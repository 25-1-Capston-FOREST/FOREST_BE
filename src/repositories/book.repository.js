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
        select: { activity_id: true, activity_date: true }  // activity_id와 activity_date 가져옴
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
        select: { activity_id: true }
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

            const activityDate = activities.find(a => a.activity_id === activity_id)?.activity_date || null;

            return { 
                activity_id: activity_id.toString(),  // BigInt를 문자열로 변환
                activity_type, 
                activity_date: activityDate,
                detailedInfo, 
                isWished: wishedActivitySet.has(activity_id) // wish 여부 확인
            };
        })
    );

    return result;  // 수정된 데이터 배열을 반환
}




// // 여가 상세 조회
// export const getActivity = async(activityId) => {
//     // activityId로 type 조회
//     const type = await prisma.aCTIVITY.findUnique({
//         where: { activity_id: BigInt(activityId) },
//         select: { activity_type: true },
//     });

//     // 해당 type 테이블에서 activity 조회
//     if(type=="movie"){
//         return await prisma.mOVIE.findUnique({
//             where: { activity_id: BigInt(activityId) }
//         });
//     }else if(type=="performance"){
//         return await prisma.pERFORMANCE.findUnique({
//             where: { activity_id: BigInt(activityId) }
//         });
//     }else if(type=="exhibition"){
//         return await prisma.eXHIBITION.findUnique({
//             where: { activity_id: BigInt(activityId) }
//         })
//     }else{
//         throw new Error("적절하지 않은 type입니다.");
//     }
// }