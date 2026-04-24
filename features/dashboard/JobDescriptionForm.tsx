"use client";

import { Sparkles, Briefcase, Building2, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/common/SelectField";
import { useJobStore } from "@/store/useJobStore";
import { toast } from "sonner";

const jobTitles = [
  { label: "Senior Product Designer", value: "Senior Product Designer" },
  { label: "Fullstack Engineer", value: "Fullstack Engineer" },
  { label: "Data Scientist", value: "Data Scientist" },
  { label: "DevOps Engineer", value: "DevOps Engineer" },
];

const jobDepartments = [
  { label: "Engineering", value: "Engineering" },
  { label: "Operations", value: "Operations" },
  { label: "Design", value: "Design" },
  { label: "Data", value: "Data" },
];

export default function JobDescriptionForm() {
  const {
    jobTitle, setJobTitle,
    department, setDepartment,
    jobDescription, setJobDescription,
    isSaving, createJob,
  } = useJobStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobTitle.trim()) {
      return toast.error("Job Title required", {
        description: "Please select a job title.",
      });
    }

    if (!department.trim()) {
      return toast.error("Department required", {
        description: "Please select a department.",
      });
    }

    if (jobDescription.trim().length < 50) {
      return toast.error("Description too short", {
        description: "Please provide at least 50 characters for better AI accuracy.",
      });
    }

    try {
      await toast.promise(createJob(), {
        loading: "Saving job description...",
        success: "Job description created!",
        error: (err) => err?.message || "Failed to create job description.",
      });
    } catch {
      // error already handled by toast
    }
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

        {/* Selects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Job Title"
            icon={Briefcase}
            options={jobTitles}
            value={jobTitle}
            onChange={setJobTitle}
          />
          <SelectField
            label="Department"
            icon={Building2}
            options={jobDepartments}
            value={department}
            onChange={setDepartment}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
            Role Requirements
          </label>
          <textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full min-h-40 p-4 bg-gray-50 border border-blue-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm resize-none"
          />
          <p className="text-[10px] text-gray-400 text-right">
            {jobDescription.length} chars {jobDescription.length < 50 && jobDescription.length > 0 && (
              <span className="text-red-400">— need at least 50</span>
            )}
          </p>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSaving || !jobDescription || !jobTitle || !department}
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