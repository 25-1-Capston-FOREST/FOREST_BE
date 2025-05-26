import {searchActivities} from "../services/search.service.js"

// 여가 통합 검색
export const handleSearch = async (req , res , next) => {
    const  userId  = req.user.id;
    const { keyword } = req.query;
  
    if (!userId) {
      return res.status(400).json({ status: 'error', message: 'userId가 필요합니다.' });
    }
    try {
      const result = await searchActivities(keyword);
      return res.status(200).json(result);
    } catch (err) {
      console.error('검색 오류:', err);
      return res.status(500).json({ status: 'error', message: '서버 내부 오류가 발생했습니다.' });
    }
}