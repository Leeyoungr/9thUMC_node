import { pool } from "../config/db.config.js";

export const addReview = async (data) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO review (store_id, user_id, score, content) VALUES (?, ?, ?, ?);`,
      // HACK : user_id를 임시로 1로 고정
      [data.storeId, 1, data.score, data.content || null]
    );

    return { id: result.insertId, userId: 1, ...data };
  } catch (err) {
    console.error("addReview error:", err);
    throw new Error(`리뷰 생성 중 오류 발생: ${err}`);
  } finally {
    conn.release();
  }
};
