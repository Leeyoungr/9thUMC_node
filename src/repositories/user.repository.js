import { pool } from "../config/db.config.js";

export const addUser = async (data) => {
  const conn = await pool.getConnection();

  try {
    // 이메일 중복 확인
    const [confirm] = await conn.query(`SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) as isExistEmail;`, [
      data.email,
    ]);

    if (confirm && confirm[0] && confirm[0].isExistEmail) {
      return null;
    }

    const [result] = await conn.query(
      `INSERT INTO user (email, name, password, gender, birth, address, spec_address, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        data.email,
        data.name,
        data.password,
        data.gender,
        data.birth,
        data.address,
        data.detailAddress,
        data.phoneNumber,
      ]
    );

    return result.insertId;
  } catch (err) {
    throw new Error(`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`);
  } finally {
    conn.release();
  }
};

export const getUser = async (userId) => {
  const conn = await pool.getConnection();

  try {
    const [user] = await pool.query(`SELECT * FROM user WHERE id = ?;`, userId);

    console.log(user);

    if (user.length == 0) {
      return null;
    }

    return user[0];
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId, foodCategoryId) => {
  const conn = await pool.getConnection();

  try {
    await pool.query(`INSERT INTO user_prefer (food_id, user_id) VALUES (?, ?);`, [foodCategoryId, userId]);

    return;
  } catch (err) {
    throw new Error(`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`);
  } finally {
    conn.release();
  }
};

// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId) => {
  const conn = await pool.getConnection();

  try {
    const [preferences] = await pool.query(
      "SELECT up.id, up.food_id, up.user_id, fcl.name " +
        "FROM user_prefer up JOIN food_category fcl on up.food_id = fcl.id " +
        "WHERE up.user_id = ? ORDER BY up.food_id ASC;",
      userId
    );

    return preferences;
  } catch (err) {
    throw new Error(`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`);
  } finally {
    conn.release();
  }
};
