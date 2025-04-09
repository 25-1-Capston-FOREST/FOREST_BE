import { prisma } from '../db.config.js';

// BigInt를 안전하게 문자열로 변환하는 헬퍼 함수
export const convertBigIntToString = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        if (typeof value === 'bigint') {
          return [key, value.toString()];
        } else if (typeof value === 'object') {
          return [key, convertBigIntToString(value)];
        } else {
          return [key, value];
        }
      })
    );
  }
  return obj;
};

// 여러 activity ID로 ACTIVITY 정보 조회
export const getActivityById = async (ids) => {
  const activities = await prisma.aCTIVITY.findMany({
    where: { activity_id: { in: ids } },
  });
  return (activities);
};

// 활동 타입에 따라 각 상세 테이블에서 정보 조회
export const getActivityDetailByType = async (type, activityId) => {
  let detail = null;

  switch (type) {
    case 'MOVIE':
      detail = await prisma.mOVIE.findFirst({ where: { activity_id: activityId } });
      break;
    case 'PERFORMANCE':
      detail = await prisma.pERFORMANCE.findFirst({ where: { activity_id: activityId } });
      break;
    case 'EXHIBITION':
      detail = await prisma.eXHIBITION.findFirst({ where: { activity_id: activityId } });
      break;
  }

  return convertBigIntToString(detail);
};
