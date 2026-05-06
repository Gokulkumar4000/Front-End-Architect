import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";

const MOCK_USERS = [
  { uid: "mock-1", fullName: "Alice Visionary", email: "alice@devconnect.mock", role: "idea-holder",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=AliceVisionary",
    bio: "Serial entrepreneur building AI solutions for sustainable agriculture. 3x founder with exits.", tagline: "Turning green ideas into real-world impact." },
  { uid: "mock-2", fullName: "Bob Builder", email: "bob@devconnect.mock", role: "developer",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=BobBuilder",
    bio: "Full-stack developer passionate about open-source tools and non-profit tech.", tagline: "Code for good, build for all." },
  { uid: "mock-3", fullName: "Charlie Capital", email: "charlie@devconnect.mock", role: "investor",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=CharlieCapital",
    bio: "Early-stage GreenTech & CleanEnergy investor. 40+ portfolio companies.", tagline: "Funding tomorrow's green economy today." },
  { uid: "mock-4", fullName: "Diana Dev", email: "diana@devconnect.mock", role: "developer",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=DianaDev",
    bio: "React Native & TypeScript specialist building cross-platform mobile experiences.", tagline: "Mobile-first, always." },
  { uid: "mock-5", fullName: "Eve Entrepreneur", email: "eve@devconnect.mock", role: "idea-holder",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=EveEntrepreneur",
    bio: "Web3 visionary disrupting the freelance economy through smart contract automation.", tagline: "Decentralize everything." },
  { uid: "mock-6", fullName: "Fiona Funds", email: "fiona@devconnect.mock", role: "investor",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=FionaFunds",
    bio: "HealthTech investor with 15 years backing digital health & AI diagnostics innovation.", tagline: "Investing in healthier futures." },
  { uid: "mock-7", fullName: "Greg Gig", email: "greg@devconnect.mock", role: "developer",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=GregGig",
    bio: "Real-time systems engineer building collaborative developer tools with WebRTC and CRDT.", tagline: "Collab in real-time, ship in no time." },
  { uid: "mock-8", fullName: "Hana HR", email: "hana@devconnect.mock", role: "idea-holder",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=HanaHR",
    bio: "EdTech co-founder hunting for a visionary CTO to build the future of learning.", tagline: "Education powered by technology." },
];

