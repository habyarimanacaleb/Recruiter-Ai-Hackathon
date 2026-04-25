"use client";

import { useState, useMemo, useEffect } from "react";
import {
  X, Eye, Pencil, Trash2, Filter, Search, Briefcase, Building2,
  Loader2, MapPin, Wifi, AlertTriangle, DollarSign, Clock, Star,
  ChevronDown, Check, Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useJobStore, JobDescription, JobFormData, SkillLevel, EmploymentType, ExperienceLevel, RequiredSkill } from "@/store/useJobStore";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 6;

const EXPERIENCE_LEVELS: ExperienceLevel[] = ["Entry-level", "Mid-level", "Senior", "Lead"];
const EMPLOYMENT_TYPES: EmploymentType[]   = ["Full-time", "Part-time", "Contract", "Temporary"];
const SKILL_LEVELS: SkillLevel[]           = ["Beginner", "Intermediate", "Advanced", "Expert"];
const CURRENCIES                           = ["USD", "EUR", "GBP", "RWF", "KES", "NGN"];

// ── Small helpers ──────────────────────────────────────────────────────────────
function Badge({ children, color = "gray" }: { children: React.ReactNode; color?: "indigo" | "emerald" | "blue" | "gray" | "violet" }) {
  const colors = {
    indigo:  "bg-indigo-50 text-indigo-700 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    blue:    "bg-blue-50 text-blue-700 border-blue-100",
    violet:  "bg-violet-50 text-violet-700 border-violet-100",
    gray:    "bg-gray-50 text-gray-600 border-gray-100",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border", colors[color])}>
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{children}</p>;
}

// ── Delete Confirm Modal ───────────────────────────────────────────────────────
function DeleteConfirmModal({
  job,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  job: JobDescription;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top danger strip */}
        <div className="h-1.5 bg-gradient-to-r from-red-400 to-red-500 rounded-t-2xl" />

        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} className="text-red-500" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Delete Job Description?</h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                <span className="font-semibold text-gray-700">"{job.jobTitle}"</span> and all linked talent profiles will be permanently removed. This cannot be undone.
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center gap-2 text-xs text-red-600 font-medium">
            <AlertTriangle size={13} />
            All resumes screened against this role will also be deleted.
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-60 transition-all"
          >
            {isDeleting
              ? <><Loader2 size={14} className="animate-spin" /> Deleting...</>
              : <><Trash2 size={14} /> Delete</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Bulk Delete Confirm Modal ──────────────────────────────────────────────────
function BulkDeleteConfirmModal({
  count,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-red-400 to-red-500 rounded-t-2xl" />
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} className="text-red-500" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Delete {count} Jobs?</h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                All linked talent profiles will also be permanently removed.
              </p>
            </div>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-xs text-red-600 font-medium flex items-center gap-2">
            <AlertTriangle size={13} /> This action cannot be undone.
          </div>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button onClick={onCancel} disabled={isDeleting} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-all">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-60 transition-all"
          >
            {isDeleting ? <><Loader2 size={14} className="animate-spin" /> Deleting...</> : <><Trash2 size={14} /> Delete All</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── View Modal ─────────────────────────────────────────────────────────────────
function ViewModal({ job, onClose }: { job: JobDescription; onClose: () => void }) {
  const salaryStr =
    job.salaryRange?.min || job.salaryRange?.max
      ? `${job.salaryRange.currency} ${job.salaryRange.min.toLocaleString()} – ${job.salaryRange.max.toLocaleString()}`
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
              <Briefcase size={18} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">{job.jobTitle}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Building2 size={11} /> {job.department}
                </span>
                {job.location && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin size={11} /> {job.location}
                  </span>
                )}
                {job.isRemote && <Badge color="emerald"><Wifi size={9} className="mr-1" />Remote</Badge>}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 mt-1"><X size={18} /></button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Badges row */}
          <div className="flex flex-wrap gap-2">
            <Badge color="indigo">{job.experienceLevel}</Badge>
            <Badge color="blue">{job.employmentType}</Badge>
            {job.yearsOfExperienceRequired > 0 && (
              <Badge color="violet"><Clock size={9} className="mr-1" />{job.yearsOfExperienceRequired}y exp</Badge>
            )}
            {salaryStr && (
              <Badge color="gray"><DollarSign size={9} className="mr-1 inline" />{salaryStr}</Badge>
            )}
          </div>

          {/* Description */}
          <div>
            <SectionLabel>Description</SectionLabel>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities?.length > 0 && (
            <div>
              <SectionLabel>Responsibilities</SectionLabel>
              <ul className="space-y-1.5">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Skills */}
          {job.requiredSkills?.length > 0 && (
            <div>
              <SectionLabel>Required Skills</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5">
                    <span className="text-sm font-medium text-gray-800">{s.name}</span>
                    <span className="text-[10px] text-indigo-600 font-bold">· {s.minLevel}</span>
                    {s.yearsRequired > 0 && (
                      <span className="text-[10px] text-gray-400">· {s.yearsRequired}y</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {job.benefits?.length > 0 && (
            <div>
              <SectionLabel>Benefits</SectionLabel>
              <ul className="space-y-1.5">
                {job.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Star size={11} className="text-amber-400 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex justify-between text-[10px] text-gray-400">
          <span>Created {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          <span>Updated {new Date(job.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      </div>
    </div>
  );
}

// ── Edit Modal ─────────────────────────────────────────────────────────────────
function EditModal({ job, onClose }: { job: JobDescription; onClose: () => void }) {
  const { updateJob, isSaving } = useJobStore();

  const [form, setForm] = useState<JobFormData>({
    jobTitle:                 job.jobTitle,
    department:               job.department,
    description:              job.description,
    requiredSkills:           job.requiredSkills ?? [],
    experienceLevel:          job.experienceLevel ?? "Mid-level",
    yearsOfExperienceRequired: job.yearsOfExperienceRequired ?? 0,
    salaryRange:              job.salaryRange ?? { min: 0, max: 0, currency: "USD" },
    employmentType:           job.employmentType ?? "Full-time",
    location:                 job.location ?? "",
    isRemote:                 job.isRemote ?? false,
    responsibilities:         job.responsibilities ?? [],
    benefits:                 job.benefits ?? [],
  });

  const patch = (update: Partial<JobFormData>) => setForm((f) => ({ ...f, ...update }));

  // Skill draft state
  const emptySkill: RequiredSkill = { name: "", minLevel: "Intermediate", yearsRequired: 0 };
  const [skillDraft, setSkillDraft] = useState<RequiredSkill>({ ...emptySkill });

  // List item draft states
  const [respInput, setRespInput]   = useState("");
  const [benInput, setBenInput]     = useState("");

  const handleSave = async () => {
    if (form.description.trim().length < 50)
      return toast.error("Description too short", { description: "At least 50 characters required." });
    try {
      await toast.promise(updateJob(job._id, form), {
        loading: "Updating job...",
        success: "Job updated!",
        error: (err) => err?.message || "Update failed.",
      });
      onClose();
    } catch {}
  };

  const inputCls = "w-full px-3 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20";
  const labelCls = "text-[10px] font-bold uppercase tracking-widest text-gray-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Edit Job Description</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Basic */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={labelCls}>Job Title</label>
              <input value={form.jobTitle} onChange={(e) => patch({ jobTitle: e.target.value })} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className={labelCls}>Department</label>
              <input value={form.department} onChange={(e) => patch({ department: e.target.value })} className={inputCls} />
            </div>
          </div>

          {/* Experience level */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelCls}>Experience Level</label>
              <div className="flex gap-1.5 flex-wrap">
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <button
                    key={lvl} type="button"
                    onClick={() => patch({ experienceLevel: lvl })}
                    className={cn("px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all",
                      form.experienceLevel === lvl
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-gray-50 text-gray-500 border-gray-100 hover:border-indigo-200"
                    )}
                  >{lvl}</button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Employment Type</label>
              <div className="flex gap-1.5 flex-wrap">
                {EMPLOYMENT_TYPES.map((t) => (
                  <button
                    key={t} type="button"
                    onClick={() => patch({ employmentType: t })}
                    className={cn("px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all",
                      form.employmentType === t
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-gray-50 text-gray-500 border-gray-100 hover:border-indigo-200"
                    )}
                  >{t}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={labelCls}>Location</label>
              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={form.location}
                    onChange={(e) => patch({ location: e.target.value })}
                    placeholder="e.g. Kigali, Rwanda"
                    className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => patch({ isRemote: !form.isRemote })}
                  className={cn("flex items-center gap-1 px-2.5 py-2 text-xs font-semibold rounded-xl border shrink-0 transition-all",
                    form.isRemote ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-400 border-gray-100"
                  )}
                >
                  <Wifi size={12} /> Remote
                </button>
              </div>
            </div>

            {/* Salary */}
            <div className="space-y-1">
              <label className={labelCls}>Salary Range</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number" min={0}
                  value={form.salaryRange.min || ""}
                  onChange={(e) => patch({ salaryRange: { ...form.salaryRange, min: Number(e.target.value) } })}
                  placeholder="Min"
                  className="flex-1 px-2 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <span className="text-gray-300">–</span>
                <input
                  type="number" min={0}
                  value={form.salaryRange.max || ""}
                  onChange={(e) => patch({ salaryRange: { ...form.salaryRange, max: Number(e.target.value) } })}
                  placeholder="Max"
                  className="flex-1 px-2 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <select
                  value={form.salaryRange.currency}
                  onChange={(e) => patch({ salaryRange: { ...form.salaryRange, currency: e.target.value } })}
                  className="px-1.5 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none"
                >
                  {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Years */}
          <div className="flex items-center gap-3">
            <label className={cn(labelCls, "shrink-0")}>Years Required</label>
            <input
              type="number" min={0} max={30}
              value={form.yearsOfExperienceRequired || ""}
              onChange={(e) => patch({ yearsOfExperienceRequired: Number(e.target.value) })}
              className="w-20 px-3 py-1.5 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-center"
            />
            <span className="text-xs text-gray-400">years</span>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className={labelCls}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => patch({ description: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
            />
            <p className="text-[10px] text-gray-400 text-right">{form.description.length} chars</p>
          </div>

          {/* Responsibilities */}
          <div className="space-y-1.5">
            <label className={labelCls}>Responsibilities</label>
            <div className="flex gap-2">
              <input
                value={respInput}
                onChange={(e) => setRespInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (respInput.trim()) { patch({ responsibilities: [...form.responsibilities, respInput.trim()] }); setRespInput(""); }
                  }
                }}
                placeholder="Add responsibility..."
                className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="button"
                onClick={() => { if (respInput.trim()) { patch({ responsibilities: [...form.responsibilities, respInput.trim()] }); setRespInput(""); } }}
                className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100"
              ><Plus size={15} /></button>
            </div>
            {form.responsibilities.map((r, i) => (
              <div key={i} className="flex items-center gap-2 group">
                <span className="flex-1 text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5">{r}</span>
                <button type="button" onClick={() => patch({ responsibilities: form.responsibilities.filter((_, j) => j !== i) })}
                  className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100"><X size={13} /></button>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="space-y-1.5">
            <label className={labelCls}>Benefits</label>
            <div className="flex gap-2">
              <input
                value={benInput}
                onChange={(e) => setBenInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (benInput.trim()) { patch({ benefits: [...form.benefits, benInput.trim()] }); setBenInput(""); }
                  }
                }}
                placeholder="Add benefit..."
                className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="button"
                onClick={() => { if (benInput.trim()) { patch({ benefits: [...form.benefits, benInput.trim()] }); setBenInput(""); } }}
                className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100"
              ><Plus size={15} /></button>
            </div>
            {form.benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2 group">
                <span className="flex-1 text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5">{b}</span>
                <button type="button" onClick={() => patch({ benefits: form.benefits.filter((_, j) => j !== i) })}
                  className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100"><X size={13} /></button>
              </div>
            ))}
          </div>

          {/* Required Skills */}
          <div className="space-y-2">
            <label className={labelCls}>Required Skills</label>
            <div className="grid grid-cols-12 gap-2 items-center">
              <input
                value={skillDraft.name}
                onChange={(e) => setSkillDraft((d) => ({ ...d, name: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (skillDraft.name.trim()) {
                      patch({ requiredSkills: [...form.requiredSkills, { ...skillDraft, name: skillDraft.name.trim() }] });
                      setSkillDraft({ ...emptySkill });
                    }
                  }
                }}
                placeholder="Skill..."
                className="col-span-5 px-3 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <select
                value={skillDraft.minLevel}
                onChange={(e) => setSkillDraft((d) => ({ ...d, minLevel: e.target.value as SkillLevel }))}
                className="col-span-4 px-2 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none"
              >
                {SKILL_LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
              <input
                type="number" min={0}
                value={skillDraft.yearsRequired || ""}
                onChange={(e) => setSkillDraft((d) => ({ ...d, yearsRequired: Number(e.target.value) }))}
                placeholder="Yrs"
                className="col-span-2 px-2 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none text-center"
              />
              <button
                type="button"
                onClick={() => {
                  if (skillDraft.name.trim()) {
                    patch({ requiredSkills: [...form.requiredSkills, { ...skillDraft, name: skillDraft.name.trim() }] });
                    setSkillDraft({ ...emptySkill });
                  }
                }}
                className="col-span-1 flex justify-center py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100"
              ><Plus size={15} /></button>
            </div>
            {form.requiredSkills.map((s, i) => (
              <div key={i} className="flex items-center gap-2 group">
                <div className="flex-1 grid grid-cols-12 gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                  <span className="col-span-5 text-sm font-medium text-gray-800 truncate">{s.name}</span>
                  <span className="col-span-4 text-xs text-indigo-600 font-semibold">{s.minLevel}</span>
                  <span className="col-span-3 text-xs text-gray-500 text-right">{s.yearsRequired}y</span>
                </div>
                <button type="button" onClick={() => patch({ requiredSkills: form.requiredSkills.filter((_, j) => j !== i) })}
                  className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100"><X size={13} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-all">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition-all"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Table ─────────────────────────────────────────────────────────────────
export function JobsTable() {
  const { jobs, isLoading, fetchJobs, deleteJob } = useJobStore();

  const [currentPage, setCurrentPage]     = useState(1);
  const [search, setSearch]               = useState("");
  const [selectedIds, setSelectedIds]     = useState<string[]>([]);
  const [viewingJob, setViewingJob]       = useState<JobDescription | null>(null);
  const [editingJob, setEditingJob]       = useState<JobDescription | null>(null);
  const [deletingJob, setDeletingJob]     = useState<JobDescription | null>(null);
  const [bulkDeleting, setBulkDeleting]   = useState(false);
  const [isDeleting, setIsDeleting]       = useState(false);

  useEffect(() => { fetchJobs(); }, []);

  const filtered = useMemo(() =>
    jobs.filter((j) =>
      j.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase())
    ), [jobs, search]);

  const paginated   = useMemo(() =>
    filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  // Selection helpers
  const toggleOne = (id: string) =>
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  const toggleAll = () => {
    const pageIds = paginated.map((j) => j._id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected
      ? selectedIds.filter((id) => !pageIds.includes(id))
      : Array.from(new Set([...selectedIds, ...pageIds]))
    );
  };

  // Delete one
  const handleDelete = async () => {
    if (!deletingJob) return;
    setIsDeleting(true);
    try {
      await toast.promise(deleteJob(deletingJob._id), {
        loading: "Deleting...",
        success: "Job deleted.",
        error: (err) => err?.message || "Delete failed.",
      });
      setSelectedIds((prev) => prev.filter((i) => i !== deletingJob._id));
      setDeletingJob(null);
    } catch {}
    finally { setIsDeleting(false); }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      await toast.promise(
        Promise.all(selectedIds.map((id) => deleteJob(id))),
        {
          loading: "Deleting...",
          success: `${selectedIds.length} jobs deleted.`,
          error: "Some deletions failed.",
        }
      );
      setSelectedIds([]);
      setBulkDeleting(false);
    } catch {}
    finally { setIsDeleting(false); }
  };

  return (
    <>
      {viewingJob   && <ViewModal job={viewingJob} onClose={() => setViewingJob(null)} />}
      {editingJob   && <EditModal job={editingJob} onClose={() => setEditingJob(null)} />}
      {deletingJob  && (
        <DeleteConfirmModal
          job={deletingJob}
          onConfirm={handleDelete}
          onCancel={() => setDeletingJob(null)}
          isDeleting={isDeleting}
        />
      )}
      {bulkDeleting && (
        <BulkDeleteConfirmModal
          count={selectedIds.length}
          onConfirm={handleBulkDelete}
          onCancel={() => setBulkDeleting(false)}
          isDeleting={isDeleting}
        />
      )}

      <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-50">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Job Descriptions</h2>
            <p className="text-xs text-gray-400">{jobs.length} total</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Filter size={14} /> Sorted by latest
          </div>
        </div>

        {/* Search / Bulk Actions Bar */}
        <div className="relative h-16 border-b border-gray-50 bg-white">
          <div className={cn(
            "absolute inset-0 px-4 flex items-center justify-between transition-all duration-300",
            selectedIds.length > 0 ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
          )}>
            <div className="relative w-1/2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Search by title or department..."
                className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <span className="text-xs text-gray-400">{filtered.length} results</span>
          </div>

          <div className={cn(
            "absolute inset-0 px-4 bg-indigo-600 flex items-center justify-between transition-all duration-300",
            selectedIds.length === 0 ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
          )}>
            <div className="flex items-center gap-4 text-white">
              <button onClick={() => setSelectedIds([])} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
              <span className="font-bold text-sm">{selectedIds.length} Selected</span>
            </div>
            <button
              onClick={() => setBulkDeleting(true)}
              className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-600 shadow-lg shadow-red-900/20 transition-all"
            >
              Delete All
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
              <Loader2 size={18} className="animate-spin" /> Loading jobs...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
              <Briefcase size={32} className="text-gray-200" />
              <p className="text-sm font-medium">No job descriptions found</p>
              <p className="text-xs">Create one using the form above</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-gray-400 font-bold border-b border-gray-50">
                  <th className="px-6 py-4 w-10">
                    <input
                      type="checkbox"
                      className="rounded accent-indigo-600"
                      checked={paginated.length > 0 && paginated.every((j) => selectedIds.includes(j._id))}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="px-4 py-4">Job Title</th>
                  <th className="px-4 py-4">Department</th>
                  <th className="px-4 py-4">Type</th>
                  <th className="px-4 py-4">Level</th>
                  <th className="px-4 py-4">Created</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((job) => (
                  <tr
                    key={job._id}
                    className={cn("transition-colors",
                      selectedIds.includes(job._id) ? "bg-indigo-50/30" : "hover:bg-gray-50/50"
                    )}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded accent-indigo-600"
                        checked={selectedIds.includes(job._id)}
                        onChange={() => toggleOne(job._id)}
                      />
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                          <Briefcase size={14} className="text-indigo-500" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-900 block">{job.jobTitle}</span>
                          {job.isRemote && (
                            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                              <Wifi size={9} /> Remote
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <Building2 size={12} className="text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-600">{job.department}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <Badge color="blue">{job.employmentType ?? "—"}</Badge>
                    </td>

                    <td className="px-4 py-4">
                      <Badge color="indigo">{job.experienceLevel ?? "—"}</Badge>
                    </td>

                    <td className="px-4 py-4 text-xs text-gray-400">
                      {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-1 text-gray-400">
                        <button
                          onClick={() => setViewingJob(job)}
                          className="p-1.5 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View"
                        ><Eye size={15} /></button>
                        <button
                          onClick={() => setEditingJob(job)}
                          className="p-1.5 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit"
                        ><Pencil size={15} /></button>
                        <button
                          onClick={() => setDeletingJob(job)}
                          className="p-1.5 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        ><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
            <span>{filtered.length} job{filtered.length !== 1 ? "s" : ""}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-100 hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-40 disabled:pointer-events-none transition-all"
              >Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn("w-8 h-8 rounded-lg text-xs font-bold transition-all",
                    page === currentPage ? "bg-indigo-600 text-white" : "hover:bg-indigo-50 hover:text-indigo-600"
                  )}
                >{page}</button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-100 hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-40 disabled:pointer-events-none transition-all"
              >Next</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}