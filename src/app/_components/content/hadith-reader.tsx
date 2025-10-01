"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, BookOpen, Share, Bookmark, Info, Users } from "lucide-react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { SkeletonWithShimmer } from "~/components/ui/skeleton";

interface HadithReaderProps {
  collection: string;
  chapterId: number;
}

const HADITHS_PER_PAGE = 15;

const collectionInfo = {
  bukhari: { name: "Sahih Bukhari", nameArabic: "صحيح البخاري", compiler: "Imam Al-Bukhari" },
  muslim: { name: "Sahih Muslim", nameArabic: "صحيح مسلم", compiler: "Imam Muslim" },
  abudawood: { name: "Sunan Abu Dawud", nameArabic: "سنن أبو داود", compiler: "Imam Abu Dawud" },
  tirmidhi: { name: "Jami at-Tirmidhi", nameArabic: "جامع الترمذي", compiler: "Imam At-Tirmidhi" },
  nasai: { name: "Sunan an-Nasai", nameArabic: "سنن النسائي", compiler: "Imam An-Nasai" },
  ibnemaaja: { name: "Sunan Ibn Majah", nameArabic: "سنن ابن ماجه", compiler: "Imam Ibn Majah" }
};

export function HadithReader({ collection, chapterId }: HadithReaderProps) {
  const [selectedHadith, setSelectedHadith] = useState<number | null>(null);
  const [showSanad, setShowSanad] = useState(false);
  const [allHadiths, setAllHadiths] = useState<Array<Record<string, unknown>>>([]);
  const [page, setPage] = useState(0);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const collectionData = collectionInfo[collection as keyof typeof collectionInfo];

  // Fetch hadiths with pagination
  const { data, isLoading, isFetching } = api.hadith.getHadithsByChapter.useQuery(
    {
      collection: collection as 'bukhari' | 'muslim' | 'abudawood' | 'tirmidhi' | 'nasai' | 'ibnemaaja',
      chapterId,
      limit: HADITHS_PER_PAGE,
      offset: page * HADITHS_PER_PAGE
    },
    {
      placeholderData: (previousData) => previousData,
    }
  );

  // Calculate hasMore from data length
  const hasMore = data && data.length === HADITHS_PER_PAGE;

  // Append new hadiths to the list
  useEffect(() => {
    if (data) {
      setAllHadiths((prev) => {
        const existingIds = new Set(prev.map(h => h.Id));
        const newHadiths = data.filter(h => !existingIds.has(h.Id));
        return [...prev, ...newHadiths];
      });
    }
  }, [data]);

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link href={`/hadith/${collection}`} className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span>Back to {collectionData?.name}</span>
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSanad(!showSanad)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showSanad ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Users className="w-4 h-4 inline mr-1" />
                Sanad
              </button>
              <button className="p-2 rounded-lg hover:bg-white/50 transition-colors">
                <Share className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {collectionData && (
            <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-semibold text-gray-800">{collectionData.name}</h1>
              </div>
              <div className="arabic-text text-4xl text-primary font-medium mb-4 text-center">
                {collectionData.nameArabic}
              </div>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                <span className="font-medium">{collectionData.compiler}</span>
                <span>•</span>
                <span>Chapter {chapterId}</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Chapter</span>
          </button>
          <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
            Chapter {chapterId}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-colors">
            <span>Next Chapter</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Hadiths */}
        <div className="max-w-4xl mx-auto space-y-6">
          {allHadiths.map((hadith) => {
            const hadithId = hadith.Id as number;
            const hadithNumber = hadith.HadithNumber as number | null;
            const hadithArabic = hadith.Arabic as string | null | undefined;
            const hadithUrdu = hadith.Urdu as string | null | undefined;
            const hadithEnglish = hadith.English as string | null | undefined;
            const hadithSanad = hadith.Sanad as string | null | undefined;

            return (
              <div
                key={hadithId}
                className={`group bg-white rounded-xl border-2 transition-all duration-200 ${
                  selectedHadith === hadithNumber
                    ? "border-primary shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedHadith(selectedHadith === hadithNumber ? null : hadithNumber)}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-6">
                      {/* Verse Number */}
                      <div className="text-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center mx-auto">
                          <span className="text-white font-semibold text-xs">{hadithNumber}</span>
                        </div>
                      </div>

                      {/* Arabic Text */}
                      {hadithArabic && (
                        <div className="arabic-text text-2xl md:text-3xl text-gray-800 leading-loose text-right"
                             dangerouslySetInnerHTML={{ __html: hadithArabic }}
                        />
                      )}

                      {/* Translations */}
                      <div className="space-y-4">
                        {hadithUrdu && (
                          <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
                            <div className="text-sm font-medium text-gray-500 mb-2 text-right urdu-text">اردو ترجمہ</div>
                            <div className="urdu-text text-lg text-gray-700 leading-relaxed text-right"
                                 dangerouslySetInnerHTML={{ __html: hadithUrdu }}
                            />
                          </div>
                        )}

                        {hadithEnglish && (
                          <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-emerald-400">
                            <div className="text-sm font-medium text-gray-500 mb-2">English Translation</div>
                            <div className="text-lg text-gray-700 leading-relaxed"
                                 dangerouslySetInnerHTML={{ __html: hadithEnglish }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Chain of Narration */}
                      {showSanad && hadithSanad && (
                        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                          <div className="flex items-center gap-2 text-sm font-medium text-blue-700 mb-3">
                            <Users className="w-4 h-4" />
                            <span>Chain of Narration (Sanad)</span>
                          </div>
                          <div className="text-sm text-blue-800 leading-relaxed"
                               dangerouslySetInnerHTML={{ __html: hadithSanad }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100">
                        <Bookmark className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading indicator */}
          {isFetching && (
            <div className="space-y-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border-2 border-gray-200 p-6">
                  <div className="space-y-6">
                    <div className="text-center">
                      <SkeletonWithShimmer className="w-6 h-6 rounded-full mx-auto" />
                    </div>
                    <div className="space-y-3">
                      <SkeletonWithShimmer className="h-8 w-full" />
                      <SkeletonWithShimmer className="h-8 w-11/12" />
                      <SkeletonWithShimmer className="h-8 w-10/12" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Infinite scroll trigger */}
          {hasMore && (
            <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
              <div className="text-gray-500 text-sm">Loading more hadiths...</div>
            </div>
          )}

          {/* End message */}
          {!hasMore && allHadiths.length > 0 && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-subtle rounded-full">
                <span className="text-primary font-medium text-sm">
                  End of Chapter {chapterId}
                </span>
              </div>
            </div>
          )}

          {/* Empty State */}
          {allHadiths.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No hadiths found</h3>
              <p className="text-gray-600">This chapter may not contain any hadiths</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}