const MOCK_POSTS = [
  {
    type: "idea", authorUid: "mock-1", authorName: "Alice Visionary",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AliceVisionary", authorRole: "Idea Holder",
    title: "AI-Powered Sustainable Farming",
    content: "We are developing a revolutionary automated sensor network for small-scale urban farmers. Our system uses advanced IoT devices and machine learning to monitor soil health, predict crop diseases before they manifest, and optimize water usage by up to 60%.",
    likesCount: 124, commentsCount: 2, domains: ["AI/ML", "Agriculture"],
    extraData: { problem: "Small-scale urban farmers struggle with crop diseases, inefficient water usage.", solution: "An IoT sensor network with ML that monitors soil moisture, pH, temperature in real-time.", traction: "Pilot tested with 12 urban farms in Berlin.", collaborationNeeds: "Looking for a Full-Stack Developer with IoT experience." }
  },
  {
    type: "project", authorUid: "mock-2", authorName: "Bob Builder",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BobBuilder", authorRole: "Developer",
    title: "Open Source CRM for Non-Profits",
    content: "Our team has just reached a major milestone in the DevConnect UI library project. We've successfully integrated accessible, high-performance components that enable non-profit organizations to manage donor relationships effectively.",
    likesCount: 85, commentsCount: 0, domains: ["Web3", "Open Source"],
    extraData: { rolesNeeded: "Backend Developer (Node.js/PostgreSQL), UX Designer, DevOps Engineer", skillsRequired: "React, Node.js, PostgreSQL, Docker, Figma", timeline: "MVP in 3 months, Beta in 6 months", benefits: "Open-source contribution credit, equity options, mentorship" }
  },
  {
    type: "fund", authorUid: "mock-3", authorName: "Charlie Capital",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CharlieCapital", authorRole: "Investor",
    title: "Seed Fund for GreenTech",
    content: "We are officially opening applications for our early-stage CleanTech Seed Fund. We are looking for visionary founders working on carbon capture, renewable energy storage, and circular economy solutions.",
    likesCount: 210, commentsCount: 45, domains: ["FinTech", "Sustainability"],
    extraData: { fundingGoal: 50000, minContribution: 100, deadline: "2026-06-30", fundUsage: "40% product development, 25% marketing, 20% operations, 15% legal", currentAmount: 32500, currentSupporters: 124 }
  },
  {
    type: "recruitment", authorUid: "mock-4", authorName: "Diana Dev",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DianaDev", authorRole: "Developer",
    title: "Looking for a React Native Developer",
    content: "We are building a cross-platform mobile app for real-time team collaboration and need an experienced React Native developer to join us. This is a fully remote, equity-based role.",
    likesCount: 56, commentsCount: 12, domains: ["Mobile", "React Native"],
    extraData: { jobType: "Part-time / Contract", compensation: "Equity-based (1-3%), Remote", requirements: "2+ years React Native experience, TypeScript, Firebase, REST APIs." }
  },
  {
    type: "idea", authorUid: "mock-5", authorName: "Eve Entrepreneur",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=EveEntrepreneur", authorRole: "Idea Holder",
    title: "Decentralized Freelance Marketplace",
    content: "A blockchain-based freelance platform where payments are handled by smart contracts, removing the need for intermediaries. Our goal is to reduce the 20% fee charged by existing platforms down to under 2%.",
    likesCount: 178, commentsCount: 33, domains: ["Web3", "FinTech"],
    extraData: { problem: "Freelancing platforms charge 20-30% in fees and hold payments for weeks.", solution: "A smart contract-based platform on Ethereum/Polygon with automated escrow.", collaborationNeeds: "Solidity developer, Web3 frontend developer, tokenomics advisor." }
  },
  {
    type: "fund", authorUid: "mock-6", authorName: "Fiona Funds",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FionaFunds", authorRole: "Investor",
    title: "HealthTech Innovation Fund 2026",
    content: "Our HealthTech fund is seeking startups building next-generation digital health tools—remote patient monitoring, AI diagnostics, mental wellness platforms, and more.",
    likesCount: 143, commentsCount: 18, domains: ["HealthTech", "AI/ML"],
    extraData: { fundingGoal: 2000000, minContribution: 250000, deadline: "2026-12-31", fundUsage: "50% direct investment, 30% operational support, 15% legal, 5% reserve", currentAmount: 850000, currentSupporters: 7 }
  },
  {
    type: "project", authorUid: "mock-7", authorName: "Greg Gig",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=GregGig", authorRole: "Developer",
    title: "Real-Time Collaborative Code Editor",
    content: "Building a VS Code-like browser IDE supporting real-time multi-user collaboration, integrated AI code suggestions, and one-click deployment pipelines using WebRTC and CRDT.",
    likesCount: 92, commentsCount: 7, domains: ["DevTools", "Web3"],
    extraData: { rolesNeeded: "Frontend Developer, AI/ML Engineer, DevOps/Cloud Engineer", skillsRequired: "React, WebRTC, CRDT algorithms, OpenAI API, AWS/GCP", timeline: "Alpha in 2 months, Public beta in 4 months", benefits: "Equity stake, remote-first, cutting-edge tech stack" }
  },
  {
    type: "recruitment", authorUid: "mock-8", authorName: "Hana HR",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=HanaHR", authorRole: "Idea Holder",
    title: "Co-Founder & CTO Wanted",
    content: "We're a pre-seed EdTech startup looking for a technical co-founder with deep expertise in cloud infrastructure and AI. Shape the product from day one and own meaningful equity.",
    likesCount: 74, commentsCount: 9, domains: ["EdTech", "AI/ML"],
    extraData: { jobType: "Full-time / Co-founder", compensation: "15-25% equity + future salary once funded", requirements: "5+ years engineering experience, cloud infrastructure, LLM/AI experience, strong leadership." }
  },
];

function postToResponse(p: any) {
  const extra = (p.extraData || {}) as Record<string, any>;
  return {
    id: String(p.id),
    type: p.type,
    collectionName: p.type === "idea" ? "ideas" : p.type === "project" ? "projects" : p.type === "fund" ? "funds" : "recruitment",
    author: { name: p.authorName, avatar: p.authorAvatar, role: p.authorRole, uid: p.authorUid },
    title: p.title,
    content: p.content,
    timestamp: p.createdAt ? timeAgo(new Date(p.createdAt)) : "Just now",
    stats: { likes: p.likesCount, comments: p.commentsCount },
    domains: p.domains || [],
    authorUid: p.authorUid,
    createdAt: p.createdAt,
    ...extra,
  };
}

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 60) return "Just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function profileToResponse(p: any) {
  const extra = (p.extraData || {}) as Record<string, any>;
  return {
    uid: p.uid, fullName: p.fullName, email: p.email, role: p.role,
    profileImage: p.profileImage, location: p.location, bio: p.bio,
    tagline: p.tagline, skills: p.skills || [], interests: p.interests || [],
    createdAt: p.createdAt, ...extra,
  };
}

