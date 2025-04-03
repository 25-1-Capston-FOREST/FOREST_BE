import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./db.config.js";

dotenv.config();

export const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log("✅ Google 로그인 프로필:", profile); // Google에서 받은 데이터 확인

        try {
            // ✅ google_id를 기준으로 기존 사용자 찾기
            let user = await prisma.uSER.findUnique({
                where: { google_id: profile.id },  // 테이블명 소문자로 변경
            });

            // 기존 유저가 없으면 새로 생성
            if (!user) {
                console.log("새로운 유저입니다");
                user = await prisma.uSER.create({ 
                    data: {
                        google_id: profile.id,
                        email: profile.emails[0].value,
                        name: profile.displayName,
                    },
                });
                console.log("✅ 새 사용자 등록:", user);
            } else {
                console.log("✅ 기존 사용자 로그인:", user);
            }

            return done(null, user);  // ✅ 여기서 `done` 호출해야 req.user가 정상적으로 설정됨
        } catch (error) {
            console.error("❌ DB 저장 오류:", error);
            return done(error, null);  // 오류가 발생하면 done 호출해야
        }
    }
);
