import { prisma } from "../db.config.js";

// Review 테이블에 추가
export const addUserReview = async(userId, id, data) => {
    const activityId = await prisma.uSER_ACTIVITY.findUnique({
        where: { user_activity_id: BigInt(id) },
        select: { activity_id: true }
    })

    // 이미 리뷰를 작성한 활동인지 확인
    const existingReview = await prisma.rEVIEW.findFirst({
        where: { user_activity_id: BigInt(id)}
    })
    if(existingReview){
        throw new Error("이미 리뷰를 작성했습니다.");
    }

    // 리뷰가 없는 활동인 경우 리뷰 추가
    const result = await prisma.rEVIEW.create({
        data: {
            user_id: userId,
            user_activity_id: BigInt(id),
            activity_id: activityId.activity_id,
            rate: data.rate,
            content: data.content || null
        }
    });
    
    // BigInt를 문자열로 변환한 후 반환
    return {
        ...result,
        review_id: result.review_id.toString(),
        user_activity_id: result.user_activity_id.toString(),
        user_id: result.user_id.toString(),
        activity_id: result.activity_id.toString(),
    };
}

// 사용자 리뷰 + 여가 정보 포함
export const listUserReview = async (userId) => {
    // 1. 사용자의 리뷰 목록 조회
    const reviews = await prisma.rEVIEW.findMany({
        where: { user_id: userId }
    });

    if (!reviews || reviews.length === 0) return [];

    // 2. 리뷰에 연결된 activity_id 수집
    const activityIds = reviews.map(r => r.activity_id);

    // 3. 각 activity의 타입 조회
    const activityTypes = await prisma.aCTIVITY.findMany({
        where: { activity_id: { in: activityIds } },
        select: { activity_id: true, activity_type: true }
    });

    // 4. activity_type 별 상세 정보 조회
    const activityDetailMap = {};
    for (const { activity_id, activity_type } of activityTypes) {
        let detailedInfo = null;

        switch (activity_type) {
            case "MOVIE":
                detailedInfo = await prisma.mOVIE.findFirst({ where: { activity_id } });
                break;
            case "PERFORMANCE":
                detailedInfo = await prisma.pERFORMANCE.findFirst({ where: { activity_id } });
                break;
            case "EXHIBITION":
                detailedInfo = await prisma.eXHIBITION.findFirst({ where: { activity_id } });
                break;
            default:
                detailedInfo = null;
        }

        // BigInt 처리
        if (detailedInfo) {
            for (let key in detailedInfo) {
                if (typeof detailedInfo[key] === 'bigint') {
                    detailedInfo[key] = detailedInfo[key].toString();
                }
            }
        }

        activityDetailMap[activity_id.toString()] = {
            activity_type,
            detailedInfo,
        };
    }

    // 5. 리뷰 + 여가 정보 결합 후 BigInt 문자열로 변환
    return reviews.map(review => {
        const aid = review.activity_id.toString();
        const activityInfo = activityDetailMap[aid] || {};

        return {
            review_id: review.review_id.toString(),
            user_activity_id: review.user_activity_id.toString(),
            user_id: review.user_id.toString(),
            activity_id: aid,
            content: review.content,
            rate: review.rate,
            created_at: review.created_at,
            updated_at: review.updated_at,
            activity_type: activityInfo.activity_type || null,
            detailedInfo: activityInfo.detailedInfo || null
        };
    });
};
