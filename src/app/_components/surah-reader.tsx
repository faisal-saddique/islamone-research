"use client";

import { api } from "~/trpc/react";
import { useFont } from "~/contexts/font-context";

interface SurahReaderProps {
  surahNumber: number;
}

export function SurahReader({ surahNumber }: SurahReaderProps) {
  const [ayahs] = api.quran.getAyahs.useSuspenseQuery({ surahNumber });
  const { getAyahText } = useFont();

  return (
    <div className="space-y-6">
      {ayahs.map((ayah) => (
        <div
          key={ayah.Id}
          className="bg-neutral-50 rounded-lg p-6 border border-neutral-300"
        >
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-primary text-neutral-50 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
              {ayah.AyahNumber}
            </div>
            <div className="flex-1 space-y-4">
              <div className="arabic-text text-xl text-neutral-800">
                {getAyahText(ayah)}
              </div>
              {ayah.Translation && (
                <div className="text-neutral-700 leading-relaxed">
                  {ayah.Translation}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}