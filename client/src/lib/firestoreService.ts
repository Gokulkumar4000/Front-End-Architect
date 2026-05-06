// All data now served from the Express/PostgreSQL API. Firebase Auth is kept for login only.

export type PostType = "idea" | "project" | "fund" | "recruitment";

export function typeToCollection(type: PostType | string): string {
  const map: Record<string, string> = { idea: "ideas", project: "projects", fund: "funds", recruitment: "recruitment" };
  return map[type] || "ideas";
}

export function collectionToType(col: string): PostType {
  const map: Record<string, PostType> = { ideas: "idea", projects: "project", funds: "fund", recruitment: "recruitment" };
  return map[col] || "idea";
}

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

export interface SavedPostData {
  id: string;
  type?: PostType | string;
  collectionName?: string;
  title?: string;
  description?: string;
  author?: { name: string; avatar?: string };
  domains?: string[];
  likes?: number;
  note?: string;
  savedAt?: any;
  [key: string]: any;
}

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
  problem?: string;
  solution?: string;
  traction?: string;
  market?: string;
  collaborationNeeds?: string;
  projectDescription?: string;
  rolesNeeded?: string;
  skillsRequired?: string;
  timeline?: string;
  benefits?: string;
  teamInfo?: string;
  fundingGoal?: number;
  minContribution?: number;
  deadline?: string;
  fundUsage?: string;
  roadmap?: string;
  currentAmount?: number;
  currentSupporters?: number;
  jobType?: string;
  compensation?: string;
  requirements?: string;
}

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(path, { headers: { "Content-Type": "application/json" }, ...options });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// ── Posts ──────────────────────────────────────────────────────────────────

export async function getPosts(): Promise<FirestorePost[]> {
  return apiFetch("/api/posts");
}

export async function getPostsByType(type: PostType | string): Promise<FirestorePost[]> {
  return apiFetch(`/api/posts/type/${type}`);
}

export async function getUserPosts(uid: string, type?: PostType | string): Promise<FirestorePost[]> {
  const all = await apiFetch(`/api/posts/user/${uid}`);
  if (!type) return all;
  return all.filter((p: FirestorePost) => p.type === type);
}

export async function createPost(uid: string, postData: Omit<FirestorePost, "id" | "createdAt" | "collectionName">): Promise<FirestorePost> {
  return apiFetch("/api/posts", {
    method: "POST",
    body: JSON.stringify({
      type: postData.type,
      authorUid: uid,
      authorName: postData.author.name,
      authorAvatar: postData.author.avatar,
      authorRole: postData.author.role,
      title: postData.title,
      content: postData.content,
      domains: postData.domains,
      problem: postData.problem,
      solution: postData.solution,
      traction: postData.traction,
      market: postData.market,
      collaborationNeeds: postData.collaborationNeeds,
      projectDescription: postData.projectDescription,
      rolesNeeded: postData.rolesNeeded,
      skillsRequired: postData.skillsRequired,
      timeline: postData.timeline,
      benefits: postData.benefits,
      teamInfo: postData.teamInfo,
      fundingGoal: postData.fundingGoal,
      minContribution: postData.minContribution,
      deadline: postData.deadline,
      fundUsage: postData.fundUsage,
      roadmap: postData.roadmap,
      currentAmount: postData.currentAmount,
      currentSupporters: postData.currentSupporters,
      jobType: postData.jobType,
      compensation: postData.compensation,
      requirements: postData.requirements,
    }),
  });
}

export async function deletePost(collectionName: string, postId: string): Promise<void> {
  await apiFetch(`/api/posts/${postId}`, { method: "DELETE" });
}

// No-op — seeding is handled server-side automatically
export async function seedMockPostsIfEmpty(): Promise<void> {}

// ── User Profile ──────────────────────────────────────────────────────────

