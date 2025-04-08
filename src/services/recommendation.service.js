import {
  getActivityById,
  getActivityDetailByType,
} from '../repositories/recommendation.repository.js';

// 추천 리스트
export const listRecommendation = async (userId) => {
  // 1. Python 추천 서버 호출
  const response = await axios.post('http://python-server-url/recommendations', {
    user_id: userId,
  });

  const { status, recommendations, message } = response.data;

  if (!recommendations || recommendations.length === 0) {
    return {
      status,
      recommendations: [],
      message: '추천 상품이 없습니다.',
    };
  }

  const activities = await getActivityById(recommendations);

  const detailedActivities = await Promise.all(
    activities.map(async (activity) => {
      const detail = await getActivityDetailByType(activity.activity_type, activity.id);
      return {
        ...activity,
        detail,
      };
    })
  );

  return {
    status: 'success',
    recommendations: detailedActivities,
    message: '추천 리스트를 성공적으로 가져왔습니다.',
  };
};