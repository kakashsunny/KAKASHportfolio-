import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfigJson from '../../firebase-applet-config.json';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  firestoreDatabaseId?: string;
}

// Get saved custom config or default to provisioned config
const getActiveConfig = (): FirebaseConfig => {
  try {
    const custom = localStorage.getItem('akash_custom_firebase_config');
    if (custom) {
      return JSON.parse(custom);
    }
  } catch {
    // Ignore parse error
  }
  return firebaseConfigJson as FirebaseConfig;
};

const config = getActiveConfig();

const app = !getApps().length ? initializeApp(config) : getApp();

// Target provisioned Firestore Database ID if specified
export const db = config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
};