interface CommentResponse {
  id: string;
  author: { name: string; avatar: string; role: string; uid: string };
  content: string;
  timestamp: string;
  likes: number;
  replies: CommentResponse[];
}

function commentToResponse(c: any, replies: any[] = []): CommentResponse {
  return {
    id: String(c.id),
    author: { name: c.authorName, avatar: c.authorAvatar, role: c.authorRole, uid: c.authorUid },
    content: c.content,
    timestamp: c.createdAt ? timeAgo(new Date(c.createdAt)) : "Just now",
    likes: c.likesCount,
    replies: replies.map((r: any) => commentToResponse(r)),
  };
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  async function seedMockData() {
    // Always upsert mock user profiles so Connect works
    for (const u of MOCK_USERS) {
      await storage.upsertProfile(u.uid, u as any);
    }

    // Delete legacy mock posts (old uid was "mock") and re-seed if needed
    await storage.deletePostsByAuthorUid("mock");

    const count = await storage.countPosts();
    if (count === 0) {
      for (const mock of MOCK_POSTS) {
        await storage.createPost(mock as any);
      }
    }
  }
  seedMockData().catch(console.error);

  app.get("/api/status", (_req, res) => res.json({ status: "online" }));

  // ── Posts ──────────────────────────────────────────────────────────────────
  app.get("/api/posts", async (_req, res) => {
    try {
      const all = await storage.getPosts();
      res.json(all.map(postToResponse));
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });

  app.get("/api/posts/type/:type", async (req, res) => {
    try {
      const p = await storage.getPostsByType(req.params.type);
      res.json(p.map(postToResponse));
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });

  app.get("/api/posts/user/:uid", async (req, res) => {
    try {
      const p = await storage.getPostsByUser(req.params.uid);
      res.json(p.map(postToResponse));
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const { type, authorUid, authorName, authorAvatar, authorRole, title, content, domains, ...extra } = req.body;
      if (!type || !authorUid || !title || !content) return res.status(400).json({ message: "Missing required fields" });
      const p = await storage.createPost({ type, authorUid, authorName: authorName || "Anonymous", authorAvatar: authorAvatar || "", authorRole: authorRole || "", title, content, likesCount: 0, commentsCount: 0, domains: domains || [], extraData: extra });
      res.json(postToResponse(p));
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });

  app.delete("/api/posts/:id", async (req, res) => {
    try {
      await storage.deletePost(Number(req.params.id));
      res.json({ success: true });
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });

  // ── Profiles ───────────────────────────────────────────────────────────────
  app.get("/api/profiles", async (_req, res) => {
    try {
      const all = await storage.getAllProfiles();
      res.json(all.map(profileToResponse));
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });

  app.get("/api/profiles/:uid", async (req, res) => {
    try {
      const p = await storage.getProfile(req.params.uid);
      if (!p) return res.status(404).json({ message: "Profile not found" });
      res.json(profileToResponse(p));
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });

  app.post("/api/profiles/:uid", async (req, res) => {
    try {
      const { uid } = req.params;
      const { fullName, email, role, profileImage, location, bio, tagline, skills, interests, ...extra } = req.body;
      const p = await storage.upsertProfile(uid, { fullName, email, role, profileImage, location, bio, tagline, skills, interests, extraData: extra });
      res.json(profileToResponse(p));
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });

  // ── User Activity ──────────────────────────────────────────────────────────
  app.get("/api/activity/:uid", async (req, res) => {
    try {
      const [likedIds, savedPosts, following] = await Promise.all([
        storage.getLikedPostIds(req.params.uid),
        storage.getSavedPosts(req.params.uid),
        storage.getFollowing(req.params.uid),
      ]);
      res.json({
        likedPostIds: likedIds,
        savedPosts: savedPosts.map(s => ({ id: s.postId, ...(s.postData as any), note: s.note, savedAt: s.savedAt })),
        following,
      });
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });

  app.post("/api/likes", async (req, res) => {
    try {
      const { userId, postId } = req.body;
      if (!userId || !postId) return res.status(400).json({ message: "Missing userId or postId" });
      const liked = await storage.toggleLike(userId, Number(postId));
      res.json({ liked });
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });

  app.post("/api/saves", async (req, res) => {
    try {
      const { userId, postId, postData } = req.body;
      if (!userId || !postId) return res.status(400).json({ message: "Missing userId or postId" });
      const saved = await storage.toggleSave(userId, String(postId), postData || {});
      res.json({ saved });
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });

  app.put("/api/saves/:userId/:postId", async (req, res) => {
    try {
      await storage.updateSaveNote(req.params.userId, req.params.postId, req.body.note || "");
      res.json({ success: true });
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });

  app.delete("/api/saves/:userId/:postId/note", async (req, res) => {
    try {
      await storage.deleteSaveNote(req.params.userId, req.params.postId);
      res.json({ success: true });
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });

  app.post("/api/follows", async (req, res) => {
    try {
      const { followerId, targetName, targetUid } = req.body;
      if (!followerId || !targetName) return res.status(400).json({ message: "Missing followerId or targetName" });
      const following = await storage.toggleFollow(followerId, targetName, targetUid);
      res.json({ following });
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });

  // ── Chat ───────────────────────────────────────────────────────────────────
  app.get("/api/chats/user/:uid", async (req, res) => {
    try {
      const rooms = await storage.getChatRoomsForUser(req.params.uid);
      res.json(rooms.map(r => ({
        ...r,
        id: String(r.id),
        participants: r.participants,
        participantNames: r.participantNames || {},
        participantAvatars: r.participantAvatars || {},
        participantRoles: r.participantRoles || {},
        unreadCounts: r.unreadCounts || {},
      })));
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });

  app.post("/api/chats", async (req, res) => {
    try {
      const { myUid, myName, myAvatar, myRole, targetUid, targetName, targetAvatar, targetRole, context } = req.body;
      if (!myUid || !targetUid) return res.status(400).json({ message: "Missing uids" });
      let room = await storage.findChatRoomBetween(myUid, targetUid);
      if (!room) {
        room = await storage.createChatRoom({
          participants: [myUid, targetUid],
          participantNames: { [myUid]: myName || "User", [targetUid]: targetName || "User" },
          participantAvatars: { [myUid]: myAvatar || "", [targetUid]: targetAvatar || "" },
          participantRoles: { [myUid]: myRole || "", [targetUid]: targetRole || "" },
          context: context || null,
        });
      }
      res.json({ ...room, id: String(room.id) });
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });

  app.get("/api/chats/:chatId/messages", async (req, res) => {
    try {
      const msgs = await storage.getMessages(Number(req.params.chatId));
      res.json(msgs.map(m => ({
        ...m,
        id: String(m.id),
        chatId: String(m.chatId),
        text: m.text,
        timestamp: m.createdAt,
      })));
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });

  app.post("/api/chats/:chatId/messages", async (req, res) => {
    try {
      const { senderId, senderName, senderAvatar, text, messageType, postId, postAuthorUid, replyTo } = req.body;
      if (!senderId || !text) return res.status(400).json({ message: "Missing senderId or text" });
      const chatId = Number(req.params.chatId);
      const room = await storage.getChatRoom(chatId);
      if (!room) return res.status(404).json({ message: "Chat not found" });
      const msg = await storage.addMessage({ chatId, senderId, senderName: senderName || "User", senderAvatar: senderAvatar || "", text, messageType, postId, postAuthorUid, replyTo });
      await storage.updateChatRoomLastMessage(chatId, text, msg.createdAt!);
      const otherUid = (room.participants as string[]).find(p => p !== senderId);
      if (otherUid) await storage.incrementUnread(chatId, otherUid);
      res.json({ ...msg, id: String(msg.id), timestamp: msg.createdAt });
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });

  app.patch("/api/chats/:chatId/read/:uid", async (req, res) => {
    try {
      const chatId = Number(req.params.chatId);
      await storage.markChatRead(chatId, req.params.uid);
      await storage.markMessagesRead(chatId, req.params.uid);
      res.json({ success: true });
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });

  app.patch("/api/messages/:messageId/grant-access", async (req, res) => {
    try {
      await storage.grantAccess(Number(req.params.messageId));
      res.json({ success: true });
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });

  // ── Comments ───────────────────────────────────────────────────────────────
  app.get("/api/comments/:postId", async (req, res) => {
    try {
      const all = await storage.getComments(Number(req.params.postId));
      const topLevel = all.filter(c => !c.parentId);
      const replies = all.filter(c => c.parentId);
      const result = topLevel.map(c => commentToResponse(c, replies.filter(r => r.parentId === c.id)));
      res.json(result);
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });

  app.post("/api/comments/:postId", async (req, res) => {
    try {
      const { authorUid, authorName, authorAvatar, authorRole, content, parentId } = req.body;
      if (!content) return res.status(400).json({ message: "Missing content" });
      const c = await storage.addComment({ postId: Number(req.params.postId), authorUid: authorUid || "anonymous", authorName: authorName || "Anonymous", authorAvatar: authorAvatar || "", authorRole: authorRole || "", content, parentId: parentId || null, likesCount: 0 });
      res.json(commentToResponse(c));
    } catch (e: any) { res.status(500).json({ message: e.message }); }
  });

  return httpServer;
}
