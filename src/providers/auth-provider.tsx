"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAuth } from "~/hooks/use-auth";
import { AuthErrorBoundary } from "~/components/auth/auth-error-boundary";
import type { AuthUser } from "~/lib/auth/auth-service";

type AuthContextType = ReturnType<typeof useAuth>;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProviderInner({ children }: AuthProviderProps) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <AuthErrorBoundary>
      <AuthProviderInner>
        {children}
      </AuthProviderInner>
    </AuthErrorBoundary>
  );
}