// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBBf6RFIp99wYASqf4askrAgjGr7Dq8aUc",
  authDomain: "angelic-base-gc70r.firebaseapp.com",
  projectId: "angelic-base-gc70r",
  storageBucket: "angelic-base-gc70r.firebasestorage.app",
  messagingSenderId: "16201258120",
  appId: "1:16201258120:web:5d0345e02c72632500bb3d"
};

// Initialize Firebase (singleton pattern to prevent duplicate initialization)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Designated Gym Owner Credentials
// STRICT SECURITY REQUIREMENT: No other email can open or access the Gym Owner role.
export const DESIGNATED_OWNER = {
  email: "varadsutar1703@gmail.com",
  password: "gym@12136",
  name: "Varad Sutar",
  role: "owner" as const,
};

export const isAuthorizedOwnerEmail = (email: string | undefined | null): boolean => {
  if (!email) return false;
  return email.trim().toLowerCase() === DESIGNATED_OWNER.email.toLowerCase();
};
