// [MOCK-MIGRATION] original API code commented out - backend unavailable
/*
import { Axios } from "../../constants/mainContent";

export const getAllOrders = async () => {
  try {
    const response = await Axios.get("/user/get-orders");
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

export const getOrderByID = async (id) => {
  try {
    const response = await Axios.get(`/user/get-order-details-by-invoice-number/${id}`);
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

export const getAllOrdersByID = async (id) => {
  try {
    const response = await Axios.get(`/user/get-order-details/${id}`);
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};
*/

import { delay, ok, fail } from "../../mock/mockDelay";
import { mockDb } from "../../mock/mockDb";

export const getAllOrders = async () => {
  await delay(400);
  const orders = mockDb.getOrders();
  return ok(orders);
};

export const getOrderByID = async (id) => {
  await delay(400);
  const order = mockDb.getOrders().find(o => o.invoiceNumber === id || o._id === id);
  if (order) return ok(order);
  return fail("Order not found");
};

export const getAllOrdersByID = async (id) => {
  await delay(400);
  const order = mockDb.getOrders().find(o => o._id === id || o.invoiceNumber === id);
  if (order) return ok(order);
  return fail("Order not found");
};
