"use client";

import { useState } from "react";
import { useAuthContext } from "~/providers/auth-provider";

export function AuthStatus() {
  const { 
    user, 
    dbUser, 
    isLoading,
    signIn,
    signInWithGoogle,
    signOut,
    isSyncing
  } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  if (isLoading) {
    return (
      <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-300">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
          <span className="text-neutral-800">Loading...</span>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-300">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {user.photoURL && (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <div className="font-medium text-neutral-800">
                  {user.displayName ?? user.email}
                  {isSyncing && (
                    <span className="ml-2 inline-flex items-center">
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-primary"></div>
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-500">{user.email}</p>
              </div>
            </div>
            
            {dbUser && (
              <div className="text-xs text-neutral-500 space-y-1">
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded text-xs text-neutral-50 ${
                    dbUser.role === 'ADMIN' ? 'bg-error' :
                    dbUser.role === 'MODERATOR' ? 'bg-warning' :
                    'bg-success'
                  }`}>
                    {dbUser.role}
                  </span>
                  
                  {user.emailVerified ? (
                    <span className="flex items-center text-success">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      Verified
                    </span>
                  ) : (
                    <span className="flex items-center text-warning">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                      Unverified
                    </span>
                  )}
                </div>
                
                <p>Last login: {dbUser.lastLoginAt ? new Date(dbUser.lastLoginAt).toLocaleDateString() : 'Never'}</p>
                {dbUser.progress && (
                  <p>Reviews: {dbUser.progress.totalReviews} | Streak: {dbUser.progress.currentStreak}</p>
                )}
              </div>
            )}
          </div>
          
          <button
            onClick={() => signOut()}
            disabled={isAuthLoading}
            className="px-4 py-2 bg-error hover:bg-error/90 disabled:opacity-50 text-neutral-50 rounded transition-colors flex items-center gap-2"
          >
            {isAuthLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-neutral-50"></div>
                Signing out...
              </>
            ) : (
              'Logout'
            )}
          </button>
        </div>
      </div>
    );
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError("");
    try {
      await signIn(email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Failed to sign in");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsAuthLoading(true);
    setAuthError("");
    try {
      await signInWithGoogle();
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Failed to sign in with Google");
    } finally {
      setIsAuthLoading(false);
    }
  };

  return (
    <div className="bg-neutral-50 rounded-lg p-4 w-full max-w-md border border-neutral-300">
      <h2 className="text-xl font-semibold text-neutral-800 mb-4">Sign In</h2>
      
      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded text-neutral-800 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary"
            required
            disabled={isAuthLoading}
          />
        </div>
        
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded text-neutral-800 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary"
            required
            disabled={isAuthLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-neutral-500 hover:text-neutral-800"
            disabled={isAuthLoading}
          >
            {showPassword ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        {authError && (
          <div className="text-error text-sm p-3 bg-error/10 rounded border border-error/30">
            {authError}
          </div>
        )}

        <div className="space-y-2">
          <button
            type="submit"
            disabled={isAuthLoading}
            className="w-full py-2 bg-primary hover:bg-primary-light disabled:opacity-50 text-neutral-50 rounded transition-colors flex items-center justify-center gap-2"
          >
            {isAuthLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-neutral-50"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-neutral-50 text-neutral-500">Or</span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isAuthLoading}
            className="w-full py-2 bg-primary hover:bg-primary-light disabled:opacity-50 text-neutral-50 rounded transition-colors flex items-center justify-center gap-2"
          >
            {isAuthLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-neutral-50"></div>
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}