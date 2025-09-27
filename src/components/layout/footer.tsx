import Link from "next/link";
import Image from "next/image";
import { Mail, Heart, MessageSquare, Users, Star } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/islamone-logo.png"
                alt="IslamOne Research"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-gray-900">
                Islam<span className="text-primary">One</span> Research
              </span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
              Collaborative platform for reviewing and verifying Quran translations. Join Islamic scholars in ensuring authentic and accurate translations through scholarly review.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for the Ummah</span>
            </div>
          </div>

          {/* Review Platform */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Review Platform</h3>
            <nav className="flex flex-col gap-3">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Start Reviewing
              </Link>
              <Link
                href="/dashboard/review-queue"
                className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2"
              >
                <Star className="w-4 h-4" />
                Review Queue
              </Link>
              <Link
                href="/dashboard/guidelines"
                className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Guidelines
              </Link>
            </nav>
          </div>

          {/* Resources */}
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
            Ensuring authentic Quran translations through collaborative review
          </div>
        </div>
      </div>
    </footer>
  );
}