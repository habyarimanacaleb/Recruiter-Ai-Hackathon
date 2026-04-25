"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles, Briefcase, Building2, FileText, Loader2,
  Plus, X, MapPin, Wifi, DollarSign, ChevronDown, Check,
} from "lucide-react"
import { Button } from "@/components/ui/button";
import { useJobStore, SkillLevel, ExperienceLevel, EmploymentType, RequiredSkill } from "@/store/useJobStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── Constants ──────────────────────────────────────────────────────────────────
const JOB_TITLE_OPTIONS  = ["Senior Product Designer", "Fullstack Engineer", "Data Scientist", "DevOps Engineer", "Product Manager", "UX Researcher"];
const DEPARTMENT_OPTIONS  = ["Engineering", "Operations", "Design", "Data", "Product", "Marketing", "HR"];
const EXPERIENCE_LEVELS: ExperienceLevel[] = ["Entry-level", "Mid-level", "Senior", "Lead"];
const EMPLOYMENT_TYPES: EmploymentType[]   = ["Full-time", "Part-time", "Contract", "Temporary"];
const SKILL_LEVELS: SkillLevel[]           = ["Beginner", "Intermediate", "Advanced", "Expert"];
const CURRENCIES                           = ["USD", "EUR", "GBP", "RWF", "KES", "NGN"];

