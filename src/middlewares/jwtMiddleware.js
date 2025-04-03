import jwt from "jsonwebtoken";

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.jwt;  // HttpOnly 쿠키에서 JWT 가져오기

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });  // 토큰 없으면 401 반환
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token" });
        }
        req.user = decoded;  // 유저 정보를 req.user에 저장
        next();
    });
};

export default authenticateJWT;
