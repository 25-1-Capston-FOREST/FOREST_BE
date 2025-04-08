import { listRecommendation } from '../services/recommendation.service.js';

// 추천 리스트 조회
export const handleGetRecommendation = async (req, res) => {
  const  userId  = req.user.id;

  if (!userId) {
    return res.status(400).json({ status: 'error', message: 'userId가 필요합니다.' });
  }
  try {
    const result = await listRecommendation(userId);
    return res.status(200).json(result);
  } catch (err) {
    console.error('추천 오류:', err);
    return res.status(500).json({ status: 'error', message: '서버 내부 오류가 발생했습니다.' });
  }
};