import React from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  // Calculate showing ranges
  const startRange = (currentPage - 1) * itemsPerPage + 1;
  const endRange = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalItems === 0) return null;

  return (
    <div className="p-4 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between bg-white text-sm text-gray-500 gap-4">
      {/* Information Text */}
      <div>
        Showing <span className="font-semibold text-gray-900">{startRange}</span> to{" "}
        <span className="font-semibold text-gray-900">{endRange}</span> of{" "}
        <span className="font-semibold text-gray-900">{totalItems}</span> results
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-gray-100 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all group"
          aria-label="Previous page"
        >
          <ChevronLeft size={18} className="group-active:scale-90 transition-transform" />
        </button>
        
        <div className="flex items-center px-4 font-medium text-gray-900">
          Page {currentPage} of {totalPages}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-100 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-all group"
          aria-label="Next page"
        >
          <ChevronRight size={18} className="group-active:scale-90 transition-transform" />
        </button>
      </div>
    </div>
  );
}
