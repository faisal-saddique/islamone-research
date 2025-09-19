"use client";

import { api } from "~/trpc/react";
import { useFont } from "~/contexts/font-context";

interface SurahReaderProps {
  surahNumber: number;
}

export function SurahReader({ surahNumber }: SurahReaderProps) {
  const [ayahs] = api.quran.getAyahs.useSuspenseQuery({ surahNumber });
  const { getAyahText, showUrduTranslation, currentEnglishTranslation, currentUrduTranslation } = useFont();

  const getSelectedEnglishTranslation = (ayah: any) => {
    if (!ayah.AllTranslations?.english) return ayah.Translation;

    switch (currentEnglishTranslation) {
      case "saheeh":
        return ayah.AllTranslations.english.saheeh || ayah.Translation;
      case "yousufAli":
        return ayah.AllTranslations.english.yousufAli || ayah.Translation;
      case "pickthall":
        return ayah.AllTranslations.english.pickthall || ayah.Translation;
      case "maududi":
        return ayah.AllTranslations.english.maududi || ayah.Translation;
      default:
        return ayah.Translation;
    }
  };

  const getSelectedUrduTranslation = (ayah: any) => {
    if (!ayah.AllTranslations?.urdu) return ayah.UrduTranslation;

    switch (currentUrduTranslation) {
      case "maududi":
        return ayah.AllTranslations.urdu.maududi || ayah.UrduTranslation;
      case "jalandhary":
        return ayah.AllTranslations.urdu.jalandhary || ayah.UrduTranslation;
      case "junagarhi":
        return ayah.AllTranslations.urdu.junagarhi || ayah.UrduTranslation;
      case "taqi":
        return ayah.AllTranslations.urdu.taqi || ayah.UrduTranslation;
      case "ahmadRaza":
        return ayah.AllTranslations.urdu.ahmadRaza || ayah.UrduTranslation;
      case "tahirulQadri":
        return ayah.AllTranslations.urdu.tahirulQadri || ayah.UrduTranslation;
      default:
        return ayah.UrduTranslation;
    }
  };

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

              {showUrduTranslation && getSelectedUrduTranslation(ayah) && (
                <div className="text-neutral-700 leading-relaxed">
                  <div className="text-sm font-medium text-neutral-500 mb-2">Urdu:</div>
                  <div className="urdu-text text-lg">
                    {getSelectedUrduTranslation(ayah)}
                  </div>
                </div>
              )}

              {getSelectedEnglishTranslation(ayah) && (
                <div className="text-neutral-700 leading-relaxed">
                  <div className="text-sm font-medium text-neutral-500 mb-2">English:</div>
                  <div>{getSelectedEnglishTranslation(ayah)}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}