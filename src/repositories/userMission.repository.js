import { prisma } from "../config/db.config.js";

export const isUserMissionInProgress = async (userId, missionId) => {
  try {
    const existingUserMission = await prisma.userMission.findFirst({
      where: { userId: userId, missionId: missionId, status: "IN_PROGRESS" },
      select: { id: true },
    });

    return !!existingUserMission;
  } catch (err) {
    console.error("isUserMissionInProgress error:", err);
    throw new Error(`미션 조회 중 오류 발생: ${err}`);
  }
};

export const addUserMission = async (userId, missionId) => {
  try {
    const created = await prisma.userMission.create({
      data: {
        userId: userId,
        missionId: missionId,
        status: "IN_PROGRESS",
      },
    });

    return { id: created.id, missionId, status: "in_progress" };
  } catch (err) {
    console.error("addUserMission error:", err);
    throw new Error(`미션 등록 중 오류 발생: ${err}`);
  }
};
