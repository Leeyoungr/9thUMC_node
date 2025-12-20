import { prisma } from "../config/db.config.js";
import CustomError from "../errors/custom.error.js";

export const addReview = async ({ userId, storeId, score, content }) => {
  try {
    const created = await prisma.review.create({
      data: {
        storeId: storeId,
        userId: userId,
        score: score,
        content: content || null,
      },
    });

    return created;
  } catch (err) {
    console.error("addReview error:", err);
    throw new CustomError({ name: "DATABASE_ERROR", description: "리뷰 생성 중 오류 발생" });
  }
};

export const getReviewsByUserId = async (userId) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: userId },
      orderBy: [{ createdAt: "desc" }],
      select: {
        id: true,
        score: true,
        content: true,
        createdAt: true,
        user: { select: { nickname: true } },
        store: { select: { name: true } },
      },
    });

    return reviews;
  } catch (err) {
    console.error("getReviewsByUserId error:", err);
    throw new CustomError({ name: "DATABASE_ERROR", description: "사용자 리뷰 조회 중 오류 발생" });
  }
};
