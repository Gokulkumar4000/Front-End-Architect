import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useFirebaseAuth } from "./use-auth";
import {
  getUserLikedPostIds,
  getUserSavedPosts,
  getUserFollowing,
  toggleLikePost,
  toggleSavePost,
  toggleFollowUser,
  updateSavedPostNote,
  deleteSavedPostNote,
  type SavedPostData,
} from "@/lib/firestoreService";
import { saveUserProfile } from "@/lib/firestoreService";

interface UserActivityContextValue {
  likedPostIds: string[];
  savedPosts: SavedPostData[];
  following: string[];
  loading: boolean;
  toggleLike: (postId: string, currentLikes: number) => Promise<void>;
  toggleSave: (postId: string, postData: SavedPostData | null) => Promise<void>;
  toggleFollow: (targetName: string) => Promise<void>;
  updateNote: (postId: string, note: string) => Promise<void>;
  deleteNote: (postId: string) => Promise<void>;
  isLiked: (postId: string) => boolean;
  isSaved: (postId: string) => boolean;
  isFollowing: (name: string) => boolean;
}

const UserActivityContext = createContext<UserActivityContextValue | null>(null);

export function UserActivityProvider({ children }: { children: ReactNode }) {
  const { user } = useFirebaseAuth();
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<SavedPostData[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLikedPostIds([]);
      setSavedPosts([]);
      setFollowing([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      getUserLikedPostIds(user.uid),
      getUserSavedPosts(user.uid),
      getUserFollowing(user.uid),
    ])
      .then(([liked, saved, follows]) => {
        setLikedPostIds(liked);
        setSavedPosts(saved);
        setFollowing(follows);
      })
      .catch(() => {
        setLikedPostIds([]);
        setSavedPosts([]);
        setFollowing([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const toggleLike = useCallback(
    async (postId: string, _currentLikes: number) => {
      if (!user) return;
      const currently = likedPostIds.includes(postId);
      setLikedPostIds((prev) =>
        currently ? prev.filter((id) => id !== postId) : [...prev, postId]
      );
      try {
        await toggleLikePost(user.uid, postId, currently);
      } catch {
        setLikedPostIds((prev) =>
          currently ? [...prev, postId] : prev.filter((id) => id !== postId)
        );
      }
    },
    [user, likedPostIds]
  );

  const toggleSave = useCallback(
    async (postId: string, postData: SavedPostData | null) => {
      if (!user) return;
      const currently = savedPosts.some((p) => p.id === postId);
      setSavedPosts((prev) =>
        currently
          ? prev.filter((p) => p.id !== postId)
          : postData
          ? [...prev, postData]
          : prev
      );
      try {
        await toggleSavePost(user.uid, postId, postData, currently);
      } catch {
        setSavedPosts((prev) =>
          currently
            ? postData
              ? [...prev, postData]
              : prev
            : prev.filter((p) => p.id !== postId)
        );
      }
    },
    [user, savedPosts]
  );

  const toggleFollow = useCallback(
    async (targetName: string) => {
      if (!user) return;
      const currently = following.includes(targetName);
      const newFollowing = currently
        ? following.filter((n) => n !== targetName)
        : [...following, targetName];
      setFollowing(newFollowing);
      window.dispatchEvent(
        new CustomEvent("following-change", { detail: { following: newFollowing } })
      );
      try {
        await toggleFollowUser(user.uid, targetName, currently);
        await saveUserProfile(user.uid, { following: newFollowing });
      } catch {
        setFollowing(following);
        window.dispatchEvent(
          new CustomEvent("following-change", { detail: { following } })
        );
      }
    },
    [user, following]
  );

  const updateNote = useCallback(
    async (postId: string, note: string) => {
      if (!user) return;
      setSavedPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, note } : p))
      );
      await updateSavedPostNote(user.uid, postId, note);
    },
    [user]
  );

  const deleteNote = useCallback(
    async (postId: string) => {
      if (!user) return;
      setSavedPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            const { note, ...rest } = p;
            return rest as SavedPostData;
          }
          return p;
        })
      );
      await deleteSavedPostNote(user.uid, postId);
    },
    [user]
  );

  const isLiked = useCallback(
    (postId: string) => likedPostIds.includes(postId),
    [likedPostIds]
  );

  const isSaved = useCallback(
    (postId: string) => savedPosts.some((p) => p.id === postId),
    [savedPosts]
  );

  const isFollowing = useCallback(
    (name: string) => following.includes(name),
    [following]
  );

  return (
    <UserActivityContext.Provider
      value={{
        likedPostIds,
        savedPosts,
        following,
        loading,
        toggleLike,
        toggleSave,
        toggleFollow,
        updateNote,
        deleteNote,
        isLiked,
        isSaved,
        isFollowing,
      }}
    >
      {children}
    </UserActivityContext.Provider>
  );
}

export function useUserActivity() {
  const ctx = useContext(UserActivityContext);
  if (!ctx) throw new Error("useUserActivity must be used inside UserActivityProvider");
  return ctx;
}
