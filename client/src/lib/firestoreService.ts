import {
  db,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  deleteField,
  query,
  orderBy,
  where,
  increment,
  onSnapshot,
  writeBatch,
} from "./firebase";

// ─── Type → Collection Mapping ───────────────────────────────────────────────

export type PostType = "idea" | "project" | "fund" | "recruitment";

export function typeToCollection(type: PostType | string): string {
  const map: Record<string, string> = {
    idea: "ideas",
    project: "projects",
    fund: "funds",
    recruitment: "recruitment",
  };
  return map[type] || "ideas";
}

export function collectionToType(col: string): PostType {
  const map: Record<string, PostType> = {
    ideas: "idea",
    projects: "project",
    funds: "fund",
    recruitment: "recruitment",
  };
  return map[col] || "idea";
}

// ─── User Profile ─────────────────────────────────────────────────────────────

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
  createdAt?: any;
}

export async function saveUserProfile(uid: string, profileData: Partial<UserProfile>) {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { ...profileData, uid, createdAt: serverTimestamp() }, { merge: true });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) return snap.data() as UserProfile;
  return null;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, data as any);
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const usersCol = collection(db, "users");
  const snap = await getDocs(usersCol);
  return snap.docs.map((d) => d.data() as UserProfile);
}

// ─── Posts ────────────────────────────────────────────────────────────────────

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
  type: PostType;
  collectionName: string;
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

async function fetchFromCollection(colName: string): Promise<FirestorePost[]> {
  try {
    const col = collection(db, colName);
    const q = query(col, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      collectionName: colName,
      ...d.data(),
    } as FirestorePost));
  } catch {
    return [];
  }
}

export async function getPosts(): Promise<FirestorePost[]> {
  const [ideas, projects, funds, recruitment] = await Promise.all([
    fetchFromCollection("ideas"),
    fetchFromCollection("projects"),
    fetchFromCollection("funds"),
    fetchFromCollection("recruitment"),
  ]);
  return [...ideas, ...projects, ...funds, ...recruitment].sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() ?? 0;
    const bTime = b.createdAt?.toMillis?.() ?? 0;
    return bTime - aTime;
  });
}

export async function getPostsByType(type: PostType | string): Promise<FirestorePost[]> {
  return fetchFromCollection(typeToCollection(type));
}

export async function getUserPosts(uid: string, type?: PostType | string): Promise<FirestorePost[]> {
  const colNames = type
    ? [typeToCollection(type)]
    : ["ideas", "projects", "funds", "recruitment"];
  const results = await Promise.all(
    colNames.map(async (colName) => {
      try {
        const col = collection(db, colName);
        const q = query(col, where("authorUid", "==", uid), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        return snap.docs.map((d) => ({
          id: d.id,
          collectionName: colName,
          ...d.data(),
        } as FirestorePost));
      } catch {
        return [] as FirestorePost[];
      }
    })
  );
  return results.flat().sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() ?? 0;
    const bTime = b.createdAt?.toMillis?.() ?? 0;
    return bTime - aTime;
  });
}

