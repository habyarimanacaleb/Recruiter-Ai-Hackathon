// app/dashboard/interviewed/page.tsx
import { FAKE_CANDIDATES } from "@/constants";
import CandidateView from "@/features/dashboard/CandidateView";

export default async function interviewedPage() {
  // Filter for only interviewed candidates
  const interviewed = FAKE_CANDIDATES.filter((c) => c.status === "Interview");

  return (
    <CandidateView
      title="Interview Stage"
      subtitle="Candidates currently in the interview pipeline."
      candidates={interviewed}
    />
  );
}
