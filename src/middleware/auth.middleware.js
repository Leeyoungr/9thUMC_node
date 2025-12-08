import passport from "passport";
import CustomError from "../errors/custom.error.js";

export const isLogin = (req, res, next) => {
  return passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) return next(new CustomError({ name: "UNAUTHORIZED" }));
    req.user = user;
    return next();
  })(req, res, next);
};

export default isLogin;
