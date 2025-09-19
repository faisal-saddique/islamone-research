import { type Metadata } from "next";
import { Scale, FileText, Users, Shield, AlertCircle, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service - IslamOne Research",
  description: "Terms of service and user agreement for using IslamOne Research platform",
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-subtle/30">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Scale className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Terms of Service
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            By using IslamOne Research, you agree to these terms and conditions. Please read them carefully.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Last updated: January 2025
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Acceptance of Terms */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                By accessing or using IslamOne Research (&quot;the Platform&quot;), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with any part of these terms, you may not use our platform.
              </p>
              <p>
                These terms apply to all users, including reviewers, moderators, administrators, and general users accessing Islamic content through our platform.
              </p>
            </div>
          </div>

          {/* Platform Purpose */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Platform Purpose & Scope</h2>
            </div>
            <div className="space-y-6">
              <p className="text-gray-600">
                IslamOne Research is designed to provide access to Islamic content and facilitate collaborative translation review and verification processes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-primary-subtle rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Educational Purpose</h4>
                  <p className="text-sm text-gray-600">Access to Quranic verses, Hadith collections, and Islamic literature for study and research.</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Collaborative Review</h4>
                  <p className="text-sm text-gray-600">Community-driven translation verification and quality assurance processes.</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Responsibilities */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">User Responsibilities</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    Maintain the confidentiality of your account credentials
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    Notify us immediately of any unauthorized access to your account
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    Use your account responsibly and in accordance with your assigned role
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Guidelines</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    Provide accurate and thoughtful reviews of translations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    Respect the sacred nature of Islamic texts and maintain appropriate conduct
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    Contribute constructively to the community review process
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Prohibited Activities */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Prohibited Activities</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <h4 className="font-semibold text-red-900 mb-2">Content Misuse</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Deliberately providing false or misleading reviews</li>
                    <li>• Misrepresenting Islamic teachings or content</li>
                    <li>• Using content for commercial purposes without permission</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <h4 className="font-semibold text-red-900 mb-2">Platform Abuse</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Attempting to circumvent security measures</li>
                    <li>• Creating multiple accounts to manipulate reviews</li>
                    <li>• Interfering with platform operations</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <h4 className="font-semibold text-red-900 mb-2">Inappropriate Conduct</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Harassment or disrespectful behavior toward other users</li>
                    <li>• Sharing inappropriate or offensive content</li>
                    <li>• Violating the privacy of other users</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <h4 className="font-semibold text-red-900 mb-2">Technical Violations</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Reverse engineering or copying platform code</li>
                    <li>• Introducing malware or harmful code</li>
                    <li>• Excessive automated requests or scraping</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Intellectual Property</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Islamic Content</h3>
                <p className="text-gray-600">
                  The Quran and authentic Hadith are sacred texts that belong to the Islamic community. Our platform provides access to these texts with various translations and commentaries for educational and research purposes.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Platform Technology</h3>
                <p className="text-gray-600">
                  The platform&apos;s design, code, features, and functionality are owned by IslamOne Research and protected by intellectual property laws. Users may not copy, modify, or distribute our technology without permission.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">User Contributions</h3>
                <p className="text-gray-600">
                  By contributing reviews, translations, or other content, you grant us a license to use, modify, and distribute your contributions for the platform&apos;s educational purposes while retaining your ownership rights.
                </p>
              </div>
            </div>
          </div>

          {/* Platform Availability */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Platform Availability & Modifications</h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                We strive to maintain continuous access to the platform, but we cannot guarantee uninterrupted service. We may need to suspend or modify the platform for maintenance, updates, or other operational reasons.
              </p>
              <p>
                We reserve the right to modify these Terms of Service at any time. Significant changes will be communicated to users through the platform or via email. Continued use after changes constitutes acceptance of the updated terms.
              </p>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Limitation of Liability</h2>
            </div>
            <div className="space-y-4">
              <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl">
                <h4 className="font-semibold text-amber-900 mb-2">Educational Purpose</h4>
                <p className="text-amber-800">
                  This platform is provided for educational and research purposes. While we strive for accuracy, users should consult qualified Islamic scholars for authoritative religious guidance.
                </p>
              </div>
              <p className="text-gray-600">
                To the fullest extent permitted by law, IslamOne Research shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-primary-subtle to-primary-subtle/50 rounded-2xl p-8 border border-primary/10">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Questions About These Terms?</h3>
              <p className="text-gray-600 mb-6">
                If you have any questions about these Terms of Service or need clarification on any provisions, please contact us.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-xl transition-colors font-semibold"
              >
                Contact Us
                <Scale className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}