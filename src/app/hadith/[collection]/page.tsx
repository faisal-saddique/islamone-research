import { type Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HadithChapterList } from "~/app/_components/content/hadith-chapter-list";
import { api, HydrateClient } from "~/trpc/server";
import { ArrowLeft, BookOpen, User, Star } from "lucide-react";

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

  const getCollectionColor = (collection: string) => {
    const colors = {
      "bukhari": "from-emerald-500 to-emerald-600",
      "muslim": "from-blue-500 to-blue-600",
      "abudawood": "from-purple-500 to-purple-600",
      "tirmidhi": "from-orange-500 to-orange-600",
      "nasai": "from-teal-500 to-teal-600",
      "ibnemaaja": "from-indigo-500 to-indigo-600"
    };
    return colors[collection as keyof typeof colors] || "from-gray-500 to-gray-600";
  };

  const getAuthorityLevel = (collection: string) => {
    const levels = {
      "bukhari": "Highest",
      "muslim": "Highest",
      "abudawood": "High",
      "tirmidhi": "High",
      "nasai": "High",
      "ibnemaaja": "Moderate"
    };
    return levels[collection as keyof typeof levels] || "Moderate";
  };

  return (
    <HydrateClient>
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-subtle/30">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <Link
              href="/hadith"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Hadith Collections
            </Link>
          </div>

          {/* Collection Header */}
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200/60 shadow-sm mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${getCollectionColor(collection)} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="arabic-text text-3xl md:text-4xl text-gray-900 font-medium mb-4 leading-relaxed text-center">
                {collectionInfo.nameArabic}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {collectionInfo.name}
              </h1>

              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{collectionInfo.compiler}</span>
                </div>

                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  getAuthorityLevel(collection) === "Highest" ? "bg-emerald-100 text-emerald-700" :
                  getAuthorityLevel(collection) === "High" ? "bg-blue-100 text-blue-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  <Star className="w-4 h-4" />
                  {getAuthorityLevel(collection)} Authority
                </div>
              </div>

              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Explore the authentic narrations from this renowned collection, meticulously compiled and verified by Islamic scholars.
              </p>
            </div>
          </div>

          {/* Chapters Section */}
          <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Chapters</h2>
              </div>
            </div>

            <div className="p-6">
              <HadithChapterList collection={collection} />
            </div>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}