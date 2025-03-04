import { prisma } from "../db.config.js";

// 여가 예약 추가
export const addUserActivity = async (userId, activityId, activityDate) => {
    const date = new Date(activityDate);  // 예약 날짜를 Date 객체로 변환
    const isoActivityDate = date.toISOString();  // ISO 8601 형식으로 변환

    // 중복된 예약이 있는지 확인
    const existingBook = await prisma.uSER_ACTIVITY.findFirst({
        where: {
            user_id: userId,
            activity_id: BigInt(activityId),
        }
    });

    // 중복 예약이 존재하는 경우
    if (existingBook) {
        throw new Error("이미 해당 예약이 존재합니다.");
    }

    // 중복이 없을 시 예약 추가
    const result = await prisma.uSER_ACTIVITY.create({
        data: {
            user_id: userId,
            activity_id: BigInt(activityId),
            activity_status: 1,
            activity_date: isoActivityDate
        }
    });

    // BigInt를 문자열로 변환한 후 반환
    return {
        ...result,
        user_activity_id: result.user_activity_id.toString(),
        user_id: result.user_id.toString(),
        activity_id: result.activity_id.toString(),
    };
}

// 여가 예약 목록 조회
export const getActivity = async(activityId) => {
    // activityId로 type 조회
    const type = await prisma.aCTIVITY.findUnique({
        where: { activity_id: BigInt(activityId) },
        select: { type: true },
    });

    // 해당 type 테이블에서 activity 조회
    if(type=="movie"){
        return await prisma.mOVIE.findUnique({
            where: { activity_id: BigInt(activityId) }
        });
    }else if(type=="performance"){
        return await prisma.pERFORMANCE.findUnique({
            where: { activity_id: BigInt(activityId) }
        });
    }else if(type=="exhibition"){
        return await prisma.eXHIBITION.findUnique({
            where: { activity_id: BigInt(activityId) }
        })
    }else{
        throw new Error("적절하지 않은 type입니다.");
    }
}