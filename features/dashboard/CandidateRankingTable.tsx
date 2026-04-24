"use client";

import { useState, useMemo, useEffect } from "react";
import { X, Eye, Mail, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Candidate } from "@/types";
import { Pagination } from "@/components/common/Pagination";
import { SearchBar } from "@/components/common/SearchBar";
import { useCandidateStore } from "@/store/useCandidateStore";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { ExportButton } from "@/components/common/ExportButton";
import { SortButton } from "./SortButton";

const ITEMS_PER_PAGE = 6;

const getStatusStyles = (status: string) => {
  const styles: Record<string, string> = {
    Rejected: "bg-gray-50 text-gray-400 border-gray-100",
    Emailed: "bg-blue-50 text-indigo-600 border-blue-100",
    Interview: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Shortlisted: "bg-pink-50 text-pink-600 border-pink-100",
    Screened: "bg-indigo-50 text-indigo-600 border-indigo-100",
  };
  return styles[status] || "bg-gray-50 text-gray-600 border-gray-100";
};

export function CandidateRankingTable({
  onView,
  onEmail,
  candidates, // Passed from Server Page via RankingSection
}: {
  onView: (c: Candidate) => void;
  onEmail: (c: Candidate) => void;
  candidates: Candidate[];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [reportStatus, setReportStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const store = useCandidateStore();

  // 1. FILTERING LOGIC: Use 'candidates' prop + Store search query
  const displayData = useMemo(() => {
    let result = [...candidates];

    if (store.searchQuery) {
      const query = store.searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.roleApplied.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query),
      );
    }

    if (reportStatus !== "All") {
      result = result.filter(
        (c) => c.status.toLowerCase() === reportStatus.toLowerCase(),
      );
    }

    result.sort((a, b) => {
      return sortOrder === "desc"
        ? b.aiScore - a.aiScore
        : a.aiScore - b.aiScore;
    });
    return result;
  }, [candidates, store.searchQuery, sortOrder, reportStatus]);

  // 2. PAGINATION LOGIC
  const paginatedData = useMemo(() => {
    return displayData.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );
  }, [displayData, currentPage]);

  // 3. RESET: Clear selection and search when moving between status pages
  useEffect(() => {
    store.clearSelection();
    store.setSearchQuery("");
    setCurrentPage(1);
  }, [candidates]);

  const handleSelectAll = () => {
    const currentPageIds = paginatedData.map((i) => i.id);
    const isAllOnPageSelected = currentPageIds.every((id) =>
      store.selectedIds.includes(id),
    );

    if (isAllOnPageSelected) {
      store.selectAll(
        store.selectedIds.filter((id) => !currentPageIds.includes(id)),
      );
    } else {
      store.selectAll(
        Array.from(new Set([...store.selectedIds, ...currentPageIds])),
      );
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      {/* Top Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-50">
        <h2 className="text-lg font-bold text-gray-800">Candidate Rankings</h2>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded tracking-wider uppercase">
            {displayData.length} Candidates Found
          </span>
          <SortButton
            label="AI Score"
            currentOrder={sortOrder}
            onSort={(order) => {
              setSortOrder(order);
              setCurrentPage(1); // Reset pagination on sort
            }}
          />

          <FilterDropdown
            options={[
              "All",
              "Shortlisted",
              "Interview",
              "Screened",
              "Rejected",
            ]}
            selected={reportStatus}
            onSelect={setReportStatus}
          />
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="relative h-16 border-b border-gray-50 bg-white">
        {/* Standard Header */}
        <div
          className={cn(
            "absolute inset-0 px-4 flex items-center justify-between transition-all duration-300",
            store.selectedIds.length > 0
              ? "-translate-y-full opacity-0 pointer-events-none"
              : "translate-y-0 opacity-100",
          )}
        >
          <div className="w-1/2">
            <SearchBar
              onSearch={(val) => {
                store.setSearchQuery(val);
                setCurrentPage(1);
              }}
              placeholder="Search in this list..."
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Only show the status filter if we are on the main 'All Candidates' view */}
            {candidates.length === 0 && (
              <FilterDropdown
                options={[
                  "All",
                  "Shortlisted",
                  "Interview",
                  "Screened",
                  "Rejected",
                ]}
                selected={store.statusFilter}
                onSelect={(val) => {
                  store.setStatusFilter(val);
                  setCurrentPage(1);
                }}
              />
            )}
            <ExportButton onExport={() => store.exportToCSV()} />
          </div>
        </div>

        {/* Bulk Actions Overlay */}
        <div
          className={cn(
            "absolute inset-0 px-4 bg-indigo-600 flex items-center justify-between transition-all duration-300",
            store.selectedIds.length === 0
              ? "translate-y-full opacity-0 pointer-events-none"
              : "translate-y-0 opacity-100",
          )}
        >
          <div className="flex items-center gap-4 text-white">
            <button
              onClick={store.clearSelection}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <span className="font-bold text-sm tracking-tight">
              {store.selectedIds.length} Candidates Selected
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() =>
                store.bulkUpdateStatus(store.selectedIds, "Shortlisted")
              }
              className="bg-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold border border-white/20 hover:bg-white/20 transition-all"
            >
              Shortlist
            </button>
            <button
              onClick={() =>
                store.bulkUpdateStatus(store.selectedIds, "Rejected")
              }
              className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-600 shadow-lg shadow-red-900/20 transition-all"
            >
              Reject All
            </button>
          </div>
        </div>
      </div>

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
                    paginatedData.every((i) => store.selectedIds.includes(i.id))
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-4 py-4">Rank</th>
              <th className="px-4 py-4">Candidate</th>
              <th className="px-4 py-4">Role Applied</th>
              <th className="px-4 py-4 text-center">AI Score</th>
              <th className="px-4 py-4 w-32">Skills</th>
              <th className="px-4 py-4">Exp</th>
              <th className="px-4 py-4">Education</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginatedData.map((item) => (
              <tr
                key={item.id}
                className={cn(
                  "transition-colors",
                  store.selectedIds.includes(item.id)
                    ? "bg-indigo-50/30"
                    : "hover:bg-gray-50/50",
                )}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded accent-indigo-600 cursor-pointer"
                    checked={store.selectedIds.includes(item.id)}
                    onChange={() => store.toggleSelection(item.id)}
                  />
                </td>
                <td className="px-4 py-4">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white",
                      item.rank <= 3
                        ? "bg-orange-500 shadow-lg shadow-orange-100"
                        : "bg-gray-200 text-gray-500",
                    )}
                  >
                    #{item.rank}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 uppercase">
                      {item.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {item.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {item.roleApplied}
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 font-bold text-sm border border-emerald-100">
                    {item.aiScore}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-indigo-600">
                      92%
                    </span>
                    <div className="w-full bg-gray-100 h-1 rounded-full">
                      <div
                        className="bg-indigo-500 h-full rounded-full"
                        style={{ width: "92%" }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {item.experience}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500 truncate max-w-30">
                  {item.education}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold border",
                      getStatusStyles(item.status),
                    )}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onView(item)}
                      className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEmail(item)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Mail size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-50 bg-white">
        <Pagination
          currentPage={currentPage}
          // Dynamically calculate total pages based on the current filtered list
          totalPages={Math.ceil(displayData.length / ITEMS_PER_PAGE)}
          totalItems={displayData.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
