import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { SurahReader } from "~/app/_components/content/surah-reader";
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
      <SurahReader surahNumber={num} />
    </HydrateClient>
  );
}