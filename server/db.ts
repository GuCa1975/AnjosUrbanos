import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertSalon, InsertSubscription, InsertUser, salons, subscriptions, users } from "../drizzle/schema";
import { ENV } from './_core/env';

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

// ─── Users ───────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<{ isNew: boolean }> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return { isNew: false }; }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};

  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];
  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };
  textFields.forEach(assignNullable);

  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }

  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  const result = await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  // MySQL: affectedRows === 1 = INSERT (novo utilizador), 2 = UPDATE (existente)
  const isNew = (result as any)?.[0]?.affectedRows === 1;
  return { isNew };
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt));
}

// ─── Salons ──────────────────────────────────────────────────────────────────

export async function getSalonByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(salons).where(eq(salons.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createSalon(data: InsertSalon) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(salons).values(data);
  return getSalonByUserId(data.userId);
}

export async function updateSalon(id: number, data: Partial<InsertSalon>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(salons).set(data).where(eq(salons.id, id));
}

export async function getAllSalons() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(salons).orderBy(desc(salons.createdAt));
}

// ─── Subscriptions ───────────────────────────────────────────────────────────

export async function getSubscriptionByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(desc(subscriptions.createdAt))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getActiveSubscriptionByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(subscriptions)
    .where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active")))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getSubscriptionByStripeId(stripeSubscriptionId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createSubscription(data: InsertSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(subscriptions).values(data);
}

export async function updateSubscriptionByStripeId(stripeSubscriptionId: string, data: Partial<InsertSubscription>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(subscriptions).set(data).where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
}

export async function incrementFreeSimulations(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.execute(`UPDATE users SET freeSimulations = freeSimulations + 1 WHERE id = ${userId}`);
  const result = await db.select({ freeSimulations: users.freeSimulations }).from(users).where(eq(users.id, userId)).limit(1);
  return result[0]?.freeSimulations ?? 0;
}

export async function getFreeSimulationsCount(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ freeSimulations: users.freeSimulations }).from(users).where(eq(users.id, userId)).limit(1);
  return result[0]?.freeSimulations ?? 0;
}

export async function getAllSubscriptions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt));
}

export async function getSubscriptionsByStatus(status: "active" | "canceled" | "past_due" | "trialing" | "incomplete" | "unpaid") {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subscriptions).where(eq(subscriptions.status, status));
}
