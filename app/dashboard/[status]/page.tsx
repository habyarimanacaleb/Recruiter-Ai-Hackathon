import { Suspense } from "react";
import { RankingSection } from "@/features/dashboard/RankingSection";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import { TalentStatus } from "@/types/talent";

interface PageProps {
  params: Promise<{ status: string }>;
}

// "candidates" = show all; everything else maps to a TalentStatus value.
// "interviewed" has been removed.
const SLUG_TO_STATUS: Record<string, TalentStatus | null> = {
  candidates:  null,            // null → fetchTalents() (all)
  screened:    "Screened",
  shortlisted: "Shortlisted",
  emailed:     "Emailed",
  rejected:    "Rejected",
  pending:     "Pending",
};

async function RankingContent({ params }: PageProps) {
  const { status } = await params;
  const lowerStatus = status.toLowerCase();

  if (!(lowerStatus in SLUG_TO_STATUS)) {
    return notFound();
  }

  const talentStatus = SLUG_TO_STATUS[lowerStatus];
  const displayTitle = lowerStatus === "candidates" ? "All" : lowerStatus;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold capitalize text-gray-900">
          {displayTitle} Candidates
        </h2>
      </div>
      <section className="w-full bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <RankingSection status={talentStatus} />
      </section>
    </div>
  );
}

function RankingFallback() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="h-8 w-48 bg-gray-100 rounded-lg animate-pulse" />
      <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-center py-24">
          <Loader2 size={24} className="animate-spin text-indigo-400" />
        </div>
      </div>
    </div>
  );
}

export default function StatusPage({ params }: PageProps) {
  return (
    <Suspense fallback={<RankingFallback />}>
      <RankingContent params={params} />
    </Suspense>
  );
}