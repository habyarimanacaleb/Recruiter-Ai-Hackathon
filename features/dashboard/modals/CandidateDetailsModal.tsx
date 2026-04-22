"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, FileText, Send, Star, UserX } from "lucide-react";
import { Candidate } from "@/types"; 

interface ModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CandidateDetailsModal({ candidate, isOpen, onClose }: ModalProps) {
  if (!candidate) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-xl bg-white shadow-2xl z-70 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
              <h2 className="text-lg font-bold text-gray-900">Candidate Details</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-10">
              {/* Profile Header */}
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-indigo-100">
                  {candidate.name.charAt(0)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{candidate.name}</h3>
                <p className="text-indigo-600 font-semibold">{candidate.roleApplied}</p>
                <p className="text-gray-400 text-sm mt-1">{candidate.email}</p>
              </div>

              {/* AI Score Breakdown */}
              <section className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">AI Score Breakdown</h4>
                {[
                  { label: "Skills Match", value: candidate.skillsMatch },
                  { label: "Work Experience", value: 88 },
                  { label: "Education Fit", value: 95 },
                  { label: "Culture Fit", value: 89 },
                ].map((score) => (
                  <div key={score.label} className="space-y-1.5">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-gray-600">{score.label}</span>
                      <span className="text-indigo-600 font-bold">{score.value}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${score.value}%` }}
                        className="h-full bg-indigo-600 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </section>

              {/* AI Summary Card */}
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-3 text-indigo-700 font-bold text-sm">
                  <Sparkles size={16} /> AI Summary
                </div>
                <p className="text-[13px] leading-relaxed text-gray-600 font-medium">
                  {candidate.name} is a strong candidate with {candidate.experience} of experience. Their skills align exceptionally well with requirements ({candidate.skillsMatch}% match). Solid educational background from {candidate.education}.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <button className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                  <Send size={18} /> Send Interview Invite
                </button>
                <button className="w-full py-3.5 border border-gray-200 text-gray-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                  <Star size={18} /> Shortlist
                </button>
                <button className="w-full py-3.5 text-red-500 font-bold text-sm hover:underline transition-all">
                  Reject Candidate
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