export async function saveUserProfile(uid: string, profileData: Partial<UserProfile>): Promise<void> {
  await apiFetch(`/api/profiles/${uid}`, { method: "POST", body: JSON.stringify(profileData) });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    return await apiFetch(`/api/profiles/${uid}`);
  } catch {
    return null;
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  await apiFetch(`/api/profiles/${uid}`, { method: "POST", body: JSON.stringify(data) });
}

export async function getAllUsers(): Promise<UserProfile[]> {
  return apiFetch("/api/profiles");
}

// ── Likes ─────────────────────────────────────────────────────────────────

export async function getUserLikedPostIds(uid: string): Promise<string[]> {
  try {
    const data = await apiFetch(`/api/activity/${uid}`);
    return data.likedPostIds || [];
  } catch { return []; }
}

export async function toggleLikePost(uid: string, postId: string, _collectionName: string, _currentlyLiked: boolean): Promise<void> {
  await apiFetch("/api/likes", { method: "POST", body: JSON.stringify({ userId: uid, postId }) });
}

// ── Saves ─────────────────────────────────────────────────────────────────

export async function getUserSavedPosts(uid: string): Promise<SavedPostData[]> {
  try {
    const data = await apiFetch(`/api/activity/${uid}`);
    return data.savedPosts || [];
  } catch { return []; }
}

export async function toggleSavePost(uid: string, postId: string, postData: SavedPostData | null, _currentlySaved: boolean): Promise<void> {
  await apiFetch("/api/saves", { method: "POST", body: JSON.stringify({ userId: uid, postId, postData }) });
}

export async function updateSavedPostNote(uid: string, postId: string, note: string): Promise<void> {
  await apiFetch(`/api/saves/${uid}/${postId}`, { method: "PUT", body: JSON.stringify({ note }) });
}

export async function deleteSavedPostNote(uid: string, postId: string): Promise<void> {
  await apiFetch(`/api/saves/${uid}/${postId}/note`, { method: "DELETE" });
}

// ── Follows ───────────────────────────────────────────────────────────────

export async function getUserFollowing(uid: string): Promise<string[]> {
  try {
    const data = await apiFetch(`/api/activity/${uid}`);
    return data.following || [];
  } catch { return []; }
}

export async function toggleFollowUser(uid: string, targetName: string, _currentlyFollowing: boolean, targetUid?: string): Promise<void> {
  await apiFetch("/api/follows", { method: "POST", body: JSON.stringify({ followerId: uid, targetName, targetUid }) });
}

export async function getUserFollowers(_uid: string): Promise<string[]> { return []; }
export async function getFollowersCount(_uid: string): Promise<number> { return 0; }
export async function getFollowingCount(_uid: string): Promise<number> { return 0; }

// ── Comments ──────────────────────────────────────────────────────────────

export async function getPostComments(postId: string, _collectionName: string): Promise<FirestoreComment[]> {
  try {
    return await apiFetch(`/api/comments/${postId}`);
  } catch { return []; }
}

export async function addPostComment(collectionName: string, postId: string, comment: Omit<FirestoreComment, "id">): Promise<FirestoreComment> {
  return apiFetch(`/api/comments/${postId}`, {
    method: "POST",
    body: JSON.stringify({
      authorUid: comment.author?.uid || "anonymous",
      authorName: comment.author?.name || "Anonymous",
      authorAvatar: comment.author?.avatar || "",
      authorRole: comment.author?.role || "",
      content: comment.content,
    }),
  });
}

export async function addReplyToComment(collectionName: string, postId: string, commentId: string, reply: FirestoreComment): Promise<void> {
  await apiFetch(`/api/comments/${postId}`, {
    method: "POST",
    body: JSON.stringify({
      authorUid: reply.author?.uid || "anonymous",
      authorName: reply.author?.name || "Anonymous",
      authorAvatar: reply.author?.avatar || "",
      authorRole: reply.author?.role || "",
      content: reply.content,
      parentId: Number(commentId),
    }),
  });
}

// ── Applications (stub — feature not yet migrated) ────────────────────────

