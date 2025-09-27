"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { BookOpen, ArrowRight } from "lucide-react";

interface HadithChapterListProps {
  collection: string;
}

export function HadithChapterList({ collection }: HadithChapterListProps) {
  const [chapters] = api.hadith.getChapters.useSuspenseQuery({
    collection: collection as 'bukhari' | 'muslim' | 'abudawood' | 'tirmidhi' | 'nasai' | 'ibnemaaja',
    limit: 100
  });

  if (!chapters || chapters.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No chapters found</h3>
        <p className="text-gray-600">This collection might not have chapters available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {chapters.map((chapter) => (
        <Link
          key={chapter.Id}
          href={`/hadith/${collection}/${chapter.Id}`}
          className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-200 block"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Chapter Number */}
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {chapter.Id}
                  </span>
                </div>
              </div>

              {/* Chapter Details */}
              <div className="flex-1">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {chapter.HadithCount && (
                    <>
                      <span>{chapter.HadithCount} hadith</span>
                      <span>•</span>
                    </>
                  )}
                  <span>Chapter {chapter.Id}</span>
                </div>
              </div>
            </div>

            {/* Arabic Text and Action */}
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-primary transition-colors urdu-text text-right">
                {chapter.Topic}
              </h3>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}