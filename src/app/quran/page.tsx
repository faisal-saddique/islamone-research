import { type Metadata } from "next";
import { QuranBrowser } from "~/app/_components/content/quran-browser";
import { api, HydrateClient } from "~/trpc/server";

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
      <QuranBrowser />
    </HydrateClient>
  );
}