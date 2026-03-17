import { useState, useEffect } from "react";
import { auth, onAuthStateChanged, signOut, type User } from "@/lib/firebase";

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return { user, loading, logout };
}

export function useUser() {
  const { user, loading } = useFirebaseAuth();
  return { data: user, isLoading: loading };
}

export function useLogout() {
  return () => signOut(auth);
}
