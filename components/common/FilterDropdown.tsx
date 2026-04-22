"use client";

import { useState } from "react";
import { SlidersHorizontal, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}

export function FilterDropdown({ options, selected, onSelect }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border",
          "bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100/50"
        )}
      >
        <SlidersHorizontal size={16} strokeWidth={2.5} />
        <span>Filters</span>
        {selected !== "All" && (
          <span className="ml-1 px-1.5 py-0.5 bg-indigo-600 text-white text-[10px] rounded-md">
            1
          </span>
        )}
        <ChevronDown size={14} className={cn("ml-1 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
              Filter by Status
            </div>
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onSelect(opt);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors",
                  selected === opt ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {opt}
                {selected === opt && <Check size={14} className="text-indigo-600" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
