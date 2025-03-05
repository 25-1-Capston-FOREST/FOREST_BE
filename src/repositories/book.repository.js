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
            activity_status: 0,
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

// 사용자 여가 목록 조회
export const listUserActivity = async (userId, status) => {
    // status에 따라 activitiy_id 조회
    const activities = await prisma.uSER_ACTIVITY.findMany({
        where: { 
            AND: [
                { user_id: userId },
                { activity_status: Number(status) },
            ]
        },
        select: { user_activity_id: true, activity_id: true, activity_date: true }
    });

    // 여러 개의 activity_id를 배열로 변환
    const activityIds = activities.map(a => a.activity_id);

    // activity 테이블에서 해당 activity_id들의 activity_type 조회
    const activityTypes = await prisma.aCTIVITY.findMany({
        where: { activity_id: { in: activityIds } },  // 여러 개의 ID 조회
        select: { activity_id: true, activity_type: true }
    });
    
    // wish 테이블에서 user_id와 activity_id로 조회 (한 번에!)
    const wishedActivities = await prisma.wISH.findMany({
        where: {
            user_id: userId,
            activity_id: { in: activityIds }
        },
        select: { wish_id: true, activity_id: true }
    });

    // wish 목록을 빠르게 검색할 수 있도록 Set으로 변환
    const wishedActivitySet = new Set(wishedActivities.map(w => w.activity_id));

    // 각 activity_id의 activity_type에 따라 상세 정보 + wish 여부 조회
    const result = await Promise.all(
        activityTypes.map(async ({ activity_id, activity_type }) => {
            let detailedInfo = null;

            switch (activity_type) {
                case "movie":
                    detailedInfo = await prisma.mOVIE.findFirst({
                        where: { activity_id }
                    });
                    break;
                case "performance":
                    detailedInfo = await prisma.pERFORMANCE.findFirst({
                        where: { activity_id }
                    });
                    break;
                case "exhibition":
                    detailedInfo = await prisma.eXHIBITION.findFirst({
                        where: { activity_id }
                    });
                    break;
                default:
                    detailedInfo = null;
            }

            // BigInt가 포함된 필드를 직접 문자열로 변환
            if (detailedInfo) {
                for (let key in detailedInfo) {
                    if (typeof detailedInfo[key] === 'bigint') {
                        detailedInfo[key] = detailedInfo[key].toString();
                    }
                }
            }

            const wishId = wishedActivities.find(w => w.activity_id === activity_id)?.wish_id || null;
            const activityDate = activities.find(a => a.activity_id === activity_id)?.activity_date || null;
            const userActivityId = activities.find(a => a.activity_id === activity_id)?.user_activity_id || null;

            return { 
                user_activity_id: userActivityId.toString(),
                activity_id: activity_id.toString(),  // BigInt를 문자열로 변환
                activity_type, 
                activity_date: activityDate,
                detailedInfo, 
                isWished: wishedActivitySet.has(activity_id), // wish 여부 확인
                wish_id: wishId.toString()
            };
        })
    );

    return result;  // 수정된 데이터 배열을 반환
}

// 여가 날짜 변경
export const updateDate = async (id, activityDate) => {
    const date = new Date(activityDate);  // 예약 날짜를 Date 객체로 변환
    const isoActivityDate = date.toISOString();  // ISO 8601 형식으로 변환
    const result = await prisma.uSER_ACTIVITY.update({
        where: { 
            user_activity_id: id,
        },
        data: { // 업데이트할 데이터는 data 객체 안에 넣어야 함
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
};

// 여가 상태 변경
export const updateStatus = async (id) => {
    const result = await prisma.uSER_ACTIVITY.update({
        where: {
            user_activity_id: id,
        },
        data: {
            activity_status:1
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

// 여가 예약 취소
export const deleteUserActivity = async (id) => {
    const result = await prisma.uSER_ACTIVITY.delete({
        where: {
            user_activity_id: id,
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
