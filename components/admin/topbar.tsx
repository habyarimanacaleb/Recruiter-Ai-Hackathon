"use client";

import { Suspense, useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Menu,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/sidebar-context";
import { UserProfile } from "./UserProfile";
import { useAuth } from "@/context/AuthContext";
import { useTalentStore } from "@/store/useTalentStore";

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

// ── Live clock ──────────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setDate(now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hidden md:flex flex-col items-end leading-tight">
      <span className="text-[13px] font-semibold text-gray-700 tabular-nums">{time}</span>
      <span className="text-[10.5px] text-gray-400 font-medium">{date}</span>
    </div>
  );
}

// ── Pulse stat pill ─────────────────────────────────────────────────────────
function StatPill({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className={cn(
        "hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[12px] font-semibold transition-all cursor-default select-none",
        color
      )}
    >
      <Icon size={12} strokeWidth={2.5} />
      <span className="hidden xl:inline text-[11px] font-medium opacity-70">{label}</span>
      <span>{value}</span>
    </div>
  );
}

// ── AI Score indicator ────────────────────────────────────────────────────────
function AiScoreWidget() {
  const { isScoring } = useTalentStore();

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className={cn(
        "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[12px] font-semibold select-none transition-all duration-300",
        isScoring
          ? "bg-violet-50 border-violet-200 text-violet-600"
          : "bg-indigo-50 border-indigo-100 text-indigo-600"
      )}
    >
      <motion.div
        animate={isScoring ? { rotate: 360 } : { rotate: 0 }}
        transition={isScoring ? { repeat: Infinity, duration: 1.4, ease: "linear" } : {}}
      >
        <Sparkles size={12} strokeWidth={2.5} />
      </motion.div>
      <span>{isScoring ? "Scoring…" : "AI Ready"}</span>
    </motion.div>
  );
}

// ── Activity dot ─────────────────────────────────────────────────────────────
function ActivityIndicator() {
  return (
    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span className="text-[11.5px] font-bold text-emerald-600">Live</span>
    </div>
  );
}

// ── Main Topbar ───────────────────────────────────────────────────────────────
export function Topbar() {
  const { toggle, isOpen } = useSidebar();

  const { user, isPending } = useAuth();
  // ── Real data from store ──────────────────────────────────────────────
  const { talents, fetchTalents, isLoading } = useTalentStore();

  const totalCandidates = talents.length;

  // Candidates added in the last 7 days
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeekCount = talents.filter((t) => {
    const created = t.createdAt ? new Date(t.createdAt).getTime() : 0;
    return created >= oneWeekAgo;
  }).length;

  // % of candidates that have been screened (status !== "Pending")
  const screenedCount = talents.filter((t) => t.status !== "Pending").length;
  const screenedPct = totalCandidates > 0
    ? Math.round((screenedCount / totalCandidates) * 100)
    : 0;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    fetchTalents();
  }, [fetchTalents]);

  if (!mounted) return <div className="h-17 w-full border-b bg-white" />;

  const title = "Dashboard";

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
          <div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse" />
          <div className="w-24 h-4 bg-gray-100 rounded animate-pulse" />
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
        "flex items-center gap-2 md:gap-4 px-4 lg:px-7 h-17 min-h-17 sticky top-0 z-50 w-full",
        "bg-white/90 backdrop-blur-md border-b border-slate-100",
        "shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
      )}
    >
      {/* ── Mobile Sidebar Toggle ── */}
      <button
        onClick={toggle}
        className="lg:hidden p-2 -ml-1 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors shrink-0"
      >
        <Menu size={22} strokeWidth={2} />
      </button>

      {/* ── Page Title + Greeting ── */}
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

      {/* ── Spacer ── */}
      <div className="flex-1" />

      {/* ── Right Actions ── */}
      {!isOpen && (
        <motion.div
          variants={rightItemsVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-2 shrink-0"
        >
          {/* Live indicator */}
          <motion.div variants={rightItemVariants}>
            <ActivityIndicator />
          </motion.div>

          {/* Quick stats pills */}
          <motion.div variants={rightItemVariants}>
            <StatPill
              icon={Users}
              label="Candidates"
              value={isLoading ? "…" : String(totalCandidates)}
              color="text-blue-600 bg-blue-50 border-blue-100"
            />
          </motion.div>

          <motion.div variants={rightItemVariants}>
            <StatPill
              icon={TrendingUp}
              label="This week"
              value={isLoading ? "…" : `+${thisWeekCount}`}
              color="text-violet-600 bg-violet-50 border-violet-100"
            />
          </motion.div>

          <motion.div variants={rightItemVariants}>
            <StatPill
              icon={Zap}
              label="Screened"
              value={isLoading ? "…" : `${screenedPct}%`}
              color="text-amber-600 bg-amber-50 border-amber-100"
            />
          </motion.div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-gray-100 mx-1" />

          {/* Live clock */}
          <motion.div variants={rightItemVariants}>
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-100 bg-gray-50">
              <Clock size={12} className="text-gray-400" />
              <LiveClock />
            </div>
          </motion.div>

          {/* AI scoring status */}
          <motion.div variants={rightItemVariants}>
            <AiScoreWidget />
          </motion.div>

          {/* User Profile */}
          <motion.div variants={rightItemVariants}>
            <Suspense fallback={<div className="w-32 h-9 bg-gray-100 rounded-xl animate-pulse" />}>
              <UserProfile
                name={user?.name || "Guest"}
                email={user?.email || "No email"}
                role={user?.role || "User"}
              />
            </Suspense>
          </motion.div>
        </motion.div>
      )}
    </motion.header>
  );
}