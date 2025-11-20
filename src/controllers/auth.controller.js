import { StatusCodes } from "http-status-codes";
import { userLogin } from "../services/auth.service.js";
import CustomError from "../errors/custom.error.js";

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
