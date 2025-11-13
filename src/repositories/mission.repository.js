import { prisma } from "../config/db.config.js";
import CustomError from "../errors/custom.error.js";

export const getMissionsByStoreId = async (storeId) => {
  try {
    const missions = await prisma.mission.findMany({
      where: { storeId: storeId },
      orderBy: [{ createdAt: "desc" }],
      select: {
        id: true,
        reward: true,
        spec: true,
        deadLine: true,
      },
    });

    return missions;
  } catch (err) {
    console.error("getMissionsByStoreId error:", err);
    throw new CustomError({ name: "DATABASE_ERROR", description: "가게 미션 조회 중 오류 발생" });
  }
};
