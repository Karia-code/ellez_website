// Firebase client initialization (Vite env-aware)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Read from Vite env when provided; fall back to existing values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCYi-6vZqsSsI6X1hhXHcABR--MlD3-mTY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'ellez-site.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'ellez-site',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'ellez-site.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '161384067066',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:161384067066:web:22fd7fa7e6d6dbfa023e43',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-3LRGF5R73H',
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