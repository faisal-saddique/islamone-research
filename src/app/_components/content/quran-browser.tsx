"use client";

import { useState } from "react";
import { Search, BookOpen, Bookmark, ChevronRight } from "lucide-react";
import Link from "next/link";
import { api } from "~/trpc/react";

export function QuranBrowser() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "meccan" | "medinan">("all");
  const [surahs] = api.quran.getSurahs.useSuspenseQuery({ limit: 114 });

  const filteredSurahs = surahs.filter((surah) => {
    const matchesSearch =
      surah.NameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.NameMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.SurahNumber.toString().includes(searchQuery);

    const matchesType =
      selectedType === "all" ||
      surah.Type.toLowerCase() === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-semibold text-gray-800">Holy Quran</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Read and study the Holy Quran with multiple translations and commentary
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
                  placeholder="Search surahs by name, meaning, or number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-2">
                {[
                  { key: "all", label: "All" },
                  { key: "meccan", label: "Meccan" },
                  { key: "medinan", label: "Medinan" }
                ].map((type) => (
                  <button
                    key={type.key}
                    onClick={() => setSelectedType(type.key as "all" | "meccan" | "medinan")}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      selectedType === type.key
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-semibold text-primary">{filteredSurahs.length}</div>
              <div className="text-sm text-gray-600">Surahs</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-semibold text-primary">
                {filteredSurahs.reduce((sum, surah) => sum + surah.AyahCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Verses</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-semibold text-primary">
                {filteredSurahs.filter(s => s.Type === "Meccan").length}
              </div>
              <div className="text-sm text-gray-600">Meccan Surahs</div>
            </div>
          </div>
        </div>

        {/* Surahs Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-4 md:gap-6">
            {filteredSurahs.map((surah) => (
              <Link
                key={surah.Id}
                href={`/quran/${surah.SurahNumber}`}
                className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {/* Surah Number */}
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {surah.SurahNumber}
                        </span>
                      </div>
                      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${
                        surah.Type === "Meccan" ? "bg-amber-400" : "bg-emerald-400"
                      }`} title={surah.Type} />
                    </div>

                    {/* Surah Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-primary transition-colors">
                          {surah.NameEnglish}
                        </h3>
                        <div className="text-2xl arabic-text text-primary font-medium">
                          {surah.NameArabic}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-medium">{surah.NameMeaning}</span>
                        <span>•</span>
                        <span>{surah.AyahCount} verses</span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          surah.Type === "Meccan"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {surah.Type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-center gap-2">
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
        {filteredSurahs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No surahs found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}