"use client";

import { useAuthContext } from "~/providers/auth-provider";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireEmailVerification?: boolean;
  requiredRoles?: string[];
  loadingComponent?: ReactNode;
}

export function ProtectedRoute({ 
  children, 
  fallback,
  requireEmailVerification = false,
  requiredRoles = [],
  loadingComponent
}: ProtectedRouteProps) {
  const { user, dbUser, isLoading } = useAuthContext();

  // Show loading state
  if (isLoading) {
    return loadingComponent ?? (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-800">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return fallback ?? (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 max-w-md mx-4">
          <div className="text-center">
            <div className="mb-4">
              <svg 
                className="mx-auto h-12 w-12 text-primary" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-neutral-800">Authentication Required</h2>
            <p className="text-neutral-500 mb-4">
              Please sign in to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check email verification requirement
  if (requireEmailVerification && !user.emailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 max-w-md mx-4">
          <div className="text-center">
            <div className="mb-4">
              <svg 
                className="mx-auto h-12 w-12 text-warning" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-neutral-800">Email Verification Required</h2>
            <p className="text-neutral-500 mb-4">
              Please verify your email address to continue.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check role requirements
  if (requiredRoles.length > 0 && dbUser) {
    const hasRequiredRole = requiredRoles.includes(dbUser.role);
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-100">
          <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300 max-w-md mx-4">
            <div className="text-center">
              <div className="mb-4">
                <svg 
                  className="mx-auto h-12 w-12 text-error" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" 
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-neutral-800">Access Denied</h2>
              <p className="text-neutral-500 mb-4">
                You don&apos;t have permission to access this page.
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}