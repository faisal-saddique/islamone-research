import { useEffect, useState, useCallback } from "react";
import { AuthService, type AuthUser, type AuthError } from "~/lib/auth/auth-service";
import { api } from "~/trpc/react";

const authService = AuthService.getInstance();

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // TRPC mutations for auth actions
  const createOrUpdateUser = api.user.createOrUpdate.useMutation();
  const updateLastLogin = api.user.updateLastLogin.useMutation();

  // Get database user
  const { data: dbUser, refetch: refetchDbUser } = api.user.getByFirebaseUid.useQuery(
    { firebaseUid: user?.uid! },
    { enabled: !!user?.uid }
  );

  // Sync user to database
  const syncUser = useCallback(async (authUser: AuthUser) => {
    if (!authUser.email) return;
    
    try {
      await createOrUpdateUser.mutateAsync({
        firebaseUid: authUser.uid,
        email: authUser.email,
        displayName: authUser.displayName || undefined,
        photoURL: authUser.photoURL || undefined,
        emailVerified: authUser.emailVerified,
      });
      
      await updateLastLogin.mutateAsync({
        firebaseUid: authUser.uid,
      });
      
      await refetchDbUser();
    } catch (error) {
      console.error("Failed to sync user:", error);
    }
  }, [createOrUpdateUser, updateLastLogin, refetchDbUser]);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthState((authUser) => {
      setUser(authUser);
      setIsLoading(false);
      
      if (authUser) {
        void syncUser(authUser);
      }
    });

    return unsubscribe;
  }, [syncUser]);

  // Auth actions
  const signIn = useCallback(async (email: string, password: string) => {
    return await authService.signIn(email, password);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    return await authService.signUp(email, password);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    return await authService.signInWithGoogle();
  }, []);

  const signOut = useCallback(async () => {
    return await authService.signOut();
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    return await authService.resetPassword(email);
  }, []);

  return {
    user,
    dbUser,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    isSyncing: createOrUpdateUser.isPending || updateLastLogin.isPending,
  };
}