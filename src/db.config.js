import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

// Prisma Client 인스턴스 생성
export const prisma = new PrismaClient();

// MySQL Connection Pool 생성
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost", // MySQL의 호스트 이름
  user: process.env.DB_USER || "root", // 사용자 이름
  port: process.env.DB_PORT || 3306, // 포트 번호
  database: process.env.DB_NAME || "DB_FOREST", // 데이터베이스 이름
  password: process.env.DB_PASSWORD || "ansdjdkrkTl", // 비밀번호
  waitForConnections: true,
  connectionLimit: 10, // 커넥션 풀에 생성할 커넥션 수
  queueLimit: 0, // 큐 대기 제한
});

// MySQL 연결 확인 함수
async function checkMysqlConnection() {
    try {
        // MySQL 커넥션 풀에서 커넥션을 얻어서 확인
        const connection = await pool.getConnection();
        console.log("✅ MySQL 데이터베이스 연결 성공");
        connection.release();  // 연결 반환
    } catch (error) {
        console.error("❌ MySQL 데이터베이스 연결 실패:", error);
    }
}

// Prisma 연결 확인 함수
async function checkPrismaConnection() {
    try {
        await prisma.$connect();
        console.log("✅ Prisma 데이터베이스 연결 성공");
    } catch (error) {
        console.error("❌ Prisma 데이터베이스 연결 실패:", error);
    }
}

// 연결 확인 함수 호출
checkMysqlConnection();
checkPrismaConnection();
