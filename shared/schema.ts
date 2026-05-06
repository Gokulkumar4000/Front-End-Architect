import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
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

export const insertUserSchema = createInsertSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Like = typeof likes.$inferSelect;
export type Save = typeof saves.$inferSelect;
export type Follow = typeof follows.$inferSelect;
export type Comment = typeof comments.$inferSelect;
