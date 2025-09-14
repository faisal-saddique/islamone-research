import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  getIdToken,
} from "firebase/auth";
import { auth } from "~/lib/firebase";

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  token?: string;
};

export type AuthError = {
  code: string;
  message: string;
};

export class AuthService {
  private static instance: AuthService;
  private authStateListeners = new Set<(user: AuthUser | null) => void>();

  private constructor() {
    this.initializeAuthListener();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private initializeAuthListener() {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Handle token asynchronously
        void getIdToken(firebaseUser)
          .then((token) => {
            const authUser: AuthUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              emailVerified: firebaseUser.emailVerified,
              token,
            };
            this.notifyListeners(authUser);
          })
          .catch((error) => {
            console.error("Failed to get ID token:", error);
            const authUser: AuthUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              emailVerified: firebaseUser.emailVerified,
            };
            this.notifyListeners(authUser);
          });
      } else {
        this.notifyListeners(null);
      }
    });
  }

  private notifyListeners(user: AuthUser | null) {
    this.authStateListeners.forEach(listener => listener(user));
  }

  subscribeToAuthState(listener: (user: AuthUser | null) => void): () => void {
    this.authStateListeners.add(listener);
    return () => this.authStateListeners.delete(listener);
  }

  async signIn(email: string, password: string): Promise<AuthUser> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await getIdToken(result.user);
      return {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        emailVerified: result.user.emailVerified,
        token,
      };
    } catch (error: unknown) {
      throw this.handleAuthError(error);
    }
  }

  async signUp(email: string, password: string): Promise<AuthUser> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const token = await getIdToken(result.user);
      return {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        emailVerified: result.user.emailVerified,
        token,
      };
    } catch (error: unknown) {
      throw this.handleAuthError(error);
    }
  }

  async signInWithGoogle(): Promise<AuthUser> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await getIdToken(result.user);
      return {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        emailVerified: result.user.emailVerified,
        token,
      };
    } catch (error: unknown) {
      throw this.handleAuthError(error);
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: unknown) {
      throw this.handleAuthError(error);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: unknown) {
      throw this.handleAuthError(error);
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      if (auth.currentUser) {
        return await getIdToken(auth.currentUser, true);
      }
      return null;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  }

  getCurrentUser(): AuthUser | null {
    if (!auth.currentUser) return null;
    
    return {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      displayName: auth.currentUser.displayName,
      photoURL: auth.currentUser.photoURL,
      emailVerified: auth.currentUser.emailVerified,
    };
  }

  private handleAuthError(error: unknown): Error {
    const firebaseError = error as { code?: string; message?: string };
    const code = firebaseError.code ?? 'unknown';
    const message = this.getReadableErrorMessage(code) ?? firebaseError.message ?? 'An unknown error occurred';
    
    const authError = new Error(message);
    (authError as Error & { code: string }).code = code;
    return authError;
  }

  private getReadableErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'An account already exists with this email address.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/popup-closed-by-user': 'Sign-in was cancelled.',
      'auth/popup-blocked': 'Sign-in popup was blocked by your browser.',
      'auth/invalid-credential': 'Invalid email or password.',
    };
    
    return errorMessages[errorCode] ?? 'An error occurred during authentication.';
  }
}