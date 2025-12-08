import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { prisma } from "../config/db.config.js";

dotenv.config();
const secret = process.env.JWT_SECRET;

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: "1h" });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, secret, { expiresIn: "14d" });
};

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

export const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
});

export default jwtStrategy;
