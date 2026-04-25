"use client";

import { useState } from "react";
import { CandidateRankingTable } from "@/features/dashboard/CandidateRankingTable";
import { CandidateDetailsModal } from "@/features/dashboard/modals/CandidateDetailsModal";
import { SendEmailModal } from "@/features/dashboard/modals/SendEmailModal";
import { Talent, TalentStatus } from "@/types/talent";

type ModalType = "DETAILS" | "EMAIL" | null;

interface RankingSectionProps {
  /** Pass a TalentStatus to pre-filter the table to that status.
   *  Pass null (or omit) to show all candidates. */
  status?: TalentStatus | null;
}

export function RankingSection({ status = null }: RankingSectionProps) {
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const handleOpenDetails = (talent: Talent) => {
    setSelectedTalent(talent);
    setActiveModal("DETAILS");
  };

  const handleOpenEmail = (talent: Talent) => {
    setSelectedTalent(talent);
    setActiveModal("EMAIL");
  };

  const handleCloseModals = () => {
    setActiveModal(null);
    setTimeout(() => setSelectedTalent(null), 200);
  };

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      <CandidateRankingTable
        initialStatus={status}
        onView={handleOpenDetails}
        onEmail={handleOpenEmail}
      />

      {selectedTalent && (
        <>
          <CandidateDetailsModal
            candidate={selectedTalent}
            isOpen={activeModal === "DETAILS"}
            onClose={handleCloseModals}
          />
          <SendEmailModal
            candidate={selectedTalent}
            isOpen={activeModal === "EMAIL"}
            onClose={handleCloseModals}
          />
        </>
      )}
    </section>
  );
}