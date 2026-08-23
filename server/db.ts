import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { chatMessages, identityProfiles, InsertUser, mediaItems, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  values.lastSignedIn ??= new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listIdentityProfiles() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(identityProfiles);
}

export async function listChatMessages() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(chatMessages).orderBy(desc(chatMessages.createdAt)).limit(200);
  return rows.reverse();
}

export async function countUnreadMessages(viewer: "Flinter" | "Josua", since: number) {
  const messages = await listChatMessages();
  const threshold = new Date(since);
  return messages.filter(message => message.sender !== viewer && new Date(message.createdAt).getTime() > threshold.getTime()).length;
}

export async function createChatMessage(sender: "Flinter" | "Josua", body: string) {
  const db = await getDb();
  if (!db) throw new Error("Database belum tersedia");
  await db.insert(chatMessages).values({ sender, body });
  const rows = await db.select().from(chatMessages).orderBy(desc(chatMessages.id)).limit(1);
  return rows[0];
}

export async function listMedia(category?: "galeri" | "kenangan") {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(mediaItems).orderBy(desc(mediaItems.createdAt));
  return category ? query.where(eq(mediaItems.category, category)) : query;
}

export async function deleteMediaItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database belum tersedia");
  await db.delete(mediaItems).where(eq(mediaItems.id, id));
  return { success: true } as const;
}

export async function createMediaItem(input: typeof mediaItems.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database belum tersedia");
  await db.insert(mediaItems).values(input);
  const rows = await db.select().from(mediaItems).orderBy(desc(mediaItems.id)).limit(1);
  return rows[0];
}
