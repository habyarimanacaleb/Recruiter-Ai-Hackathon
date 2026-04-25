"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, ChevronDown, Loader2 } from "lucide-react";
import { Talent } from "@/types/talent";
import { useTalentStore } from "@/store/useTalentStore";

interface EmailModalProps {
  candidate: Talent | null;
  isOpen: boolean;
  onClose: () => void;
}

// ─── Email templates ──────────────────────────────────────────────────────────
type TemplateName = "Interview Invite" | "Follow Up" | "Rejection Notice";

function buildSubject(template: TemplateName, role: string) {
  switch (template) {
    case "Interview Invite":  return `Interview Invitation – ${role} Role`;
    case "Follow Up":         return `Following Up – ${role} Application`;
    case "Rejection Notice":  return `Update on Your ${role} Application`;
  }
}

function buildBody(template: TemplateName, name: string, role: string): string {
  switch (template) {
    case "Interview Invite":
      return `Hi ${name},\n\nThank you for applying for the ${role} position. We were impressed with your profile and would like to invite you to the next stage of our recruitment process.\n\nPlease let us know your availability for an interview in the coming week.\n\nBest regards,\nThe Hiring Team`;
    case "Follow Up":
      return `Hi ${name},\n\nWe wanted to follow up regarding your application for the ${role} position. We are still reviewing applications and will be in touch shortly.\n\nThank you for your patience.\n\nBest regards,\nThe Hiring Team`;
    case "Rejection Notice":
      return `Hi ${name},\n\nThank you for taking the time to apply for the ${role} position. After careful consideration, we have decided to move forward with other candidates whose experience more closely matches our current needs.\n\nWe appreciate your interest and wish you the best in your search.\n\nBest regards,\nThe Hiring Team`;
  }
}

const TEMPLATES: TemplateName[] = ["Interview Invite", "Follow Up", "Rejection Notice"];

// ─── Component ────────────────────────────────────────────────────────────────
export function SendEmailModal({ candidate, isOpen, onClose }: EmailModalProps) {
  const { updateTalentStatus } = useTalentStore();

  const candidateName = candidate ? `${candidate.firstName} ${candidate.lastName}` : "";
  const role          = candidate?.headline ?? "Open Position";

  const [template, setTemplate] = useState<TemplateName>("Interview Invite");
  const [subject, setSubject]   = useState(() => buildSubject("Interview Invite", role));
  const [message, setMessage]   = useState(() => buildBody("Interview Invite", candidateName, role));
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent]           = useState(false);

  if (!candidate) return null;

  const handleTemplateChange = (t: TemplateName) => {
    setTemplate(t);
    setSubject(buildSubject(t, role));
    setMessage(buildBody(t, candidateName, role));
  };
  const handleSend = async () => {
  setIsSending(true);
  try {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to:      candidate.email,
        toName:  candidateName,
        subject,
        message,
      }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error ?? "Failed to send email");
    }

    await updateTalentStatus(candidate._id, "Emailed");
    setSent(true);
    setTimeout(() => { setSent(false); onClose(); }, 1200);
  } catch (err) {
    console.error("Email failed:", err);
    // optionally surface this to the UI with a toast
  } finally {
    setIsSending(false);
  }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-100 p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-white font-semibold text-lg">Send Email to Candidate</h2>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5">
              {/* Template select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Select Template
                </label>
                <div className="relative">
                  <select
                    value={template}
                    onChange={(e) => handleTemplateChange(e.target.value as TemplateName)}
                    className="w-full appearance-none bg-white border-2 border-blue-600 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none cursor-pointer"
                  >
                    {TEMPLATES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none"
                    size={18}
                  />
                </div>
              </div>

              {/* To */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">To</label>
                <input
                  disabled
                  value={`${candidateName} <${candidate.email}>`}
                  className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-medium"
                />
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Subject</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-blue-500 focus:outline-none transition-colors resize-none"
                />
                <span className="text-[10px] text-gray-400 font-bold uppercase">
                  {message.length} characters
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button
                onClick={onClose}
                disabled={isSending}
                className="px-5 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={isSending || sent}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-100 active:scale-95"
              >
                {isSending ? (
                  <><Loader2 size={15} className="animate-spin" /> Sending…</>
                ) : sent ? (
                  <><Send size={15} /> Sent!</>
                ) : (
                  <><Send size={15} /> Send Email</>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}