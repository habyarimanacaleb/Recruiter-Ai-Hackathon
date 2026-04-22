"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, ChevronDown } from "lucide-react";
import { Candidate } from "@/types";

interface EmailModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SendEmailModal({ candidate, isOpen, onClose }: EmailModalProps) {
  const [message, setMessage] = useState(
    `Designer position at our company. We would like to invite you to the next stage of our recruitment process.\n\nPlease let us know your availability for an interview in the coming week.\n\nBest regards,\nThe Hiring Team`
  );

  if (!candidate) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-100 p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-white font-semibold text-lg">Send Email to Candidate</h2>
              <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5">
              {/* Template Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Select Template</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-white border-2 border-blue-600 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none">
                    <option>Interview Invite</option>
                    <option>Follow Up</option>
                    <option>Rejection Notice</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none" size={18} />
                </div>
              </div>

              {/* To field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">To</label>
                <input 
                  disabled 
                  value={`${candidate.name} <${candidate.email}>`}
                  className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-medium"
                />
              </div>

              {/* Subject field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Subject</label>
                <input 
                  defaultValue={`Interview Invitation - ${candidate.roleApplied} Role`}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Message field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-blue-500 focus:outline-none transition-colors resize-none"
                />
                <div className="flex justify-between items-center">
                   <span className="text-[10px] text-gray-400 font-bold uppercase">{message.length} characters</span>
                   <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-[11px] text-gray-500 font-bold group-hover:text-blue-600 transition-colors">
                        Send to all shortlisted (3 candidates)
                      </span>
                   </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button 
                onClick={onClose}
                className="px-5 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-100 active:scale-95">
                <Send size={16} /> Send Email
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