// ── ComboSelect ────────────────────────────────────────────────────────────────
// Dropdown with preset options + ability to type a custom value.
function ComboSelect({
  label,
  icon: Icon,
  options,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  icon: React.ElementType;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen]       = useState(false);
  const [manual, setManual]   = useState(false);
  const [query, setQuery]     = useState("");
  const ref                   = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase())
  );

  if (manual) {
    return (
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">{label}</label>
        <div className="relative flex items-center">
          <Icon size={14} className="absolute left-3 text-gray-400" />
          <input
            autoFocus
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Type ${label.toLowerCase()}...`}
            className="w-full pl-8 pr-10 py-2.5 text-sm bg-gray-50 border border-blue-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            type="button"
            onClick={() => { setManual(false); setQuery(""); }}
            className="absolute right-3 text-gray-400 hover:text-gray-600"
            title="Pick from list"
          >
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5" ref={ref}>
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "w-full flex items-center gap-2 pl-3 pr-3 py-2.5 text-sm bg-gray-50 border border-blue-100 rounded-xl outline-none text-left transition-all",
            open ? "ring-2 ring-indigo-500/20 border-indigo-200" : "hover:border-indigo-100"
          )}
        >
          <Icon size={14} className="text-gray-400 shrink-0" />
          <span className={cn("flex-1 truncate", !value && "text-gray-400")}>
            {value || placeholder || `Select ${label.toLowerCase()}`}
          </span>
          <ChevronDown size={14} className={cn("text-gray-400 transition-transform", open && "rotate-180")} />
        </button>

        {open && (
          <div className="absolute z-30 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
            {/* Search within dropdown */}
            <div className="p-2 border-b border-gray-50">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-1.5 text-xs bg-gray-50 rounded-lg outline-none"
              />
            </div>
            <div className="max-h-44 overflow-y-auto">
              {filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { onChange(opt); setOpen(false); setQuery(""); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-indigo-50 text-left transition-colors"
                >
                  {opt}
                  {value === opt && <Check size={13} className="text-indigo-600" />}
                </button>
              ))}
              {/* Type manually option */}
              <button
                type="button"
                onClick={() => { setManual(true); setOpen(false); setQuery(""); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-indigo-600 hover:bg-indigo-50 border-t border-gray-50 font-medium"
              >
                <Plus size={13} /> Type manually...
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ListBuilder ────────────────────────────────────────────────────────────────
// Add/remove string items (responsibilities, benefits).
function ListBuilder({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    const v = input.trim();
    if (!v || items.includes(v)) return;
    onChange([...items, v]);
    setInput("");
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">{label}</label>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder || `Add ${label.toLowerCase()}...`}
          className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-blue-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
      {items.length > 0 && (
        <ul className="space-y-1.5 mt-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 group">
              <span className="flex-1 text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 leading-snug">
                {item}
              </span>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="mt-1.5 text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── SkillsBuilder ──────────────────────────────────────────────────────────────
function SkillsBuilder({
  skills,
  onChange,
}: {
  skills: RequiredSkill[];
  onChange: (skills: RequiredSkill[]) => void;
}) {
  const empty: RequiredSkill = { name: "", minLevel: "Intermediate", yearsRequired: 0 };
  const [draft, setDraft]    = useState<RequiredSkill>({ ...empty });

  const add = () => {
    if (!draft.name.trim()) return;
    onChange([...skills, { ...draft, name: draft.name.trim() }]);
    setDraft({ ...empty });
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Required Skills</label>

      {/* Add row */}
      <div className="grid grid-cols-12 gap-2 items-center">
        <input
          value={draft.name}
          onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Skill name..."
          className="col-span-5 px-3 py-2 text-sm bg-gray-50 border border-blue-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        <select
          value={draft.minLevel}
          onChange={(e) => setDraft((d) => ({ ...d, minLevel: e.target.value as SkillLevel }))}
          className="col-span-4 px-2 py-2 text-sm bg-gray-50 border border-blue-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          {SKILL_LEVELS.map((l) => <option key={l}>{l}</option>)}
        </select>
        <input
          type="number"
          min={0}
          value={draft.yearsRequired || ""}
          onChange={(e) => setDraft((d) => ({ ...d, yearsRequired: Number(e.target.value) }))}
          placeholder="Yrs"
          className="col-span-2 px-2 py-2 text-sm bg-gray-50 border border-blue-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-center"
        />
        <button
          type="button"
          onClick={add}
          className="col-span-1 flex justify-center py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
      <p className="text-[10px] text-gray-400 ml-1">Columns: Name · Min Level · Years exp.</p>

      {/* List */}
      {skills.length > 0 && (
        <div className="space-y-1.5 mt-1">
          {skills.map((s, i) => (
            <div key={i} className="flex items-center gap-2 group">
              <div className="flex-1 grid grid-cols-12 gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                <span className="col-span-5 text-sm font-medium text-gray-800 truncate">{s.name}</span>
                <span className="col-span-4 text-xs text-indigo-600 font-semibold">{s.minLevel}</span>
                <span className="col-span-3 text-xs text-gray-500 text-right">{s.yearsRequired}y</span>
              </div>
              <button
                type="button"
                onClick={() => onChange(skills.filter((_, j) => j !== i))}
                className="text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Form ──────────────────────────────────────────────────────────────────
export default function JobDescriptionForm() {
  const { form, setForm, isSaving, createJob } = useJobStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.jobTitle.trim())     return toast.error("Job Title required");
    if (!form.department.trim())   return toast.error("Department required");
    if (form.description.trim().length < 50)
      return toast.error("Description too short", { description: "At least 50 characters for better AI accuracy." });

    try {
      await toast.promise(createJob(), {
        loading: "Saving job description...",
        success: "Job description created!",
        error: (err) => err?.message || "Failed to create job description.",
      });
    } catch { /* handled by toast */ }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Job Description</h2>
            <p className="text-xs text-gray-400">Define role details for AI screening</p>
          </div>
        </div>

        {/* ── Section 1: Role basics ── */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Role</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ComboSelect
              label="Job Title"
              icon={Briefcase}
              options={JOB_TITLE_OPTIONS}
              value={form.jobTitle}
              onChange={(v) => setForm({ jobTitle: v })}
            />
            <ComboSelect
              label="Department"
              icon={Building2}
              options={DEPARTMENT_OPTIONS}
              value={form.department}
              onChange={(v) => setForm({ department: v })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Experience level */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Experience Level</label>
              <div className="flex gap-2 flex-wrap">
                {EXPERIENCE_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setForm({ experienceLevel: level })}
                    className={cn(
                      "px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all",
                      form.experienceLevel === level
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-gray-50 text-gray-500 border-gray-100 hover:border-indigo-200 hover:text-indigo-600"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Employment type */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Employment Type</label>
              <div className="flex gap-2 flex-wrap">
                {EMPLOYMENT_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm({ employmentType: type })}
                    className={cn(
                      "px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all",
                      form.employmentType === type
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-gray-50 text-gray-500 border-gray-100 hover:border-indigo-200 hover:text-indigo-600"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 2: Location & Salary ── */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Location & Compensation</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location + Remote toggle */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Location</label>
              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ location: e.target.value })}
                    placeholder="e.g. Kigali, Rwanda"
                    className="w-full pl-8 pr-3 py-2.5 text-sm bg-gray-50 border border-blue-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ isRemote: !form.isRemote })}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-xl border transition-all shrink-0",
                    form.isRemote
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-gray-50 text-gray-400 border-gray-100 hover:border-emerald-200"
                  )}
                  title="Toggle remote"
                >
                  <Wifi size={13} />
                  Remote
                </button>
              </div>
            </div>

            {/* Salary Range */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Salary Range</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <DollarSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    min={0}
                    value={form.salaryRange.min || ""}
                    onChange={(e) => setForm({ salaryRange: { ...form.salaryRange, min: Number(e.target.value) } })}
                    placeholder="Min"
                    className="w-full pl-7 pr-2 py-2.5 text-sm bg-gray-50 border border-blue-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <span className="text-gray-300 text-sm">–</span>
                <input
                  type="number"
                  min={0}
                  value={form.salaryRange.max || ""}
                  onChange={(e) => setForm({ salaryRange: { ...form.salaryRange, max: Number(e.target.value) } })}
                  placeholder="Max"
                  className="flex-1 px-3 py-2.5 text-sm bg-gray-50 border border-blue-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <select
                  value={form.salaryRange.currency}
                  onChange={(e) => setForm({ salaryRange: { ...form.salaryRange, currency: e.target.value } })}
                  className="px-2 py-2.5 text-sm bg-gray-50 border border-blue-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Years of experience */}
          <div className="flex items-center gap-3 pt-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 shrink-0">
              Years of Experience Required
            </label>
            <input
              type="number"
              min={0}
              max={30}
              value={form.yearsOfExperienceRequired || ""}
              onChange={(e) => setForm({ yearsOfExperienceRequired: Number(e.target.value) })}
              placeholder="0"
              className="w-20 px-3 py-1.5 text-sm bg-gray-50 border border-blue-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-center"
            />
            <span className="text-xs text-gray-400">years</span>
          </div>
        </div>

        {/* ── Section 3: Description ── */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Description</p>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Role Requirements</label>
            <textarea
              placeholder="Paste the job description here..."
              value={form.description}
              onChange={(e) => setForm({ description: e.target.value })}
              className="w-full min-h-36 p-4 bg-gray-50 border border-blue-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm resize-none"
            />
            <p className="text-[10px] text-gray-400 text-right">
              {form.description.length} chars{" "}
              {form.description.length < 50 && form.description.length > 0 && (
                <span className="text-red-400">— need at least 50</span>
              )}
            </p>
          </div>
        </div>

        {/* ── Section 4: Responsibilities & Benefits ── */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ListBuilder
              label="Responsibilities"
              items={form.responsibilities}
              onChange={(v) => setForm({ responsibilities: v })}
              placeholder="e.g. Lead cross-functional teams..."
            />
            <ListBuilder
              label="Benefits"
              items={form.benefits}
              onChange={(v) => setForm({ benefits: v })}
              placeholder="e.g. Health insurance, Remote work..."
            />
          </div>
        </div>

        {/* ── Section 5: Required Skills ── */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Skills</p>
          <SkillsBuilder
            skills={form.requiredSkills}
            onChange={(v) => setForm({ requiredSkills: v })}
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSaving || !form.description || !form.jobTitle || !form.department}
          className="h-12 w-full md:w-fit px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all"
        >
          {isSaving
            ? <><Loader2 className="animate-spin mr-2" size={18} /> Saving...</>
            : <><Sparkles className="mr-2" size={18} /> Save Job Description</>
          }
        </Button>
      </form>
    </div>
  );
}