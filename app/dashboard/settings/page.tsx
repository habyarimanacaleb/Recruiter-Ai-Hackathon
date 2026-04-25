"use client";

import { useState } from "react";
import {
  Building2, Sparkles, Mail, ShieldAlert, User,
  Save, Loader2, Check, ChevronRight, Trash2, Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTalentStore } from "@/store/useTalentStore";

// ─── Types ────────────────────────────────────────────────────────────────────
type Section = "organization" | "ai" | "email" | "data" | "account";

// ─── Reusable field components ────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    />
  );
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-bold text-gray-700">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors duration-200",
          checked ? "bg-indigo-600" : "bg-gray-200"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200",
            checked && "translate-x-5"
          )}
        />
      </button>
    </div>
  );
}

function WeightSlider({
  label,
  value,
  onChange,
  color = "bg-indigo-500",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-gray-700">{label}</span>
        <span className="text-sm font-bold text-indigo-600 tabular-nums w-10 text-right">
          {value}%
        </span>
      </div>
      <div className="relative h-2 bg-gray-100 rounded-full">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${value}%` }}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
      </div>
    </div>
  );
}

function SaveButton({ onClick, saving, saved }: {
  onClick: () => void;
  saving: boolean;
  saved: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className={cn(
        "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
        saved
          ? "bg-emerald-500 text-white"
          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 active:scale-95",
        saving && "opacity-70 cursor-not-allowed"
      )}
    >
      {saving ? (
        <><Loader2 size={15} className="animate-spin" /> Saving…</>
      ) : saved ? (
        <><Check size={15} /> Saved</>
      ) : (
        <><Save size={15} /> Save Changes</>
      )}
    </button>
  );
}

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "organization", label: "Organization",   icon: <Building2 size={16} /> },
  { id: "ai",          label: "AI Scoring",      icon: <Sparkles size={16} /> },
  { id: "email",       label: "Email",            icon: <Mail size={16} /> },
  { id: "account",     label: "Account",          icon: <User size={16} /> },
  { id: "data",        label: "Data & Privacy",   icon: <ShieldAlert size={16} /> },
];

// ─── Fake save helper ─────────────────────────────────────────────────────────
function useSave() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  const save = async (cb?: () => Promise<void>) => {
    setSaving(true);
    await (cb?.() ?? new Promise((r) => setTimeout(r, 800)));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return { saving, saved, save };
}

// ─── Sections ─────────────────────────────────────────────────────────────────
function OrganizationSection() {
  const [companyName, setCompanyName]   = useState("Acme Corp");
  const [industry, setIndustry]         = useState("Technology");
  const [website, setWebsite]           = useState("https://acme.com");
  const [location, setLocation]         = useState("San Francisco, CA");
  const { saving, saved, save }         = useSave();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Organization"
        description="Details used across reports, email footers, and the candidate portal."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <FieldLabel>Company Name</FieldLabel>
          <TextInput value={companyName} onChange={setCompanyName} placeholder="Acme Corp" />
        </div>
        <div>
          <FieldLabel>Industry</FieldLabel>
          <TextInput value={industry} onChange={setIndustry} placeholder="Technology" />
        </div>
        <div>
          <FieldLabel>Website</FieldLabel>
          <TextInput value={website} onChange={setWebsite} placeholder="https://" />
        </div>
        <div>
          <FieldLabel>Headquarters Location</FieldLabel>
          <TextInput value={location} onChange={setLocation} placeholder="City, Country" />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <SaveButton onClick={() => save()} saving={saving} saved={saved} />
      </div>
    </div>
  );
}

function AISection() {
  const [skills, setSkills]       = useState(35);
  const [experience, setExperience] = useState(30);
  const [education, setEducation]  = useState(20);
  const [culture, setCulture]      = useState(15);
  const [threshold, setThreshold]  = useState(75);
  const [autoShortlist, setAutoShortlist] = useState(false);
  const { saving, saved, save } = useSave();

  const total = skills + experience + education + culture;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="AI Scoring"
        description="Configure how the AI weighs each dimension when calculating a candidate's overall score."
      />

      {/* Weight sliders */}
      <div className="bg-gray-50 rounded-2xl p-5 space-y-5">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Score Weights
          </p>
          <span
            className={cn(
              "text-xs font-bold px-2 py-0.5 rounded-full",
              total === 100
                ? "bg-emerald-50 text-emerald-600"
                : "bg-amber-50 text-amber-600"
            )}
          >
            {total}/100 — {total === 100 ? "balanced" : total > 100 ? "over" : "under"}
          </span>
        </div>
        <WeightSlider label="Skills Match"   value={skills}     onChange={setSkills}     color="bg-indigo-500" />
        <WeightSlider label="Work Experience" value={experience} onChange={setExperience} color="bg-pink-500" />
        <WeightSlider label="Education Fit"  value={education}  onChange={setEducation}  color="bg-amber-400" />
        <WeightSlider label="Culture Fit"    value={culture}    onChange={setCulture}    color="bg-emerald-500" />
      </div>

      {/* Threshold + auto-shortlist */}
      <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Automation
        </p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-700">Auto-shortlist Threshold</span>
            <span className="text-sm font-bold text-indigo-600 tabular-nums">{threshold}</span>
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${threshold}%` }}
            />
            <input
              type="range" min={0} max={100} value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
            />
          </div>
          <p className="text-xs text-gray-400">
            Candidates scoring above this threshold will be eligible for auto-shortlisting.
          </p>
        </div>
        <div className="border-t border-gray-200 pt-3">
          <Toggle
            checked={autoShortlist}
            onChange={setAutoShortlist}
            label="Auto-shortlist on Score"
            description="Automatically move candidates above the threshold to Shortlisted."
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <SaveButton onClick={() => save()} saving={saving} saved={saved} />
      </div>
    </div>
  );
}

