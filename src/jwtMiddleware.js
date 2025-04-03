// jwtMiddleware.js
import jwt from 'jsonwebtoken';

// JWT 검증 미들웨어
const authenticateJWT = (req, res, next) => {
  const token = req.cookies.jwt;  // 쿠키에서 JWT 추출

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // JWT 검증
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    // 사용자 정보 추가
    req.user = decoded;
    next();  // 인증된 사용자로서 요청을 처리
  });
};

export default authenticateJWT;