export interface Application {
  id: string;
  postId: string;
  postTitle: string;
  postType: PostType;
  applicantUid: string;
  applicantName: string;
  applicantAvatar?: string;
  coverLetter?: string;
  message?: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt?: any;
  [key: string]: any;
}

export async function getMyApplications(_uid: string): Promise<Application[]> { return []; }
export async function getApplicationsForMyPosts(_uid: string): Promise<Application[]> { return []; }
export async function updateApplicationStatus(_applicationId: string, _status: string): Promise<void> {}

// ── Investments (stub — feature not yet migrated) ─────────────────────────

export interface Investment {
  id: string;
  fundPostId: string;
  fundTitle?: string;
  postTitle?: string;
  postCollection?: string;
  investorUid: string;
  investorName: string;
  amount: number;
  status: string;
  note?: string;
  investedAt?: any;
  returns?: number;
  [key: string]: any;
}

export async function getMyInvestments(_uid: string): Promise<Investment[]> { return []; }
export async function updateInvestmentStatus(_id: string, _status: string): Promise<void> {}

// ── User Account ─────────────────────────────────────────────────────────

export async function deleteUserAccount(_uid: string): Promise<void> {}

// ── Chat ─────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  text?: string;
  timestamp?: any;
  read?: boolean;
  status?: string;
  messageType?: string;
  accessGranted?: boolean | null;
  postId?: string;
  postAuthorUid?: string;
  replyTo?: { id: string; content: string; text?: string; senderName: string; senderId?: string } | null;
  [key: string]: any;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  participantIds?: string[];
  participantNames: Record<string, string>;
  participantAvatars?: Record<string, string>;
  participantRoles?: Record<string, string>;
  lastMessage?: string;
  lastMessageAt?: any;
  unreadCounts?: Record<string, number>;
  unreadCount?: Record<string, number>;
  context?: { type?: string; title?: string } | null;
  [key: string]: any;
}

const CHAT_POLL_MS = 3000;
const MSG_POLL_MS = 2000;

export function subscribeToUserChats(uid: string, cb: (chats: ChatRoom[]) => void): () => void {
  let active = true;
  const poll = async () => {
    if (!active) return;
    try {
      const res = await fetch(`/api/chats/user/${uid}`);
      if (res.ok) { const data = await res.json(); cb(data); }
    } catch {}
    if (active) setTimeout(poll, CHAT_POLL_MS);
  };
  poll();
  return () => { active = false; };
}

export function subscribeToMessages(chatId: string, cb: (messages: ChatMessage[]) => void): () => void {
  if (!chatId) return () => {};
  let active = true;
  const poll = async () => {
    if (!active) return;
    try {
      const res = await fetch(`/api/chats/${chatId}/messages`);
      if (res.ok) { const data = await res.json(); cb(data); }
    } catch {}
    if (active) setTimeout(poll, MSG_POLL_MS);
  };
  poll();
  return () => { active = false; };
}

export async function sendMessage(
  chatId: string,
  senderId: string,
  text: string,
  options?: { messageType?: string; postId?: string; postAuthorUid?: string; replyTo?: any; senderName?: string; senderAvatar?: string }
): Promise<void> {
  await fetch(`/api/chats/${chatId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ senderId, text, ...(options || {}) }),
  });
}

export async function getOrCreateChat(
  myUid: string, myName: string, myAvatar: string, myRole: string,
  targetUid: string, targetName: string, targetAvatar: string, targetRole: string,
  context?: { type?: string; title?: string }
): Promise<string> {
  const res = await fetch("/api/chats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ myUid, myName, myAvatar, myRole, targetUid, targetName, targetAvatar, targetRole, context }),
  });
  if (!res.ok) throw new Error("Failed to create chat");
  const room = await res.json();
  return room.id;
}

export async function markChatAsRead(chatId: string, uid: string): Promise<void> {
  await fetch(`/api/chats/${chatId}/read/${uid}`, { method: "PATCH" });
}

export async function grantChatAccess(messageId: string): Promise<void> {
  await fetch(`/api/messages/${messageId}/grant-access`, { method: "PATCH" });
}
