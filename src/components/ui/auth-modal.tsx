"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuthContext } from "~/providers/auth-provider";
import { X, Mail, BookOpen } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signInWithGoogle } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Add blur effect to main content when modal is open
  useEffect(() => {
    if (isOpen) {
      // Add a class to body to prevent scrolling
      document.body.style.overflow = 'hidden';

      const header = document.querySelector('header');
      const main = document.querySelector('main');
      const footer = document.querySelector('footer');

      [header, main, footer].forEach(element => {
        if (element) {
          element.style.filter = 'blur(4px)';
          element.style.pointerEvents = 'none';
          element.style.userSelect = 'none';
        }
      });
    } else {
      // Remove body scroll lock
      document.body.style.overflow = '';

      const header = document.querySelector('header');
      const main = document.querySelector('main');
      const footer = document.querySelector('footer');

      [header, main, footer].forEach(element => {
        if (element) {
          element.style.filter = '';
          element.style.pointerEvents = '';
          element.style.userSelect = '';
        }
      });
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      const header = document.querySelector('header');
      const main = document.querySelector('main');
      const footer = document.querySelector('footer');

      [header, main, footer].forEach(element => {
        if (element) {
          element.style.filter = '';
          element.style.pointerEvents = '';
          element.style.userSelect = '';
        }
      });
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
      onClose();
    } catch (error) {
      console.error("Sign in failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error("Sign in failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/75 z-[9999]"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        filter: 'none !important',
        backdropFilter: 'none !important'
      }}
    >
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-md border border-gray-200/60 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          filter: 'none !important',
          backdropFilter: 'none !important'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-light rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-sm text-gray-600">Sign in to continue your research</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Email Sign In Form */}
        <form onSubmit={handleEmailSignIn} className="space-y-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary hover:bg-primary-light disabled:opacity-50 text-white rounded-xl transition-colors font-semibold shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
          </div>
        </div>
        
        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-3 bg-white hover:bg-gray-50 disabled:opacity-50 text-gray-900 border border-gray-300 rounded-xl transition-colors flex items-center justify-center gap-3 font-semibold hover:border-gray-400"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-900 border-t-transparent"></div>
              Connecting...
            </div>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC04" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account? Contact an administrator for access.
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}