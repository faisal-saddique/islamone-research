"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { BookOpen, ArrowRight } from "lucide-react";

export function LatestSurah() {
  const [surahs] = api.quran.getSurahs.useSuspenseQuery({ limit: 3 });

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Featured Surahs</h2>
        </div>
        <p className="text-gray-600">
          Begin your Quranic study with these featured chapters
        </p>
      </div>
      {surahs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {surahs.map((surah) => (
              <Link
                key={surah.Id}
                href={`/quran/${surah.SurahNumber}`}
                className="group bg-white rounded-2xl p-6 border border-gray-200/60 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center mx-auto text-lg font-bold text-white group-hover:scale-110 transition-transform">
                    {surah.SurahNumber}
                  </div>
                  <div className="arabic-text text-2xl font-medium text-gray-800 leading-relaxed text-center">
                    {surah.NameArabic}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {surah.NameEnglish}
                  </div>
                  <div className="text-sm text-gray-600 italic">
                    {surah.NameMeaning}
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-200 group-hover:border-primary/30 transition-colors">
                    <span className="font-medium">{surah.AyahCount} verses</span>
                    <span className="capitalize px-2 py-1 bg-gray-100 rounded-full font-medium group-hover:bg-primary-subtle transition-colors">{surah.Type}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-primary font-medium group-hover:text-primary-light transition-colors">
                    <span className="text-sm">Read Surah</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/quran"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl transition-colors font-medium"
            >
              View All Surahs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No Surahs available at the moment.</p>
        </div>
      )}
    </div>
  );
}
