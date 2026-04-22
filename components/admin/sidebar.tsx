"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Star,
  Mail,
  CalendarDays,
  BarChart3,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Zap,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/sidebar-context";
import { useAuth } from "@/context/AuthContext";


const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, badge: null },
  { label: "All Candidates", href: "/candidates", icon: Users, badge: "24" },
  { label: "Shortlisted", href: "/shortlisted", icon: Star, badge: "4" },
  { label: "Emailed", href: "/emailed", icon: Mail, badge: "3" },
  { label: "Interviews", href: "/interviews", icon: CalendarDays, badge: null },
  { label: "Reports", href: "/reports", icon: BarChart3, badge: null },
];

const PROFILE_ACTIONS = [
  { label: "Settings", icon: Settings, href: "/settings" },
  { label: "Log Out", icon: LogOut, action: "logout" },
];

const sidebarVariants: Variants = {
  expanded: { width: "260px" },
  collapsed: { width: "80px" },
};

const contentVariants: Variants = {
  expanded: { opacity: 1, display: "flex", transition: { delay: 0.1 } },
  collapsed: { opacity: 0, transitionEnd: { display: "none" } },
};

export function Sidebar() {
  const { isOpen, close } = useSidebar();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { actions } = useAuth();

  const handleClick = (action: string) => {
  if (action === "logout") {
    actions.logout();
  }
};

  return (
    <>
      <motion.aside
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        className={cn(
          "fixed lg:sticky top-0 z-40 left-0 h-screen bg-white border-r border-blue-200 flex flex-col py-6 transition-transform duration-300",
          isOpen ? "translate-x-0 shadow-2xl pt-18" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-80 w-6 h-6 bg-white border text-blue-600 border-blue-200 rounded-full items-center justify-center hover:text-indigo-600 shadow-sm z-50 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        {/* Brand */}
        <div className="flex items-center gap-3 px-5 mb-2 overflow-hidden whitespace-nowrap">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-indigo-500 flex items-center justify-center shadow-[0_4px_12px_rgba(99,102,241,0.35)] shrink-0">
            <Sparkles size={19} className="text-white" strokeWidth={2.2} />
          </div>
          <motion.div 
            animate={isCollapsed ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }} 
            className="flex flex-col"
          >
            <span className="text-[17px] font-bold tracking-tight text-gray-900 leading-none">RecruitAI</span>
            <span className="text-[10.5px] font-semibold uppercase tracking-widest text-gray-400 mt-0.5">Smart Hiring</span>
          </motion.div>
        </div>

        <div className="h-px bg-gray-100 my-4 mx-4" />

        {/* Nav Items */}
        <nav className="flex-1 px-3 overflow-y-auto overflow-x-hidden">
          {!isCollapsed && (
            <p className="text-[10px] font-bold uppercase tracking-[0.9px] text-gray-400 px-3 mb-2.5">Main Menu</p>
          )}
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ label, href, icon: Icon, badge }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={href}>
                  <Link href={href} className="block" onClick={() => close()}>
                    <div
                      className={cn(
                        "relative flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                        isActive
                          ? "bg-indigo-50 text-indigo-600 shadow-xs"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                      )}
                    >
                      <div className={cn("flex items-center justify-center w-6 shrink-0", isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600")}>
                        <Icon size={19} strokeWidth={isActive ? 2.3 : 1.8} />
                      </div>

                      <motion.div
                        variants={contentVariants}
                        className="flex flex-1 items-center justify-between ml-3 overflow-hidden"
                      >
                        <span className="whitespace-nowrap">{label}</span>
                        {badge && (
                          <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full", isActive ? "bg-indigo-200/50 text-indigo-700" : "bg-gray-100 text-gray-400")}>
                            {badge}
                          </span>
                        )}
                      </motion.div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Upgrade Card */}
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mx-4 relative overflow-hidden bg-linear-to-br from-indigo-600 to-violet-600 rounded-2xl p-4 text-white mb-4 shadow-[0_8px_24px_rgba(99,102,241,0.28)]"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap size={12} className="text-white" strokeWidth={2.5} />
                <span className="text-[13px] font-bold">Upgrade Plan</span>
              </div>
              <p className="text-[11px] text-white/70 leading-tight mb-3">AI screening for unlimited roles</p>
              <button className="w-full bg-white text-indigo-600 text-[11px] font-bold py-1.5 rounded-lg hover:bg-opacity-90 transition-opacity">
                Go Pro
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-px bg-gray-100 my-4 mx-4" />

        {/* User Profile Actions */}
        <section className="px-3 mt-auto">
  {!isCollapsed && (
    <p className="text-[10px] font-bold uppercase tracking-[0.9px] text-gray-400 px-3 mb-2.5">
      Account Settings
    </p>
  )}

  <ul className="flex flex-col gap-1">
    {PROFILE_ACTIONS.map(({ label, icon: Icon, href, action }) => {
      const isActive = href && pathname.startsWith(href);

      const content = (
        <div
          className={cn(
            "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer",
            isActive
              ? "bg-indigo-50 text-indigo-600"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
          )}
        >
          {/* Icon */}
          <div
            className={cn(
              "flex items-center justify-center w-6 shrink-0",
              isActive
                ? "text-indigo-600"
                : "text-gray-400 group-hover:text-gray-600"
            )}
          >
            <Icon size={19} strokeWidth={isActive ? 2.3 : 1.8} />
          </div>

          {/* Label */}
          <motion.div
            variants={contentVariants}
            className="ml-3 whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.div>
        </div>
      );

      return (
        <li key={label}>
          {href ? (
            <Link href={href} onClick={close}>
              {content}
            </Link>
          ) : (
            <button
              onClick={handleClick.bind(null, action!)}
              className="w-full text-left"
            >
              {content}
            </button>
          )}
        </li>
      );
    })}
  </ul>
</section>
      </motion.aside>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={close} 
          className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-30 lg:hidden" 
        />
      )}
    </>
  );
}
