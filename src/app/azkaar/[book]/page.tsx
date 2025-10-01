import { type Metadata } from "next";
import { Suspense } from "react";
import { DuaList } from "~/app/_components/content/dua-list";
import { api, HydrateClient } from "~/trpc/server";
import { DuaListSkeleton } from "~/components/skeletons/dua-list-skeleton";

interface PageProps {
  params: Promise<{
    book: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { book: encodedBook } = await params;
  const book = decodeURIComponent(encodedBook);

  return {
    title: `${book} - Azkaar & Duas - IslamOne Research`,
    description: `Browse authentic duas from ${book}`,
  };
}

export const dynamic = 'force-dynamic';

export default async function AzkaarBookPage({ params }: PageProps) {
  const { book: encodedBook } = await params;
  const book = decodeURIComponent(encodedBook);

  try {
    void api.azkaar.getDuasByBook.prefetch({
      book,
      limit: 100
    });
  } catch (error) {
    console.warn("Failed to prefetch duas:", error);
  }

  return (
    <HydrateClient>
      <Suspense fallback={<DuaListSkeleton />}>
        <DuaList book={book} />
      </Suspense>
    </HydrateClient>
  );
}
