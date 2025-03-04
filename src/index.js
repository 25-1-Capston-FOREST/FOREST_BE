import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import jwt from "jsonwebtoken";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import cors from "cors";
import axios from "axios";
import cookieParser from "cookie-parser";  // cookie-parser 추가
import { googleStrategy } from "./auth.config.js";
import authenticateJWT from "./jwtMiddleware.js";
import { handleAddBook, handleGetUserActivity, handleModifyDate } from "./controllers/book.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const swaggerPath = path.join(__dirname, "../swagger.yaml");
const swaggerSpec = YAML.load(swaggerPath);

passport.use(googleStrategy);  // passport가 googleStrategy를 사용하도록 설정

// CORS 설정
app.use(cors({
    origin: 'http://localhost:3000', // 프론트엔드 주소
    credentials: true,  // 쿠키를 포함하려면 이 설정이 필요합니다.
}));

app.use(cookieParser());  // 쿠키 파서 추가
app.use(passport.initialize());  // 세션 관련 설정 삭제
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// JWT 토큰 생성 함수
const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "3h" });
};

// 구글 로그인 요청 (passport.authenticate 사용)
app.post("/auth/google", passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,  // 세션을 사용하지 않도록 설정
}), (req, res) => {
    // 여기까지 오면 인증 성공
    const { user } = req;  // passport.authenticate에서 설정된 user 정보 가져오기
    // BigInt를 문자열로 변환
    user.user_id = user.user_id.toString();  // BigInt를 문자열로 변환
    const token = generateToken({ id: user.user_id, email: user.email });

    // JWT를 쿠키로 클라이언트에 저장
    res.cookie("jwt", token, {
        httpOnly: false,  // 클라이언트에서 접근가능
        secure: false, 
        maxAge: 3600000, // 1시간 동안 유효
    });
    console.log("토큰: "+token);

    console.log("쿠키 저장 완료");

    res.json({ message: "로그인 성공", user });
});

// 유저 정보 가져오기 (JWT 쿠키에서 가져오기)
app.get("/user", (req, res) => {
    const token = req.cookies.jwt;  // 쿠키에서 JWT 추출

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        res.json(decoded);  // JWT에서 추출한 사용자 정보 반환
    });
});

// 로그아웃 (JWT 쿠키 삭제)
app.post("/logout", (req, res) => {
    console.log("로그아웃 요청 받음");
    res.clearCookie("jwt");  // JWT 쿠키 삭제
    res.clearCookie("G_AUTHUSER_H"); // 구글 인증 관련 쿠키 예시 (구글 OAuth 쿠키)
    res.clearCookie("G_AUTH") // 구글 인증 관련 다른 쿠키들
    res.json({ message: "로그아웃 성공" });
    console.log("쿠키 삭제 완료");
});


// 인증이 필요한 API
app.post('/api/book', authenticateJWT, handleAddBook);
app.get('/api/user/activities', authenticateJWT, handleGetUserActivity);
app.patch('/api/book', authenticateJWT, handleModifyDate);
// app.patch('/api/user/activity', authenticateJWT, handleFinishActivity);
// app.delete('/api/user/activity', authenticateJWT, handleDeleteActivity);

// 비인증 API
app.get('/public', (req, res) => {
    res.json({ message: "This is a public API" });
  });

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
});
