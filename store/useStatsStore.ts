import { useMemo } from "react";
import { useCandidateStore } from "@/store/useCandidateStore";

export const useStatsStore = () => {
  const candidates = useCandidateStore((state) => state.candidates);

  return useMemo(() => {
    const total = candidates.length;
    const screened = candidates.filter(c => c.status !== "Rejected").length; // Example logic for 'Screened'
    const shortlisted = candidates.filter(c => c.status === "Shortlisted").length;
    const emailed = candidates.filter(c => c.status === "Emailed").length;

    // Calculate progress for the AI Screened card
    const screenedProgress = total > 0 ? Math.round((screened / total) * 100) : 0;

    return [
      { 
        label: "Resumes Uploaded", 
        value: total.toString(), 
        iconName: "upload" as const, 
        color: "blue" as const 
      },
      { 
        label: "Screened by AI", 
        value: `${screened}/${total}`, 
        iconName: "sparkles" as const, 
        color: "violet" as const, 
        progress: screenedProgress 
      },
      { 
        label: "Shortlisted", 
        value: shortlisted.toString(), 
        iconName: "star" as const, 
        color: "indigo" as const 
      },
      { 
        label: "Emails Sent", 
        value: emailed.toString(), 
        iconName: "mail" as const, 
        color: "emerald" as const 
      },
    ];
  }, [candidates]);
};
