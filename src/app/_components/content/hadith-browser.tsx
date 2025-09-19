"use client";

import { useState } from "react";
import { Search, BookMarked, Star, Users, ChevronRight, Filter } from "lucide-react";
import Link from "next/link";
import { api } from "~/trpc/react";

export function HadithBrowser() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAuthority, setSelectedAuthority] = useState<string>("all");
  const [collections] = api.hadith.getCollections.useSuspenseQuery();

  const authorityLevels = {
    "bukhari": "Highest",
    "muslim": "Highest",
    "abudawood": "High",
    "tirmidhi": "High",
    "nasai": "High",
    "ibnemaaja": "Moderate"
  };

  const collectionColors = {
    "bukhari": "bg-emerald-500",
    "muslim": "bg-blue-500",
    "abudawood": "bg-purple-500",
    "tirmidhi": "bg-orange-500",
    "nasai": "bg-teal-500",
    "ibnemaaja": "bg-indigo-500"
  };

  const filteredCollections = collections.filter((collection) => {
    const matchesSearch =
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.compiler.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAuthority =
      selectedAuthority === "all" ||
      authorityLevels[collection.id as keyof typeof authorityLevels] === selectedAuthority;

    return matchesSearch && matchesAuthority;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
              <BookMarked className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-semibold text-gray-800">Hadith Collections</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore authentic Hadith from the six major collections (Kutub al-Sittah) compiled by the greatest Islamic scholars
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search collections by name, compiler, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedAuthority}
                  onChange={(e) => setSelectedAuthority(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="all">All Authority Levels</option>
                  <option value="Highest">Highest Authority</option>
                  <option value="High">High Authority</option>
                  <option value="Moderate">Moderate Authority</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-semibold text-primary">{filteredCollections.length}</div>
              <div className="text-sm text-gray-600">Collections</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-semibold text-emerald-500">2</div>
              <div className="text-sm text-gray-600">Sahih Collections</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-semibold text-blue-500">4</div>
              <div className="text-sm text-gray-600">Sunan Collections</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-semibold text-orange-500">6</div>
              <div className="text-sm text-gray-600">Major Compilers</div>
            </div>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCollections.map((collection) => {
              const authorityLevel = authorityLevels[collection.id as keyof typeof authorityLevels];
              const colorClass = collectionColors[collection.id as keyof typeof collectionColors];

              return (
                <Link
                  key={collection.id}
                  href={`/hadith/${collection.id}`}
                  className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <BookMarked className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          authorityLevel === "Highest" ? "bg-emerald-100 text-emerald-700" :
                          authorityLevel === "High" ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          <Star className="w-3 h-3 inline mr-1" />
                          {authorityLevel}
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3 text-center">
                      <div>
                        <div className="arabic-text text-2xl text-gray-800 font-medium mb-2">
                          {collection.nameArabic}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-primary transition-colors">
                          {collection.name}
                        </h3>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="font-medium">{collection.compiler}</span>
                      </div>

                      <p className="text-gray-600 leading-relaxed">
                        {collection.description}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-center">
                        <span className="text-primary font-medium text-sm group-hover:text-primary-light transition-colors">
                          Explore Collection →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredCollections.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No collections found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Additional Info */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">About Kutub al-Sittah</h2>
            <div className="grid md:grid-cols-2 gap-6 text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">The Six Books</h3>
                <p className="leading-relaxed">
                  Kutub al-Sittah (الكتب الستة) refers to the six major Sunni hadith collections,
                  considered the most authentic and reliable sources of prophetic traditions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Authority Levels</h3>
                <p className="leading-relaxed">
                  Collections are ranked by scholarly consensus on authenticity, with Sahih Bukhari
                  and Sahih Muslim considered the highest authority after the Quran.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}