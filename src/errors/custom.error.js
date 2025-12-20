import Errors from "./errors.js";

class CustomError extends Error {
  constructor({ name, message, description, data } = {}) {
    const errorInfo = Errors[name] || Errors.UNHANDLED_ERROR;
    const finalMessage = message || errorInfo.message;
    super(finalMessage);

    this.name = name || "UNHANDLED_ERROR";
    this.statusCode = errorInfo.code || 500;
    this.errorCode = this.name;
    this.reason = finalMessage;
    this.description = description || errorInfo.description || null;
    this.data = data || null;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}

export default CustomError;
