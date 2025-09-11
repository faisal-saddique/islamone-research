"use client";

import { useAuthContext } from "~/providers/auth-provider";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return fallback ?? (
      <div className="flex items-center justify-center min-h-screen bg-neutral-100">
        <div className="text-center bg-neutral-50 p-6 rounded-lg border border-neutral-300">
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">Please sign in</h2>
          <p className="text-neutral-500">You need to be authenticated to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}