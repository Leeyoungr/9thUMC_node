import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../config/db.config.js";
import crypto from "crypto";
import { upsertUserAuth } from "../repositories/userAuth.repository.js";
import { generateAccessToken, generateRefreshToken } from "./jwt.util.js";

dotenv.config();

// GoogleVerify
const googleVerify = async (profile) => {
  const email = profile.emails?.[0]?.value;
  if (!email) {
    throw new Error(`profile.email was not found: ${profile}`);
  }

  const user = await prisma.user.findFirst({ where: { email } });
  if (user !== null) {
    return { id: user.id, email: user.email, name: user.name };
  }
  // 신규 사용자 생성 (User 및 UserAuth 동시 생성)
  const provider = "GOOGLE";
  const providerAccountId = profile.id;
  const providerEmail = profile.emails?.[0]?.value ?? null;

  const created = await prisma.user.create({
    data: {
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      userAuths: {
        create: {
          provider,
          providerAccountId,
          providerEmail,
          refreshTokenHash: null,
        },
      },
    },
    include: { userAuths: true },
  });

  return { id: created.id, email: created.email, name: created.name };
};

// GoogleStrategy
export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/callback/google",
    scope: ["email", "profile"],
  },

  async (accessToken, refreshToken, profile, cb) => {
    try {
      const user = await googleVerify(profile);

      const jwtAccessToken = generateAccessToken(user);
      const jwtRefreshToken = generateRefreshToken(user);

      // 저장: UserAuth에 provider 식별자와 리프레시 토큰 해시를 저장
      try {
        const provider = "GOOGLE";
        const providerAccountId = profile.id;
        const providerEmail = profile.emails?.[0]?.value ?? null;

        const refreshTokenHash = crypto.createHash("sha256").update(jwtRefreshToken).digest("hex");

        await upsertUserAuth({ provider, providerAccountId, providerEmail, refreshTokenHash, userId: user.id });
      } catch (innerErr) {
        console.error("Google 로그인 실패: UserAuth 업데이트 중 오류 발생:", innerErr);
      }

      return cb(null, {
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken,
      });
    } catch (err) {
      return cb(err);
    }
  }
);
