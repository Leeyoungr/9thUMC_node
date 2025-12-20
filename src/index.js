import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";
import swaggerUiExpress from "swagger-ui-express";
import YAML from "yamljs";
import globalErrorHandler from "./errors/error.middleware.js";
import { attachResponseHelpers } from "./errors/response.middleware.js";
import indexRouter from "./router/index.router.js";
import authRouter from "./router/auth.router.js";
import passport from "passport";
import { googleStrategy } from "./util/google.util.js";
import { jwtStrategy } from "./util/jwt.util.js";
dotenv.config();

passport.use(googleStrategy);
passport.use(jwtStrategy);

const app = express();
const port = process.env.PORT;

const swaggerSpec = YAML.load(path.join(path.dirname(new URL(import.meta.url).pathname), "./swagger.yaml"));
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec));

app.use(attachResponseHelpers);

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석
app.use(express.urlencoded({ extended: false })); // URL-encoded body 파싱
app.use(morgan("dev")); // 로그 출력
app.use(cookieParser()); // 쿠키 파싱
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1", indexRouter);
app.use("/auth", authRouter);

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
