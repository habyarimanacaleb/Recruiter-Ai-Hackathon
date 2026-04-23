"use client";

import { Suspense, useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Bell,
  Search,
  Plus,
  CheckCircle2,
  X,
  Menu, 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/sidebar-context";
import { UserProfile } from "./UserProfile";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";


const topbarVariants: Variants = {
  hidden: { y: -10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const rightItemsVariants: Variants = {
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
};

const rightItemVariants: Variants = {
  hidden: { opacity: 0, x: 10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export function Topbar() {
  const { toggle,isOpen } = useSidebar();

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

   const { user ,isPending} = useAuth();

   const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

// Don't render interactive parts until the client is ready
if (!mounted) {
  return <div className="h-17 w-full border-b bg-white" />; // Plain placeholder
}

  const title =  "Dashboard";

  if (isPending) {
    return (
     <motion.header
  variants={topbarVariants}
  initial="hidden"
  animate="visible"
  className={cn(
    "flex items-center gap-2 md:gap-4 px-4 lg:px-7 h-17 min-h-17 sticky top-0 z-50 w-full",
    "bg-white/90 backdrop-blur-md border-b border-blue-200",
    "shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
  )}
>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse" />
          <div className="w-24 h-4 bg-gray-300 rounded animate-pulse" />
        </div>
      </motion.header>
    );
  }

  return (
    <motion.header
      variants={topbarVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        // Updated padding: px-4 on mobile, lg:px-7 on desktop
        // removed pl-20 because we're putting the menu button inside the flex flow
        "flex items-center gap-2 md:gap-4 px-4 lg:px-7 h-17 min-h-17 sticky top-0 z-50",
        "bg-white/90 backdrop-blur-md border-b border-blue-200",
        "shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
      )}
    >
      {/* ── Mobile Sidebar Toggle ── */}
      {!isMobileSearchOpen && (
        <button
          onClick={toggle}
          className="lg:hidden p-2 -ml-1 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors shrink-0"
        >
          <Menu size={22} strokeWidth={2} />
        </button>
      )}

      {/* ── Page Title ── */}
      {!isMobileSearchOpen && (
        <div className="flex flex-col min-w-0 shrink-0">
          <motion.h1
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[17px] lg:text-[20px] font-bold tracking-tight text-gray-900 leading-tight truncate"
          >
            {title}
          </motion.h1>
          {user?.name && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden md:block text-[11.5px] text-gray-400 font-medium mt-0.5 truncate"
            >
              {`Welcome back, ${user.name.slice(0, 8)}`}
            </motion.p>
          )}
        </div>
      )}

      {/* ── Search Bar (Adaptive) ── */}
      <div className={cn(
        "flex-1 items-center justify-center",
        isMobileSearchOpen ? "flex fixed inset-0 bg-white px-4 z-60 h-17" : "hidden md:flex"
      )}>
        <motion.div
          animate={{
            boxShadow: searchFocused
              ? "0 0 0 3px rgba(99,102,241,0.12), 0 1px 4px rgba(0,0,0,0.06)"
              : "0 1px 4px rgba(0,0,0,0.04)",
          }}
          className={cn(
            "w-full max-w-110 flex items-center gap-2.5 h-10 px-3.5 rounded-xl border transition-all",
            searchFocused ? "bg-white border-indigo-200" : "bg-[#f7f8fa] border-transparent"
          )}
        >
          <Search size={14} className={searchFocused ? "text-indigo-500" : "text-gray-400"} />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search candidates..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="flex-1 bg-transparent text-[13.5px] outline-none font-medium text-gray-700"
          />
          {isMobileSearchOpen ? (
            <button onClick={() => setIsMobileSearchOpen(false)}>
              <X size={16} className="text-gray-400 hover:text-gray-600" />
            </button>
          ) : (
            <kbd className="hidden lg:inline-flex text-[10.5px] font-semibold text-gray-300 bg-gray-100 rounded px-1.5 py-0.5">⌘K</kbd>
          )}
        </motion.div>
      </div>

      {/* ── Right Actions ── */}
      {!isOpen && (
        <motion.div
          variants={rightItemsVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-1.5 md:gap-2 shrink-0 ml-auto"
        >
          {/* Mobile Search Toggle */}
          <button 
            onClick={() => setIsMobileSearchOpen(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <Search size={18} />
          </button>

          {/* New Screening */}
          <motion.div variants={rightItemVariants}>
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-xl bg-indigo-600 text-white text-[13px] font-semibold shadow-md shadow-indigo-200"
            >
              <Plus size={14} strokeWidth={2.6} />
              <span className="hidden sm:inline">New Screening</span>
            </motion.button>
          </motion.div>

          {/* AI Badge (Desktop Only) */}
          <motion.div variants={rightItemVariants} className="hidden xl:block">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600">
              <CheckCircle2 size={12} strokeWidth={2.5} />
              <span className="text-[11.5px] font-bold">AI Active</span>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div variants={rightItemVariants} className="hidden sm:block">
            <button className="relative w-9 h-9 rounded-xl border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
              <Bell size={17} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </motion.div>

          {/* User Profile */}
          <Suspense fallback={<div className="w-32 h-9 bg-gray-300 rounded-xl animate-pulse" />}> 
          <UserProfile 
            name={user?.name || "Guest"}
            email={user?.email || " No email"}
            role={user?.role || "User"}
          />
          </Suspense>
        </motion.div>
      )}
    </motion.header>
  );
}
