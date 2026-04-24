"use client";

import { ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortButtonProps {
  label: string;
  currentOrder: "asc" | "desc" | null;
  onSort: (order: "asc" | "desc") => void;
}

export function SortButton({ label, currentOrder, onSort }: SortButtonProps) {
  const toggleSort = () => {
    onSort(currentOrder === "desc" ? "asc" : "desc");
  };

  return (
    <button
      onClick={toggleSort}
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded-md transition-all hover:bg-gray-100 group",
        currentOrder ? "text-indigo-600 bg-indigo-50 font-bold" : "text-gray-400 font-medium"
      )}
    >
      {currentOrder === null && <ArrowUpDown size={13} className="text-gray-300" />}
      {currentOrder === "asc" && <ChevronUp size={14} />}
      {currentOrder === "desc" && <ChevronDown size={14} />}
      
      <span className="text-[11px] uppercase tracking-tight">
        Sorted by {label}
      </span>
    </button>
  );
}
