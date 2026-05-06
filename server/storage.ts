import { db } from "./db";
import { eq, and, desc, or } from "drizzle-orm";
import {
  users, profiles, posts, likes, saves, follows, comments, chatRooms, chatMessages,
  type User, type InsertUser, type Profile, type Post, type Save, type Follow, type Comment,
  type ChatRoom, type ChatMessage,
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Profiles
  async getProfile(uid: string): Promise<Profile | undefined> {
    const [p] = await db.select().from(profiles).where(eq(profiles.uid, uid));
    return p;
  }
  async getAllProfiles(): Promise<Profile[]> {
    return db.select().from(profiles).orderBy(desc(profiles.createdAt));
  }
  async upsertProfile(uid: string, data: Partial<Omit<Profile, "uid" | "createdAt">>): Promise<Profile> {
    const existing = await this.getProfile(uid);
    if (existing) {
      const [updated] = await db.update(profiles).set(data).where(eq(profiles.uid, uid)).returning();
      return updated;
    }
    const [created] = await db.insert(profiles).values({ uid, ...data } as any).returning();
    return created;
  }

  // Posts
  async getPosts(): Promise<Post[]> {
    return db.select().from(posts).orderBy(desc(posts.createdAt));
  }
  async getPostsByType(type: string): Promise<Post[]> {
    return db.select().from(posts).where(eq(posts.type, type)).orderBy(desc(posts.createdAt));
  }
  async getPostsByUser(uid: string): Promise<Post[]> {
    return db.select().from(posts).where(eq(posts.authorUid, uid)).orderBy(desc(posts.createdAt));
  }
  async getPost(id: number): Promise<Post | undefined> {
    const [p] = await db.select().from(posts).where(eq(posts.id, id));
    return p;
  }
  async createPost(data: Omit<Post, "id" | "createdAt">): Promise<Post> {
    const [p] = await db.insert(posts).values(data as any).returning();
    return p;
  }
  async deletePost(id: number): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }
  async incrementLikes(id: number, delta: number): Promise<void> {
    const [p] = await db.select().from(posts).where(eq(posts.id, id));
    if (p) await db.update(posts).set({ likesCount: Math.max(0, p.likesCount + delta) }).where(eq(posts.id, id));
  }
  async countPosts(): Promise<number> {
    const all = await db.select().from(posts);
    return all.length;
  }

  // Likes
  async getLikedPostIds(userId: string): Promise<string[]> {
    const rows = await db.select().from(likes).where(eq(likes.userId, userId));
    return rows.map(r => String(r.postId));
  }
  async toggleLike(userId: string, postId: number): Promise<boolean> {
    const [existing] = await db.select().from(likes).where(and(eq(likes.userId, userId), eq(likes.postId, postId)));
    if (existing) {
      await db.delete(likes).where(and(eq(likes.userId, userId), eq(likes.postId, postId)));
      await this.incrementLikes(postId, -1);
      return false;
    }
    await db.insert(likes).values({ userId, postId });
    await this.incrementLikes(postId, 1);
    return true;
  }

  // Saves
  async getSavedPosts(userId: string): Promise<Save[]> {
    return db.select().from(saves).where(eq(saves.userId, userId)).orderBy(desc(saves.savedAt));
  }
  async toggleSave(userId: string, postId: string, postData: any): Promise<boolean> {
    const [existing] = await db.select().from(saves).where(and(eq(saves.userId, userId), eq(saves.postId, postId)));
    if (existing) {
      await db.delete(saves).where(and(eq(saves.userId, userId), eq(saves.postId, postId)));
      return false;
    }
    await db.insert(saves).values({ userId, postId, postData });
    return true;
  }
  async updateSaveNote(userId: string, postId: string, note: string): Promise<void> {
    await db.update(saves).set({ note }).where(and(eq(saves.userId, userId), eq(saves.postId, postId)));
  }
  async deleteSaveNote(userId: string, postId: string): Promise<void> {
    await db.update(saves).set({ note: null }).where(and(eq(saves.userId, userId), eq(saves.postId, postId)));
  }

  // Follows
  async getFollowing(followerId: string): Promise<string[]> {
    const rows = await db.select().from(follows).where(eq(follows.followerId, followerId));
    return rows.map(r => r.targetName);
  }
  async toggleFollow(followerId: string, targetName: string, targetUid?: string): Promise<boolean> {
    const [existing] = await db.select().from(follows).where(and(eq(follows.followerId, followerId), eq(follows.targetName, targetName)));
    if (existing) {
      await db.delete(follows).where(and(eq(follows.followerId, followerId), eq(follows.targetName, targetName)));
      return false;
    }
    await db.insert(follows).values({ followerId, targetName, targetUid });
    return true;
  }

  // Comments
  async getComments(postId: number): Promise<Comment[]> {
    return db.select().from(comments).where(eq(comments.postId, postId)).orderBy(comments.createdAt);
  }
  async addComment(data: Omit<Comment, "id" | "createdAt">): Promise<Comment> {
    const [c] = await db.insert(comments).values(data as any).returning();
    const [p] = await db.select().from(posts).where(eq(posts.id, data.postId));
    if (p) await db.update(posts).set({ commentsCount: p.commentsCount + 1 }).where(eq(posts.id, data.postId));
    return c;
  }

  // Chat Rooms
  async getChatRoomsForUser(uid: string): Promise<ChatRoom[]> {
    const all = await db.select().from(chatRooms).orderBy(desc(chatRooms.lastMessageAt));
    return all.filter(r => Array.isArray(r.participants) && r.participants.includes(uid));
  }
  async getChatRoom(id: number): Promise<ChatRoom | undefined> {
    const [r] = await db.select().from(chatRooms).where(eq(chatRooms.id, id));
    return r;
  }
  async findChatRoomBetween(uid1: string, uid2: string): Promise<ChatRoom | undefined> {
    const all = await db.select().from(chatRooms);
    return all.find(r =>
      Array.isArray(r.participants) &&
      r.participants.includes(uid1) &&
      r.participants.includes(uid2) &&
      r.participants.length === 2
    );
  }
  async createChatRoom(data: {
    participants: string[];
    participantNames: Record<string, string>;
    participantAvatars: Record<string, string>;
    participantRoles: Record<string, string>;
    context?: { type?: string; title?: string } | null;
  }): Promise<ChatRoom> {
    const [r] = await db.insert(chatRooms).values({
      participants: data.participants,
      participantNames: data.participantNames,
      participantAvatars: data.participantAvatars,
      participantRoles: data.participantRoles,
      unreadCounts: {},
      context: data.context ?? null,
    } as any).returning();
    return r;
  }
  async updateChatRoomLastMessage(chatId: number, text: string, timestamp: Date): Promise<void> {
    await db.update(chatRooms).set({ lastMessage: text, lastMessageAt: timestamp }).where(eq(chatRooms.id, chatId));
  }
  async markChatRead(chatId: number, uid: string): Promise<void> {
    const [r] = await db.select().from(chatRooms).where(eq(chatRooms.id, chatId));
    if (!r) return;
    const counts = { ...(r.unreadCounts as Record<string, number> || {}) };
    counts[uid] = 0;
    await db.update(chatRooms).set({ unreadCounts: counts } as any).where(eq(chatRooms.id, chatId));
  }
  async incrementUnread(chatId: number, uid: string): Promise<void> {
    const [r] = await db.select().from(chatRooms).where(eq(chatRooms.id, chatId));
    if (!r) return;
    const counts = { ...(r.unreadCounts as Record<string, number> || {}) };
    counts[uid] = (counts[uid] || 0) + 1;
    await db.update(chatRooms).set({ unreadCounts: counts } as any).where(eq(chatRooms.id, chatId));
  }

  // Chat Messages
  async getMessages(chatId: number): Promise<ChatMessage[]> {
    return db.select().from(chatMessages).where(eq(chatMessages.chatId, chatId)).orderBy(chatMessages.createdAt);
  }
  async addMessage(data: {
    chatId: number;
    senderId: string;
    senderName: string;
    senderAvatar: string;
    text: string;
    messageType?: string;
    postId?: string;
    postAuthorUid?: string;
    replyTo?: { id: string; senderId: string; text: string } | null;
  }): Promise<ChatMessage> {
    const [m] = await db.insert(chatMessages).values({
      chatId: data.chatId,
      senderId: data.senderId,
      senderName: data.senderName,
      senderAvatar: data.senderAvatar,
      text: data.text,
      messageType: data.messageType || "normal",
      postId: data.postId,
      postAuthorUid: data.postAuthorUid,
      replyTo: data.replyTo ?? null,
      status: "sent",
    } as any).returning();
    return m;
  }
  async grantAccess(messageId: number): Promise<void> {
    await db.update(chatMessages).set({ accessGranted: true } as any).where(eq(chatMessages.id, messageId));
  }
  async markMessagesRead(chatId: number, uid: string): Promise<void> {
    const msgs = await db.select().from(chatMessages)
      .where(and(eq(chatMessages.chatId, chatId), eq(chatMessages.status, "sent")));
    for (const m of msgs) {
      if (m.senderId !== uid) {
        await db.update(chatMessages).set({ status: "read" }).where(eq(chatMessages.id, m.id));
      }
    }
  }
}

export const storage = new DatabaseStorage();
