"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ArrowLeft, Heart, BookmarkPlus, Copy, Check } from "lucide-react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { SkeletonWithShimmer } from "~/components/ui/skeleton";

interface DuaListProps {
  book: string;
}

const DUAS_PER_PAGE = 20;

export function DuaList({ book }: DuaListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [expandedDuas, setExpandedDuas] = useState<Set<number>>(new Set());
  const [allDuas, setAllDuas] = useState<Array<Record<string, unknown>>>([]);
  const [page, setPage] = useState(0);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetching } = api.azkaar.getDuasByBook.useQuery(
    {
      book,
      limit: DUAS_PER_PAGE,
      offset: page * DUAS_PER_PAGE
    },
    {
      placeholderData: (previousData) => previousData,
    }
  );

  // Append new duas to the list
  useEffect(() => {
    if (data?.duas) {
      setAllDuas((prev) => {
        const existingIds = new Set(prev.map(d => d.id));
        const newDuas = data.duas.filter(d => !existingIds.has(d.id));
        return [...prev, ...newDuas];
      });
    }
  }, [data]);

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current || !data?.hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && data?.hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [data?.hasMore, isFetching]);

  const filteredDuas = allDuas.filter((dua) => {
    const title = dua.title as string | null | undefined;
    const translation = dua.translation as string | null | undefined;
    const arabicText = dua.arabic_text as string | null | undefined;

    const matchesSearch =
      (title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (translation?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (arabicText?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    return matchesSearch;
  });

  const handleCopy = async (text: string | null, id: number) => {
    if (!text) return;

    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedDuas);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedDuas(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-subtle">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <p className="text-gray-600">Loading duas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/azkaar"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Collections
          </Link>
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-semibold text-gray-800 urdu-text-center">{book}</h1>
              <p className="text-gray-600">{filteredDuas.length} Duas</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search duas by title or translation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Duas List */}
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6">
            {filteredDuas.map((dua) => {
              const duaId = dua.id as number;
              const duaTitle = dua.title as string | null;
              const duaIntro = dua.intro as string | null;
              const duaArabicText = dua.arabic_text as string | null;
              const duaTranslation = dua.translation as string | null;
              const duaVirtues = dua.virtues as string | null;

              const isExpanded = expandedDuas.has(duaId);
              const hasLongContent = (duaTranslation?.length ?? 0) > 300 || (duaArabicText?.length ?? 0) > 300;

              return (
                <div
                  key={duaId}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {/* Title */}
                  {duaTitle && (
                    <div className="mb-4 pb-4 border-b border-gray-100 text-center">
                      <h3 className="text-xl font-semibold text-gray-800 urdu-text-center">{duaTitle}</h3>
                    </div>
                  )}

                  {/* Intro */}
                  {duaIntro && (
                    <div className="mb-4 p-4 bg-primary-subtle/30 rounded-lg">
                      <p className="text-sm text-gray-700 leading-relaxed urdu-text text-right">{duaIntro}</p>
                    </div>
                  )}

                  {/* Arabic Text */}
                  {duaArabicText && (
                    <div className="mb-6 p-6 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Arabic</p>
                        <button
                          onClick={() => handleCopy(duaArabicText, duaId)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Copy Arabic text"
                        >
                          {copiedId === duaId ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <p
                        className={`arabic-text text-2xl leading-relaxed text-gray-800 ${!isExpanded && hasLongContent ? 'line-clamp-3' : ''}`}
                        dir="rtl"
                      >
                        {duaArabicText}
                      </p>
                    </div>
                  )}

                  {/* Translation */}
                  {duaTranslation && (
                    <div className="mb-6 p-6 bg-white rounded-lg border border-gray-200">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Translation</p>
                      <p className={`text-gray-700 leading-relaxed urdu-text text-right ${!isExpanded && hasLongContent ? 'line-clamp-4' : ''}`}>
                        {duaTranslation}
                      </p>
                    </div>
                  )}

                  {/* Virtues */}
                  {duaVirtues && (
                    <div className="mb-4 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Virtues & Benefits</p>
                      <p className={`text-sm text-gray-700 leading-relaxed urdu-text text-right ${!isExpanded && hasLongContent ? 'line-clamp-3' : ''}`}>
                        {duaVirtues}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      {hasLongContent && (
                        <button
                          onClick={() => toggleExpanded(duaId)}
                          className="text-sm text-primary hover:text-primary-light font-medium transition-colors"
                        >
                          {isExpanded ? 'Show less' : 'Show more'}
                        </button>
                      )}
                    </div>
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
                      title="Bookmark this dua"
                    >
                      <BookmarkPlus className="w-4 h-4" />
                      <span className="text-sm font-medium">Bookmark</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Loading indicator */}
            {isFetching && (
              <div className="grid gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="mb-4 pb-4 border-b border-gray-100 text-center">
                      <SkeletonWithShimmer className="h-6 w-64 mx-auto" />
                    </div>
                    <div className="mb-6 p-6 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
                      <div className="space-y-3">
                        <SkeletonWithShimmer className="h-8 w-full" />
                        <SkeletonWithShimmer className="h-8 w-11/12 ml-auto" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Infinite scroll trigger */}
            {data?.hasMore && !searchQuery && (
              <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
                <div className="text-gray-500 text-sm">Loading more duas...</div>
              </div>
            )}

            {/* End message */}
            {!data?.hasMore && allDuas.length > 0 && !searchQuery && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-subtle rounded-full">
                  <span className="text-primary font-medium text-sm">
                    End of {book}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {filteredDuas.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No duas found</h3>
            <p className="text-gray-600">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
