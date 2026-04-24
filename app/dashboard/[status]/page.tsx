import { FAKE_CANDIDATES } from "@/constants";
import { RankingSection } from "@/features/dashboard/RankingSection";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button"; // Assuming a standard UI library
import { RotateCcw, ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ status: string }>;
}

const VALID_STATUSES = ["candidates", "shortlisted", "interviewed", "emailed","rejected", "screened"];

export default async function StatusPage({ params }: PageProps) {
  const { status } = await params;
  const lowerStatus = status.toLowerCase();

  if (!VALID_STATUSES.includes(lowerStatus)) {
    return notFound();
  }

  // 1. Strict Filtering: Ensure case-insensitive match on data
  const filteredCandidates = lowerStatus === "candidates" 
    ? FAKE_CANDIDATES 
    : FAKE_CANDIDATES.filter(
        (c) => c.status?.toLowerCase() === lowerStatus
      );

  const displayTitle = status === "candidates" ? "all" : status;

  console.log(`Filtered ${filteredCandidates.length} candidates for status: ${status}`);

  // 2. Empty State View
  if (filteredCandidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 p-6 text-center">
        <div className="bg-gray-100 p-6 rounded-full">
          <span className="text-4xl">📂</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">No {displayTitle} Candidates</h3>
        <p className="text-gray-500 max-w-xs">
          There are currently no candidates assigned to this status. Try refreshing or going back to the full list.
        </p>
        
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button onClick={() => window.location.reload()}>
            <RotateCcw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>
    );
  }

  // 3. Regular Render
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold capitalize text-gray-900">{displayTitle} Candidates</h2>
        <span className="text-sm font-medium px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
          {filteredCandidates.length} Found
        </span>
      </div>

      <section className="w-full bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <RankingSection key={lowerStatus} candidates={filteredCandidates} />
      </section>
    </div>
  );
}
