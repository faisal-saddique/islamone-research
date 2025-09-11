"use client";

import { api } from "~/trpc/react";

export function LatestSurah() {
  const [surahs] = api.quran.getSurahs.useSuspenseQuery({ limit: 3 });

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-xl font-semibold mb-6 text-center text-neutral-800 bg-neutral-50 px-4 py-2 rounded-lg">Holy Quran - Surahs</h2>
      {surahs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {surahs.map((surah) => (
            <div
              key={surah.Id}
              className="bg-neutral-50 rounded-lg p-4 hover:bg-primary-subtle transition-colors border border-neutral-300"
            >
              <div className="text-center space-y-2">
                <div className="text-xl font-semibold text-primary">
                  {surah.SurahNumber}
                </div>
                <div className="text-lg font-medium text-neutral-800">
                  {surah.NameArabic}
                </div>
                <div className="text-base font-medium text-neutral-800">
                  {surah.NameEnglish}
                </div>
                <div className="text-sm text-neutral-500 italic">
                  {surah.NameMeaning}
                </div>
                <div className="flex justify-between items-center text-sm text-neutral-500 pt-2 border-t border-neutral-300">
                  <span>{surah.AyahCount} Ayahs</span>
                  <span className="capitalize">{surah.Type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-neutral-500 bg-neutral-50 px-4 py-2 rounded-lg">No Surahs found.</p>
      )}
    </div>
  );
}
