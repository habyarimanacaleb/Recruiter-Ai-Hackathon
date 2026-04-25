"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  X, Eye, Mail, Trash2, Sparkles, ChevronDown,
  Loader2, BriefcaseBusiness, Zap, Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Talent, TalentStatus } from "@/types/talent";
import { Pagination } from "@/components/common/Pagination";
import { SearchBar } from "@/components/common/SearchBar";
import { ExportButton } from "@/components/common/ExportButton";
import { SortButton } from "./SortButton";
import { useTalentStore } from "@/store/useTalentStore";
import { useJobStore } from "@/store/useJobStore";

const ITEMS_PER_PAGE = 6;

const STATUS_OPTIONS: TalentStatus[] = [
  "Pending", "Screened", "Shortlisted", "Emailed", "Rejected",
];

const getStatusStyles = (status: string) => {
  const styles: Record<string, string> = {
    Rejected:    "bg-gray-50 text-gray-400 border-gray-100",
    Emailed:     "bg-blue-50 text-indigo-600 border-blue-100",
    Shortlisted: "bg-pink-50 text-pink-600 border-pink-100",
    Screened:    "bg-indigo-50 text-indigo-600 border-indigo-100",
    Pending:     "bg-amber-50 text-amber-600 border-amber-100",
  };
  return styles[status] || "bg-gray-50 text-gray-600 border-gray-100";
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function talentName(t: Talent) {
  return `${t.firstName} ${t.lastName}`;
}

function talentInitials(t: Talent) {
  return `${t.firstName[0] ?? ""}${t.lastName[0] ?? ""}`.toUpperCase();
}

function latestRole(t: Talent): string {
  if (!t.experience?.length) return t.headline ?? "—";
  const current = t.experience.find((e) => e.isCurrent) ?? t.experience[0];
  return `${current.role} @ ${current.company}`;
}

function highestEducation(t: Talent): string {
  if (!t.education?.length) return "—";
  const ed = t.education[t.education.length - 1];
  return `${ed.degree}, ${ed.institution}`;
}

function totalExperience(t: Talent): string {
  if (!t.experience?.length) return "—";
  const years = t.experience.reduce((acc, e) => {
    const start = new Date(e.startDate).getFullYear();
    const end = e.isCurrent
      ? new Date().getFullYear()
      : new Date(e.endDate).getFullYear();
    return acc + (end - start);
  }, 0);
  return `${years} yr${years !== 1 ? "s" : ""}`;
}

function skillsMatchPercent(t: Talent): number {
  if (!t.skills?.length) return 0;
  const withExp = t.skills.filter((s) => s.yearsOfExperience > 0).length;
  return Math.round((withExp / t.skills.length) * 100);
}

function exportTalentsToCSV(talents: Talent[]) {
  const headers = ["Rank,Name,Email,Role,Score,Status,Experience,Education"];
  const rows = talents.map((t, i) =>
    `${i + 1},${talentName(t)},${t.email},${latestRole(t)},${
      t.talentScore?.overallScore ?? 0
    },${t.status ?? "Pending"},${totalExperience(t)},${highestEducation(t)}`
  );
  const csv = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csv));
  link.setAttribute("download", "candidates_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ─── Status Dropdown (per-row) ────────────────────────────────────────────────
function StatusDropdown({
  currentStatus,
  talentId,
  onUpdate,
}: {
  currentStatus: TalentStatus;
  talentId: string;
  onUpdate: (id: string, status: TalentStatus) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = async (status: TalentStatus) => {
    setOpen(false);
    if (status === currentStatus) return;
    setLoading(true);
    try {
      await onUpdate(talentId, status);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition-all",
          getStatusStyles(currentStatus),
          loading && "opacity-50 cursor-not-allowed"
        )}
      >
        {loading ? (
          <Loader2 size={10} className="animate-spin" />
        ) : (
          <>
            {currentStatus}
            <ChevronDown
              size={10}
              className={cn("transition-transform", open && "rotate-180")}
            />
          </>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-36 bg-white rounded-xl border border-gray-100 shadow-xl z-50 overflow-hidden">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSelect(s)}
              className={cn(
                "w-full text-left px-3 py-2 text-xs font-bold transition-colors hover:bg-gray-50",
                s === currentStatus && "bg-gray-50"
              )}
            >
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full border text-[10px]",
                  getStatusStyles(s)
                )}
              >
                {s}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Job Selector Dropdown ────────────────────────────────────────────────────
function JobSelectorDropdown({
  selectedJobId,
  onSelect,
}: {
  selectedJobId: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { jobs, fetchJobs, isLoading } = useJobStore();

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = jobs.find((j) => j._id === selectedJobId);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
          selectedJobId
            ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200"
            : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
        )}
      >
        <BriefcaseBusiness size={13} />
        <span className="max-w-[140px] truncate">
          {isLoading ? "Loading…" : selected ? selected.jobTitle : "Select Job"}
        </span>
        <ChevronDown
          size={12}
          className={cn("transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl border border-gray-100 shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-gray-50">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">
              Score against job
            </p>
          </div>
          <div className="max-h-56 overflow-y-auto">
            {jobs.length === 0 ? (
              <p className="text-xs text-gray-400 px-4 py-3">No jobs found.</p>
            ) : (
              jobs.map((job) => (
                <button
                  key={job._id}
                  onClick={() => {
                    onSelect(job._id);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 hover:bg-indigo-50 transition-colors",
                    selectedJobId === job._id && "bg-indigo-50"
                  )}
                >
                  <p className="text-xs font-bold text-gray-800">
                    {job.jobTitle}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {job.department}
                  </p>
                </button>
              ))
            )}
          </div>
          {selectedJobId && (
            <div className="p-2 border-t border-gray-50">
              <button
                onClick={() => {
                  onSelect("");
                  setOpen(false);
                }}
                className="w-full text-center text-[10px] font-bold text-gray-400 hover:text-red-500 py-1"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Status Filter Dropdown ───────────────────────────────────────────────────
function StatusFilterDropdown({
  selected,
  onSelect,
  isLoading,
  locked,
}: {
  selected: string;
  onSelect: (val: string) => void;
  isLoading: boolean;
  /** When true the dropdown is read-only (page is already scoped to a status) */
  locked?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => !locked && setOpen((v) => !v)}
        disabled={isLoading || locked}
        title={locked ? "Filter locked to current page status" : undefined}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
          selected !== "All"
            ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200"
            : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600",
          (isLoading || locked) && "opacity-60 cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Filter size={12} />
        )}
        <span>{selected === "All" ? "All Statuses" : selected}</span>
        {!locked && (
          <ChevronDown
            size={12}
            className={cn("transition-transform", open && "rotate-180")}
          />
        )}
      </button>

      {open && !locked && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-gray-100 shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-gray-50">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">
              Filter by status
            </p>
          </div>
          {["All", ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => {
                onSelect(s);
                setOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-gray-50 transition-colors",
                selected === s && "bg-gray-50"
              )}
            >
              {s === "All" ? (
                <span className="text-gray-600 text-xs">All Statuses</span>
              ) : (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full border text-[10px]",
                    getStatusStyles(s)
                  )}
                >
                  {s}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function CandidateRankingTable({
  onView,
  onEmail,
  initialStatus = null,
}: {
  onView: (t: Talent) => void;
  onEmail: (t: Talent) => void;
  /**
   * When provided the table seeds its initial fetch with this status and locks
   * the status-filter dropdown so the user can't accidentally change the scope
   * while navigating a filtered page (e.g. /screened).
   */
  initialStatus?: TalentStatus | null;
}) {
  const {
    talents,
    isLoading,
    isScoring,
    error,
    fetchTalents,
    fetchTalentsByStatus,
    scoreOneTalent,
    scoreAllTalents,
    updateTalentStatus,
    deleteTalent,
    clearError,
  } = useTalentStore();

  const [currentPage, setCurrentPage]         = useState(1);
  const [statusFilter, setStatusFilter]       = useState<"All" | TalentStatus>(
    initialStatus ?? "All"
  );
  const [sortOrder, setSortOrder]             = useState<"asc" | "desc">("desc");
  const [selectedJobId, setSelectedJobId]     = useState("");
  const [searchQuery, setSearchQuery]         = useState("");
  const [selectedIds, setSelectedIds]         = useState<Set<string>>(new Set());
  const [scoringIds, setScoringIds]           = useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds]         = useState<Set<string>>(new Set());
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // Initial fetch — respect initialStatus from the page route
  useEffect(() => {
    if (initialStatus) {
      fetchTalentsByStatus(initialStatus);
    } else {
      fetchTalents();
    }
  }, [initialStatus]);

  // Reset page + selection whenever the talent list changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, [talents]);

  // ── Derived data ──────────────────────────────────────────────────────
  const displayData = useMemo(() => {
    let result = [...talents];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          talentName(t).toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q) ||
          latestRole(t).toLowerCase().includes(q) ||
          t.skills?.some((s) => s.name.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      const aScore = a.talentScore?.overallScore ?? 0;
      const bScore = b.talentScore?.overallScore ?? 0;
      return sortOrder === "desc" ? bScore - aScore : aScore - bScore;
    });

    return result;
  }, [talents, searchQuery, sortOrder]);

  const paginatedData = useMemo(
    () =>
      displayData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [displayData, currentPage]
  );

  // ── Selection helpers ─────────────────────────────────────────────────
  const toggleSelection = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleSelectAll = () => {
    const pageIds = paginatedData.map((t) => t._id);
    const allSelected = pageIds.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) pageIds.forEach((id) => next.delete(id));
      else pageIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  // ── Status filter ─────────────────────────────────────────────────────
  // Only reachable when the dropdown is not locked (initialStatus === null)
  const handleStatusFilter = async (val: string) => {
    setStatusFilter(val as "All" | TalentStatus);
    setCurrentPage(1);
    setIsFilterLoading(true);
    try {
      if (val === "All") await fetchTalents();
      else await fetchTalentsByStatus(val as TalentStatus);
    } finally {
      setIsFilterLoading(false);
    }
  };

  // ── Score handlers ────────────────────────────────────────────────────
  const handleScoreOne = async (talentId: string) => {
    if (!selectedJobId) return;
    setScoringIds((prev) => new Set(prev).add(talentId));
    try {
      await scoreOneTalent(talentId, selectedJobId);
      await updateTalentStatus(talentId, "Screened");
    } finally {
      setScoringIds((prev) => {
        const n = new Set(prev);
        n.delete(talentId);
        return n;
      });
    }
  };

  const handleScoreAll = async () => {
    if (!selectedJobId) return;
    try {
      await scoreAllTalents(selectedJobId);
      await Promise.all(
        talents.map((t) => updateTalentStatus(t._id, "Screened"))
      );
    } catch {
      // handled in store
    }
  };

  // ── Status update handlers ────────────────────────────────────────────
  const handleUpdateStatus = async (talentId: string, status: TalentStatus) => {
    await updateTalentStatus(talentId, status);
  };

  const handleBulkStatusUpdate = async (status: TalentStatus) => {
    await Promise.all(
      Array.from(selectedIds).map((id) => updateTalentStatus(id, status))
    );
    clearSelection();
  };

  // ── Delete handlers ───────────────────────────────────────────────────
  const handleDeleteOne = async (talentId: string) => {
    setDeletingIds((prev) => new Set(prev).add(talentId));
    try {
      await deleteTalent(talentId);
    } finally {
      setDeletingIds((prev) => {
        const n = new Set(prev);
        n.delete(talentId);
        return n;
      });
      setSelectedIds((prev) => {
        const n = new Set(prev);
        n.delete(talentId);
        return n;
      });
    }
  };

  const handleBulkDelete = async () => {
    await Promise.all(Array.from(selectedIds).map((id) => deleteTalent(id)));
    clearSelection();
  };

  const isScoreAllLoading = isScoring && scoringIds.size === 0;

  // ─────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

      {/* ── Top Header ── */}
      <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-50">
        <h2 className="text-lg font-bold text-gray-800">Candidate Rankings</h2>

        <div className="flex flex-wrap items-center gap-2">
          {isLoading ? (
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
              <Loader2 size={10} className="animate-spin" /> Loading…
            </span>
          ) : (
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded tracking-wider uppercase">
              {displayData.length} Candidates
            </span>
          )}

          <StatusFilterDropdown
            selected={statusFilter}
            onSelect={handleStatusFilter}
            isLoading={isFilterLoading}
            locked={initialStatus !== null}
          />

          <JobSelectorDropdown
            selectedJobId={selectedJobId}
            onSelect={setSelectedJobId}
          />

          {selectedJobId && (
            <button
              onClick={handleScoreAll}
              disabled={isScoreAllLoading}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border",
                isScoreAllLoading
                  ? "bg-violet-50 text-violet-400 border-violet-100 cursor-not-allowed"
                  : "bg-violet-600 text-white border-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-200"
              )}
            >
              {isScoreAllLoading ? (
                <><Loader2 size={12} className="animate-spin" />Scoring…</>
              ) : (
                <><Zap size={12} />Score All</>
              )}
            </button>
          )}

          <SortButton
            label="AI Score"
            currentOrder={sortOrder}
            onSort={(order) => {
              setSortOrder(order);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* ── Search + Bulk Actions Bar ── */}
      <div className="relative h-16 border-b border-gray-50 bg-white">
        {/* Standard row */}
        <div
          className={cn(
            "absolute inset-0 px-4 flex items-center justify-between transition-all duration-300",
            selectedIds.size > 0
              ? "-translate-y-full opacity-0 pointer-events-none"
              : "translate-y-0 opacity-100"
          )}
        >
          <div className="w-1/2">
            <SearchBar
              onSearch={(val) => {
                setSearchQuery(val);
                setCurrentPage(1);
              }}
              placeholder="Search candidates…"
            />
          </div>
          <ExportButton onExport={() => exportTalentsToCSV(displayData)} />
        </div>

        {/* Bulk actions */}
        <div
          className={cn(
            "absolute inset-0 px-4 bg-indigo-600 flex items-center justify-between transition-all duration-300",
            selectedIds.size === 0
              ? "translate-y-full opacity-0 pointer-events-none"
              : "translate-y-0 opacity-100"
          )}
        >
          <div className="flex items-center gap-4 text-white">
            <button
              onClick={clearSelection}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <span className="font-bold text-sm tracking-tight">
              {selectedIds.size} Selected
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkStatusUpdate("Screened")}
              className="bg-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold border border-white/20 hover:bg-white/20 transition-all"
            >
              Mark Screened
            </button>
            <button
              onClick={() => handleBulkStatusUpdate("Shortlisted")}
              className="bg-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold border border-white/20 hover:bg-white/20 transition-all"
            >
              Shortlist
            </button>
            <button
              onClick={() => handleBulkStatusUpdate("Emailed")}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 transition-all flex items-center gap-1.5"
            >
              <Mail size={13} />Mark Emailed
            </button>
            <button
              onClick={() => handleBulkStatusUpdate("Rejected")}
              className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-600 transition-all"
            >
              Reject All
            </button>
            <button
              onClick={handleBulkDelete}
              className="bg-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold border border-white/20 hover:bg-red-500 hover:border-red-500 transition-all flex items-center gap-1.5"
            >
              <Trash2 size={13} />Delete
            </button>
          </div>
        </div>
      </div>

      {/* ── Hint banners ── */}
      {!selectedJobId && talents.length > 0 && (
        <div className="flex items-center gap-2 px-5 py-2.5 bg-amber-50 border-b border-amber-100">
          <Sparkles size={13} className="text-amber-500 shrink-0" />
          <p className="text-xs text-amber-700 font-medium">
            Select a job description above to enable AI scoring.
          </p>
        </div>
      )}
      {error && (
        <div className="flex items-center justify-between gap-2 px-5 py-2.5 bg-red-50 border-b border-red-100">
          <p className="text-xs text-red-600 font-medium">{error}</p>
          <button
            onClick={clearError}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-gray-400 font-bold border-b border-gray-50">
              <th className="px-6 py-4 w-10">
                <input
                  type="checkbox"
                  className="rounded accent-indigo-600 cursor-pointer"
                  checked={
                    paginatedData.length > 0 &&
                    paginatedData.every((t) => selectedIds.has(t._id))
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-4 py-4">Rank</th>
              <th className="px-4 py-4">Candidate</th>
              <th className="px-4 py-4">Role / Headline</th>
              <th className="px-4 py-4 text-center">AI Score</th>
              <th className="px-4 py-4 w-32">Skills Match</th>
              <th className="px-4 py-4">Exp</th>
              <th className="px-4 py-4">Education</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginatedData.map((talent, index) => {
              const globalRank    = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
              const score         = talent.talentScore?.overallScore ?? 0;
              const match         = skillsMatchPercent(talent);
              const isBeingScored  = scoringIds.has(talent._id);
              const isBeingDeleted = deletingIds.has(talent._id);
              const isBusy        = isBeingScored || isBeingDeleted;
              const talentStatus  = (talent.status ?? "Pending") as TalentStatus;

              return (
                <tr
                  key={talent._id}
                  className={cn(
                    "transition-colors",
                    isBusy
                      ? "opacity-60 pointer-events-none bg-gray-50/50"
                      : selectedIds.has(talent._id)
                      ? "bg-indigo-50/30"
                      : "hover:bg-gray-50/50"
                  )}
                >
                  {/* Checkbox */}
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded accent-indigo-600 cursor-pointer"
                      checked={selectedIds.has(talent._id)}
                      onChange={() => toggleSelection(talent._id)}
                    />
                  </td>

                  {/* Rank */}
                  <td className="px-4 py-4">
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                        globalRank <= 3
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-100"
                          : "bg-gray-100 text-gray-500"
                      )}
                    >
                      #{globalRank}
                    </div>
                  </td>

                  {/* Candidate */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                        {talentInitials(talent)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">
                          {talentName(talent)}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {talent.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-4 text-sm text-gray-600 max-w-[160px] truncate">
                    {latestRole(talent)}
                  </td>

                  {/* AI Score */}
                  <td className="px-4 py-4 text-center">
                    {isBeingScored ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-violet-50 text-violet-500 font-bold text-xs border border-violet-100">
                        <Loader2 size={11} className="animate-spin" />Scoring
                      </span>
                    ) : (
                      <span
                        className={cn(
                          "px-2 py-1 rounded-lg font-bold text-sm border",
                          score >= 80
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : score >= 60
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : score > 0
                            ? "bg-red-50 text-red-500 border-red-100"
                            : "bg-gray-50 text-gray-400 border-gray-100"
                        )}
                      >
                        {score > 0 ? score : "—"}
                      </span>
                    )}
                  </td>

                  {/* Skills match */}
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-indigo-600">
                        {match}%
                      </span>
                      <div className="w-full bg-gray-100 h-1 rounded-full">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${match}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Experience */}
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {totalExperience(talent)}
                  </td>

                  {/* Education */}
                  <td className="px-4 py-4 text-sm text-gray-500 truncate max-w-[120px]">
                    {highestEducation(talent)}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <StatusDropdown
                      currentStatus={talentStatus}
                      talentId={talent._id}
                      onUpdate={handleUpdateStatus}
                    />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onView(talent)}
                        title="View profile"
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEmail(talent)}
                        title="Send email"
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Mail size={16} />
                      </button>
                      {selectedJobId && (
                        <button
                          onClick={() => handleScoreOne(talent._id)}
                          disabled={isBeingScored || isScoring}
                          title="Score against selected job"
                          className={cn(
                            "p-2 transition-colors",
                            isBeingScored
                              ? "text-violet-400 cursor-not-allowed"
                              : "text-gray-400 hover:text-violet-600"
                          )}
                        >
                          {isBeingScored ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Sparkles size={16} />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteOne(talent._id)}
                        disabled={isBeingDeleted}
                        title="Delete"
                        className={cn(
                          "p-2 transition-colors",
                          isBeingDeleted
                            ? "text-red-300 cursor-not-allowed"
                            : "text-gray-400 hover:text-red-500"
                        )}
                      >
                        {isBeingDeleted ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {paginatedData.length === 0 && !isLoading && (
              <tr>
                <td colSpan={10} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                      <BriefcaseBusiness size={18} className="text-gray-300" />
                    </div>
                    <p className="text-sm font-bold text-gray-400">
                      No candidates found
                    </p>
                    <p className="text-xs text-gray-300">
                      Try adjusting your filters or search query
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className="p-4 border-t border-gray-50 bg-white">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(displayData.length / ITEMS_PER_PAGE)}
          totalItems={displayData.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}