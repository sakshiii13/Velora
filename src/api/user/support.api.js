// [MOCK-MIGRATION] original API code commented out - backend unavailable
/*
import { Axios } from "../../constants/mainContent";

// Local storage mock helpers for seamless local simulation
const getLocalTickets = () => {
  const data = localStorage.getItem("support_tickets");
  return data ? JSON.parse(data) : [];
};

const saveLocalTickets = (tickets) => {
  localStorage.setItem("support_tickets", JSON.stringify(tickets));
};

export const createTicketApi = async (payload) => {
  try {
    const response = await Axios.post("/user/contact-us", payload);
    return response.data;
  } catch (error) {
    console.warn("API error, falling back to local simulation:", error);
    return error.response?.data || { success: false, message: "Error" };
  }
};

export const getUserTicketsApi = async () => {
  try {
    const response = await Axios.get("/user/my-query");
    return response.data;
  } catch (error) {
    console.warn("API error, falling back to local simulation:", error);
    return error.response?.data || { success: false, message: "Error", data: [] };
  }
};

export const getTicketDetailsApi = async (ticketId) => {
  try {
    const response = await Axios.get(`/support/ticket/${ticketId}`);
    return response.data;
  } catch (error) {
    console.warn("API error, falling back to local simulation:", error);
    return error.response?.data || { success: false, message: "Error" };
  }
};
*/

import { delay, ok, fail } from "../../mock/mockDelay";
import { mockDb } from "../../mock/mockDb";

export const createTicketApi = async (payload) => {
  await delay(500);
  const ticket = mockDb.createTicket(payload);
  return ok(ticket, "Your support request has been submitted successfully.");
};

export const getUserTicketsApi = async () => {
  await delay(400);
  // Return tickets belonging to the demo user
  const demoUser = mockDb.findUserByEmail("user@whiold.com");
  const tickets = mockDb.getTickets().filter(
    t => !demoUser || t.user?._id === demoUser._id
  );
  return ok(tickets);
};

export const getTicketDetailsApi = async (ticketId) => {
  await delay(300);
  const ticket = mockDb.getTickets().find(
    t => t._id === ticketId || t.ticketId === ticketId
  );
  if (ticket) return ok(ticket);
  return fail("Ticket not found");
};
