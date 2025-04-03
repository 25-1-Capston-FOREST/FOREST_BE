import { addUserActivity, listUserActivity, updateDate, updateStatus, deleteUserActivity } from "../repositories/book.repository.js";

export const addBook = async (userId, activityId, activityDate) => {
    return await addUserActivity(userId, activityId, activityDate);
}

export const getUserActivity = async (userId, status) => {
    return await listUserActivity(userId, status);
}

export const modifyDate = async (id, activityDate) => {
    return await updateDate(id, activityDate);
}

export const finishActivity = async (id) => {
    return await updateStatus(id);
}

export const cancelActivity = async (id) => {
    return await deleteUserActivity(id);
}