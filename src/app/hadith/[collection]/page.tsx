import { type Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HadithChapterList } from "~/app/_components/hadith-chapter-list";
import { api, HydrateClient } from "~/trpc/server";

interface Props {
  params: Promise<{ collection: string }>;
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
  const { collection } = await params;

  if (!validCollections.includes(collection)) {
    return { title: "Collection Not Found" };
  }

  const collectionInfo = collectionNames[collection];

  return {
    title: `${collectionInfo?.name} - IslamOne Research`,
    description: `Browse chapters from ${collectionInfo?.name} by ${collectionInfo?.compiler}`,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { collection } = await params;

  if (!validCollections.includes(collection)) {
    notFound();
  }

  const collectionInfo = collectionNames[collection];

  if (!collectionInfo) {
    notFound();
  }

  try {
    void api.hadith.getChapters.prefetch({ collection: collection as any, limit: 100 });
  } catch (error) {
    console.warn("Failed to prefetch hadith chapters:", error);
  }

  return (
    <HydrateClient>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/hadith"
            className="text-primary hover:text-primary-light transition-colors text-sm"
          >
            ← Back to Collections
          </Link>
        </div>

        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 mb-8">
          <div className="text-center">
            <div className="arabic-text text-2xl text-neutral-800 font-semibold mb-2">
              {collectionInfo.nameArabic}
            </div>
            <div className="text-xl font-semibold text-neutral-800 mb-1">
              {collectionInfo.name}
            </div>
            <div className="text-neutral-500">
              Compiled by {collectionInfo.compiler}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium text-neutral-800">Chapters</h2>
        </div>

        <HadithChapterList collection={collection} />
      </div>
    </HydrateClient>
  );
}