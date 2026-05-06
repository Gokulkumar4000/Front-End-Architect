let firebaseApp: any = null;
let firebaseAuth: any = null;
let firebaseDb: any = null;

try {
  const { initializeApp } = await import("firebase/app");
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  arrayUnion,
  arrayRemove,
  increment,
  deleteField,
  writeBatch,
  where,
  onSnapshot,
  limit,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

  const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } = await import("firebase/auth");
  const { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs, addDoc, query, orderBy, serverTimestamp, Timestamp, arrayUnion, arrayRemove, increment, deleteField, writeBatch, where, onSnapshot, limit } = await import("firebase/firestore");
  firebaseApp = initializeApp(firebaseConfig);
  firebaseAuth = getAuth(firebaseApp);
  firebaseDb = getFirestore(firebaseApp);

  export const auth = firebaseAuth;
  export const db = firebaseDb;
  export {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    type User,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    collection,
    getDocs,
    addDoc,
    query,
    orderBy,
    serverTimestamp,
    Timestamp,
    arrayUnion,
    arrayRemove,
    increment,
    deleteField,
    writeBatch,
    where,
    onSnapshot,
    limit,
  };
} catch {
  export const auth = null;
  export const db = null;
  export type User = any;
}
