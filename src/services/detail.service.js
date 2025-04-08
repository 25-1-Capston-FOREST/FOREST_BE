import { getActivityById, getActivityDetailById } from "../repositories/detail.repository.js";

export const getActivityDetail = async(activityId) => {
    const activity = await getActivityById(activityId);
    const result = await getActivityDetailById(activity.activity_type, activity.activity_id);
    return result;
    
}