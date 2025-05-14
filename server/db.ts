import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';
import 'dotenv/config';

// Kiểm tra các biến môi trường cần thiết
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL must be set in environment variables or .env file');
  process.exit(1);
}

// Tạo pool connection
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Tạo Drizzle client
export const db = drizzle(pool, { schema });

// Hàm để kiểm tra kết nối
export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Database connection successful');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}