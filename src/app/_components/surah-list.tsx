"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

export function SurahList() {
  const [surahs] = api.quran.getSurahs.useSuspenseQuery({ limit: 114 });

  return (
    <div className="grid gap-3">
      {surahs.map((surah) => (
        <Link
          key={surah.Id}
          href={`/quran/${surah.SurahNumber}`}
          className="bg-neutral-50 rounded-lg p-4 border border-neutral-300 hover:bg-primary-subtle transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary text-neutral-50 rounded-full flex items-center justify-center font-semibold">
                {surah.SurahNumber}
              </div>
              <div>
                <div className="font-semibold text-neutral-800">
                  {surah.NameEnglish}
                </div>
                <div className="text-sm text-neutral-500">
                  {surah.NameMeaning}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="arabic-text text-lg text-neutral-800 font-medium">
                {surah.NameArabic}
              </div>
              <div className="text-xs text-neutral-500">
                {surah.AyahCount} verses • {surah.Type}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}