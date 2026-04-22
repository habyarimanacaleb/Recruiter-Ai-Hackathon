"use client";

import { Download } from "lucide-react";

interface ExportProps {
  onExport: () => void;
}

export function ExportButton({ onExport }: ExportProps) {
  return (
    <button 
      onClick={onExport}
      className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]"
    >
      <Download size={16} /> 
      <span>Export</span>
    </button>
  );
}
