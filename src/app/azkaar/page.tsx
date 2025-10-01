import { type Metadata } from "next";
import { Suspense } from "react";
import { AzkaarBrowser } from "~/app/_components/content/azkaar-browser";
import { api, HydrateClient } from "~/trpc/server";
import { AzkaarBrowserSkeleton } from "~/components/skeletons/azkaar-browser-skeleton";

export const metadata: Metadata = {
  title: "Azkaar & Duas - IslamOne Research",
  description: "Authentic Islamic supplications and remembrances from the Quran and Sunnah",
};

export const dynamic = 'force-dynamic';

export default async function Azkaar() {
  try {
    void api.azkaar.getBooks.prefetch();
  } catch (error) {
    console.warn("Failed to prefetch azkaar data:", error);
  }

  return (
    <HydrateClient>
      <Suspense fallback={<AzkaarBrowserSkeleton />}>
        <AzkaarBrowser />
      </Suspense>
    </HydrateClient>
  );
}
