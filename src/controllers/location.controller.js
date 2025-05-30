import { StatusCodes } from "http-status-codes";
import { getLocation } from "../services/location.service.js";

// 클라이언트에 위경도 전달
export const handleGetLocation = async(req , res , next) => {
    try{
        const { id } = req.query; // id: activity_id

        const result = await getLocation(id);
        res.status(StatusCodes.OK).json({ success: true, message: "해당 여가의 위치 정보가 조회되었습니다.", data: result });

    }catch(error){
        console.log("위치 정보 조회 오류", error.message);
        return null;
    }
}