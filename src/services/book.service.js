import { addUserActivity, listUserActivity } from "../repositories/book.repository.js";

export const addBook = async (userId, activityId, activityDate) => {
    return await addUserActivity(userId, activityId, activityDate);
}

export const getUserActivity = async (userId, status) => {
    return await listUserActivity(userId, status);
}