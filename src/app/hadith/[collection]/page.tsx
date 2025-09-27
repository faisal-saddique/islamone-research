import { type Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HadithChapterList } from "~/app/_components/content/hadith-chapter-list";
import { api, HydrateClient } from "~/trpc/server";
import { ArrowLeft, BookOpen } from "lucide-react";

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
    void api.hadith.getChapters.prefetch({ collection: collection as 'bukhari' | 'muslim' | 'abudawood' | 'tirmidhi' | 'nasai' | 'ibnemaaja', limit: 100 });
  } catch (error) {
    console.warn("Failed to prefetch hadith chapters:", error);
  }


  return (
    <HydrateClient>
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-subtle">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <Link href="/hadith" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Hadith Collections</span>
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-semibold text-gray-800">{collectionInfo.name}</h1>
              </div>
              <div className="arabic-text text-4xl text-primary font-medium mb-4 text-center">
                {collectionInfo.nameArabic}
              </div>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                <span className="font-medium">{collectionInfo.compiler}</span>
                <span>•</span>
                <span>Authentic Hadith Collection</span>
              </div>
            </div>
          </div>

          {/* Chapters */}
          <div className="max-w-4xl mx-auto">
            <HadithChapterList collection={collection} />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}