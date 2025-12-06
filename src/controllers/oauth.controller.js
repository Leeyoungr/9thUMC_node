import { StatusCodes } from "http-status-codes";
import { userLogin } from "../services/auth.service.js";
import CustomError from "../errors/custom.error.js";
import { prisma } from "../config/db.config.js";
import crypto from "crypto";
import { generateAccessToken, generateRefreshToken } from "../util/oauth.util.js";
import { setRefreshTokenCookie, clearRefreshTokenCookie } from "../util/cookie.util.js";

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

    // 리프레시 토큰을 HttpOnly 쿠키로 설정(유틸 사용)
    setRefreshTokenCookie(res, newRefresh);

    return res
      .status(StatusCodes.OK)
      .success({ data: { accessToken: newAccess }, message: "토큰이 재발급 되었습니다." });
  } catch (err) {
    next(err);
  }
};

export const handleGoogleCallback = async (req, res, next) => {
  try {
    const tokens = req.user;

    // 리프레시 토큰을 HttpOnly 쿠키로 설정(유틸 사용)
    if (tokens?.refreshToken) {
      setRefreshTokenCookie(res, tokens.refreshToken);
    }

    return res
      .status(StatusCodes.OK)
      .success({ data: { accessToken: tokens?.accessToken }, message: "Google 로그인 성공!" });
  } catch (err) {
    next(err);
  }
};

export const handleLogout = async (req, res, next) => {
  try {
    // 리프레시 토큰을 제공된 값(쿠키 또는 본문) 또는 provider + providerAccountId로 식별 시도
    const provided = req.body?.refreshToken || req.cookies?.refreshToken;
    const provider = req.body?.provider;
    const providerAccountId = req.body?.providerAccountId;

    if (!provided && !(provider && providerAccountId)) {
      return res.status(StatusCodes.BAD_REQUEST).error({ errorCode: "NO_LOGOUT_IDENTIFIER" });
    }

    if (provided) {
      const hash = crypto.createHash("sha256").update(provided).digest("hex");
      await prisma.userAuth.updateMany({ where: { refreshTokenHash: hash }, data: { refreshTokenHash: null } });
    } else {
      await prisma.userAuth.updateMany({
        where: { provider, providerAccountId },
        data: { refreshTokenHash: null },
      });
    }
    // 클라이언트 쿠키에서 리프레시 토큰 제거
    clearRefreshTokenCookie(res);

    return res.status(StatusCodes.OK).success({ data: { message: "로그아웃 및 리프레시 토큰이 삭제되었습니다." } });
  } catch (err) {
    next(err);
  }
};
