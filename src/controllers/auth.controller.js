import { StatusCodes } from "http-status-codes";
import { userLogin } from "../services/auth.service.js";
import CustomError from "../errors/custom.error.js";
import {
  findByProviderAccount,
  upsertUserAuth,
  findByRefreshHash,
  updateRefreshHashById,
  invalidateByRefreshHash,
  invalidateByProviderAccount,
} from "../repositories/userAuth.repository.js";
import crypto from "crypto";
import { generateAccessToken, generateRefreshToken } from "../util/jwt.util.js";
import { setRefreshTokenCookie, clearRefreshTokenCookie } from "../util/cookie.util.js";

export const handleUserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userLogin(email, password);
    if (!user) {
      throw new CustomError({ name: "LOGIN_FAILED" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    try {
      const provider = "LOCAL";
      const providerAccountId = String(user.id);
      const providerEmail = user.email ?? null;
      const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

      await upsertUserAuth({ provider, providerAccountId, providerEmail, refreshTokenHash, userId: user.id });
    } catch (err) {
      console.error("로컬 로그인 실패: UserAuth 업데이트 중 오류 발생:", err);
    }

    setRefreshTokenCookie(res, refreshToken);

    return res.status(StatusCodes.OK).success({ data: { accessToken, user }, message: "로컬 로그인 성공" });
  } catch (err) {
    next(err);
  }
};

export const handleRefreshToken = async (req, res, next) => {
  try {
    const provided = req.body?.refreshToken || req.cookies?.refreshToken;
    if (!provided) return res.status(StatusCodes.BAD_REQUEST).error({ errorCode: "NO_REFRESH_TOKEN" });

    const hash = crypto.createHash("sha256").update(provided).digest("hex");

    const userAuth = await findByRefreshHash(hash);
    if (!userAuth || !userAuth.user)
      return res.status(StatusCodes.UNAUTHORIZED).error({ errorCode: "INVALID_REFRESH_TOKEN" });

    const user = userAuth.user;

    // rotate tokens
    const newAccess = generateAccessToken(user);
    const newRefresh = generateRefreshToken(user);
    const newHash = crypto.createHash("sha256").update(newRefresh).digest("hex");

    await updateRefreshHashById(userAuth.id, newHash);

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
      await invalidateByRefreshHash(hash);
    } else {
      await invalidateByProviderAccount(provider, providerAccountId);
    }
    // 클라이언트 쿠키에서 리프레시 토큰 제거
    clearRefreshTokenCookie(res);

    return res.status(StatusCodes.OK).success({ data: { message: "로그아웃 및 리프레시 토큰이 삭제되었습니다." } });
  } catch (err) {
    next(err);
  }
};
