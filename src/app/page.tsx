import Link from "next/link";
import Image from "next/image";
import { LatestSurah } from "~/app/_components/surah";
import { api, HydrateClient } from "~/trpc/server";
import { BookOpen, ArrowRight, CheckCircle, Eye, MessageSquare, Star, Users } from "lucide-react";

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
            <div className="flex items-center justify-center gap-4 mb-6">
              <Image
                src="/islamone-logo.png"
                alt="IslamOne Research"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Islam<span className="text-primary">One</span> Research
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Collaborative platform for reviewing and verifying Quran translations with precision. Join Islamic scholars in ensuring authentic and accurate translations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-light text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                <MessageSquare className="w-5 h-5" />
                Start Reviewing
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/quran"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-xl transition-all duration-200 font-semibold"
              >
                <BookOpen className="w-5 h-5" />
                Read Quran
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Translation Review Platform</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ensuring accuracy and authenticity in Quran translations through collaborative scholarly review
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Translation Review</h3>
              <p className="text-gray-600 leading-relaxed">
                Review and verify Quran translations for accuracy, providing scholarly feedback and confidence ratings for each verse.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Scholarly Collaboration</h3>
              <p className="text-gray-600 leading-relaxed">
                Work with Islamic scholars and experts to ensure translations maintain authenticity and convey proper meaning.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Verification</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced review workflows with confidence scoring, flagging mechanisms, and approval processes for verified translations.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200/60 shadow-sm">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How Translation Review Works</h2>
              <p className="text-lg text-gray-600">
                Join our collaborative process to ensure authentic and accurate Quran translations
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  Review Process
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    Compare Arabic text with existing translations
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    Provide confidence ratings for translation accuracy
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    Submit detailed feedback and suggestions
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    Flag problematic translations for expert review
                  </li>
                </ul>
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <Eye className="w-6 h-6 text-primary" />
                  Additional Features
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    Read complete Quran with verified translations
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    Browse authentic Hadith collections for context
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    Access research tools and scholarly resources
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    Track your contributions and review history
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="container mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Join the Translation Review Community</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Help ensure the accuracy and authenticity of Quran translations. Your scholarly contributions make a difference in preserving the true meaning of the divine text.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-xl transition-all duration-200 font-semibold hover:shadow-lg"
              >
                <MessageSquare className="w-5 h-5" />
                Start Reviewing Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/quran"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 text-white border-2 border-white/30 rounded-xl transition-all duration-200 font-semibold hover:bg-white/30"
              >
                <BookOpen className="w-5 h-5" />
                Browse Quran
              </Link>
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
