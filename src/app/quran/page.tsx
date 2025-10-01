import { type Metadata } from "next";
import { Suspense } from "react";
import { QuranBrowser } from "~/app/_components/content/quran-browser";
import { api, HydrateClient } from "~/trpc/server";
import { QuranBrowserSkeleton } from "~/components/skeletons/quran-browser-skeleton";

export const metadata: Metadata = {
  title: "Quran - IslamOne Research",
  description: "Browse and study the Holy Quran with translations and commentary",
};

export const dynamic = 'force-dynamic';

export default async function Quran() {
  try {
    void api.quran.getSurahs.prefetch({ limit: 114 });
  } catch (error) {
    console.warn("Failed to prefetch Quran data:", error);
  }

  return (
    <HydrateClient>
      <Suspense fallback={<QuranBrowserSkeleton />}>
        <QuranBrowser />
      </Suspense>
    </HydrateClient>
  );
}