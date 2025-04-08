import { StatusCodes } from "http-status-codes";
import { getActivityDetail } from "../services/detail.service.js";

// 상세 페이지 조회
export const handleGetActivityDetail = async(req, res, next) => {
    try{
        const { id } = req.query; // id: activity_id

        if(!id){
            return res.status(400).json({message: "activity id가 필요합니다"});
        }

        const result = await getActivityDetail(id);
        if(!result){
            throw new Error();
        }
                
        res.status(StatusCodes.OK).json({ success: true, message: "여가 상세 정보가 성공적으로 조회되었습니다.", data: result });
    }catch(error){
        console.log("예약 상세 조회 오류", error.message);
        next(error);
    }
}