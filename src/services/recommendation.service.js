import {
  getActivityById,
  getActivityDetailByType,
} from '../repositories/recommendation.repository';

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

  // 2. 추천 activity ID에 해당하는 ACTIVITY 조회
  const activities = await getActivityById(recommendations);

  // 3. 상세 정보 병합
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