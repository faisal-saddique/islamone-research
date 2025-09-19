import Link from "next/link";
import { LatestSurah } from "~/app/_components/surah";
import { api, HydrateClient } from "~/trpc/server";
import { BookOpen, Users, Search, Award, ArrowRight, CheckCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Home() {
  try {
    void api.quran.getSurahs.prefetch({ limit: 3 });
  } catch (error) {
    console.warn("Failed to prefetch data:", error);
  }

  return (
    <HydrateClient>
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-subtle/30">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Islam<span className="text-primary">One</span> Research
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              A comprehensive Islamic research platform for studying and reviewing Quran, Hadith, and Islamic literature with collaborative translation verification.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quran"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-light text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                <BookOpen className="w-5 h-5" />
                Explore Quran
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/hadith"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-xl transition-all duration-200 font-semibold"
              >
                <Search className="w-5 h-5" />
                Browse Hadith
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Research & Review Platform</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Collaborative tools for Islamic scholarship with translation review and verification
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Comprehensive Library</h3>
              <p className="text-gray-600 leading-relaxed">
                Access to complete Quran with multiple translations, major Hadith collections, and Islamic literature for thorough research.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Collaborative Review</h3>
              <p className="text-gray-600 leading-relaxed">
                Join a community of scholars and reviewers to verify translations, provide feedback, and improve content quality.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Assurance</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced review system with confidence ratings, flagging mechanisms, and approval workflows to ensure accuracy.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Start Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200/60 shadow-sm">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Started</h2>
              <p className="text-lg text-gray-600">
                Begin your Islamic research journey or contribute to our review community
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                  For Researchers
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    Access complete Quran with multiple translations
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    Browse major Hadith collections (Bukhari, Muslim, etc.)
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    Advanced search and filtering capabilities
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    Bookmarking and reading history features
                  </li>
                </ul>
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <Users className="w-6 h-6 text-primary" />
                  For Reviewers
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    Review and verify translation accuracy
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    Provide confidence ratings and feedback
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    Track review progress and assignments
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    Collaborate with other scholars and reviewers
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Content Preview */}
        <section className="container mx-auto px-4 py-16">
          <LatestSurah />
        </section>
      </div>
    </HydrateClient>
  );
}
