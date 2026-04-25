import { useMemo } from "react";
import { useTalentStore } from "@/store/useTalentStore";

export const useStatsStore = () => {
  const talents = useTalentStore((state) => state.talents);

  return useMemo(() => {
    const total       = talents.length;
    const screened    = talents.filter((t) => t.status !== "Rejected" && t.status !== "Pending").length;
    const shortlisted = talents.filter((t) => t.status === "Shortlisted").length;
    const emailed     = talents.filter((t) => t.status === "Emailed").length;

    const screenedProgress = total > 0 ? Math.round((screened / total) * 100) : 0;

    return [
      {
        label: "Resumes Uploaded",
        value: total.toString(),
        iconName: "upload" as const,
        color: "blue" as const,
      },
      {
        label: "Screened by AI",
        value: `${screened}/${total}`,
        iconName: "sparkles" as const,
        color: "violet" as const,
        progress: screenedProgress,
      },
      {
        label: "Shortlisted",
        value: shortlisted.toString(),
        iconName: "star" as const,
        color: "indigo" as const,
      },
      {
        label: "Emails Sent",
        value: emailed.toString(),
        iconName: "mail" as const,
        color: "emerald" as const,
      },
    ];
  }, [talents]);
};