function EmailSection() {
  const [senderName, setSenderName]   = useState("The Hiring Team");
  const [replyTo, setReplyTo]         = useState("hiring@acme.com");
  const [signature, setSignature]     = useState("Best regards,\nThe Hiring Team\nAcme Corp");
  const [notifyOnApply, setNotifyOnApply] = useState(true);
  const [notifyOnScore, setNotifyOnScore] = useState(false);
  const { saving, saved, save } = useSave();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Email"
        description="Defaults used when sending emails to candidates from the platform."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <FieldLabel>Sender Name</FieldLabel>
          <TextInput value={senderName} onChange={setSenderName} placeholder="The Hiring Team" />
        </div>
        <div>
          <FieldLabel>Reply-To Address</FieldLabel>
          <TextInput value={replyTo} onChange={setReplyTo} placeholder="hiring@company.com" type="email" />
        </div>
      </div>
      <div>
        <FieldLabel>Email Signature</FieldLabel>
        <textarea
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          rows={4}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all resize-none"
        />
      </div>

      <div className="bg-gray-50 rounded-2xl p-5 divide-y divide-gray-200">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Notifications
        </p>
        <Toggle
          checked={notifyOnApply}
          onChange={setNotifyOnApply}
          label="Notify on new upload"
          description="Receive an email when resumes are uploaded and processed."
        />
        <Toggle
          checked={notifyOnScore}
          onChange={setNotifyOnScore}
          label="Notify when scoring completes"
          description="Get an email summary after a bulk AI scoring run finishes."
        />
      </div>

      <div className="flex justify-end pt-2">
        <SaveButton onClick={() => save()} saving={saving} saved={saved} />
      </div>
    </div>
  );
}

