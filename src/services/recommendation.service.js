import axios from 'axios';
import {
  getActivityById,
  getActivityDetailByType,
  convertBigIntToString
} from '../repositories/recommendation.repository.js';

// 추천 리스트
export const listRecommendation = async (userId) => {
  // 추천 알고리즘 서버 호출
  const response = await axios.post(`${process.env.AI_SERVER_URI}/recommendations`, {
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

  // 순서를 추천 결과 순서에 맞게 정렬
  const activityMap = new Map(
    activities.map((a) => [a.activity_id.toString(), a]) // 👈 BigInt → string
  );
  
  const orderedActivities = recommendations
    .map((id) => activityMap.get(id.toString())) // 👈 동일하게 string으로 변환
    .filter((activity) => activity !== undefined);

  const detailedActivities = await Promise.all(
    orderedActivities.map(async (activity) => {
      const detail = await getActivityDetailByType(activity.activity_type, activity.activity_id);
      return {
        ...activity,
        detail,
      };
    })
  );

  return await convertBigIntToString({
    status: 'success',
    recommendations: detailedActivities,
    message: '추천 리스트를 성공적으로 가져왔습니다.',
  });
  
};