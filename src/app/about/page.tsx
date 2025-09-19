import { type Metadata } from "next";
import { BookOpen, Users, Award, Heart, CheckCircle, Globe, Shield, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "About - IslamOne Research",
  description: "Learn about our collaborative Islamic research platform for Quran, Hadith, and translation review",
};

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-subtle/30">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              About Islam<span className="text-primary">One</span> Research
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A collaborative Islamic research platform dedicated to preserving and sharing authentic Islamic knowledge through advanced translation review and verification systems.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200/60 shadow-sm mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                To make authentic Islamic scholarship accessible to Muslims worldwide through modern technology, collaborative review systems, and the highest standards of accuracy and authenticity.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We believe in the power of community-driven verification to ensure the quality and reliability of Islamic content for future generations.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-6 bg-primary-subtle rounded-2xl">
                <div className="text-3xl font-bold text-primary mb-2">114</div>
                <p className="text-sm font-medium text-gray-700">Quran Surahs</p>
              </div>
              <div className="text-center p-6 bg-emerald-50 rounded-2xl">
                <div className="text-3xl font-bold text-emerald-600 mb-2">7000+</div>
                <p className="text-sm font-medium text-gray-700">Hadith Records</p>
              </div>
              <div className="text-center p-6 bg-amber-50 rounded-2xl">
                <div className="text-3xl font-bold text-amber-600 mb-2">Multi</div>
                <p className="text-sm font-medium text-gray-700">Languages</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-2xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                <p className="text-sm font-medium text-gray-700">Access</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-lg text-gray-600">
              Comprehensive tools for Islamic research and collaborative content verification
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Complete Quran</h3>
              <p className="text-gray-600 leading-relaxed">
                Access to all 114 Surahs with multiple translations, Arabic text, and comprehensive study tools for in-depth research.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Hadith Collections</h3>
              <p className="text-gray-600 leading-relaxed">
                Authentic Hadith from major collections including Sahih Bukhari, Sahih Muslim, and other trusted sources.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Collaborative Review</h3>
              <p className="text-gray-600 leading-relaxed">
                Community-driven translation verification system with role-based access for reviewers, moderators, and administrators.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Assurance</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced review workflows with confidence ratings, approval mechanisms, and quality control processes.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Reliable</h3>
              <p className="text-gray-600 leading-relaxed">
                Built with modern security practices, user authentication, and reliable data storage for trusted access.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Global Access</h3>
              <p className="text-gray-600 leading-relaxed">
                Available worldwide with responsive design, multiple languages, and accessibility features for all users.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200/60 shadow-sm">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">
              The principles that guide our work in preserving and sharing Islamic knowledge
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-light rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Authenticity</h3>
              <p className="text-gray-600 leading-relaxed">
                Every piece of content is carefully verified and reviewed to ensure authenticity and accuracy in Islamic scholarship.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600 leading-relaxed">
                We believe in the power of collaborative scholarship and community-driven quality assurance for Islamic content.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Accessibility</h3>
              <p className="text-gray-600 leading-relaxed">
                Making Islamic knowledge accessible to Muslims worldwide through modern technology and user-friendly interfaces.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}