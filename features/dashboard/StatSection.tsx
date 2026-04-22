"use client";

import { Suspense } from "react";
import { StatCard } from "./StatCard"
import { StatCardsLoading } from "@/components/skeleton-loading/StatSkeleton"
import { useStatsStore } from "@/store/useStatsStore";

function StatSection() {
     const stats = useStatsStore();
  return (
<section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((stat, idx) => (
        <Suspense key={idx} fallback={<StatCardsLoading />}>
          <StatCard {...stat} />
        </Suspense>
      ))}
    </section>  )
}

export default StatSection