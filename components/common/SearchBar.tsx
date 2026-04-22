"use client";
import React, { useState, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Search..." }: SearchBarProps) {
  const [value, setValue] = useState("");

  // Debounce logic: wait 300ms after last keystroke before triggering search
  useEffect(() => {
    const handler = setTimeout(() => onSearch(value), 300);
    return () => clearTimeout(handler);
  }, [value, onSearch]);

  return (
    <div className="relative w-full md:max-w-md">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
      />
    </div>
  );
}
