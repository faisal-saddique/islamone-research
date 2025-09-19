"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Settings, Bookmark, Share } from "lucide-react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { useFont } from "~/contexts/font-context";

interface SurahReaderProps {
  surahNumber: number;
}

export function SurahReader({ surahNumber }: SurahReaderProps) {
  const [ayahs] = api.quran.getAyahs.useSuspenseQuery({ surahNumber });
  const [surah] = api.quran.getSurahByNumber.useSuspenseQuery({ surahNumber });
  const { getAyahText, showUrduTranslation, currentEnglishTranslation, currentUrduTranslation } = useFont();
  const [selectedAyah, setSelectedAyah] = useState<number | null>(null);

  const getSelectedEnglishTranslation = (ayah: { AllTranslations?: { english?: Record<string, string | null | undefined> }; Translation?: string | null }) => {
    if (!ayah.AllTranslations?.english) return ayah.Translation;

    switch (currentEnglishTranslation) {
      case "saheeh":
        return ayah.AllTranslations?.english?.saheeh ?? ayah.Translation;
      case "yousufAli":
        return ayah.AllTranslations?.english?.yousufAli ?? ayah.Translation;
      case "pickthall":
        return ayah.AllTranslations?.english?.pickthall ?? ayah.Translation;
      case "maududi":
        return ayah.AllTranslations?.english?.maududi ?? ayah.Translation;
      default:
        return ayah.Translation;
    }
  };

  const getSelectedUrduTranslation = (ayah: { AllTranslations?: { urdu?: Record<string, string | null | undefined> }; UrduTranslation?: string | null }) => {
    if (!ayah.AllTranslations?.urdu) return ayah.UrduTranslation;

    switch (currentUrduTranslation) {
      case "maududi":
        return ayah.AllTranslations?.urdu?.maududi ?? ayah.UrduTranslation;
      case "jalandhary":
        return ayah.AllTranslations?.urdu?.jalandhary ?? ayah.UrduTranslation;
      case "junagarhi":
        return ayah.AllTranslations?.urdu?.junagarhi ?? ayah.UrduTranslation;
      case "taqi":
        return ayah.AllTranslations?.urdu?.taqi ?? ayah.UrduTranslation;
      case "ahmadRaza":
        return ayah.AllTranslations?.urdu?.ahmadRaza ?? ayah.UrduTranslation;
      case "tahirulQadri":
        return ayah.AllTranslations?.urdu?.tahirulQadri ?? ayah.UrduTranslation;
      default:
        return ayah.UrduTranslation;
    }
  };

  if (!surah) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/quran" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Quran</span>
            </Link>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-white/50 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/50 transition-colors">
                <Share className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">{surah.SurahNumber}</span>
              </div>
              <h1 className="text-3xl font-semibold text-gray-800">{surah.NameEnglish}</h1>
            </div>
            <div className="arabic-text text-4xl text-primary font-medium mb-4 text-center">
              {surah.NameArabic}
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <span className="font-medium">{surah.NameMeaning}</span>
              <span>•</span>
              <span>{surah.AyahCount} verses</span>
              <span>•</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                surah.Type === "Meccan"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}>
                {surah.Type}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href={surahNumber > 1 ? `/quran/${surahNumber - 1}` : "/quran"}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{surahNumber > 1 ? "Previous Surah" : "Back to List"}</span>
          </Link>
          <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
            Surah {surahNumber} of 114
          </div>
          <Link
            href={surahNumber < 114 ? `/quran/${surahNumber + 1}` : "/quran"}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-colors"
          >
            <span>{surahNumber < 114 ? "Next Surah" : "Back to List"}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Ayahs */}
        <div className="max-w-4xl mx-auto space-y-6">
          {ayahs.map((ayah) => (
            <div
              key={ayah.Id}
              className={`group bg-white rounded-xl border-2 transition-all duration-200 ${
                selectedAyah === ayah.AyahNumber
                  ? "border-primary shadow-lg"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedAyah(selectedAyah === ayah.AyahNumber ? null : ayah.AyahNumber)}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-6">
                    {/* Verse Number */}
                    <div className="text-center">
                      <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white font-semibold text-xs">{ayah.AyahNumber}</span>
                      </div>
                    </div>

                    {/* Arabic Text */}
                    <div className="arabic-text text-2xl md:text-3xl text-gray-800 leading-loose text-right">
                      {getAyahText(ayah)}
                    </div>

                    {/* Translations */}
                    <div className="space-y-4">
                      {showUrduTranslation && getSelectedUrduTranslation(ayah) && (
                        <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
                          <div className="text-sm font-medium text-gray-500 mb-2 text-right urdu-text">اردو ترجمہ</div>
                          <div className="urdu-text text-lg text-gray-700 leading-relaxed">
                            {getSelectedUrduTranslation(ayah)}
                          </div>
                        </div>
                      )}

                      {getSelectedEnglishTranslation(ayah) && (
                        <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-emerald-400">
                          <div className="text-sm font-medium text-gray-500 mb-2">English Translation</div>
                          <div className="text-lg text-gray-700 leading-relaxed">
                            {getSelectedEnglishTranslation(ayah)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100">
                      <Bookmark className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}