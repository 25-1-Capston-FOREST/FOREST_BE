import { prisma } from "../db.config.js"

export const addUserWish = async (userId, id) => {
    // 아마 찜하기 한 여가인지 확인
    const existingWish = await prisma.uSER_ACTIVITY.findFirst({
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