"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Sparkles, Send, Star, UserX, Briefcase, GraduationCap,
  Loader2, MapPin, Globe, ExternalLink,
  Calendar, Clock, Award, Languages, FolderGit2, CheckCircle2,
  Wifi, ChevronDown, ChevronUp, Mail,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Talent, TalentStatus } from "@/types/talent";
import { useTalentStore } from "@/store/useTalentStore";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────
interface ModalProps {
  candidate: Talent | null;
  isOpen: boolean;
  onClose: () => void;
}

// ── Small reusable pieces ──────────────────────────────────────────────────────
function SectionTitle({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center">
        <Icon size={12} className="text-indigo-600" />
      </div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</h4>
    </div>
  );
}

function Pill({
  children,
  color = "gray",
}: {
  children: React.ReactNode;
  color?: "indigo" | "emerald" | "amber" | "red" | "gray" | "violet" | "blue";
}) {
  const colors = {
    indigo:  "bg-indigo-50 text-indigo-700 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber:   "bg-amber-50 text-amber-600 border-amber-100",
    red:     "bg-red-50 text-red-500 border-red-100",
    violet:  "bg-violet-50 text-violet-700 border-violet-100",
    blue:    "bg-blue-50 text-blue-700 border-blue-100",
    gray:    "bg-gray-50 text-gray-600 border-gray-100",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border", colors[color])}>
      {children}
    </span>
  );
}

function StatusBadge({ status }: { status: TalentStatus }) {
  const map: Record<TalentStatus, { color: string; label: string }> = {
    Pending:     { color: "bg-gray-100 text-gray-500",    label: "Pending"     },
    Screened:    { color: "bg-blue-50 text-blue-600",     label: "Screened"    },
    Shortlisted: { color: "bg-indigo-50 text-indigo-700", label: "Shortlisted" },
    Emailed:     { color: "bg-emerald-50 text-emerald-700", label: "Emailed"   },
    Rejected:    { color: "bg-red-50 text-red-500",       label: "Rejected"    },
  };
  const { color, label } = map[status] ?? map.Pending;
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-bold", color)}>
      {label}
    </span>
  );
}

// Collapsible section for long lists
function Collapsible({
  children,
  maxHeight = 260,
}: {
  children: React.ReactNode;
  maxHeight?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <div
        className={cn("overflow-hidden transition-all duration-300", !expanded && `max-h-[${maxHeight}px]`)}
        style={!expanded ? { maxHeight } : undefined}
      >
        {children}
      </div>
      <button
        onClick={() => setExpanded((e) => !e)}
        className="mt-2 flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 font-semibold transition-colors"
      >
        {expanded ? <><ChevronUp size={13} /> Show less</> : <><ChevronDown size={13} /> Show more</>}
      </button>
    </div>
  );
}

// ── Score bar ──────────────────────────────────────────────────────────────────
function ScoreBar({ label, value }: { label: string; value: number }) {
  const color =
    value >= 80 ? "bg-emerald-500"
    : value >= 60 ? "bg-indigo-500"
    : value >= 40 ? "bg-amber-400"
    : "bg-red-400";

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className={cn("font-bold tabular-nums",
          value >= 80 ? "text-emerald-600" : value >= 60 ? "text-indigo-600" : value >= 40 ? "text-amber-500" : "text-red-500"
        )}>
          {value}%
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
}

