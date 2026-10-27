import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// User-provided Firebase configuration for FitCare
export const firebaseConfig = {
  apiKey: 'AIzaSyCJjA9d3HWQDyhEEVedycMq-rKr2cwzVkk',
  authDomain: 'fitcare-smartgym.firebaseapp.com',
  projectId: 'fitcare-smartgym',
  storageBucket: 'fitcare-smartgym.firebasestorage.app',
  messagingSenderId: '230025913559',
  appId: '1:230025913559:web:90470d93f46f211c3bbc92',
  measurementId: 'G-0XLH7E3FXR',
};

// Authorized Gym Owner portal credentials requirement
export const AUTHORIZED_OWNER_EMAIL = 'varadsutar1703@gmail.com';
export const AUTHORIZED_OWNER_DEFAULT_PASS = '12136';

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Safe Analytics initialization
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Analytics optional
    });
}

/**
 * Validates if an email is the authorized Gym Owner
 */
export function isAuthorizedOwner(email: string): boolean {
  return email.trim().toLowerCase() === AUTHORIZED_OWNER_EMAIL.toLowerCase();
}

/**
 * Authenticates against Firebase Auth with automatic account creation on first login
 */
export async function authenticateFirebaseUser(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: FirebaseUser; error?: string }> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return { success: true, user: cred.user };
  } catch (err: any) {
    const code = err?.code || '';
    // If user does not exist in Firebase Auth yet, try creating it with the specified password
    if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
      try {
        const newCred = await createUserWithEmailAndPassword(auth, email, pass);
        return { success: true, user: newCred.user };
      } catch (createErr: any) {
        // If creating also failed (e.g., email-already-in-use with wrong pass)
        return { success: false, error: createErr?.message || 'Authentication error' };
      }
    }
    return { success: false, error: err?.message || 'Firebase sign-in failed' };
  }
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fbSignOut,
  onAuthStateChanged,
};
