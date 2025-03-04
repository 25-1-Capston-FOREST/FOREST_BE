import { StatusCodes } from "http-status-codes";
import { addBook, getUserActivity, modifyDate } from "../services/book.service.js";

// 여가 예약 추가
export const handleAddBook = async (req,res,next) => {
    try{
        const userId = req.user.id;
        const { activityId } = req.query;
        const { activityDate } = req.body;

        if(!userId){
            return res.status(StatusCodes.UNAUTHORIZED).json({success: false, message: "사용자 인증 실패"});
        }
        if(!activityId){
            return res.status(400).json({message: "acticityId가 필요합니다"});
        }
        if(!activityDate){
            return res.status(401).json({message: "activityDate가 필요합니다"});
        }

        const result = await addBook(userId, activityId, activityDate);
        if(!result){
            throw new Error();
        }
        
        res.status(StatusCodes.OK).json({ success: true, message: "예약이 성공적으로 추가되었습니다.", data: result });
    }catch(error){
        console.log("예약 추가 오류", error.message);
        next(error);
    }
};

// 쿼리(status:0/1)에 맞는 여가 조회
export const handleGetUserActivity = async (req,res,next) => {
    try{
        const userId = req.user.id;
        const { status } = req.query;

        if(!userId){
            return res.status(StatusCodes.UNAUTHORIZED).json({success: false, message: "사용자 인증 실패"});
        }
        if(!status){
            return res.status(400).json({message: "status가 필요합니다"});
        }

        const result = await getUserActivity(userId, status);
        if(!result){
            throw new Error();
        }

        res.status(StatusCodes.OK).json({ success: true, message: "사용자 여가 목록이 성공적으로 조회되었습니다.", data: result });
    }catch(error){
        console.log("예약 목록 조회 오류", error.message);
        next(error);

    }
};

// 여가 예약 날짜 수정
export const handleModifyDate = async(req,res,next) => {
    try{
        const userId = req.user.id;
        const { id } = req.query;
        const { activityDate } = req.body;

        if(!userId){
            return res.status(StatusCodes.UNAUTHORIZED).json({success: false, message: "사용자 인증 실패"});
        }
        if(!activityDate){
            return res.status(400).json({message: "수정할 date값이 필요합니다"});
        }
        const result = await modifyDate(userId, id, activityDate);
        if(!result){
            throw new Error();
        }

        res.status(StatusCodes.OK).json({ success: true, message: "여가 예약 날짜가 성공적으로 변경되었습니다.", data: result });
    }catch(error){
        console.log("예약 날짜 변경 오류", error.message);
        next(error);
    }
}
