import { addUserActivity, listUserActivity, updateDate } from "../repositories/book.repository.js";

export const addBook = async (userId, activityId, activityDate) => {
    return await addUserActivity(userId, activityId, activityDate);
}

export const getUserActivity = async (userId, status) => {
    return await listUserActivity(userId, status);
}

export const modifyDate = async (userId, id, activityDate) => {
    return await updateDate(userId, id, activityDate);
}