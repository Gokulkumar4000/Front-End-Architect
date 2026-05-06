import { pgTable, text, serial, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const profiles = pgTable("profiles", {
  uid: text("uid").primaryKey(),
  fullName: text("full_name").notNull().default(""),
  email: text("email").notNull().default(""),
  role: text("role").notNull().default("idea-holder"),
  profileImage: text("profile_image"),
  location: text("location"),
  bio: text("bio"),
  tagline: text("tagline"),
  skills: text("skills").array(),
  interests: text("interests").array(),
  extraData: jsonb("extra_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  authorUid: text("author_uid").notNull(),
  authorName: text("author_name").notNull(),
  authorAvatar: text("author_avatar").notNull().default(""),
  authorRole: text("author_role").notNull().default(""),
  title: text("title").notNull(),
  content: text("content").notNull(),
  likesCount: integer("likes_count").notNull().default(0),
  commentsCount: integer("comments_count").notNull().default(0),
  domains: text("domains").array().notNull().default([]),
  extraData: jsonb("extra_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  postId: integer("post_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const saves = pgTable("saves", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  postId: text("post_id").notNull(),
  postData: jsonb("post_data").notNull(),
  note: text("note"),
  savedAt: timestamp("saved_at").defaultNow(),
});

export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: text("follower_id").notNull(),
  targetName: text("target_name").notNull(),
  targetUid: text("target_uid"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  authorUid: text("author_uid").notNull(),
  authorName: text("author_name").notNull(),
  authorAvatar: text("author_avatar").notNull().default(""),
  authorRole: text("author_role").notNull().default(""),
  content: text("content").notNull(),
  parentId: integer("parent_id"),
  likesCount: integer("likes_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatRooms = pgTable("chat_rooms", {
  id: serial("id").primaryKey(),
  participants: text("participants").array().notNull(),
  participantNames: jsonb("participant_names").$type<Record<string, string>>().notNull().default({}),
  participantAvatars: jsonb("participant_avatars").$type<Record<string, string>>().notNull().default({}),
  participantRoles: jsonb("participant_roles").$type<Record<string, string>>().notNull().default({}),
  lastMessage: text("last_message"),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  unreadCounts: jsonb("unread_counts").$type<Record<string, number>>().notNull().default({}),
  context: jsonb("context").$type<{ type?: string; title?: string } | null>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").notNull(),
  senderId: text("sender_id").notNull(),
  senderName: text("sender_name").notNull().default(""),
  senderAvatar: text("sender_avatar").notNull().default(""),
  text: text("text").notNull(),
  messageType: text("message_type").notNull().default("normal"),
  accessGranted: boolean("access_granted"),
  postId: text("post_id"),
  postAuthorUid: text("post_author_uid"),
  replyTo: jsonb("reply_to").$type<{ id: string; senderId: string; text: string } | null>(),
  status: text("status").notNull().default("sent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Like = typeof likes.$inferSelect;
export type Save = typeof saves.$inferSelect;
export type Follow = typeof follows.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type ChatRoom = typeof chatRooms.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
