import { StatusCodes } from "http-status-codes";
import { userReviewDTO } from "../dtos/review.dto.js";
import { addReview, getUserReview } from "../services/review.service.js";

// 리뷰 작성
export const handleAddReview = async (req , res , next) => {
    try{
        const userId = req.user.id;
        const { id } = req.query;

        if(!userId){
            return res.status(StatusCodes.UNAUTHORIZED).json({success: false, message: "사용자 인증 실패"});
        }
        if(!id){
            return res.status(400).json({ success: false, message: "id가 쿼리에 필요합니다." });
        }

        const result = await addReview(userId, id, userReviewDTO(req.body));
        if(!result){
            throw new Error();
        }
        res.status(StatusCodes.OK).json({ success: true, message: "리뷰를 성공적으로 작성했습니다.", data: result});
    }catch(error){
        console.log("리뷰 작성 오류", error.message);
        next(error);
    }
}

// 사용자 리뷰 조회
export const handleGetUserReview = async (req , res , next) => {
    try{
        const userId = req.user.id;

        if(!userId){
            return res.status(StatusCodes.UNAUTHORIZED).json({success: false, message: "사용자 인증 실패"});
        }

        const result = await getUserReview(userId);
        if(!result){
            throw new Error();
        }
        res.status(StatusCodes.OK).json({ success: true, message: "리뷰를 성공적으로 조회했습니다.", data: result});
    }catch(error){
        console.log("사용자 리뷰 조회 오류", error.message);
        next(error);
    }
}