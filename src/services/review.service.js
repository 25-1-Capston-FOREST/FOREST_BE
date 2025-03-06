import { addUserReview, listUserReview } from "../repositories/review.repository.js";

export const addReview = async(userId, id, data) => {
    return await addUserReview(userId, id, data);
}

export const getUserReview = async(userId) => {
    return await listUserReview(userId);
}