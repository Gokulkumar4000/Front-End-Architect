import {
  db,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  deleteField,
  query,
  orderBy,
  where,
  writeBatch,
} from "./firebase";

// ─── User Profile ────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  role: string;
  profileImage?: string;
  location?: string;
  timezone?: string;
  bio?: string;
  tagline?: string;
  skills?: string[];
  interests?: string[];
  problemDomains?: string[];
  currentProject?: string;
  focus?: string;
  teamSize?: string;
  experience?: string;
  workPref?: string;
  availability?: string;
  equityInterest?: string;
  investorCat?: string;
  investmentStage?: string[];
  isOrg?: string;
  orgName?: string;
  orgRole?: string;
  orgType?: string;
  objectives?: string;
  successDefinition?: string;
  githubLink?: string;
  portfolioLink?: string;
  resumeLink?: string;
  annualSalary?: string;
  status?: string;
  prevIdeas?: string;
  involvement?: string;
  likedPostIds?: string[];
  savedPostIds?: string[];
  following?: string[];
  createdAt?: any;
}

export async function saveUserProfile(uid: string, profileData: Partial<UserProfile>) {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { ...profileData, uid, createdAt: serverTimestamp() }, { merge: true });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }
  return null;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, data as any);
}

// ─── Posts ───────────────────────────────────────────────────────────────────

export interface FirestoreComment {
  id: string;
  author: { name: string; avatar: string; role: string; uid?: string };
  content: string;
  timestamp: string;
  likes: number;
  replies?: FirestoreComment[];
}

export interface FirestorePost {
  id: string;
  type: "idea" | "project" | "fund" | "recruitment";
  author: { name: string; avatar: string; role: string; uid?: string };
  title: string;
  content: string;
  timestamp: string;
  stats: { likes: number; comments: number };
  domains: string[];
  comments?: FirestoreComment[];
  createdAt?: any;
  authorUid?: string;
}

export async function getPosts(): Promise<FirestorePost[]> {
  const postsCol = collection(db, "posts");
  const q = query(postsCol, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestorePost));
}

