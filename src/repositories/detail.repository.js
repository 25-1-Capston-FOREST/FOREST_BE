import { prisma } from "../db.config.js";

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

// activity ID로 ACTIVITY 정보 조회
export const getActivityById = async (activityId) => {
  const activity = await prisma.aCTIVITY.findFirst({
    where: { activity_id: activityId },
  });
  return activity;
};

// 활동 타입에 따라 각 상세 테이블에서 정보 조회 + isWished 여부 추가
export const getActivityDetailById = async (type, activityId, userId) => {
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

  // BigInt -> string 변환
  detail = convertBigIntToString(detail);

  // isWished 확인 (userId가 있는 경우만)
  let isWished = false;
  let wishId = null;

  if (userId) {
    const wish = await prisma.wISH.findFirst({
      where: {
        user_id: userId,
        activity_id: BigInt(activityId)
      }
    });

    if (wish) {
      isWished = true;
      wishId = wish.wish_id.toString();
    }
  }

  return {
    ...detail,
    isWished,
    wish_id: wishId
  };
};

