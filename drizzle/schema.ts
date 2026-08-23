import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const identityProfiles = mysqlTable("identityProfiles", {
  id: int("id").autoincrement().primaryKey(),
  identity: mysqlEnum("identity", ["Flinter", "Josua"]).notNull().unique(),
  displayName: varchar("displayName", { length: 120 }).notNull(),
  subtitle: varchar("subtitle", { length: 180 }).notNull(),
  avatarInitial: varchar("avatarInitial", { length: 1 }).notNull(),
});

export const chatMessages = mysqlTable("chatMessages", {
  id: int("id").autoincrement().primaryKey(),
  sender: mysqlEnum("sender", ["Flinter", "Josua"]).notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const mediaItems = mysqlTable("mediaItems", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  caption: text("caption"),
  category: mysqlEnum("category", ["galeri", "kenangan"]).default("galeri").notNull(),
  mediaType: mysqlEnum("mediaType", ["image", "video", "audio"]).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  fileUrl: varchar("fileUrl", { length: 1024 }).notNull(),
  mimeType: varchar("mimeType", { length: 120 }).notNull(),
  uploadedBy: mysqlEnum("uploadedBy", ["Flinter", "Josua"]).notNull(),
  memoryIndex: int("memoryIndex"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type IdentityProfile = typeof identityProfiles.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type MediaItem = typeof mediaItems.$inferSelect;
