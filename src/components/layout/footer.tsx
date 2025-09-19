import Link from "next/link";
import { BookOpen, Mail, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-light rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Islam<span className="text-primary">One</span> Research
              </span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
              A comprehensive Islamic research platform dedicated to preserving and sharing authentic Islamic knowledge through collaborative study and review.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for the Ummah</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <nav className="flex flex-col gap-3">
              <Link
                href="/quran"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Holy Quran
              </Link>
              <Link
                href="/hadith"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Hadith Collections
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                About Project
              </Link>
            </nav>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <nav className="flex flex-col gap-3">
              <Link
                href="/contact"
                className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Contact Us
              </Link>
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            © 2025 IslamOne Research. All rights reserved.
          </div>
          <div className="text-sm text-gray-500">
            Built for Islamic scholarship and research
          </div>
        </div>
      </div>
    </footer>
  );
}