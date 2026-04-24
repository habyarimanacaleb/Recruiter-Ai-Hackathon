// app/dashboard/shortlisted/page.tsx
import { FAKE_CANDIDATES } from "@/constants";
import CandidateView from "@/features/dashboard/CandidateView";

export default async function ShortlistedPage() {
  // Filter for only shortlisted candidates
  const shortlisted = FAKE_CANDIDATES.filter(c => c.status === "Shortlisted");

  return (
    <CandidateView 
      title="Shortlisted" 
      subtitle="Top-tier talent moved to the next stage."
      candidates={shortlisted}
    />
  );
}
