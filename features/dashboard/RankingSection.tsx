"use client";

import  { useState } from "react";
import { CandidateRankingTable } from "@/features/dashboard/CandidateRankingTable";
import { CandidateDetailsModal } from "@/features/dashboard/modals/CandidateDetailsModal";
import { SendEmailModal } from "@/features/dashboard/modals/SendEmailModal";
import { Candidate } from "@/types";

type ModalType = "DETAILS" | "EMAIL" | null;

export function RankingSection({ candidates }: { candidates: Candidate[] }) {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const activeCandidate = candidates.find(c => c.id === selectedCandidateId) || null;

  const handleOpenDetails = (candidate: Candidate) => {
    setSelectedCandidateId(candidate.id);
    setActiveModal("DETAILS");
  };

  const handleOpenEmail = (candidate: Candidate) => {
    setSelectedCandidateId(candidate.id);
    setActiveModal("EMAIL");
  };

  const handleCloseModals = () => {
    setActiveModal(null);
    // Timeout matches typical Tailwind/Framer transition durations
    setTimeout(() => setSelectedCandidateId(null), 200); 
  };

 

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      <CandidateRankingTable 
       candidates={candidates}
        onView={handleOpenDetails}
        onEmail={handleOpenEmail}
      />

      {/* Logic for shared modals */}
      {activeCandidate && (
        <>
          <CandidateDetailsModal 
            candidate={activeCandidate}
            isOpen={activeModal === "DETAILS"}
            onClose={handleCloseModals}
          />

          <SendEmailModal 
            candidate={activeCandidate}
            isOpen={activeModal === "EMAIL"}
            onClose={handleCloseModals}
          />
        </>
      )}
    </section>
  );
}
