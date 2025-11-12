import { prisma } from "../config/db.config.js";

export const isUserMissionInProgress = async (userId, missionId) => {
  try {
    const existingUserMission = await prisma.userMission.findFirst({
      where: { userId, missionId, status: "IN_PROGRESS" },
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
    const created = await prisma.userMission.create({ data: { userId, missionId, status: "IN_PROGRESS" } });
    return { id: created.id, missionId, status: "IN_PROGRESS" };
  } catch (err) {
    console.error("addUserMission error:", err);
    throw new Error(`미션 등록 중 오류 발생: ${err}`);
  }
};

export const updateUserMission = async (userMissionId) => {
  try {
    const result = await prisma.userMission.updateMany({
      where: { id: userMissionId, status: "IN_PROGRESS" },
      data: { status: "COMPLETED" },
    });

    if (result.count === 0) return null;

    const updated = await prisma.userMission.findUnique({
      where: { id: userMissionId },
      select: { id: true, missionId: true, status: true, createdAt: true, updatedAt: true },
    });

    return updated || null;
  } catch (err) {
    console.error("completeUserMission error:", err);
    throw new Error(`미션 완료 처리 중 오류 발생: ${err}`);
  }
};

export const getUserMissionById = async (userMissionId) => {
  try {
    const userMission = await prisma.userMission.findUnique({
      where: { id: userMissionId },
      select: { id: true, missionId: true, userId: true, status: true, createdAt: true, updatedAt: true },
    });

    return userMission || null;
  } catch (err) {
    console.error("getUserMissionById error:", err);
    throw new Error(`사용자 미션 조회 중 오류 발생: ${err}`);
  }
};

export const getUserMissionsByStatus = async (userId, status) => {
  try {
    const where = { userId };

    if (status === "IN_PROGRESS" || status === "COMPLETED") {
      where.status = status;
    }

    const missions = await prisma.userMission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        missionId: true,
        mission: {
          select: {
            spec: true,
            deadLine: true,
            reward: true,
          },
        },
      },
    });

    return missions;
  } catch (err) {
    console.error("getUserMissions error:", err);
    throw new Error(`사용자 미션 목록 조회 중 오류 발생: ${err}`);
  }
};
