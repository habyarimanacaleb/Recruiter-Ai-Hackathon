// app/dashboard/candidates/page.tsx
import { FAKE_CANDIDATES } from "@/constants";
import CandidateView from "@/features/dashboard/CandidateView";

export default async function AllCandidatesPage() {
  const candidates = FAKE_CANDIDATES; // Replace with your real fetch

  return (
    <CandidateView 
      title="All Candidates" 
      subtitle="Complete database of all uploaded resumes."
      candidates={candidates}
    />
  );
}
