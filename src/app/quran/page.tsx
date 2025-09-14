import { type Metadata } from "next";
import { SurahList } from "~/app/_components/surah-list";
import { api, HydrateClient } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Quran - IslamOne Research",
  description: "Browse and study the Holy Quran",
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
      <div className="container mx-auto px-4 py-8">
        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 mb-8">
          <h1 className="text-2xl font-semibold text-neutral-800 mb-4">
            Holy Quran
          </h1>
          <p className="text-neutral-500">
            Read and study the Holy Quran with translations and commentary.
          </p>
        </div>

        <SurahList />
      </div>
    </HydrateClient>
  );
}