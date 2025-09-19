import { type Metadata } from "next";
import { HelpCircle, BookOpen, Users, Search, Settings, MessageCircle, ChevronRight, Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Help & Support - IslamOne Research",
  description: "Get help and support for using IslamOne Research platform - FAQs, guides, and contact information",
};

export default function Help() {
  const faqs = [
    {
      question: "How do I get started with reviewing translations?",
      answer: "First, you'll need an account with Reviewer privileges. Contact an administrator for access. Once approved, visit your Dashboard to see assigned content and begin reviewing translations with confidence ratings."
    },
    {
      question: "What are the different user roles on the platform?",
      answer: "There are three main roles: Reviewers (verify translations and provide feedback), Moderators (process flagged content and manage assignments), and Admins (user management and platform oversight)."
    },
    {
      question: "How does the review process work?",
      answer: "Reviewers are assigned specific Surahs or content to review. They examine translations, provide confidence ratings (1-5 scale), and can flag issues or approve content. All reviews contribute to overall quality assurance."
    },
    {
      question: "Can I access content without an account?",
      answer: "Yes! You can browse the Quran and Hadith collections without an account. However, reviewing features, bookmarks, and personalized content require account registration."
    },
    {
      question: "How do I report an issue with a translation?",
      answer: "If you have Reviewer access, you can flag problematic translations during the review process. General users can contact us through the contact form to report content issues."
    },
    {
      question: "Is the platform available in multiple languages?",
      answer: "Currently, the platform interface is in English, but we provide Islamic content with translations in multiple languages. We're working on expanding interface language support."
    }
  ];

  const guides = [
    {
      title: "Getting Started Guide",
      description: "Learn the basics of navigating and using IslamOne Research",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Review System Guide",
      description: "Complete guide to the translation review and verification process",
      icon: Users,
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Search & Navigation",
      description: "Tips for efficiently finding and studying Islamic content",
      icon: Search,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Account Management",
      description: "Manage your profile, settings, and role-specific features",
      icon: Settings,
      color: "from-amber-500 to-amber-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-primary-subtle/30">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-lg">
              <HelpCircle className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Help & Support
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions, learn how to use the platform, and get support when you need it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Quick Help */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Guides */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">User Guides</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guides.map((guide, index) => (
                  <div key={index} className="group p-6 bg-gray-50 hover:bg-white border border-gray-200 rounded-xl transition-all cursor-pointer hover:shadow-md">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 bg-gradient-to-r ${guide.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <guide.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                          {guide.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {guide.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Support */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-light rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Need More Help?</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Can&apos;t find what you&apos;re looking for? Our support team is here to help.
              </p>
              <a
                href="/contact"
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-light text-white rounded-xl transition-colors font-semibold"
              >
                <Mail className="w-5 h-5" />
                Contact Support
              </a>
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-2xl p-6 border border-amber-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Response Time</h3>
              </div>
              <p className="text-gray-700">
                We typically respond to support requests within 24-48 hours during business days.
              </p>
            </div>

            {/* Platform Status */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Platform</span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm text-emerald-700 font-medium">Operational</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Review System</span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm text-emerald-700 font-medium">Operational</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Authentication</span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm text-emerald-700 font-medium">Operational</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a href="/about" className="flex items-center justify-between text-gray-600 hover:text-primary transition-colors">
                  <span>About the Platform</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a href="/privacy" className="flex items-center justify-between text-gray-600 hover:text-primary transition-colors">
                  <span>Privacy Policy</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a href="/terms" className="flex items-center justify-between text-gray-600 hover:text-primary transition-colors">
                  <span>Terms of Service</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Common Issues */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200/60 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Common Issues & Solutions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Can&apos;t Access Dashboard</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Dashboard access requires specific user roles. Contact an administrator if you need Reviewer, Moderator, or Admin privileges.
                </p>
                <div className="text-xs text-primary font-medium">
                  Solution: Request role assignment via contact form
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Login Issues</h4>
                <p className="text-sm text-gray-600 mb-2">
                  If you&apos;re having trouble signing in, try clearing your browser cache or using the &quot;Forgot Password&quot; option.
                </p>
                <div className="text-xs text-primary font-medium">
                  Solution: Clear cache or reset password
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Missing Content</h4>
                <p className="text-sm text-gray-600 mb-2">
                  If you notice missing translations or content, please report it through our contact form with specific details.
                </p>
                <div className="text-xs text-primary font-medium">
                  Solution: Report via contact form
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Slow Loading</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Platform performance may vary based on internet connection. Try refreshing the page or checking your network.
                </p>
                <div className="text-xs text-primary font-medium">
                  Solution: Check connection and refresh
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}