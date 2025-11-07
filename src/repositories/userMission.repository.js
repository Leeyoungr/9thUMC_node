import { pool } from "../config/db.config.js";

export const isUserMissionInProgress = async (userId, missionId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT id FROM user_mission WHERE user_id = ? AND mission_id = ? AND status = 'in_progress' LIMIT 1;`,
      [userId, missionId]
    );

    return rows && rows.length > 0;
  } catch (err) {
    console.error("isUserMissionInProgress error:", err);
    throw new Error(`미션 조회 중 오류 발생: ${err}`);
  } finally {
    conn.release();
  }
};

export const addUserMission = async (userId, missionId) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO user_mission (user_id, mission_id, status, created_at) VALUES (?, ?, 'in_progress', NOW());`,
      [userId, missionId]
    );

    return { id: result.insertId, missionId, status: "in_progress" };
  } catch (err) {
    console.error("addUserMission error:", err);
    throw new Error(`미션 등록 중 오류 발생: ${err}`);
  } finally {
    conn.release();
  }
};
