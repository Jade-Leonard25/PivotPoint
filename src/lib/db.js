// src/db/index.js - NEON VERSION
import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import * as schema from '@/config/db/schema';

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
