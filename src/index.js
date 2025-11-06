import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import indexRouter from "./router/index.router.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석
app.use(express.urlencoded({ extended: false })); // URL-encoded body 파싱

app.use("/api/v1", indexRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
