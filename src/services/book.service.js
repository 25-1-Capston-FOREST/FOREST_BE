import { addUserActivity } from "../repositories/book.repository.js";

export const addBook = async (userId, activityId, activityDate) => {
    return await addUserActivity(userId, activityId, activityDate);
}