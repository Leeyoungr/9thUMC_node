import { prisma } from "../config/db.config.js";

export const addReview = async (data) => {
  try {
    // HACK: userId 임시 고정
    const userId = 1;

    const created = await prisma.review.create({
      data: {
        storeId: data.storeId,
        userId: userId,
        score: data.score,
        content: data.content || null,
      },
    });

    return { id: created.id, ...data };
  } catch (err) {
    console.error("addReview error:", err);
    throw new Error(`리뷰 생성 중 오류 발생: ${err}`);
  }
};
