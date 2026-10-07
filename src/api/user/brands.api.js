// [MOCK-MIGRATION] original API code commented out - backend unavailable
/*
import { Axios } from "../../constants/mainContent";

export const getBrandsApi = async () => {
  try {
    const response = await Axios.get(`/user/brands`);    
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};
*/

import { delay, ok } from "../../mock/mockDelay";
import { mockDb } from "../../mock/mockDb";

export const getBrandsApi = async () => {
  await delay(400);
  const brands = mockDb.getBrands().filter(b => b.isActive !== false);
  return ok(brands);
};
