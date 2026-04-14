import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { env } from '../config/env.js';

const { Client } = pg;

const client = new Client({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Critical for Neon serverless DB connections
});

await client.connect();

const db = drizzle(client);

console.log("DB connected successfully");

export { db };
