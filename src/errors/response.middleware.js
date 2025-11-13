import Errors from "./errors.js";

export const attachResponseHelpers = (req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({ errorCode, reason, data = null } = {}) => {
    const defaultKey = "UNHANDLED_ERROR";
    const errorKey = errorCode || defaultKey;
    const errorReason = reason || Errors[errorKey]?.message || null;
    const description = Errors[errorKey]?.description || null;

    return res.json({
      resultType: "FAIL",
      error: { errorCode: errorKey, reason: errorReason, description, data },
      success: null,
    });
  };

  next();
};
