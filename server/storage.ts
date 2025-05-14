import { users, type User, type InsertUser, drawings, type Drawing, type InsertDrawing } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { Store } from 'express-session';

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Drawing methods
  getDrawing(id: number): Promise<Drawing | undefined>;
  getDrawingsByUserId(userId: number): Promise<Drawing[]>;
  createDrawing(drawing: InsertDrawing): Promise<Drawing>;
  deleteDrawing(id: number): Promise<void>;
  
  // Session store
  sessionStore: Store;
}

// Database configuration
const connectionString = process.env.DATABASE_URL!;
const queryClient = postgres(connectionString);
const db = drizzle(queryClient);

// PostgreSQL storage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: Store;

  constructor() {
    const PostgresStore = connectPg(session);
    this.sessionStore = new PostgresStore({
      conString: connectionString,
      createTableIfMissing: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Drawing methods
  async getDrawing(id: number): Promise<Drawing | undefined> {
    const result = await db.select().from(drawings).where(eq(drawings.id, id));
    return result[0];
  }

  async getDrawingsByUserId(userId: number): Promise<Drawing[]> {
    return await db.select().from(drawings).where(eq(drawings.userId, userId));
  }

  async createDrawing(insertDrawing: InsertDrawing): Promise<Drawing> {
    const result = await db.insert(drawings).values(insertDrawing).returning();
    return result[0];
  }

  async deleteDrawing(id: number): Promise<void> {
    await db.delete(drawings).where(eq(drawings.id, id));
  }
}

export const storage = new DatabaseStorage();
