import { prisma } from "../db.config.js"

// Wish 테이블에 추가
export const addUserWish = async (userId, id) => {
    // 아마 찜하기 한 여가인지 확인
    const existingWish = await prisma.wISH.findFirst({
        where: {
            user_id: userId,
            activity_id: BigInt(id),
        }
    });

    // 이미 찜하기 한 여가인 경우
    if (existingWish) {
        throw new Error("이미 찜하기 된 예약입니다.");
    }

    // 찜하기 되어있지 않은 여가인 경우 찜 목록에 추가
    const result = await prisma.wISH.create({
        data: {
            user_id: userId,
            activity_id: id
        }
    })
    // BigInt를 문자열로 변환한 후 반환
    return {
        ...result,
        wish_id: result.wish_id.toString(),
        user_id: result.user_id.toString(),
        activity_id: result.activity_id.toString(),
    };
}

// Wish 테이블에서 여가 삭제
export const deleteUserWish = async (id) => {
    // 찜 목록에 있는 여가인지 확인
    const existingWish = await prisma.wISH.findFirst({
        where: {
            wish_id: BigInt(id),
        }
    });

    // 찜 목록에 없는 여가인 경우
    if (!existingWish) {
        throw new Error("해당 여가가 찜 목록에 없습니다.");
    }

    // 찜 목록에 있는 여가인 경우 삭제
    const result = await prisma.wISH.delete({
        where: { wish_id: id }
    })

    // BigInt를 문자열로 변환한 후 반환
    return {
        ...result,
        wish_id: result.wish_id.toString(),
        user_id: result.user_id.toString(),
        activity_id: result.activity_id.toString(),
    };
}


// Wish 테이블에서 사용자 찜 목록 조회
export const listUserWish = async (userId) => {

    // user_id에 해당하는 wish_id와 activity_id 조회
    const activities = await prisma.wISH.findMany({
        where: { user_id: userId },
        select: { wish_id: true, activity_id: true }
    });

    // 여러 개의 activity_id를 배열로 변환
    const activityIds = activities.map(a => a.activity_id);

    // activity 테이블에서 해당 activity_id들의 activity_type 조회
    const activityTypes = await prisma.aCTIVITY.findMany({
        where: { activity_id: { in: activityIds } },  // 여러 개의 ID 조회
        select: { activity_id: true, activity_type: true }
    });

    // 각 activity_id의 activity_type에 따라 상세 정보 조회
    const result = await Promise.all(
        activities.map(async ({ wish_id, activity_id }) => {
            // 현재 activity_id에 해당하는 activity_type 찾기
            const activityTypeObj = activityTypes.find(a => a.activity_id === activity_id);
            const activity_type = activityTypeObj ? activityTypeObj.activity_type : null;

            let detailedInfo = null;
            if (activity_type) {
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
            }

            // BigInt가 포함된 필드를 문자열로 변환
            if (detailedInfo) {
                Object.keys(detailedInfo).forEach(key => {
                    if (typeof detailedInfo[key] === 'bigint') {
                        detailedInfo[key] = detailedInfo[key].toString();
                    }
                });
            }

            return { 
                wish_id: wish_id.toString(),  // BigInt 변환
                activity_id: activity_id.toString(),  // BigInt 변환
                activity_type, 
                detailedInfo, 
                isWished: true
            };
        })
    );

    return result;  // 수정된 데이터 배열 반환
};
