// [MOCK-MIGRATION] original API code commented out - backend unavailable
/*
import { Axios } from "../../constants/mainContent";

export const addToCart = async (payload) => {
    try {
        const response = await Axios.post(`/user/cart`, payload);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};

export const getCart = async () => {
    try {
        const response = await Axios.get(`/user/cart`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};

export const updateCartQuantity = async (payload) => {
    try {
        const response = await Axios.patch(`/user/cart`, payload);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};

export const deleteCartProduct = async (payload) => {
    try {
        const response = await Axios.put(`/user/cart`, payload);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
};
*/

import { delay, ok } from "../../mock/mockDelay";
import { mockDb } from "../../mock/mockDb";

export const addToCart = async (payload) => {
  await delay(400);
  const cart = mockDb.addToCart(payload);
  return ok(cart, "Added to cart successfully");
};

export const getCart = async () => {
  await delay(400);
  const cart = mockDb.getCart();
  return ok(cart);
};

export const updateCartQuantity = async (payload) => {
  await delay(400);
  const cart = mockDb.updateCartQuantity(payload);
  return ok(cart, "Cart quantity updated");
};

export const deleteCartProduct = async (payload) => {
  await delay(400);
  const cart = mockDb.deleteCartProduct(payload);
  return ok(cart, "Item removed from cart");
};