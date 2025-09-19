"use client";

import { api } from "~/trpc/react";

interface HadithReaderProps {
  collection: string;
  chapterId: number;
}

export function HadithReader({ collection, chapterId }: HadithReaderProps) {
  const [hadiths] = api.hadith.getHadithsByChapter.useSuspenseQuery({
    collection: collection as any,
    chapterId,
    limit: 50
  });

  return (
    <div className="space-y-6">
      {hadiths.map((hadith) => (
        <div
          key={hadith.Id}
          className="bg-neutral-50 rounded-lg p-6 border border-neutral-300"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary text-neutral-50 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {hadith.HadithNumber}
              </div>
              <div className="flex-1 space-y-4">
                {hadith.Arabic && (
                  <div
                    className="arabic-text text-xl text-neutral-800 leading-loose"
                    dangerouslySetInnerHTML={{ __html: hadith.Arabic }}
                  />
                )}

                {hadith.English && (
                  <div className="text-neutral-700 leading-relaxed">
                    <div className="text-sm font-medium text-neutral-500 mb-2">English:</div>
                    <div dangerouslySetInnerHTML={{ __html: hadith.English }} />
                  </div>
                )}

                {hadith.Urdu && (
                  <div className="text-neutral-700 leading-relaxed">
                    <div className="text-sm font-medium text-neutral-500 mb-2">Urdu:</div>
                    <div className="urdu-text" dangerouslySetInnerHTML={{ __html: hadith.Urdu }} />
                  </div>
                )}

                {hadith.Sanad && (
                  <div className="text-sm text-neutral-600 bg-neutral-100 p-3 rounded border-l-4 border-primary">
                    <div className="font-medium text-neutral-500 mb-1">Chain of Narration:</div>
                    <div dangerouslySetInnerHTML={{ __html: hadith.Sanad }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}