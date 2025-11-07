import { pool, prisma } from "../config/db.config.js";

export const addStore = async (data) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(`INSERT INTO store (name, region_id, address) VALUES (?, ?, ?);`, [
      data.name,
      data.regionId,
      data.address || null,
    ]);
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

export const getAllStoreReviews = async (storeId, cursor) => {
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
};
