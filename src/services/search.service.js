import { findActivitiesByKeyword } from "../repositories/search.repository.js";

export const searchActivities = async(keyword) => {
    return await findActivitiesByKeyword(keyword);
}