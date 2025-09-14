import { useEffect, useState, useCallback, useRef } from "react";
import { AuthService, type AuthUser } from "~/lib/auth/auth-service";
import { api } from "~/trpc/react";
import { useToast as useToastHook } from "~/hooks/use-toast";

const authService = AuthService.getInstance();

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToastHook();
  const previousUser = useRef<AuthUser | null>(null);

  // TRPC mutations for auth actions
  const createOrUpdateUser = api.user.createOrUpdate.useMutation();
  const updateLastLogin = api.user.updateLastLogin.useMutation();

  // Get database user
  const { data: dbUser, refetch: refetchDbUser } = api.user.getByFirebaseUid.useQuery(
    { firebaseUid: user?.uid ?? "" },
    { enabled: !!user?.uid }
  );

  // Sync user to database
  const syncUser = useCallback(async (authUser: AuthUser) => {
    if (!authUser.email) return;
    
    try {
      await createOrUpdateUser.mutateAsync({
        firebaseUid: authUser.uid,
        email: authUser.email,
        displayName: authUser.displayName ?? undefined,
        photoURL: authUser.photoURL ?? undefined,
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
      const wasSignedOut = previousUser.current && !authUser;
      const wasSignedIn = !previousUser.current && authUser;
      
      setUser(authUser);
      setIsLoading(false);
      
      if (authUser) {
        void syncUser(authUser);
        
        // Show welcome toast on sign in (not on page refresh)
        if (wasSignedIn) {
          const name = authUser.displayName ?? authUser.email?.split('@')[0] ?? 'there';
          toast.success(`Welcome back, ${name}!`);
        }
      } else if (wasSignedOut) {
        // Show logout toast
        toast.info("You've been signed out. See you next time!");
      }
      
      previousUser.current = authUser;
    });

    return unsubscribe;
  }, [syncUser, toast]);

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