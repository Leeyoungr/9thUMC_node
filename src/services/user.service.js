import bcrypt from "bcryptjs";
import { responseFromUser } from "../dtos/user.dto.js";
import CustomError from "../errors/custom.error.js";
import { addUser, getUser, getUserPreferencesByUserId, setPreference } from "../repositories/user.repository.js";

export const userSignUp = async (data) => {
  // 비밀번호 해싱
  const hashPassword = data.password ? await bcrypt.hash(data.password, 10) : null;

  const joinUserId = await addUser({
    email: data.email,
    name: data.name,
    nickname: data.nickname,
    password: hashPassword,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    specAddress: data.specAddress,
    phoneNumber: data.phoneNumber,
  });

  if (joinUserId === null) {
    throw new CustomError({ name: "DUPLICATE_USER_EMAIL", data: { email: data.email } });
  }

  for (const preference of data.preferences) {
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};
