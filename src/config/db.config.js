import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const globalForPrisma = globalThis;

const isDev = process.env.NODE_ENV !== "production";

// 환경에 따른 로그레벨 설정
const prismaClientOptions = {
  log: isDev ? ["query", "info", "warn", "error"] : ["error"],
};

// 싱글톤 유지
export const prisma = globalForPrisma.__prismaClient ?? new PrismaClient(prismaClientOptions);
if (isDev) globalForPrisma.__prismaClient = prisma;

// Prisma 연결/해제 헬퍼 함수
export const connectPrisma = async () => {
  try {
    await prisma.$connect();
    if (isDev) console.info("Prisma connected");
  } catch (err) {
    console.error("Prisma connect error:", err);
    throw err;
  }
};

export const disconnectPrisma = async () => {
  try {
    await prisma.$disconnect();
    if (isDev) console.info("Prisma disconnected");
  } catch (err) {
    console.error("Prisma disconnect error:", err);
  }
};

if (!globalForPrisma.__prismaShutdownHandlerRegistered) {
  const shutdown = async () => {
    try {
      await disconnectPrisma();
    } finally {
      process.exit(0);
    }
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  globalForPrisma.__prismaShutdownHandlerRegistered = true;
}
