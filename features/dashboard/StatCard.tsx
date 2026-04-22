"use client";

import { 
  Upload, 
  Sparkles, 
  Star, 
  Mail 
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { StatColor } from "@/types";

const IconLib = {
  upload: Upload,
  sparkles: Sparkles,
  star: Star,
  mail: Mail,
};

interface StatCardProps {
  label: string;
  value: string | number;
  iconName: keyof typeof IconLib;
  color: StatColor;
  progress?: number;
}

const colorMap = {
  blue: {
    bg: "from-blue-600 to-blue-500",
    shadow: "shadow-blue-200",
    text: "text-blue-600"
  },
  violet: {
    bg: "from-violet-600 to-violet-500",
    shadow: "shadow-violet-200",
    text: "text-violet-600"
  },
  indigo: {
    bg: "from-indigo-600 to-indigo-500",
    shadow: "shadow-indigo-200",
    text: "text-indigo-600"
  },
  emerald: {
    bg: "from-emerald-600 to-emerald-500",
    shadow: "shadow-emerald-200",
    text: "text-emerald-600"
  },
};

export function StatCard({ label, value, iconName, color, progress }: StatCardProps) {
  const Icon = IconLib[iconName];
  const theme = colorMap[color];

  // Circle math (no hardcoding)
  const radius = 20;
  const circumference = 2 * Math.PI * radius;

  return (
    <motion.article 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="relative  flex flex-col gap-4 p-6 rounded-2xl bg-white border border-blue-200 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
    >
      <div className="flex justify-between items-start">
        
        {/* Icon */}
        <header
          className={cn(
            "w-11 h-11 rounded-xl bg-linear-to-br flex items-center justify-center shadow-lg shadow-opacity-40",
            theme.bg,
            theme.shadow
          )}
        >
          <Icon className="text-white" size={20} strokeWidth={2.5} />
        </header>

        {/* Progress Circle */}
        {progress !== undefined && (
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              
              {/* Background circle */}
              <circle
                cx="24"
                cy="24"
                r={radius}
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                className="text-gray-100"
              />

              {/* Animated progress */}
              <motion.circle
                cx="24"
                cy="24"
                r={radius}
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{
                  strokeDashoffset:
                    circumference - (circumference * progress) / 100
                }}
                transition={{
                  duration: 1,
                  ease: "easeInOut"
                }}
                className={theme.text}
              />
            </svg>

            {/* Label */}
            <span className="absolute text-[10px] font-bold text-gray-600">
              {progress}%
            </span>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="space-y-1">
        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
          {value}
        </h2>
        <p className="text-[13px] font-medium text-gray-400">
          {label}
        </p>
      </div>
    </motion.article>
  );
}