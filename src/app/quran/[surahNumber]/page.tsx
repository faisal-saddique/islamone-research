import { type Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SurahReader } from "~/app/_components/surah-reader";
import { api, HydrateClient } from "~/trpc/server";

interface Props {
  params: Promise<{ surahNumber: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { surahNumber } = await params;
  const num = parseInt(surahNumber);
  
  if (isNaN(num) || num < 1 || num > 114) {
    return { title: "Surah Not Found" };
  }

  const surah = await api.quran.getSurahByNumber({ surahNumber: num });
  
  if (!surah) {
    return { title: "Surah Not Found" };
  }

  return {
    title: `${surah.NameEnglish} - IslamOne Research`,
    description: `Read Surah ${surah.NameEnglish} (${surah.NameMeaning}) from the Holy Quran`,
  };
}

export default async function SurahPage({ params }: Props) {
  const { surahNumber } = await params;
  const num = parseInt(surahNumber);
  
  if (isNaN(num) || num < 1 || num > 114) {
    notFound();
  }

  const surah = await api.quran.getSurahByNumber({ surahNumber: num });
  
  if (!surah) {
    notFound();
  }

  void api.quran.getAyahs.prefetch({ surahNumber: num });

  return (
    <HydrateClient>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/quran" 
            className="text-primary hover:text-primary-light transition-colors text-sm"
          >
            ← Back to Quran
          </Link>
        </div>

        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 mb-8">
          <div className="text-center">
            <div className="arabic-text text-2xl text-neutral-800 font-semibold mb-2">
              {surah.NameArabic}
            </div>
            <div className="text-xl font-semibold text-neutral-800 mb-1">
              {surah.NameEnglish}
            </div>
            <div className="text-neutral-500 mb-4">
              {surah.NameMeaning}
            </div>
            <div className="flex justify-center gap-6 text-sm text-neutral-500">
              <span>Surah {surah.SurahNumber}</span>
              <span>{surah.AyahCount} verses</span>
              <span className="capitalize">{surah.Type}</span>
            </div>
          </div>
        </div>

        <SurahReader surahNumber={num} />
      </div>
    </HydrateClient>
  );
}