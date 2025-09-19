"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

interface HadithChapterListProps {
  collection: string;
}

export function HadithChapterList({ collection }: HadithChapterListProps) {
  const [chapters] = api.hadith.getChapters.useSuspenseQuery({
    collection: collection as any,
    limit: 100
  });

  return (
    <div className="space-y-3">
      {chapters.map((chapter) => (
        <Link
          key={chapter.Id}
          href={`/hadith/${collection}/${chapter.Id}`}
          className="block bg-neutral-50 rounded-lg p-4 border border-neutral-300 hover:bg-primary-subtle transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary text-neutral-50 rounded-full flex items-center justify-center font-semibold text-sm">
                {chapter.Id}
              </div>
              <div className="flex-1">
                <div className="font-medium text-neutral-800">
                  {chapter.Topic}
                </div>
                {chapter.HadithCount && (
                  <div className="text-sm text-neutral-500">
                    {chapter.HadithCount} hadith
                  </div>
                )}
              </div>
            </div>
            <div className="text-primary font-medium text-sm">
              Read →
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}