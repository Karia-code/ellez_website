// Firebase client initialization (Vite env-aware)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Read from Vite env when provided; fall back to existing values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBH-fFCxGVXIKN0QB1FPHwyUKYQrbDt4qA',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'ellez-site.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'ellez-site',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'ellez-site.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '161384067066',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:161384067066:web:b072e1e473bdd469023e43',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-YMHLWEP3H6',
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export auth and firestore for app usage (admin panel, public updates)
export const auth = getAuth(app);
export const db = getFirestore(app);

// Optional: initialize analytics only in browser environments
export const analytics = typeof window !== 'undefined' && firebaseConfig.measurementId
  ? getAnalytics(app)
  : undefined;

export default app;