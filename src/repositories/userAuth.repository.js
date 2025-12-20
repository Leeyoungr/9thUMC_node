import { prisma } from "../config/db.config.js";

export const findByProviderAccount = async (provider, providerAccountId) => {
  return prisma.userAuth.findFirst({ where: { provider, providerAccountId } });
};

export const upsertUserAuth = async ({ provider, providerAccountId, providerEmail = null, refreshTokenHash = null, userId = null }) => {
  const existing = await prisma.userAuth.findFirst({ where: { provider, providerAccountId } });
  if (existing) {
    return prisma.userAuth.update({ where: { id: existing.id }, data: { refreshTokenHash, providerEmail } });
  }
  return prisma.userAuth.create({ data: { provider, providerAccountId, providerEmail, refreshTokenHash, userId } });
};

export const findByRefreshHash = async (hash) => {
  return prisma.userAuth.findFirst({ where: { refreshTokenHash: hash }, include: { user: true } });
};

export const updateRefreshHashById = async (id, refreshTokenHash) => {
  return prisma.userAuth.update({ where: { id }, data: { refreshTokenHash } });
};

export const invalidateByRefreshHash = async (hash) => {
  return prisma.userAuth.updateMany({ where: { refreshTokenHash: hash }, data: { refreshTokenHash: null } });
};

export const invalidateByProviderAccount = async (provider, providerAccountId) => {
  return prisma.userAuth.updateMany({ where: { provider, providerAccountId }, data: { refreshTokenHash: null } });
};

export default {
  findByProviderAccount,
  upsertUserAuth,
  findByRefreshHash,
  updateRefreshHashById,
  invalidateByRefreshHash,
  invalidateByProviderAccount,
};
