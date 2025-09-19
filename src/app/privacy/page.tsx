import { type Metadata } from "next";
import { Shield, Eye, Lock, Database, Users, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - IslamOne Research",
  description: "Learn how we protect your privacy and handle your data on IslamOne Research platform",
};

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-subtle/30">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Privacy Policy
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We are committed to protecting your privacy and ensuring the security of your personal information while using IslamOne Research.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Last updated: January 2025
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Information We Collect */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Information</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Email address and display name for account creation and authentication
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Profile information including role assignments (Reviewer, Moderator, Admin)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Authentication data through Firebase Authentication
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Usage Information</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Review and translation activities for quality assurance purposes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Reading history and bookmarks to enhance your experience
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Progress tracking and assignment completion data
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-primary-subtle rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Platform Operation</h4>
                  <p className="text-sm text-gray-600">Provide access to Islamic content, enable review processes, and maintain user accounts.</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Quality Assurance</h4>
                  <p className="text-sm text-gray-600">Track review contributions and maintain content accuracy through collaborative verification.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">User Experience</h4>
                  <p className="text-sm text-gray-600">Personalize content recommendations and improve platform functionality.</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Communication</h4>
                  <p className="text-sm text-gray-600">Send important updates, respond to inquiries, and provide support when needed.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Data Security & Protection</h2>
            </div>
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed">
                We implement industry-standard security measures to protect your personal information and ensure the integrity of our platform.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Technical Safeguards</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Encrypted data transmission (HTTPS/TLS)</li>
                    <li>• Secure authentication via Firebase</li>
                    <li>• Protected database infrastructure</li>
                    <li>• Regular security updates and monitoring</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Access Controls</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Role-based access permissions</li>
                    <li>• Limited administrative access</li>
                    <li>• Audit trails for sensitive operations</li>
                    <li>• Regular access reviews and updates</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Data Sharing */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Information Sharing</h2>
            </div>
            <div className="space-y-4">
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl">
                <h4 className="font-semibold text-emerald-900 mb-2">We DO NOT sell your personal information</h4>
                <p className="text-emerald-700">Your privacy is fundamental to our mission. We never sell, rent, or trade your personal data to third parties.</p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Limited Sharing Only For:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Service providers who help us operate the platform (with strict privacy agreements)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Legal compliance when required by law or to protect user safety
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Aggregated, anonymized data for research and platform improvement
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Your Privacy Rights</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Access & Control</h4>
                  <p className="text-sm text-gray-600">Request access to your personal data and update your account information at any time.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Data Portability</h4>
                  <p className="text-sm text-gray-600">Export your data in a structured format if you choose to leave the platform.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Deletion</h4>
                  <p className="text-sm text-gray-600">Request deletion of your account and associated personal data (some review data may be retained for quality purposes).</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Corrections</h4>
                  <p className="text-sm text-gray-600">Correct any inaccurate or incomplete personal information in your account.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-primary-subtle to-primary-subtle/50 rounded-2xl p-8 border border-primary/10">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Questions About Privacy?</h3>
              <p className="text-gray-600 mb-6">
                If you have any questions about this Privacy Policy or our data practices, please don&apos;t hesitate to contact us.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-xl transition-colors font-semibold"
              >
                Contact Us
                <Calendar className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}