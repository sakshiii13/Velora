// [MOCK-MIGRATION] original API code commented out - backend unavailable
/*
import { Axios } from "../../constants/mainContent";

export const getAllCategories = async () => {
    try {
        const response = await Axios.get(`/user/get-all-active-category`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};
*/

import { delay, ok } from "../../mock/mockDelay";
import { mockDb } from "../../mock/mockDb";

export const getAllCategories = async () => {
  await delay(400);
  const activeCategories = mockDb.getCategories().filter(c => c.isActive !== false);
  return ok(activeCategories);
};