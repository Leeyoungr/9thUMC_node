import { pool } from "../config/db.config.js";

export const addStore = async (data) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO store (name, region_id, address) VALUES (?, ?, ?);`,
      [data.name, data.regionId, data.address || null]
    );
    return { id: result.insertId, ...data };
  } catch (err) {
    console.error("addStore error:", err);
    throw new Error(`가게 생성 중 오류 발생: ${err}`);
  } finally {
    conn.release();
  }
};

// id로 가게 조회
export const getStore = async (storeId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(`SELECT * FROM store WHERE id = ?;`, [storeId]);

    if (!rows || rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (err) {
    console.error("getStore error:", err);
    throw new Error(`가게 조회 중 오류 발생: ${err}`);
  } finally {
    conn.release();
  }
};
