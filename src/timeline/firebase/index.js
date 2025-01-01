import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup as signIn,
  getRedirectResult as _getRedirectResult,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const index = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID, // Optional for Analytics
};
const app = initializeApp(index);

const storage = getStorage(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithPopup = () => signIn(auth, provider);
export const signInWithRedirect = () => signIn(auth, provider);
export const signOut = () => auth.signOut();
export const getRedirectResult = () => _getRedirectResult(auth);

export const onAuthStateChanged = (callback) =>
  auth.onAuthStateChanged(callback);
export { app, storage, auth, provider };
