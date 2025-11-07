import { StatusCodes } from "http-status-codes";
import { userLogin } from "../services/auth.service.js";

export const handleUserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userLogin(email, password);
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "fail",
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      });
    }

    return res.status(StatusCodes.OK).json({ status: "success", data: { user } });
  } catch (err) {
    next(err);
  }
};
