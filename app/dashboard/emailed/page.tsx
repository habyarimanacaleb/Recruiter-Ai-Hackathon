// app/dashboard/interviewed/page.tsx
import { FAKE_CANDIDATES } from "@/constants";
import CandidateView from "@/features/dashboard/CandidateView";

export default async function emailedPage() {
  // Filter for only emailed candidates
  const emailed = FAKE_CANDIDATES.filter((c) => c.status === "Emailed");

  return (
    <CandidateView
      title="Emailed Stage"
      subtitle="Candidates currently in the Emailed pipeline."
      candidates={emailed}
    />
  );
}
