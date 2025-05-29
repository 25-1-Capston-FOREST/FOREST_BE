import { getActivityById, getActivityDetailById, getActivityReviewById } from "../repositories/detail.repository.js";
import Decimal from 'decimal.js';


export const getActivityDetail = async(activityId, userId) => {
    const activity = await getActivityById(activityId);
    const result = await getActivityDetailById(activity.activity_type, activity.activity_id, userId);

    return await convertBigIntToString({
        ...activity,
        detail: result
      });
    
}

export const convertBigIntToString = (obj) => {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'bigint') {
    return obj.toString();
  }

  if (obj instanceof Decimal) {
    return Number(obj.toFixed(1));
  }

  // 날짜 문자열 혹은 Date 객체 처리
  if (obj instanceof Date) {
    return obj.toISOString().split('T')[0];  // 'YYYY-MM-DD' 형태로 변환
  }
  
  // 만약 문자열인데 ISO 날짜 형식이면 그대로 리턴
  if (typeof obj === 'string' && /^\d{4}-\d{2}-\d{2}/.test(obj)) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  }

  if (typeof obj === 'object') {
    const converted = {};
    for (const key in obj) {
      converted[key] = convertBigIntToString(obj[key]);
    }
    return converted;
  }

  return obj;
};


export const getActivityReview = async(id) => {
  const result = await getActivityReviewById(id);
  return await convertBigIntToString(result);
}