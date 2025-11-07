import bcrypt from "bcryptjs";
import { responseFromUser } from "../dtos/user.dto.js";
import { getUserByEmail } from "../repositories/user.repository.js";

export const userLogin = async (email, password) => {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password || "");
  if (!match) return null;

  return responseFromUser({ user, preferences: [] });
};
