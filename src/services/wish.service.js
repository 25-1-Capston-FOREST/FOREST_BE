 import { addUserWish, deleteUserWish } from "../repositories/wish.repository.js"
 
 export const addWish = async (userId, id) => {
    return await addUserWish(userId, id);
 }

 export const deleteWish = async (id) => {
    return await deleteUserWish(id);
 }