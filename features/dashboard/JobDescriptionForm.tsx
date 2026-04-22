"use client";

import { Sparkles, Briefcase, Building2, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/common/SelectField";
import { useJobStore } from "@/store/useJobStore";
import { toast } from "sonner";

const jobTitles = [{ label: "Senior Product Designer", value: "senior-product-designer" }, { label: "Fullstack Engineer", value: "fullstack-engineer" }];
const jobDepartments = [{ label: "Engineering", value: "engineering" }, { label: "Operations", value: "operations" }];

export default function JobDescriptionForm() {
  const { jobTitle, setJobTitle, department, setDepartment, jobDescription, setJobDescription, isProcessing, processBatch, files } = useJobStore();
 
const handleScreening = async () => {
  // 1. Validation logic with specific feedback
  if (files.length === 0) {
    return toast.error("No resumes found", {
      description: "Please upload at least one resume to start screening."
    });
  }

  if (!jobTitle.trim()) {
    return toast.error("Job Title required", {
      description: "Please select or enter a job title."
    });
  }

  if (jobDescription.trim().length < 50) {
    return toast.error("Description too short", {
      description: "Please provide a more detailed job description for better AI accuracy."
    });
  }

  // 2. Execution with loading state handling
  try {
    await toast.promise(processBatch(), {
      loading: 'AI is analyzing resumes against the job description...',
      success: () => {
        return `Successfully screened ${files.length} resumes!`;
      },
      error: (err) => {
        return err || "Analysis failed. Please try again.";
      },
    });
    // router.push('/dashboard/candidates');
    
  } catch (error) {
    console.error("Screening Handler Error:", error);
  }
};

  return (
    <div className="w-full bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
      <form onSubmit={(e) => { e.preventDefault(); handleScreening(); }} className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600"><FileText size={20} /></div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Screening Criteria</h2>
            <p className="text-xs text-gray-400">Define role details for AI analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField label="Job Title" icon={Briefcase} options={jobTitles} value={jobTitle} onChange={setJobTitle} />
          <SelectField label="Department" icon={Building2} options={jobDepartments} value={department} onChange={setDepartment} />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Role Requirements</label>
          <textarea 
            placeholder="Paste job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full min-h-40 p-4 bg-gray-50 border border-blue-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
          />
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Button 
            type="submit"
            disabled={isProcessing || !jobDescription || !jobTitle || files.length === 0}
            className="h-12 w-full md:w-fit px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all"
          >
            {isProcessing ? <Loader2 className="animate-spin mr-2" size={18}/> : <Sparkles className="mr-2" size={18}/>}
            {isProcessing ? "Analyzing Resumes..." : "Start AI Screening"}
          </Button>
          <p className="text-xs text-gray-400 italic">
            {files.length} resumes uploaded. Both JD and files are required to start.
          </p>
        </div>
      </form>
    </div>
  );
}
