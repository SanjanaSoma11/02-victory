"use client";

import dynamic from "next/dynamic";

const StatsCards = dynamic(
  () => import("./stats-cards").then((m) => m.StatsCards),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 animate-pulse rounded-xl bg-muted/40" aria-hidden />
    ),
  }
);

export function StatsCardsLoader() {
  return <StatsCards />;
}
