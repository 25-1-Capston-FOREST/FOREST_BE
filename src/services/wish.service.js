 import { addUserWish } from "../repositories/wish.repository.js"
 
 export const addWish = async (userId, id) => {
    return await addUserWish(userId, id);
 }