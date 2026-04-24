import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar"; // Import your Topbar
import "@/app/globals.css";
import { SidebarProvider } from "@/context/sidebar-context";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RecruitAI — Smart Hiring",
  description: "AI-powered resume screening and candidate management",
};

// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8f9fa]">
      <Suspense
        fallback={<div className="w-64 h-full bg-white animate-pulse" />}
      >
        <Sidebar />
      </Suspense>
      <main className="flex flex-col flex-1 min-w-0 h-full">
        <Suspense fallback={<div className="h-17 w-full border-b bg-white" />}>
          <Topbar />
        </Suspense>
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-4 lg:p-8 max-w-400 mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
