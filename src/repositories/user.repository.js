import { prisma } from "../config/db.config.js";

export const addUser = async (data) => {
  const user = await prisma.user.findFirst({ where: { email: data.email } });
  if (user) {
    return null;
  }

  const created = await prisma.user.create({ data: data });
  return created.id;
};

export const getUser = async (userId) => {
  const user = await prisma.user.findFirstOrThrow({ where: { id: userId } });
  return user;
};

// 이메일로 사용자 조회 (로그인에 사용)
export const getUserByEmail = async (email) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  return user;
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId, foodCategoryId) => {
  await prisma.userPrefer.create({
    data: {
      userId: userId,
      foodCategoryId: foodCategoryId,
    },
  });
};

// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId) => {
  const preferences = await prisma.userPrefer.findMany({
    select: {
      id: true,
      userId: true,
      foodCategoryId: true,
      foodCategory: true,
    },
    where: { userId: userId },
    orderBy: { foodCategoryId: "asc" },
  });

  return preferences;
};
