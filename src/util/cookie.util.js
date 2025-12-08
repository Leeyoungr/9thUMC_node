// 리프레시 토큰 쿠키 설정
const DEFAULT_REFRESH_MAX_AGE = 14 * 24 * 60 * 60 * 1000; // 14 days in ms

export const getRefreshCookieOptions = () => {
  const maxAge = Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE) || DEFAULT_REFRESH_MAX_AGE;
  const secure = process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production";
  const sameSite = process.env.COOKIE_SAMESITE || "lax";

  return {
    httpOnly: true,
    secure,
    sameSite,
    maxAge,
    path: "/",
  };
};

export const setRefreshTokenCookie = (res, token) => {
  if (!res || !token) return;
  const opts = getRefreshCookieOptions();
  res.cookie("refreshToken", token, opts);
};

export const clearRefreshTokenCookie = (res) => {
  if (!res) return;
  res.clearCookie("refreshToken", { path: "/" });
};

export default { getRefreshCookieOptions, setRefreshTokenCookie, clearRefreshTokenCookie };
