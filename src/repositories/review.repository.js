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

// Review 테이블에서 해당 사용자 리뷰 조회
export const listUserReview = async(userId) => {
    const result = await prisma.rEVIEW.findMany({
        where: { user_id: userId }
    })

    // 결과가 없을 경우 빈 배열 반환
    if (!result || result.length === 0) return [];

    // BigInt를 문자열로 변환한 후 반환
    return result.map(review => ({
        ...review,
        review_id: review.review_id.toString(),
        user_activity_id: review.user_activity_id.toString(),
        user_id: review.user_id.toString(),
        activity_id: review.activity_id.toString(),
    }));
}