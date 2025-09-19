import { type Metadata } from "next";
import { HadithCollectionList } from "~/app/_components/hadith-collection-list";
import { api, HydrateClient } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Hadith - IslamOne Research",
  description: "Browse authentic Hadith collections",
};

export const dynamic = 'force-dynamic';

export default async function Hadith() {
  try {
    void api.hadith.getCollections.prefetch();
  } catch (error) {
    console.warn("Failed to prefetch hadith collections:", error);
  }

  return (
    <HydrateClient>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 mb-8">
          <h1 className="text-2xl font-semibold text-neutral-800 mb-4">
            Hadith Collections
          </h1>
          <p className="text-neutral-500">
            Explore authentic Hadith from the six major collections (Kutub al-Sittah).
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium text-neutral-800">Collections</h2>
        </div>

        <HadithCollectionList />
      </div>
    </HydrateClient>
  );
}