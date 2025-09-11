import { type Metadata } from "next";
import { LatestSurah } from "~/app/_components/surah";
import { api, HydrateClient } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Quran - IslamOne Research",
  description: "Browse and study the Holy Quran",
};

export default async function Quran() {
  void api.quran.getSurahs.prefetch({ limit: 10 });

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

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <h2 className="text-lg font-medium text-neutral-800">Surahs</h2>
            <div className="flex gap-2">
              <input
                type="search"
                placeholder="Search surahs..."
                className="px-3 py-2 bg-neutral-50 border border-neutral-300 rounded text-neutral-800 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <select className="px-3 py-2 bg-neutral-50 border border-neutral-300 rounded text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                <option value="all">All Surahs</option>
                <option value="meccan">Meccan</option>
                <option value="medinan">Medinan</option>
              </select>
            </div>
          </div>

          <LatestSurah />
        </div>
      </div>
    </HydrateClient>
  );
}