function AccountSection() {
  const [name, setName]         = useState("Admin User");
  const [email, setEmail]       = useState("admin@acme.com");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw]       = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const { saving, saved, save } = useSave();

  const pwMismatch = newPw.length > 0 && confirmPw.length > 0 && newPw !== confirmPw;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Account"
        description="Your personal account details and password."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <FieldLabel>Full Name</FieldLabel>
          <TextInput value={name} onChange={setName} />
        </div>
        <div>
          <FieldLabel>Email Address</FieldLabel>
          <TextInput value={email} onChange={setEmail} type="email" />
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Change Password</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <FieldLabel>Current Password</FieldLabel>
            <TextInput value={currentPw} onChange={setCurrentPw} type="password" placeholder="••••••••" />
          </div>
          <div>
            <FieldLabel>New Password</FieldLabel>
            <TextInput value={newPw} onChange={setNewPw} type="password" placeholder="••••••••" />
          </div>
          <div>
            <FieldLabel>Confirm Password</FieldLabel>
            <TextInput value={confirmPw} onChange={setConfirmPw} type="password" placeholder="••••••••" />
          </div>
        </div>
        {pwMismatch && (
          <p className="text-xs text-red-500 font-bold">Passwords do not match.</p>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <SaveButton onClick={() => save()} saving={saving} saved={saved} />
      </div>
    </div>
  );
}

function DataSection() {
  const { talents, deleteTalentsByJob } = useTalentStore();
  const [confirmWipe, setConfirmWipe]   = useState(false);
  const [wiping, setWiping]             = useState(false);

  const handleExport = () => {
    const headers = ["Name,Email,Status,Score"];
    const rows = talents.map(
      (t) =>
        `${t.firstName} ${t.lastName},${t.email},${t.status ?? "Pending"},${
          t.talentScore?.overallScore ?? 0
        }`
    );
    const csv =
      "data:text/csv;charset=utf-8," +
      encodeURIComponent(headers.concat(rows).join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csv);
    link.setAttribute("download", "all_candidates.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Data & Privacy"
        description="Export your data or permanently remove candidates from the platform."
      />

      {/* Export */}
      <div className="bg-gray-50 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-gray-800">Export All Candidate Data</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Download a CSV of all {talents.length} candidate{talents.length !== 1 ? "s" : ""} currently on the platform.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:border-indigo-300 hover:text-indigo-600 transition-all"
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Danger zone */}
      <div className="border border-red-100 bg-red-50/40 rounded-2xl p-5 space-y-4">
        <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Danger Zone</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-800">Delete All Candidates</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Permanently remove all talent profiles. This cannot be undone.
            </p>
          </div>
          {!confirmWipe ? (
            <button
              onClick={() => setConfirmWipe(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-red-200 text-red-500 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
            >
              <Trash2 size={15} /> Delete All
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-red-500">Are you sure?</span>
              <button
                onClick={async () => {
                  setWiping(true);
                  // Deletes all talents per job; for a global wipe you'd call a dedicated endpoint.
                  // Here we just close the confirm UI; wire to your real endpoint as needed.
                  await new Promise((r) => setTimeout(r, 800));
                  setWiping(false);
                  setConfirmWipe(false);
                }}
                disabled={wiping}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all disabled:opacity-60"
              >
                {wiping ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                Confirm
              </button>
              <button
                onClick={() => setConfirmWipe(false)}
                className="px-3 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="pb-4 border-b border-gray-100">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const SECTION_COMPONENTS: Record<Section, React.ReactNode> = {
  organization: <OrganizationSection />,
  ai:           <AISection />,
  email:        <EmailSection />,
  account:      <AccountSection />,
  data:         <DataSection />,
};

export default function SettingsPage() {
  const [active, setActive] = useState<Section>("organization");

  return (
    <div className="container mx-auto p-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage your workspace, AI behaviour, and account preferences.
        </p>
      </div>

      <div className="flex gap-8 items-start">
        {/* Sidebar nav */}
        <nav className="w-52 shrink-0 sticky top-6 space-y-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
                active === item.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              )}
            >
              <span className="flex items-center gap-2.5">
                {item.icon}
                {item.label}
              </span>
              {active === item.id && <ChevronRight size={14} />}
            </button>
          ))}
        </nav>

        {/* Content panel */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 min-h-[480px]">
          {SECTION_COMPONENTS[active]}
        </div>
      </div>
    </div>
  );
}