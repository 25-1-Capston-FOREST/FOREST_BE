import { StatusCodes } from "http-status-codes";
import { addWish } from "../services/wish.service.js";

// 여가 찜하기
export const handleAddWish = async (req , res , next) => {
    try{
        const userId = req.user.id;
        const { id } = req.query;

        if(!userId){
            return res.status(StatusCodes.UNAUTHORIZED).json({success: false, message: "사용자 인증 실패"});
        }
        if(!id){
            return res.status(400).json({message: "id가 쿼리에 필요합니다."});
        }

        const result = await addWish(userId, id);
        if(!result){
            throw new Error();
        }
        res.status(StatusCodes.OK).json({ success: true, message: "여가를 성공적으로 찜했습니다.", data: result});
    }catch(error){
        console.log("여가 찜 오류", error.message);
        next(error);
    }
}
