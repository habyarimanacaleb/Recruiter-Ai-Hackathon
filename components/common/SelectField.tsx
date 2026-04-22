"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label: string;
  icon?: React.ElementType;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SelectField({
  label,
  icon: Icon,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
}: SelectFieldProps) {
  return (
    <section className={cn("space-y-2 ", className)}>
      
      {/* Label */}
      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">
        {label}
      </label>

      {/* Select Wrapper */}
      <section className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(
            "w-full h-12 px-4 pr-10 bg-gray-50/50 border border-blue-200 rounded-xl outline-none",
            "focus:border-indigo-300 transition-all appearance-none cursor-pointer",
            "text-gray-700 font-medium"
          )}
        >
          {/* Placeholder */}
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}

          {/* Options */}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Chevron Icon */}
        <ChevronDown
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </section>
    </section>
  );
}