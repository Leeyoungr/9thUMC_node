import { StatusCodes } from "http-status-codes";
import { userLogin } from "../services/auth.service.js";
import CustomError from "../errors/custom.error.js";
import { prisma } from "../config/db.config.js";
import crypto from "crypto";
import { generateAccessToken, generateRefreshToken } from "../config/oauth.config.js";

export const handleUserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userLogin(email, password);
    if (!user) {
      throw new CustomError({ name: "LOGIN_FAILED" });
    }

    return res.status(StatusCodes.OK).success({ data: { user } });
  } catch (err) {
    next(err);
  }
};

export const handleRefreshToken = async (req, res, next) => {
  try {
    const provided = req.body?.refreshToken || req.cookies?.refreshToken;
    if (!provided) return res.status(StatusCodes.BAD_REQUEST).error({ errorCode: "NO_REFRESH_TOKEN" });

    const hash = crypto.createHash("sha256").update(provided).digest("hex");

    const userAuth = await prisma.userAuth.findFirst({ where: { refreshTokenHash: hash }, include: { user: true } });
    if (!userAuth || !userAuth.user)
      return res.status(StatusCodes.UNAUTHORIZED).error({ errorCode: "INVALID_REFRESH_TOKEN" });

    const user = userAuth.user;

    // rotate tokens
    const newAccess = generateAccessToken(user);
    const newRefresh = generateRefreshToken(user);
    const newHash = crypto.createHash("sha256").update(newRefresh).digest("hex");

    await prisma.userAuth.update({ where: { id: userAuth.id }, data: { refreshTokenHash: newHash } });

    return res.status(StatusCodes.OK).success({ data: { accessToken: newAccess, refreshToken: newRefresh } });
  } catch (err) {
    next(err);
  }
};
