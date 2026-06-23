import { initializeApp } from 'firebase/app';
import { getAuth, getRedirectResult, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signInWithRedirect } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey
  && firebaseConfig.authDomain
  && firebaseConfig.projectId
  && firebaseConfig.appId
);

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function signInWithGoogle() {
  if (!auth) {
    throw new Error('Firebase is not configured yet.');
  }

  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();

  return {
    idToken,
    user: result.user,
  };
}

export async function signInWithGoogleRedirect() {
  if (!auth) {
    throw new Error('Firebase is not configured yet.');
  }

  await signInWithRedirect(auth, googleProvider);
}

export async function getGoogleRedirectLoginResult() {
  if (!auth) {
    throw new Error('Firebase is not configured yet.');
  }

  const result = await getRedirectResult(auth);
  if (!result?.user) return null;

  const idToken = await result.user.getIdToken();

  return {
    idToken,
    user: result.user,
  };
}

export function waitForFirebaseUser(timeoutMs = 3500) {
  if (!auth) {
    return Promise.reject(new Error('Firebase is not configured yet.'));
  }

  return new Promise(resolve => {
    const timeout = window.setTimeout(() => {
      unsubscribe();
      resolve(null);
    }, timeoutMs);

    const unsubscribe = onAuthStateChanged(auth, async user => {
      window.clearTimeout(timeout);
      unsubscribe();

      if (!user) {
        resolve(null);
        return;
      }

      const idToken = await user.getIdToken();
      resolve({ idToken, user });
    });
  });
}