// ── Date formatter ─────────────────────────────────────────────────────────────
function fmtDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// ── Main component ─────────────────────────────────────────────────────────────
export function CandidateDetailsModal({ candidate, isOpen, onClose }: ModalProps) {
  const { updateTalentStatus } = useTalentStore();
  const [loadingAction, setLoadingAction] = useState<TalentStatus | null>(null);

  if (!candidate) return null;

  const name         = `${candidate.firstName} ${candidate.lastName}`;
  const overallScore = candidate.talentScore?.overallScore ?? 0;
  const breakdown    = candidate.talentScore?.breakdown;
  const summary      = candidate.talentScore?.summary;

  const handleAction = async (status: TalentStatus) => {
    setLoadingAction(status);
    try {
      await updateTalentStatus(candidate._id, status);
      onClose();
    } finally {
      setLoadingAction(null);
    }
  };

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

          {/* Slide-in panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 h-screen w-full max-w-xl bg-white shadow-2xl z-70 flex flex-col"
          >
            {/* ── Sticky header ── */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10 shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-gray-900">Candidate Details</h2>
                <StatusBadge status={candidate.status} />
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-8">

                {/* ── Profile header ── */}
                <div className="flex flex-col items-center text-center gap-1">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-2 shadow-lg shadow-indigo-100">
                    {candidate.firstName[0]?.toUpperCase()}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
                  <p className="text-indigo-600 font-semibold text-sm">{candidate.headline}</p>

                  <div className="flex flex-wrap justify-center gap-2 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Mail size={11} /> {candidate.email}
                    </span>
                    {candidate.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={11} /> {candidate.location}
                      </span>
                    )}
                  </div>

                  {/* Availability */}
                  {candidate.availability?.status && (
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      <Pill color={
                        candidate.availability.status === "Available" ? "emerald"
                        : candidate.availability.status === "Open to Opportunities" ? "amber"
                        : "gray"
                      }>
                        {candidate.availability.status === "Available" && <CheckCircle2 size={10} />}
                        {candidate.availability.status === "Open to Opportunities" && <Clock size={10} />}
                        {candidate.availability.status}
                      </Pill>
                      {candidate.availability.type && (
                        <Pill color="blue"><Briefcase size={10} />{candidate.availability.type}</Pill>
                      )}
                      {candidate.availability.startDate && (
                        <Pill color="gray"><Calendar size={10} />From {fmtDate(candidate.availability.startDate)}</Pill>
                      )}
                    </div>
                  )}

                  {/* Social Links */}
                  {(candidate.socialLinks?.linkedin || candidate.socialLinks?.github || candidate.socialLinks?.portfolio) && (
                    <div className="mt-3 flex items-center gap-3">
                      {candidate.socialLinks.linkedin && (
                        <a href={candidate.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                          <FaLinkedin size={15} />
                        </a>
                      )}
                      {candidate.socialLinks.github && (
                        <a href={candidate.socialLinks.github} target="_blank" rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                          <FaGithub size={15} />
                        </a>
                      )}
                      {candidate.socialLinks.portfolio && (
                        <a href={candidate.socialLinks.portfolio} target="_blank" rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
                          <Globe size={15} />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* ── Bio ── */}
                {candidate.bio && (
                  <section>
                    <SectionTitle icon={Sparkles} label="About" />
                    <p className="text-sm text-gray-600 leading-relaxed">{candidate.bio}</p>
                  </section>
                )}

                {/* ── AI Score ── */}
                {overallScore > 0 && (
                  <section>
                    <SectionTitle icon={Sparkles} label="AI Score" />

                    {/* Overall ring-like display */}
                    <div className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border mb-5",
                      overallScore >= 80 ? "bg-emerald-50 border-emerald-100"
                      : overallScore >= 60 ? "bg-indigo-50 border-indigo-100"
                      : "bg-amber-50 border-amber-100"
                    )}>
                      <div className={cn(
                        "w-14 h-14 rounded-full flex flex-col items-center justify-center font-black text-white text-base shadow-md shrink-0",
                        overallScore >= 80 ? "bg-emerald-500"
                        : overallScore >= 60 ? "bg-indigo-600"
                        : "bg-amber-500"
                      )}>
                        {overallScore}
                        <span className="text-[9px] font-normal opacity-80">/100</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          {overallScore >= 80 ? "Strong Match" : overallScore >= 60 ? "Good Match" : "Partial Match"}
                        </p>
                        {summary && (
                          <p className="text-xs text-gray-500 leading-relaxed mt-0.5 line-clamp-2">{summary}</p>
                        )}
                      </div>
                    </div>

                    {/* Breakdown bars */}
                    {breakdown && (
                      <div className="space-y-3.5">
                        <ScoreBar label="Skills"               value={breakdown.skills} />
                        <ScoreBar label="Experience"           value={breakdown.experience} />
                        <ScoreBar label="Education"            value={breakdown.education} />
                        <ScoreBar label="Projects"             value={breakdown.projects} />
                        <ScoreBar label="Profile Completeness" value={breakdown.profileCompleteness} />
                      </div>
                    )}
                  </section>
                )}

                {/* ── Skills ── */}
                {candidate.skills?.length > 0 && (
                  <section>
                    <SectionTitle icon={CheckCircle2} label="Skills" />
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((s) => (
                        <div key={s.name}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-100 rounded-xl"
                        >
                          <span className="text-sm font-semibold text-gray-800">{s.name}</span>
                          {s.level && (
                            <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                              s.level === "Expert"       ? "bg-indigo-100 text-indigo-700"
                              : s.level === "Advanced"  ? "bg-violet-100 text-violet-700"
                              : s.level === "Intermediate" ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-500"
                            )}>
                              {s.level}
                            </span>
                          )}
                          {s.yearsOfExperience > 0 && (
                            <span className="text-[10px] text-gray-400">{s.yearsOfExperience}y</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* ── Experience ── */}
                {candidate.experience?.length > 0 && (
                  <section>
                    <SectionTitle icon={Briefcase} label="Work Experience" />
                    <Collapsible>
                      <div className="space-y-5">
                        {candidate.experience.map((e, i) => (
                          <div key={i} className="relative pl-5 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-gray-100">
                            {/* Dot */}
                            <div className={cn(
                              "absolute left-[-4px] top-1.5 w-2 h-2 rounded-full border-2 border-white",
                              e.isCurrent ? "bg-indigo-500" : "bg-gray-300"
                            )} />

                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-bold text-gray-900">{e.role}</p>
                                <p className="text-xs text-indigo-600 font-semibold">{e.company}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-[11px] text-gray-400">
                                  {fmtDate(e.startDate)} — {e.isCurrent ? <span className="text-indigo-500 font-semibold">Present</span> : fmtDate(e.endDate)}
                                </p>
                                {e.isCurrent && (
                                  <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full font-bold">Current</span>
                                )}
                              </div>
                            </div>

                            {e.description && (
                              <p className="text-xs text-gray-500 leading-relaxed mt-1.5">{e.description}</p>
                            )}

                            {e.technologies?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {e.technologies.map((tech) => (
                                  <span key={tech} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md font-medium">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </Collapsible>
                  </section>
                )}

                {/* ── Education ── */}
                {candidate.education?.length > 0 && (
                  <section>
                    <SectionTitle icon={GraduationCap} label="Education" />
                    <div className="space-y-4">
                      {candidate.education.map((ed, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                            <GraduationCap size={15} className="text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{ed.degree}</p>
                            {ed.fieldOfStudy && (
                              <p className="text-xs text-indigo-600 font-semibold">{ed.fieldOfStudy}</p>
                            )}
                            <p className="text-xs text-gray-500">{ed.institution}</p>
                            {(ed.startYear || ed.endYear) && (
                              <p className="text-[11px] text-gray-400 mt-0.5">
                                {ed.startYear} — {ed.endYear ?? "Present"}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* ── Projects ── */}
                {candidate.projects?.length > 0 && (
                  <section>
                    <SectionTitle icon={FolderGit2} label="Projects" />
                    <div className="space-y-4">
                      {candidate.projects.map((p, i) => (
                        <div key={i} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-bold text-gray-900">{p.name}</p>
                              {p.role && <p className="text-xs text-indigo-600 font-semibold">{p.role}</p>}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {(p.startDate || p.endDate) && (
                                <span className="text-[11px] text-gray-400">
                                  {fmtDate(p.startDate)}{p.endDate ? ` — ${fmtDate(p.endDate)}` : ""}
                                </span>
                              )}
                              {p.link && (
                                <a href={p.link} target="_blank" rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                                  <ExternalLink size={12} />
                                </a>
                              )}
                            </div>
                          </div>

                          {p.description && (
                            <p className="text-xs text-gray-500 leading-relaxed">{p.description}</p>
                          )}

                          {p.technologies?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {p.technologies.map((tech) => (
                                <span key={tech} className="text-[10px] px-2 py-0.5 bg-white border border-gray-200 text-gray-600 rounded-md font-medium">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* ── Languages ── */}
                {candidate.languages?.length > 0 && (
                  <section>
                    <SectionTitle icon={Languages} label="Languages" />
                    <div className="flex flex-wrap gap-2">
                      {candidate.languages.map((l) => (
                        <div key={l.name} className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl">
                          <span className="text-sm font-semibold text-gray-800">{l.name}</span>
                          {l.proficiency && (
                            <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                              l.proficiency === "Native"         ? "bg-indigo-100 text-indigo-700"
                              : l.proficiency === "Fluent"       ? "bg-emerald-100 text-emerald-700"
                              : l.proficiency === "Conversational" ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-500"
                            )}>
                              {l.proficiency}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* ── Certifications ── */}
                {candidate.certifications?.length > 0 && (
                  <section>
                    <SectionTitle icon={Award} label="Certifications" />
                    <div className="space-y-3">
                      {candidate.certifications.map((c, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                            <Award size={14} className="text-amber-500" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{c.name}</p>
                            <p className="text-xs text-gray-500">{c.issuer}</p>
                            {c.issueDate && (
                              <p className="text-[11px] text-gray-400 mt-0.5">{fmtDate(c.issueDate)}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Spacer so last section isn't hidden behind sticky footer */}
                <div className="h-2" />
              </div>
            </div>

            {/* ── Sticky action footer ── */}
            <div className="shrink-0 border-t border-gray-100 bg-white px-6 py-4 space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleAction("Shortlisted")}
                  disabled={!!loadingAction || candidate.status === "Shortlisted"}
                  className={cn(
                    "py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                    candidate.status === "Shortlisted"
                      ? "bg-indigo-100 text-indigo-400 cursor-not-allowed"
                      : loadingAction
                      ? "bg-indigo-300 text-white cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100"
                  )}
                >
                  {loadingAction === "Shortlisted"
                    ? <Loader2 size={15} className="animate-spin" />
                    : <Star size={15} />
                  }
                  {candidate.status === "Shortlisted" ? "Shortlisted" : "Shortlist"}
                </button>

                <button
                  onClick={() => handleAction("Emailed")}
                  disabled={!!loadingAction || candidate.status === "Emailed"}
                  className={cn(
                    "py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all",
                    candidate.status === "Emailed"
                      ? "border-gray-100 text-gray-300 cursor-not-allowed"
                      : loadingAction
                      ? "border-gray-100 text-gray-300 cursor-not-allowed"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {loadingAction === "Emailed"
                    ? <Loader2 size={15} className="animate-spin" />
                    : <Send size={15} />
                  }
                  {candidate.status === "Emailed" ? "Emailed" : "Mark Emailed"}
                </button>
              </div>

              <button
                onClick={() => handleAction("Rejected")}
                disabled={!!loadingAction || candidate.status === "Rejected"}
                className={cn(
                  "w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                  candidate.status === "Rejected"
                    ? "text-gray-300 cursor-not-allowed"
                    : loadingAction
                    ? "text-red-200 cursor-not-allowed"
                    : "text-red-500 hover:bg-red-50"
                )}
              >
                {loadingAction === "Rejected"
                  ? <Loader2 size={14} className="animate-spin" />
                  : <UserX size={14} />
                }
                {candidate.status === "Rejected" ? "Already Rejected" : "Reject Candidate"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}