export async function createPost(
  uid: string,
  postData: Omit<FirestorePost, "id" | "createdAt">
): Promise<FirestorePost> {
  const postsCol = collection(db, "posts");
  const ref = await addDoc(postsCol, {
    ...postData,
    authorUid: uid,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, ...postData };
}

export async function seedMockPostsIfEmpty() {
  const postsCol = collection(db, "posts");
  const existing = await getDocs(postsCol);
  if (!existing.empty) return;

  const mockPosts = [
    {
      type: "idea",
      author: { name: "Alice Visionary", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", role: "Idea Holder" },
      title: "AI-Powered Sustainable Farming",
      content: "We are developing a revolutionary automated sensor network for small-scale urban farmers. Our system uses advanced IoT devices and machine learning to monitor soil health, predict crop diseases before they manifest, and optimize water usage by up to 60%. This solution empowers local growers to increase yields while reducing their environmental footprint through data-driven precision agriculture techniques.",
      timestamp: "2h ago",
      stats: { likes: 124, comments: 2 },
      domains: ["AI/ML", "Agriculture"],
    },
    {
      type: "project",
      author: { name: "Bob Builder", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob", role: "Developer" },
      title: "Open Source CRM for Non-Profits",
      content: "Our team has just reached a major milestone in the DevConnect UI library project. We've successfully integrated accessible, high-performance components that enable non-profit organizations to manage donor relationships effectively. Unlike commercial CRM solutions, our open-source platform focuses on simplicity and core functionality, allowing organizations to devote more resources to their mission while benefiting from automated reporting features.",
      timestamp: "4h ago",
      stats: { likes: 85, comments: 0 },
      domains: ["Web3", "Open Source"],
    },
    {
      type: "fund",
      author: { name: "Charlie Capital", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie", role: "Investor" },
      title: "Seed Fund for GreenTech",
      content: "We are officially opening applications for our early-stage CleanTech Seed Fund. We are looking for visionary founders working on carbon capture, renewable energy storage, and circular economy solutions. Our fund provides capital, strategic mentorship, and access to a global network of industry experts. We believe the next decade's most successful companies will solve the most pressing environmental challenges.",
      timestamp: "6h ago",
      stats: { likes: 210, comments: 45 },
      domains: ["FinTech", "Sustainability"],
    },
    {
      type: "recruitment",
      author: { name: "Diana Dev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana", role: "Developer" },
      title: "Looking for a React Native Developer",
      content: "We are building a cross-platform mobile app for real-time team collaboration and need an experienced React Native developer to join us. The ideal candidate has 2+ years of experience with React Native, strong TypeScript skills, and familiarity with Firebase. This is a fully remote, equity-based role with potential for a full-time position once we close our seed round.",
      timestamp: "8h ago",
      stats: { likes: 56, comments: 12 },
      domains: ["Mobile", "React Native"],
    },
    {
      type: "idea",
      author: { name: "Eve Entrepreneur", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eve", role: "Idea Holder" },
      title: "Decentralized Freelance Marketplace",
      content: "A blockchain-based freelance platform where payments are handled by smart contracts, removing the need for intermediaries. Freelancers get paid instantly upon milestone completion, and clients enjoy full transparency into the work being done. Our goal is to reduce the 20% fee typically charged by existing platforms down to under 2%, passing the savings directly to the creators.",
      timestamp: "12h ago",
      stats: { likes: 178, comments: 33 },
      domains: ["Web3", "FinTech"],
    },
  ];

  for (const post of mockPosts) {
    await addDoc(postsCol, { ...post, createdAt: serverTimestamp() });
  }
}

// ─── Likes ───────────────────────────────────────────────────────────────────

export async function toggleLikePost(
  uid: string,
  postId: string,
  currentlyLiked: boolean
): Promise<void> {
  const userRef = doc(db, "users", uid);
  const postRef = doc(db, "posts", postId);

  if (currentlyLiked) {
    await updateDoc(userRef, { likedPostIds: arrayRemove(postId) });
    await updateDoc(postRef, { "stats.likes": increment(-1) });
  } else {
    await updateDoc(userRef, { likedPostIds: arrayUnion(postId) });
    await updateDoc(postRef, { "stats.likes": increment(1) });
  }
}

export async function getUserLikedPostIds(uid: string): Promise<string[]> {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return (snap.data().likedPostIds as string[]) || [];
  }
  return [];
}

// ─── Saves ───────────────────────────────────────────────────────────────────

export interface SavedPostData {
  id: string;
  type: "idea" | "project" | "funding" | "recruitment";
  title: string;
  description: string;
  author: { name: string; avatar?: string };
  domains: string[];
  likes: number;
  note?: string;
  savedAt?: any;
}

export async function toggleSavePost(
  uid: string,
  postId: string,
  postData: SavedPostData | null,
  currentlySaved: boolean
): Promise<void> {
  const userRef = doc(db, "users", uid);
  const savedPostRef = doc(db, "users", uid, "savedPosts", postId);

  if (currentlySaved) {
    await updateDoc(userRef, { savedPostIds: arrayRemove(postId) });
    const batch = writeBatch(db);
    batch.delete(savedPostRef);
    await batch.commit();
  } else if (postData) {
    await updateDoc(userRef, { savedPostIds: arrayUnion(postId) });
    await setDoc(savedPostRef, {
      ...postData,
      savedAt: serverTimestamp(),
    });
  }
}

export async function getUserSavedPosts(uid: string): Promise<SavedPostData[]> {
  const savedPostsCol = collection(db, "users", uid, "savedPosts");
  const snap = await getDocs(savedPostsCol);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SavedPostData));
}

export async function updateSavedPostNote(
  uid: string,
  postId: string,
  note: string
): Promise<void> {
  const savedPostRef = doc(db, "users", uid, "savedPosts", postId);
  await updateDoc(savedPostRef, { note });
}

export async function deleteSavedPostNote(
  uid: string,
  postId: string
): Promise<void> {
  const savedPostRef = doc(db, "users", uid, "savedPosts", postId);
  await updateDoc(savedPostRef, { note: deleteField() });
}

// ─── Following ───────────────────────────────────────────────────────────────

export async function toggleFollowUser(
  uid: string,
  targetName: string,
  currentlyFollowing: boolean
): Promise<void> {
  const userRef = doc(db, "users", uid);
  if (currentlyFollowing) {
    await updateDoc(userRef, { following: arrayRemove(targetName) });
  } else {
    await updateDoc(userRef, { following: arrayUnion(targetName) });
  }
}

export async function getUserFollowing(uid: string): Promise<string[]> {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return (snap.data().following as string[]) || [];
  }
  return [];
}

// ─── Comments ────────────────────────────────────────────────────────────────

export async function getPostComments(postId: string): Promise<FirestoreComment[]> {
  const commentsCol = collection(db, "posts", postId, "comments");
  const q = query(commentsCol, orderBy("createdAt", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreComment));
}

export async function addPostComment(
  postId: string,
  comment: Omit<FirestoreComment, "id">
): Promise<FirestoreComment> {
  const commentsCol = collection(db, "posts", postId, "comments");
  const ref = await addDoc(commentsCol, {
    ...comment,
    createdAt: serverTimestamp(),
  });
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, { "stats.comments": increment(1) });
  return { id: ref.id, ...comment };
}

export async function addReplyToComment(
  postId: string,
  commentId: string,
  reply: FirestoreComment
): Promise<void> {
  const commentRef = doc(db, "posts", postId, "comments", commentId);
  const snap = await getDoc(commentRef);
  if (snap.exists()) {
    const existing = (snap.data().replies as FirestoreComment[]) || [];
    await updateDoc(commentRef, { replies: [...existing, reply] });
  }
}
