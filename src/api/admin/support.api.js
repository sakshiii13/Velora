// [MOCK-MIGRATION] original API code commented out - backend unavailable
/*
import { Axios } from "../../constants/mainContent";

export const getAllTicketsApi = async () => {
  try {
    const response = await Axios.get("/admin/get-contact-us");
    return response.data;
  } catch (error) {
    console.warn("API error, falling back to local simulation:", error);
    return error.response?.data || { success: false, message: "Error", data: [] };
  }
};

export const replyToTicketApi = async (ticketId, replyText) => {
  try {
    const response = await Axios.post(`/admin/support/reply/${ticketId}`, { replyText });
    return response.data;
  } catch (error) {
    console.warn("API error, falling back to local simulation:", error);
    return error.response?.data || { success: false, message: "Error" };
  }
};

export const updateTicketStatusApi = async (ticketId, status, message) => {
  try {
    const response = await Axios.post(`/admin/update-contact-us/${ticketId}`, { status, message });
    return response.data;
  } catch (error) {
    console.warn("API error, falling back to local simulation:", error);
    return error.response?.data || { success: false, message: "Error" };
  }
};
*/

import { delay, ok } from "../../mock/mockDelay";
import { mockDb } from "../../mock/mockDb";

export const getAllTicketsApi = async () => {
  await delay(400);
  const tickets = mockDb.getTickets();
  return ok(tickets);
};

export const replyToTicketApi = async (ticketId, replyText) => {
  await delay(400);
  const ticket = mockDb.replyTicket(ticketId, replyText);
  return ok(ticket, "Reply sent successfully");
};

export const updateTicketStatusApi = async (ticketId, status, message) => {
  await delay(400);
  const ticket = mockDb.updateTicketStatus(ticketId, status, message);
  return ok(ticket, `Ticket status updated to ${status}`);
};
