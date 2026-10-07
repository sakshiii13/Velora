// [MOCK-MIGRATION] original API code commented out - backend unavailable
/*
import { Axios } from "../../constants/mainContent";

export const getAllProducts = async () => {
  try {
    const response = await Axios.get("/user/get-all-active-products");
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

export const getProductDetailsById = async (id) => {
  try {
    const response = await Axios.get(`/user/get-product-details-by-id/${id}`);
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

export const getBestSellerProducts = async () => {
  try {
    const response = await Axios.get("/user/best-seller");
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

export const getNewArrivalProducts = async () => {
  try {
    const response = await Axios.get("/user/get-ten-landing-products");
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

export const getProductsByCategory = async (payload) => {
  try {
    const response = await Axios.get(`/user/get-products-by-category/${payload}`);
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

export const getProductsByCategoryAndSub = async (cat, subCat) => {
  try {
    const response = await Axios.get(`/user/get-products-by-cat-and-subcat/${cat}/${subCat}`);
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};
*/

import { delay, ok, fail } from "../../mock/mockDelay";
import { mockDb } from "../../mock/mockDb";

export const getAllProducts = async () => {
  await delay(400);
  const products = mockDb.getProducts().filter(p => p.isActive);
  return ok(products);
};

export const getProductDetailsById = async (id) => {
  await delay(300);
  const product = mockDb.getProducts().find(p => p._id === id);
  if (product) return ok(product);
  return fail("Product not found");
};

export const getBestSellerProducts = async () => {
  await delay(400);
  const products = mockDb.getProducts().filter(p => p.isActive && p.isBestSeller);
  return ok(products);
};

export const getNewArrivalProducts = async () => {
  await delay(400);
  // Return up to 10 most recently created active products
  const products = mockDb.getProducts()
    .filter(p => p.isActive)
    .slice(0, 10);
  return ok(products);
};

export const getProductsByCategory = async (categoryId) => {
  await delay(400);
  const products = mockDb.getProducts().filter(
    p => p.isActive && (p.category?._id === categoryId || p.category?.slug === categoryId)
  );
  return ok(products);
};

export const getProductsByCategoryAndSub = async (cat, subCat) => {
  await delay(400);
  const products = mockDb.getProducts().filter(
    p =>
      p.isActive &&
      (p.category?._id === cat || p.category?.slug === cat) &&
      (p.subCategory?._id === subCat || p.subCategory?.slug === subCat)
  );
  return ok(products);
};
