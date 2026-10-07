// [MOCK-MIGRATION] original API code commented out - backend unavailable
/*
import { Axios } from "../../constants/mainContent";

export const createCategory = async (payload) => {
  try {
    const response = await Axios.post(`/admin/category`, payload);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data 
  }
};
export const getAllCategories = async () => {
  try {
    const response = await Axios.get(`/admin/category`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data 
  }
};
export const editCategory = async (payload) => {
  try {
    const response = await Axios.put(`/admin/category`, payload);    
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data 
  }
};
 export const toggleCategory = async (payload) => {
  try {
    const response = await Axios.patch(`/admin/category`, payload);    
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data 
  }
};  

// ==================================getProductsBySubCategory  and getProductsByCategory===================================
export const getProductsBySubCategory = async (subCategoryId) => {
  try {
    const response = await Axios.get(`/admin/get-products-by-subcat/${subCategoryId}`);    
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data 
  }
}
export const getProductsByCategory = async () => {
  try {
    const response = await Axios.get(`/admin/category`);    
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data 
  }
}

// ===================Create Orderrs==================
export const createOrderApi = async (payload) => {
  try {
    const response = await Axios.post(`/admin/create-order`, payload);    
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data 
  }
}

// =================== SubCategories ===================
export const createSubCategory = async (payload) => {
  try {
    const response = await Axios.post(`/admin/sub-category`, payload);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};

export const getAllSubCategories = async () => {
  try {
    const response = await Axios.get(`/admin/sub-category`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};

export const editSubCategory = async (payload) => {
  try {
    const response = await Axios.put(`/admin/sub-category`, payload);    
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};
*/

import { delay, ok } from "../../mock/mockDelay";
import { mockDb } from "../../mock/mockDb";

export const createCategory = async (payload) => {
  await delay(400);
  const newCat = mockDb.addCategory(payload);
  return ok(newCat, "Category created successfully");
};

export const getAllCategories = async () => {
  await delay(400);
  const categories = mockDb.getCategories();
  return ok(categories);
};

export const editCategory = async (payload) => {
  await delay(400);
  const updated = mockDb.updateCategory(payload);
  return ok(updated, "Category edited successfully");
};

export const toggleCategory = async (payload) => {
  await delay(400);
  const item = mockDb.toggleCategory(payload?.id || payload?._id);
  return ok(item, "Category status updated");
};

export const getProductsBySubCategory = async (subCategoryId) => {
  await delay(400);
  const products = mockDb.getProducts().filter(p => {
    const subId = typeof p.subCategory === "object" ? p.subCategory?._id : p.subCategory;
    return subId === subCategoryId;
  });
  return ok(products);
};

export const getProductsByCategory = async (categoryId) => {
  await delay(400);
  const products = mockDb.getProducts().filter(p => {
    const catId = typeof p.category === "object" ? p.category?._id : p.category;
    return !categoryId || catId === categoryId;
  });
  return ok(products);
};

export const createOrderApi = async (payload) => {
  await delay(400);
  const newOrder = mockDb.createOrder(payload);
  return ok(newOrder, "Order created successfully");
};

export const createSubCategory = async (payload) => {
  await delay(400);
  const newSub = mockDb.addSubCategory(payload);
  return ok(newSub, "Subcategory created successfully");
};

export const getAllSubCategories = async () => {
  await delay(400);
  const list = mockDb.getSubCategories();
  const categories = mockDb.getCategories();
  // Populate category objects if needed
  const populated = list.map(sub => {
    const catId = typeof sub.category === "object" ? sub.category?._id : sub.category;
    const catObj = categories.find(c => c._id === catId) || { _id: catId, name: "Category" };
    return { ...sub, category: catObj };
  });
  return ok(populated);
};

export const editSubCategory = async (payload) => {
  await delay(400);
  const updated = mockDb.updateSubCategory(payload);
  return ok(updated, "Subcategory updated successfully");
};