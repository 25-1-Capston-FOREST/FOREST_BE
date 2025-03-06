import { addUserReview } from "../repositories/review.repository.js";

export const addReview = async(userId, id, data) => {
    return await addUserReview(userId, id, data);
}