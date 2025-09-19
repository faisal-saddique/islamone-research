import { type Metadata } from "next";
import { HadithBrowser } from "~/app/_components/content/hadith-browser";
import { api, HydrateClient } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Hadith - IslamOne Research",
  description: "Explore authentic Hadith from the six major collections (Kutub al-Sittah)",
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
      <HadithBrowser />
    </HydrateClient>
  );
}