export async function createPost(
  uid: string,
  postData: Omit<FirestorePost, "id" | "createdAt" | "collectionName">
): Promise<FirestorePost> {
  const colName = typeToCollection(postData.type);
  const col = collection(db, colName);
  const ref = await addDoc(col, {
    ...postData,
    authorUid: uid,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, collectionName: colName, ...postData };
}

export async function seedMockPostsIfEmpty() {
  const ideasCol = collection(db, "ideas");
  const existing = await getDocs(ideasCol);
  if (!existing.empty) return;

  const mockPosts = [
    {
      type: "idea" as PostType,
      author: { name: "Alice Visionary", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", role: "Idea Holder" },
      title: "AI-Powered Sustainable Farming",
      content: "We are developing a revolutionary automated sensor network for small-scale urban farmers. Our system uses advanced IoT devices and machine learning to monitor soil health, predict crop diseases before they manifest, and optimize water usage by up to 60%. This solution empowers local growers to increase yields while reducing their environmental footprint through data-driven precision agriculture techniques.",
      timestamp: "2h ago",
      stats: { likes: 124, comments: 2 },
      domains: ["AI/ML", "Agriculture"],
    },
    {
      type: "project" as PostType,
      author: { name: "Bob Builder", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob", role: "Developer" },
      title: "Open Source CRM for Non-Profits",
      content: "Our team has just reached a major milestone in the DevConnect UI library project. We've successfully integrated accessible, high-performance components that enable non-profit organizations to manage donor relationships effectively. Unlike commercial CRM solutions, our open-source platform focuses on simplicity and core functionality.",
      timestamp: "4h ago",
      stats: { likes: 85, comments: 0 },
      domains: ["Web3", "Open Source"],
    },
    {
      type: "fund" as PostType,
      author: { name: "Charlie Capital", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie", role: "Investor" },
      title: "Seed Fund for GreenTech",
      content: "We are officially opening applications for our early-stage CleanTech Seed Fund. We are looking for visionary founders working on carbon capture, renewable energy storage, and circular economy solutions. Our fund provides capital, strategic mentorship, and access to a global network of industry experts.",
      timestamp: "6h ago",
      stats: { likes: 210, comments: 45 },
      domains: ["FinTech", "Sustainability"],
    },
    {
      type: "recruitment" as PostType,
      author: { name: "Diana Dev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana", role: "Developer" },
      title: "Looking for a React Native Developer",
      content: "We are building a cross-platform mobile app for real-time team collaboration and need an experienced React Native developer to join us. The ideal candidate has 2+ years of experience with React Native, strong TypeScript skills, and familiarity with Firebase. This is a fully remote, equity-based role.",
      timestamp: "8h ago",
      stats: { likes: 56, comments: 12 },
      domains: ["Mobile", "React Native"],
    },
    {
      type: "idea" as PostType,
      author: { name: "Eve Entrepreneur", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eve", role: "Idea Holder" },
      title: "Decentralized Freelance Marketplace",
      content: "A blockchain-based freelance platform where payments are handled by smart contracts, removing the need for intermediaries. Freelancers get paid instantly upon milestone completion, and clients enjoy full transparency into the work being done. Our goal is to reduce the 20% fee charged by existing platforms down to under 2%.",
      timestamp: "12h ago",
      stats: { likes: 178, comments: 33 },
      domains: ["Web3", "FinTech"],
    },
    {
      type: "fund" as PostType,
      author: { name: "Fiona Funds", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fiona", role: "Investor" },
      title: "HealthTech Innovation Fund 2026",
      content: "Our HealthTech fund is seeking startups building next-generation digital health tools—remote patient monitoring, AI diagnostics, mental wellness platforms, and more. We write checks from $250K to $2M and provide active operational support alongside capital.",
      timestamp: "1d ago",
      stats: { likes: 143, comments: 18 },
      domains: ["HealthTech", "AI/ML"],
    },
    {
      type: "project" as PostType,
      author: { name: "Greg Gig", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Greg", role: "Developer" },
      title: "Real-Time Collaborative Code Editor",
      content: "Building a VS Code-like browser IDE supporting real-time multi-user collaboration, integrated AI code suggestions, and one-click deployment pipelines. We're using WebRTC for peer connections and CRDT for conflict-free document merging.",
      timestamp: "2d ago",
      stats: { likes: 92, comments: 7 },
      domains: ["DevTools", "Web3"],
    },
    {
      type: "recruitment" as PostType,
      author: { name: "Hana HR", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hana", role: "Idea Holder" },
      title: "Co-Founder & CTO Wanted",
      content: "We're a pre-seed EdTech startup looking for a technical co-founder with deep expertise in cloud infrastructure and AI. If you're passionate about reshaping how people learn technical skills, this is your chance to shape the product from day one and own meaningful equity.",
      timestamp: "3d ago",
      stats: { likes: 74, comments: 9 },
      domains: ["EdTech", "AI/ML"],
    },
  ];

  for (const post of mockPosts) {
    const colName = typeToCollection(post.type);
    await addDoc(collection(db, colName), { ...post, createdAt: serverTimestamp() });
  }
}

// ─── Likes (userActivity subcollection) ──────────────────────────────────────

export async function toggleLikePost(
  uid: string,
  postId: string,
  collectionName: string,
  currentlyLiked: boolean
): Promise<void> {
  const likeRef = doc(db, "userActivity", uid, "likes", postId);
  const postRef = doc(db, collectionName, postId);
  if (currentlyLiked) {
    await deleteDoc(likeRef);
    await updateDoc(postRef, { "stats.likes": increment(-1) });
  } else {
    await setDoc(likeRef, { postId, collectionName, likedAt: serverTimestamp() });
    await updateDoc(postRef, { "stats.likes": increment(1) });
  }
}

export async function getUserLikedPostIds(uid: string): Promise<string[]> {
  try {
    const likesCol = collection(db, "userActivity", uid, "likes");
    const snap = await getDocs(likesCol);
    return snap.docs.map((d) => d.id);
  } catch {
    return [];
  }
}

// ─── Saves (userActivity subcollection) ───────────────────────────────────────

export interface SavedPostData {
  id: string;
  type: PostType | string;
  collectionName?: string;
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
  const saveRef = doc(db, "userActivity", uid, "saves", postId);
  if (currentlySaved) {
    await deleteDoc(saveRef);
  } else if (postData) {
    await setDoc(saveRef, { ...postData, savedAt: serverTimestamp() });
  }
}

export async function getUserSavedPosts(uid: string): Promise<SavedPostData[]> {
  try {
    const savesCol = collection(db, "userActivity", uid, "saves");
    const snap = await getDocs(savesCol);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SavedPostData));
  } catch {
    return [];
  }
}

export async function updateSavedPostNote(
  uid: string,
  postId: string,
  note: string
): Promise<void> {
  const saveRef = doc(db, "userActivity", uid, "saves", postId);
  await updateDoc(saveRef, { note });
}

export async function deleteSavedPostNote(uid: string, postId: string): Promise<void> {
  const saveRef = doc(db, "userActivity", uid, "saves", postId);
  await updateDoc(saveRef, { note: deleteField() });
}

// ─── Following (userActivity subcollection) ───────────────────────────────────

function encodeFollowKey(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 100);
}

export async function toggleFollowUser(
  uid: string,
  targetName: string,
  currentlyFollowing: boolean
): Promise<void> {
  const followRef = doc(db, "userActivity", uid, "following", encodeFollowKey(targetName));
  if (currentlyFollowing) {
    await deleteDoc(followRef);
  } else {
    await setDoc(followRef, { name: targetName, followedAt: serverTimestamp() });
  }
}

export async function getUserFollowing(uid: string): Promise<string[]> {
  try {
    const followingCol = collection(db, "userActivity", uid, "following");
    const snap = await getDocs(followingCol);
    return snap.docs.map((d) => (d.data().name as string) || d.id);
  } catch {
    return [];
  }
}

// ─── Comments (per typed collection) ─────────────────────────────────────────

export async function getPostComments(
  collectionName: string,
  postId: string
): Promise<FirestoreComment[]> {
  try {
    const commentsCol = collection(db, collectionName, postId, "comments");
    const q = query(commentsCol, orderBy("createdAt", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreComment));
  } catch {
    return [];
  }
}

export async function addPostComment(
  collectionName: string,
  postId: string,
  comment: Omit<FirestoreComment, "id">
): Promise<FirestoreComment> {
  const commentsCol = collection(db, collectionName, postId, "comments");
  const ref = await addDoc(commentsCol, { ...comment, createdAt: serverTimestamp() });
  const postRef = doc(db, collectionName, postId);
  await updateDoc(postRef, { "stats.comments": increment(1) });
  return { id: ref.id, ...comment };
}

export async function addReplyToComment(
  collectionName: string,
  postId: string,
  commentId: string,
  reply: FirestoreComment
): Promise<void> {
  const commentRef = doc(db, collectionName, postId, "comments", commentId);
  const snap = await getDoc(commentRef);
  if (snap.exists()) {
    const existing = (snap.data().replies as FirestoreComment[]) || [];
    await updateDoc(commentRef, { replies: [...existing, reply] });
  }
}

// ─── Chat ─────────────────────────────────────────────────────────────────────
// Structure: chats/{chatId}  →  chats/{chatId}/messages/{msgId}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  image?: string;
  timestamp: any;
  status: "sent" | "delivered" | "read";
  replyTo?: { id: string; senderId: string; text: string };
}

export interface ChatRoom {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  participantAvatars: Record<string, string>;
  participantRoles: Record<string, string>;
  lastMessage: string;
  lastMessageAt: any;
  context?: { type: string; title: string };
  unreadCounts: Record<string, number>;
}

export function subscribeToUserChats(
  uid: string,
  callback: (chats: ChatRoom[]) => void
): () => void {
  const chatsCol = collection(db, "chats");
  const q = query(chatsCol, where("participants", "array-contains", uid), orderBy("lastMessageAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChatRoom)));
  });
}

export function subscribeToMessages(
  chatId: string,
  callback: (msgs: ChatMessage[]) => void
): () => void {
  const msgsCol = collection(db, "chats", chatId, "messages");
  const q = query(msgsCol, orderBy("timestamp", "asc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChatMessage)));
  });
}

export async function getOrCreateChat(
  myUid: string,
  myName: string,
  myAvatar: string,
  myRole: string,
  otherUid: string,
  otherName: string,
  otherAvatar: string,
  otherRole: string,
  context?: { type: string; title: string }
): Promise<string> {
  const chatsCol = collection(db, "chats");
  const q = query(chatsCol, where("participants", "array-contains", myUid));
  const snap = await getDocs(q);
  const existing = snap.docs.find((d) => {
    const p = d.data().participants as string[];
    return p.includes(otherUid);
  });
  if (existing) return existing.id;

  const ref = await addDoc(chatsCol, {
    participants: [myUid, otherUid],
    participantNames: { [myUid]: myName, [otherUid]: otherName },
    participantAvatars: { [myUid]: myAvatar, [otherUid]: otherAvatar },
    participantRoles: { [myUid]: myRole, [otherUid]: otherRole },
    lastMessage: "",
    lastMessageAt: serverTimestamp(),
    context: context || null,
    unreadCounts: { [myUid]: 0, [otherUid]: 0 },
  });
  return ref.id;
}

export async function sendMessage(
  chatId: string,
  senderId: string,
  text: string,
  image?: string,
  replyTo?: { id: string; senderId: string; text: string }
): Promise<void> {
  const msgsCol = collection(db, "chats", chatId, "messages");
  await addDoc(msgsCol, {
    senderId,
    text,
    image: image || null,
    replyTo: replyTo || null,
    timestamp: serverTimestamp(),
    status: "sent",
  });
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    lastMessage: text || "📎 Attachment",
    lastMessageAt: serverTimestamp(),
  });
}

export async function markChatAsRead(chatId: string, uid: string): Promise<void> {
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, { [`unreadCounts.${uid}`]: 0 });
}

// ─── Applications ─────────────────────────────────────────────────────────────
// Structure: applications/{applicationId}

export interface Application {
  id: string;
  applicantUid: string;
  applicantName: string;
  applicantAvatar: string;
  postId: string;
  postTitle: string;
  postAuthorUid: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: any;
}

export async function applyToJob(
  applicantUid: string,
  applicantName: string,
  applicantAvatar: string,
  postId: string,
  postTitle: string,
  postAuthorUid: string,
  message: string
): Promise<void> {
  const applicationsCol = collection(db, "applications");
  await addDoc(applicationsCol, {
    applicantUid,
    applicantName,
    applicantAvatar,
    postId,
    postTitle,
    postAuthorUid,
    message,
    status: "pending",
    appliedAt: serverTimestamp(),
  });
}

export async function getMyApplications(uid: string): Promise<Application[]> {
  try {
    const col = collection(db, "applications");
    const q = query(col, where("applicantUid", "==", uid), orderBy("appliedAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Application));
  } catch {
    return [];
  }
}

export async function getApplicationsForMyPosts(uid: string): Promise<Application[]> {
  try {
    const col = collection(db, "applications");
    const q = query(col, where("postAuthorUid", "==", uid), orderBy("appliedAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Application));
  } catch {
    return [];
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  status: "accepted" | "rejected"
): Promise<void> {
  const appRef = doc(db, "applications", applicationId);
  await updateDoc(appRef, { status });
}

// ─── Investments ──────────────────────────────────────────────────────────────
// Structure: investments/{investmentId}

export interface Investment {
  id: string;
  investorUid: string;
  investorName: string;
  investorAvatar: string;
  postId: string;
  postTitle: string;
  postAuthorUid: string;
  postCollection: string;
  amount?: string;
  note?: string;
  status: "interested" | "committed" | "completed";
  investedAt: any;
}

export async function addInvestment(
  investorUid: string,
  investorName: string,
  investorAvatar: string,
  postId: string,
  postTitle: string,
  postAuthorUid: string,
  postCollection: string,
  amount?: string,
  note?: string
): Promise<void> {
  const investmentsCol = collection(db, "investments");
  await addDoc(investmentsCol, {
    investorUid,
    investorName,
    investorAvatar,
    postId,
    postTitle,
    postAuthorUid,
    postCollection,
    amount: amount || "",
    note: note || "",
    status: "interested",
    investedAt: serverTimestamp(),
  });
}

export async function getMyInvestments(uid: string): Promise<Investment[]> {
  try {
    const col = collection(db, "investments");
    const q = query(col, where("investorUid", "==", uid), orderBy("investedAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Investment));
  } catch {
    return [];
  }
}

export async function updateInvestmentStatus(
  investmentId: string,
  status: "interested" | "committed" | "completed"
): Promise<void> {
  const ref = doc(db, "investments", investmentId);
  await updateDoc(ref, { status });
}
