import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import jwt from "jsonwebtoken";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import cors from "cors";
import axios from "axios";
import cookieParser from "cookie-parser";

import { googleStrategy } from "./auth.config.js";
import authenticateJWT from "./jwtMiddleware.js";

import './scheduler/movieScheduler.js';
import './scheduler/performanceScheduler.js'; 
import './scheduler/exhibitionScheduler.js';

import { handleAddBook, handleGetUserActivity, handleModifyDate, handleFinishActivity, handleCancelBook } from "./controllers/book.controller.js";
import { handleAddWish, handleDeleteWish, handleGetUserWish } from "./controllers/wish.controller.js";
import { handleAddReview, handleGetUserReview } from "./controllers/review.controller.js";
import { handleGetRecommendation } from "./controllers/recommendation.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const swaggerPath = path.join(__dirname, "../swagger.yaml");
const swaggerSpec = YAML.load(swaggerPath);

// Google Strategy 등록
passport.use(googleStrategy);

// 미들웨어
app.use(cors({
    origin: 'https://forest-fe.vercel.app', // 프론트엔드 주소
    credentials: true,
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// JWT 토큰 생성 함수
const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "3h" });
};

// ✅ 구글 로그인 시작 (GET 요청)
app.get("/auth/google", passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
}));

// ✅ 구글 로그인 콜백 처리
app.get("/auth/google/callback",
    passport.authenticate('google', { failureRedirect: "/login", session: false }),
    (req, res) => {
        const { user } = req;
        user.user_id = user.user_id.toString();

        const token = generateToken({ id: user.user_id, email: user.email });

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 3600000,
        });

        console.log("✅ 토큰 발급 및 쿠키 저장 완료");

        // 프론트엔드로 리다이렉트 (성공 시)
        res.redirect("https://forest-fe.vercel.app/main");
    }
);

// ✅ 유저 정보 가져오기 (쿠키에 저장된 JWT로)
app.get("/user", (req, res) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        res.json(decoded);
    });
});

// ✅ 로그아웃 (JWT 쿠키 삭제)
app.post("/logout", (req, res) => {
    console.log("로그아웃 요청 받음");
    res.clearCookie("jwt");
    res.clearCookie("G_AUTHUSER_H");
    res.clearCookie("G_AUTH");
    res.json({ message: "로그아웃 성공" });
    console.log("쿠키 삭제 완료");
});

// 인증이 필요한 API
app.post('/api/book', authenticateJWT, handleAddBook);
app.patch('/api/book', authenticateJWT, handleModifyDate);
app.delete('/api/book', authenticateJWT, handleCancelBook);
app.get('/api/user/activities', authenticateJWT, handleGetUserActivity);
app.patch('/api/user/activity', authenticateJWT, handleFinishActivity);
app.post('/api/wish', authenticateJWT, handleAddWish);
app.delete('/api/wish', authenticateJWT, handleDeleteWish);
app.get('/api/user/wishlist', authenticateJWT, handleGetUserWish);
app.post('/api/review', authenticateJWT, handleAddReview);
app.get('/api/user/reviews', authenticateJWT, handleGetUserReview);
app.get('/api/recommendation', authenticateJWT, handleGetRecommendation);

// 비인증 테스트용 API
app.get('/public', (req, res) => {
    res.json({ message: "This is a public API" });
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${port}`);
});
