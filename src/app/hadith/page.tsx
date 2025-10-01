import { type Metadata } from "next";
import { Suspense } from "react";
import { HadithBrowser } from "~/app/_components/content/hadith-browser";
import { api, HydrateClient } from "~/trpc/server";
import { HadithBrowserSkeleton } from "~/components/skeletons/hadith-browser-skeleton";

export const metadata: Metadata = {
  title: "Hadith - IslamOne Research",
  description: "Explore authentic Hadith from the six major collections (Kutub al-Sittah)",
};

export const dynamic = 'force-dynamic';

export default async function Hadith() {
  try {
    void api.hadith.getCollections.prefetch();
  } catch (error) {
    console.warn("Failed to prefetch hadith collections:", error);
  }

  return (
    <HydrateClient>
      <Suspense fallback={<HadithBrowserSkeleton />}>
        <HadithBrowser />
      </Suspense>
    </HydrateClient>
  );
}