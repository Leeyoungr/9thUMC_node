import { prisma } from "../config/db.config.js";

export const addStore = async (data) => {
  try {
    const created = await prisma.store.create({
      data: {
        name: data.name,
        regionId: data.regionId,
        address: data.address || null,
      },
    });

    return { id: created.id, ...data };
  } catch (err) {
    console.error("addStore error:", err);
    throw new Error(`가게 생성 중 오류 발생: ${err}`);
  }
};

// id로 가게 조회
export const getStore = async (storeId) => {
  try {
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    return store || null;
  } catch (err) {
    console.error("getStore error:", err);
    throw new Error(`가게 조회 중 오류 발생: ${err}`);
  }
};

export const getAllStoreReviews = async (storeId, cursor) => {
  try {
    const baseWhere = { storeId: storeId };
    const baseSelect = {
      id: true,
      content: true,
      store: { select: { id: true, name: true } },
      user: { select: { nickname: true, gender: true } },
    };

    if (typeof cursor === "number" && !Number.isNaN(cursor) && cursor > 0) {
      const reviews = await prisma.review.findMany({
        where: baseWhere,
        orderBy: [{ id: "asc" }],
        take: 5,
        cursor: { id: cursor },
        skip: 1, // 커서레코드 제외
        select: baseSelect,
      });

      return reviews;
    }

    // 커서 없는 경우, fetch the first page
    const reviews = await prisma.review.findMany({
      where: baseWhere,
      orderBy: [{ id: "asc" }],
      take: 5,
      select: baseSelect,
    });

    return reviews;
  } catch (err) {
    console.error("getAllStoreReviews error:", err);
    throw new Error(`매장 리뷰 조회 중 오류 발생: ${err}`);
  }
};
