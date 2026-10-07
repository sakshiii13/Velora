// [MOCK-MIGRATION] original API code commented out - backend unavailable
/*
import { Axios, backendConfig } from "../../constants/mainContent";
const origin = backendConfig?.base;

export const getAllSubCategoriesByCategory = async (id) => {
    try {
        const response = await Axios.get(`${origin}/admin/get-active-sub-category-by-category/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data
    }
};

export const getAllActiveCategories = async () => {
    try {
        const response = await Axios.get(`${origin}/admin/get-active-category-for-sub-category`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data
    }
};
*/

import { delay, ok } from "../../mock/mockDelay";
import { mockDb } from "../../mock/mockDb";

export const getAllSubCategoriesByCategory = async (id) => {
  await delay(400);
  const subs = mockDb.getSubCategories().filter(s => {
    const catId = typeof s.category === "object" ? s.category?._id : s.category;
    return s.isActive !== false && (!id || catId === id);
  });
  return ok(subs);
};

export const getAllActiveCategories = async () => {
  await delay(400);
  const categories = mockDb.getCategories().filter(c => c.isActive !== false);
  return ok(categories);
};
