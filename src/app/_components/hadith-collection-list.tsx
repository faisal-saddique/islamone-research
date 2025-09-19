"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

export function HadithCollectionList() {
  const [collections] = api.hadith.getCollections.useSuspenseQuery();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {collections.map((collection) => (
        <Link
          key={collection.id}
          href={`/hadith/${collection.id}`}
          className="bg-neutral-50 rounded-lg p-4 border border-neutral-300 hover:bg-primary-subtle transition-colors"
        >
          <div className="space-y-3">
            <div className="text-center">
              <div className="arabic-text text-lg text-neutral-800 font-medium mb-1">
                {collection.nameArabic}
              </div>
              <div className="font-semibold text-neutral-800">
                {collection.name}
              </div>
              <div className="text-xs text-neutral-500">
                {collection.compiler}
              </div>
            </div>
            <div className="text-sm text-neutral-600 text-center">
              {collection.description}
            </div>
            <div className="text-center">
              <span className="text-primary font-medium text-sm">Browse →</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}