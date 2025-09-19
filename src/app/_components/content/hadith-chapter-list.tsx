"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { BookOpen, ArrowRight, Hash } from "lucide-react";

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
    <div className="grid grid-cols-1 gap-4">
      {chapters.map((chapter) => (
        <Link
          key={chapter.Id}
          href={`/hadith/${collection}/${chapter.Id}`}
          className="group bg-gray-50 hover:bg-white rounded-xl p-6 border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            {/* Chapter Number */}
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              {chapter.Id}
            </div>

            {/* Chapter Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors mb-1 leading-tight">
                {chapter.Topic}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {chapter.HadithCount && (
                  <div className="flex items-center gap-1">
                    <Hash className="w-4 h-4" />
                    <span>{chapter.HadithCount} {chapter.HadithCount === 1 ? 'hadith' : 'hadith'}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Chapter {chapter.Id}</span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center gap-2 text-primary group-hover:text-primary-light transition-colors">
              <span className="font-medium hidden sm:block">Read Chapter</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      ))}

      {/* Summary Footer */}
      <div className="mt-6 p-4 bg-primary-subtle rounded-xl">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            Total: <span className="text-primary font-semibold">{chapters.length}</span> chapters available
          </p>
        </div>
      </div>
    </div>
  );
}