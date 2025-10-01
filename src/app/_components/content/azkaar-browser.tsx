"use client";

import { useState } from "react";
import { Search, ChevronRight, Bookmark, Heart } from "lucide-react";
import Link from "next/link";
import { api } from "~/trpc/react";

export function AzkaarBrowser() {
  const [searchQuery, setSearchQuery] = useState("");
  const [books] = api.azkaar.getBooks.useSuspenseQuery();

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.book?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-semibold text-gray-800">Azkaar & Duas</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover authentic supplications and remembrances from the Quran and Sunnah to strengthen your connection with Allah
          </p>
        </div>

        {/* Search */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search dua collections by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-semibold text-primary">{filteredBooks.length}</div>
              <div className="text-sm text-gray-600">Collections</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-semibold text-primary">
                {filteredBooks.reduce((sum, book) => sum + book.duaCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Duas</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-semibold text-primary">
                {filteredBooks.filter(b => b.duaCount > 0).length}
              </div>
              <div className="text-sm text-gray-600">Active Collections</div>
            </div>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-4 md:gap-6">
            {filteredBooks.map((book) => (
              <Link
                key={book.id}
                href={`/azkaar/${encodeURIComponent(book.book ?? '')}`}
                className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {/* Collection Icon */}
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Collection Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-medium">{book.duaCount} Duas</span>
                        <span>•</span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          Collection #{book.sortorder}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Urdu Title and Action */}
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-primary transition-colors urdu-text">
                      {book.book}
                    </h3>
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <Bookmark className="w-5 h-5 text-gray-400" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No collections found</h3>
            <p className="text-gray-600">Try adjusting your search</p>
          </div>
        )}

        {/* Additional Info */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">About Azkaar & Duas</h2>
            <div className="grid md:grid-cols-2 gap-6 text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Daily Remembrance</h3>
                <p className="leading-relaxed">
                  Azkaar (أذكار) are the prescribed remembrances and supplications taught by Prophet Muhammad (ﷺ)
                  for various occasions throughout the day and night.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Spiritual Benefits</h3>
                <p className="leading-relaxed">
                  Regular recitation of authentic duas brings peace to the heart, protection from harm,
                  and draws one closer to Allah through sincere worship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
