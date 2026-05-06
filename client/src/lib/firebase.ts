import { initializeApp } from "firebase/app";
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
  apiKey: "AIzaSyAV2mGidu4MYrvR1ZrwkVkD1JO0OQ7Sp3M",
  authDomain: "devconnect-9c912.firebaseapp.com",
  projectId: "devconnect-9c912",
  storageBucket: "devconnect-9c912.firebasestorage.app",
  messagingSenderId: "636388114032",
  appId: "1:636388114032:web:b7d8bcff4b143843ee3eb5",
  measurementId: "G-2G55LFRMTE",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

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
