import { type Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HadithReader } from "~/app/_components/hadith-reader";
import { api, HydrateClient } from "~/trpc/server";

interface Props {
  params: Promise<{ collection: string; chapterId: string }>;
}

const validCollections = ["bukhari", "muslim", "abudawood", "tirmidhi", "nasai", "ibnemaaja"];

const collectionNames: Record<string, { name: string; nameArabic: string; compiler: string }> = {
  bukhari: { name: "Sahih Bukhari", nameArabic: "صحيح البخاري", compiler: "Imam Al-Bukhari" },
  muslim: { name: "Sahih Muslim", nameArabic: "صحيح مسلم", compiler: "Imam Muslim" },
  abudawood: { name: "Sunan Abu Dawud", nameArabic: "سنن أبو داود", compiler: "Imam Abu Dawud" },
  tirmidhi: { name: "Jami at-Tirmidhi", nameArabic: "جامع الترمذي", compiler: "Imam At-Tirmidhi" },
  nasai: { name: "Sunan an-Nasai", nameArabic: "سنن النسائي", compiler: "Imam An-Nasai" },
  ibnemaaja: { name: "Sunan Ibn Majah", nameArabic: "سنن ابن ماجه", compiler: "Imam Ibn Majah" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection, chapterId } = await params;
  const chapterNum = parseInt(chapterId);

  if (!validCollections.includes(collection) || isNaN(chapterNum)) {
    return { title: "Chapter Not Found" };
  }

  const collectionInfo = collectionNames[collection];

  return {
    title: `Chapter ${chapterNum} - ${collectionInfo?.name} - IslamOne Research`,
    description: `Read hadith from Chapter ${chapterNum} of ${collectionInfo?.name}`,
  };
}

export default async function ChapterPage({ params }: Props) {
  const { collection, chapterId } = await params;
  const chapterNum = parseInt(chapterId);

  if (!validCollections.includes(collection) || isNaN(chapterNum)) {
    notFound();
  }

  const collectionInfo = collectionNames[collection];

  if (!collectionInfo) {
    notFound();
  }

  try {
    void api.hadith.getHadithsByChapter.prefetch({
      collection: collection as any,
      chapterId: chapterNum,
      limit: 50
    });
  } catch (error) {
    console.warn("Failed to prefetch hadith:", error);
  }

  return (
    <HydrateClient>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href={`/hadith/${collection}`}
            className="text-primary hover:text-primary-light transition-colors text-sm"
          >
            ← Back to {collectionInfo.name}
          </Link>
        </div>

        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 mb-8">
          <div className="text-center">
            <div className="text-xl font-semibold text-neutral-800 mb-1">
              {collectionInfo.name} - Chapter {chapterNum}
            </div>
            <div className="text-neutral-500">
              {collectionInfo.compiler}
            </div>
          </div>
        </div>

        <HadithReader collection={collection} chapterId={chapterNum} />
      </div>
    </HydrateClient>
  );
}