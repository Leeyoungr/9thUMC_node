import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../config/db.config.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

dotenv.config();
const secret = process.env.JWT_SECRET;

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: "1h" });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, secret, { expiresIn: "14d" });
};

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
    callbackURL: "/oauth2/callback/google",
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

        const existing = await prisma.userAuth.findFirst({ where: { provider, providerAccountId } });
        if (existing) {
          await prisma.userAuth.update({
            where: { id: existing.id },
            data: { refreshTokenHash, providerEmail },
          });
        } else {
          await prisma.userAuth.create({
            data: {
              provider,
              providerAccountId,
              providerEmail,
              refreshTokenHash,
              userId: user.id,
            },
          });
        }
      } catch (innerErr) {
        // 토큰 저장 실패는 인증 자체를 막지 않도록 로깅 후 계속 진행
        console.error("Failed to store userAuth:", innerErr);
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

const jwtOptions = {
  // 요청 헤더의 'Authorization'에서 'Bearer <token>' 토큰을 추출
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

export const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await prisma.user.findFirst({ where: { id: payload.id } });

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
});
