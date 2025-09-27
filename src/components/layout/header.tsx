"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useAuthContext } from "~/providers/auth-provider";
import { AuthModal } from "~/components/ui/auth-modal";
import { BookOpen, Users, Menu, X, User, Bookmark, Settings, HelpCircle, LogOut, Shield, UserCheck, ChevronDown, MessageSquare, Search } from "lucide-react";

export function Header() {
  const { user, dbUser, signOut } = useAuthContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/islamone-logo.png"
              alt="IslamOne Research"
              width={32}
              height={32}
              className="w-8 h-8 group-hover:scale-110 transition-transform"
            />
            <span className="text-xl font-bold text-gray-900">
              Islam<span className="text-primary">One</span> Research
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {user && (
              <Link
                href="/dashboard"
                className="text-primary hover:text-primary-light transition-colors font-semibold flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Review Dashboard
              </Link>
            )}
            <Link
              href="/quran"
              className="text-gray-600 hover:text-primary transition-colors font-medium flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Quran
            </Link>
            <Link
              href="/hadith"
              className="text-gray-600 hover:text-primary transition-colors font-medium flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Hadith
            </Link>
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  {user.photoURL ? (
                    <Image 
                      src={user.photoURL} 
                      alt="Profile" 
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary text-neutral-50 rounded-full flex items-center justify-center text-sm font-medium">
                      {(user.displayName ?? user.email ?? "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm text-gray-800 font-medium">
                    {user.displayName ?? user.email}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-200/60 rounded-2xl shadow-xl z-50 overflow-hidden">
                    {/* User Info Section */}
                    <div className="p-6 bg-gradient-to-r from-primary-subtle to-primary-subtle/50 border-b border-gray-200">
                      <div className="flex items-center gap-4 mb-3">
                        {user.photoURL ? (
                          <Image
                            src={user.photoURL}
                            alt="Profile"
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                            {(user.displayName ?? user.email ?? "U").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-semibold text-gray-900 truncate">
                            {user.displayName ?? "User"}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {dbUser && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white ${
                              dbUser.role === 'ADMIN' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                              dbUser.role === 'MODERATOR' ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                              'bg-gradient-to-r from-emerald-500 to-emerald-600'
                            }`}>
                              {dbUser.role === 'ADMIN' ? <Shield className="w-3 h-3" /> :
                               dbUser.role === 'MODERATOR' ? <UserCheck className="w-3 h-3" /> :
                               <User className="w-3 h-3" />}
                              {dbUser.role}
                            </span>

                            {user.emailVerified && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                </svg>
                                Verified
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Navigation Links */}
                    <div className="py-3">
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        Profile Settings
                      </Link>

                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-primary" />
                        </div>
                        Review Dashboard
                      </Link>

                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Bookmark className="w-4 h-4 text-gray-600" />
                        </div>
                        Bookmarks
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Settings className="w-4 h-4 text-gray-600" />
                        </div>
                        Settings
                      </Link>
                    </div>

                    {/* Admin Controls */}
                    {dbUser?.role === 'ADMIN' && (
                      <>
                        <div className="border-t border-gray-200 py-3">
                          <div className="px-6 py-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Admin Tools
                            </p>
                          </div>
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                              <Shield className="w-4 h-4 text-red-600" />
                            </div>
                            Admin Dashboard
                          </Link>

                          <Link
                            href="/dashboard/user-management"
                            className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Users className="w-4 h-4 text-purple-600" />
                            </div>
                            User Management
                          </Link>
                        </div>
                      </>
                    )}

                    {/* Moderator Controls */}
                    {(dbUser?.role === 'MODERATOR' || dbUser?.role === 'ADMIN') && (
                      <>
                        <div className="border-t border-gray-200 py-3">
                          <div className="px-6 py-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Moderation
                            </p>
                          </div>
                          <Link
                            href="/dashboard/review-queue"
                            className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                              <UserCheck className="w-4 h-4 text-amber-600" />
                            </div>
                            Review Queue
                          </Link>
                        </div>
                      </>
                    )}

                    {/* Help & Support */}
                    <div className="border-t border-gray-200 py-3">
                      <Link
                        href="/help"
                        className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <HelpCircle className="w-4 h-4 text-gray-600" />
                        </div>
                        Help & Support
                      </Link>
                    </div>

                    {/* Sign Out */}
                    <div className="border-t border-gray-200 py-3">
                      <button
                        onClick={async () => {
                          setIsProfileDropdownOpen(false);
                          await signOut();
                        }}
                        className="flex items-center gap-3 w-full px-6 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <LogOut className="w-4 h-4 text-red-600" />
                        </div>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-6 py-2 bg-primary hover:bg-primary-light text-white rounded-lg transition-colors font-semibold shadow-sm hover:shadow-md"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 mt-4 pt-4">
            <nav className="flex flex-col gap-4">
              {user && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 text-primary hover:text-primary-light transition-colors font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MessageSquare className="w-4 h-4" />
                  Review Dashboard
                </Link>
              )}
              <Link
                href="/quran"
                className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookOpen className="w-4 h-4" />
                Quran
              </Link>
              <Link
                href="/hadith"
                className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Search className="w-4 h-4" />
                Hadith
              </Link>

              {user ? (
                <div className="border-t border-neutral-300 pt-3">
                  <div className="flex items-center gap-3 mb-3">
                    {user.photoURL ? (
                      <Image 
                        src={user.photoURL} 
                        alt="Profile" 
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary text-neutral-50 rounded-full flex items-center justify-center text-sm font-medium">
                        {(user.displayName ?? user.email ?? "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-800 truncate">
                        {user.displayName ?? "User"}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link
                      href="/settings"
                      className="text-neutral-500 hover:text-neutral-800 transition-colors text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="text-neutral-500 hover:text-neutral-800 transition-colors text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Bookmarks
                    </Link>
                    {dbUser?.role === 'ADMIN' && (
                      <Link
                        href="/dashboard/user-management"
                        className="text-neutral-500 hover:text-neutral-800 transition-colors text-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={async () => {
                        setIsMobileMenuOpen(false);
                        await signOut();
                      }}
                      className="text-error hover:text-error/80 transition-colors text-sm text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-lg transition-colors font-semibold w-fit shadow-sm"
                >
                  Sign In
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}