// [MOCK-MIGRATION] original API code commented out - backend unavailable
/*
import { Axios, backendConfig } from "../../constants/mainContent";
const origin = backendConfig?.base;

export const createProduct = async (payload) => {
  try {
    const response = await Axios.post(`${origin}/admin/product`, payload);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data 
  }
};

export const getAllProducts = async () => {
  try {
    const response = await Axios.get(`${origin}/admin/product`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data 
  }
};

export const editProduct = async (payload) => {
  try {
    const response = await Axios.put(`${origin}/admin/product`, payload);    
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data 
  }
};

export const toggleProduct = async (payload) => {
  try {
    const response = await Axios.patch(`${origin}/admin/product`, payload);    
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data 
  }
};  

// =====================best seller api=========================
export const toggleBestSeller = async (payload) => {
  try {
    const response = await Axios.patch(`${origin}/admin/best-seller`, payload);    
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data 
  }
};

export const getAllBestSellers = async () => {
  try {
    const response = await Axios.get(`${origin}/admin/best-seller`);    
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data 
  }
};
*/

import { delay, ok, fail } from "../../mock/mockDelay";
import { mockDb } from "../../mock/mockDb";

export const createProduct = async (payload) => {
  await delay(400);
  const created = mockDb.addProduct(payload);
  return ok(created, "Product created successfully");
};

export const getAllProducts = async () => {
  await delay(400);
  const products = mockDb.getProducts();
  return ok(products);
};

export const editProduct = async (payload) => {
  await delay(400);
  const updated = mockDb.updateProduct(payload);
  return ok(updated, "Product updated successfully");
};

export const toggleProduct = async (payload) => {
  await delay(400);
  const updated = mockDb.toggleProduct(payload?.id || payload?._id, payload?.isActive);
  return ok(updated, "Product status updated");
};

export const toggleBestSeller = async (payload) => {
  await delay(400);
  const updated = mockDb.toggleBestSeller(payload?.productId || payload?.id || payload?._id, payload?.isBestSeller);
  return ok(updated, "Best seller status updated");
};

export const getAllBestSellers = async () => {
  await delay(400);
  const products = mockDb.getProducts().filter(p => p.isBestSeller);
  return ok(products);
};
