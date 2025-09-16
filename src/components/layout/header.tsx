"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useAuthContext } from "~/providers/auth-provider";
import { AuthModal } from "~/components/ui/auth-modal";

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
    <header className="bg-neutral-50 border-b border-neutral-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold text-neutral-800">
              Islam<span className="text-primary">One</span> Research
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {user && (
              <Link 
                href="/dashboard" 
                className="text-neutral-500 hover:text-neutral-800 transition-colors"
              >
                Dashboard
              </Link>
            )}
            <Link 
              href="/quran" 
              className="text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              Quran
            </Link>
            <Link 
              href="/hadith" 
              className="text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              Hadith
            </Link>
            <Link 
              href="/research" 
              className="text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              Research
            </Link>
            <Link 
              href="/about" 
              className="text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              About
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
                  <span className="text-sm text-neutral-800">
                    {user.displayName ?? user.email}
                  </span>
                  <svg 
                    className={`w-4 h-4 text-neutral-500 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-neutral-50 border border-neutral-300 rounded-lg shadow-lg z-50">
                    {/* User Info Section */}
                    <div className="p-4 border-b border-neutral-300">
                      <div className="flex items-center gap-3 mb-2">
                        {user.photoURL ? (
                          <Image 
                            src={user.photoURL} 
                            alt="Profile" 
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-primary text-neutral-50 rounded-full flex items-center justify-center font-medium">
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
                      
                      {dbUser && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className={`px-2 py-1 rounded text-xs text-neutral-50 ${
                            dbUser.role === 'ADMIN' ? 'bg-error' :
                            dbUser.role === 'MODERATOR' ? 'bg-warning' :
                            'bg-success'
                          }`}>
                            {dbUser.role}
                          </span>
                          
                          {user.emailVerified ? (
                            <span className="flex items-center text-success gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                              </svg>
                              Verified
                            </span>
                          ) : (
                            <span className="flex items-center text-warning gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                              </svg>
                              Unverified
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Navigation Links */}
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile Settings
                      </Link>
                      

                      <Link
                        href="/bookmarks"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        Bookmarks
                      </Link>

                      <Link
                        href="/reading-history"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Reading History
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </Link>
                    </div>

                    {/* Admin Controls */}
                    {dbUser?.role === 'ADMIN' && (
                      <>
                        <div className="border-t border-neutral-300 py-2">
                          <p className="px-4 py-1 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            Admin
                          </p>
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Admin Panel
                          </Link>
                          
                          <Link
                            href="/admin/users"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            User Management
                          </Link>

                          <Link
                            href="/admin/content"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Content Management
                          </Link>
                        </div>
                      </>
                    )}

                    {/* Moderator Controls */}
                    {(dbUser?.role === 'MODERATOR' || dbUser?.role === 'ADMIN') && (
                      <>
                        <div className="border-t border-neutral-300 py-2">
                          <p className="px-4 py-1 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                            Moderation
                          </p>
                          <Link
                            href="/moderate"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            Review Queue
                          </Link>
                        </div>
                      </>
                    )}

                    {/* Help & Support */}
                    <div className="border-t border-neutral-300 py-2">
                      <Link
                        href="/help"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Help & Support
                      </Link>
                    </div>

                    {/* Sign Out */}
                    <div className="border-t border-neutral-300 py-2">
                      <button
                        onClick={async () => {
                          setIsProfileDropdownOpen(false);
                          await signOut();
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 bg-primary hover:bg-primary-light text-neutral-50 rounded transition-colors text-sm"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-neutral-500 hover:text-neutral-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-300 py-4">
            <nav className="flex flex-col gap-3">
              {user && (
                <Link 
                  href="/dashboard" 
                  className="text-neutral-500 hover:text-neutral-800 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <Link 
                href="/quran" 
                className="text-neutral-500 hover:text-neutral-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Quran
              </Link>
              <Link 
                href="/hadith" 
                className="text-neutral-500 hover:text-neutral-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hadith
              </Link>
              <Link 
                href="/research" 
                className="text-neutral-500 hover:text-neutral-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Research
              </Link>
              <Link 
                href="/about" 
                className="text-neutral-500 hover:text-neutral-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
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
                      href="/profile"
                      className="text-neutral-500 hover:text-neutral-800 transition-colors text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/bookmarks"
                      className="text-neutral-500 hover:text-neutral-800 transition-colors text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Bookmarks
                    </Link>
                    {dbUser?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
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
                  className="px-4 py-2 bg-primary hover:bg-primary-light text-neutral-50 rounded transition-colors text-sm w-fit"
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