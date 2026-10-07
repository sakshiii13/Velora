// [MOCK-MIGRATION] original API code commented out - backend unavailable
/*
import { Axios } from "../../constants/mainContent";

export const getAllPendingOrders = async () => {
  try {
    const response = await Axios.get(`/admin/get-pending-orders`);    
    return response.data;
  } catch (error) {
    return error.response?.data 
  }
};

export const getAllDeliveredOrders = async () => {
  try {
    const response = await Axios.get(`/admin/get-delivered-orders`);    
    return response.data;
  } catch (error) {
    return error.response?.data 
  }
};

export const getAllCancelledOrders = async () => {
  try {
    const response = await Axios.get(`/admin/get-cancelled-orders`);    
    return response.data;
  } catch (error) {
    return error.response?.data 
  }
};

export const updateOrderStatus = async (id, payload) => {
  try {
    const response = await Axios.put(`/admin/update-order/${id}`, payload);    
    return response.data;
  } catch (error) {
    return error.response?.data 
  }
};

export const postDeliveryDetails = async (id, payload) => {
  try {
    const response = await Axios.put(`/admin/add-delivery/${id}`, payload);    
    return response.data;
  } catch (error) {
    return error.response?.data 
  }
};

export const getAllOrdersByID = async (id) => {
  try {
    const response = await Axios.get(`/admin/get-order-details/${id}`);
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};
*/

import { delay, ok, fail } from "../../mock/mockDelay";
import { mockDb } from "../../mock/mockDb";

export const getAllPendingOrders = async () => {
  await delay(400);
  const orders = mockDb.getOrders().filter(o => {
    const st = o.orderStatus?.toUpperCase();
    return st === "PENDING" || st === "CONFIRMED" || st === "DISPATCH" || st === "CREATED";
  });
  return ok(orders);
};

export const getAllDeliveredOrders = async () => {
  await delay(400);
  const orders = mockDb.getOrders().filter(o => o.orderStatus?.toUpperCase() === "DELIVERED");
  return ok(orders);
};

export const getAllCancelledOrders = async () => {
  await delay(400);
  const orders = mockDb.getOrders().filter(o => o.orderStatus?.toUpperCase() === "CANCELLED");
  return ok(orders);
};

export const updateOrderStatus = async (id, payload) => {
  await delay(400);
  const updated = mockDb.updateOrderStatus(id, payload?.orderStatus);
  if (updated) {
    return ok(updated, `Order status updated to ${payload?.orderStatus}`);
  }
  return fail("Order not found");
};

export const postDeliveryDetails = async (id, payload) => {
  await delay(400);
  const updated = mockDb.postDeliveryDetails(id, payload);
  if (updated) {
    return ok(updated, "Delivery details updated successfully");
  }
  return fail("Order not found");
};

export const getAllOrdersByID = async (id) => {
  await delay(400);
  const order = mockDb.getOrders().find(o => o._id === id || o.invoiceNumber === id);
  if (order) {
    return ok(order);
  }
  return fail("Order not found");
};
