// Global error handler middleware
import Errors from "./errors.js";

export default function globalErrorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const defaultKey = "UNHANDLED_ERROR";
  const defaultErr = Errors[defaultKey];

  const status = err.statusCode || defaultErr.code || 500;
  const payload = {
    errorCode: err.errorCode || defaultKey,
    reason: err.reason || err.message || defaultErr.message || null,
    description: err.description || defaultErr.description || null,
    data: err.data || null,
  };

  // Prefer the res.error helper when available
  if (res && typeof res.error === "function") {
    return res.status(status).error(payload);
  }

  // Fallback JSON shape if helpers are not attached
  return res.status(status).json({ resultType: "FAIL", error: payload, success: null });
}
