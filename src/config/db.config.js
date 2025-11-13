import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Load environment variables before creating clients
dotenv.config();

// Create a singleton PrismaClient per Node process to avoid exhausting DB connections
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.__prismaClient ?? new PrismaClient({ log: ["query"] });
if (process.env.NODE_ENV === "development") globalForPrisma.__prismaClient = prisma;

// NOTE: mysql2 pool was removed because the project uses Prisma as the primary DB client.
// If you still need a raw mysql pool, re-add it here. Removing the pool avoids creating
// duplicate connection pools which can exhaust DB connections in production.
