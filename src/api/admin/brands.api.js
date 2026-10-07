// [MOCK-MIGRATION] original API code commented out - backend unavailable
/*
import { Axios } from "../../constants/mainContent";

export const uploadBrandsApi = async (payload) => {
  try {
    const response = await Axios.post(`admin/brands`, payload);    
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};

export const getAllBrandsApi = async () => {
  try {
    const response = await Axios.get(`admin/brands`);    
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};

export const deleteBrandsApi = async (payload) => {
  try {
    const response = await Axios.put(`admin/brands`, payload);    
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};

export const toggleBrandsApi = async (payload) => {
  try {
    const response = await Axios.patch(`admin/brands`, payload);    
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};
*/

import { delay, ok, fail } from "../../mock/mockDelay";
import { mockDb } from "../../mock/mockDb";

export const uploadBrandsApi = async (payload) => {
  await delay(400);
  const newBrand = mockDb.addBrand(payload);
  return ok(newBrand, "Brand uploaded successfully");
};

export const getAllBrandsApi = async () => {
  await delay(400);
  const brands = mockDb.getBrands();
  return ok(brands);
};

export const deleteBrandsApi = async (payload) => {
  await delay(400);
  const id = payload?.id || payload?.brandId;
  mockDb.deleteBrand(id);
  return ok(null, "Brand deleted successfully");
};

export const toggleBrandsApi = async (payload) => {
  await delay(400);
  const id = payload?.id || payload?.brandId;
  const item = mockDb.toggleBrand(id, payload?.isActive);
  return ok(item, "Brand status updated");
};
