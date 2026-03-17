import { useState, useEffect } from "react";
import { useFirebaseAuth } from "./use-auth";
import { getUserProfile, type UserProfile } from "@/lib/firestoreService";

export function useUserProfile() {
  const { user, loading: authLoading } = useFirebaseAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    getUserProfile(user.uid).then((data) => {
      setProfile(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user, authLoading]);

  return { profile, loading, user };
}
