// [MOCK-MIGRATION] original API code commented out - backend unavailable
/*
import { Axios } from "../../constants/mainContent";

export const AdminLoginApi = async (payload) => {
  try {
    const response = await Axios.post(`/admin/login`, payload);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data 
  }
};
*/

import { delay, ok, fail } from "../../mock/mockDelay";
import { mockDb } from "../../mock/mockDb";

export const AdminLoginApi = async (payload) => {
  await delay(400);
  const email = payload?.email || payload?.userId;
  const pass = payload?.password;

  if (email === "admin@whiold.com" && pass === "123456") {
    const adminUser = mockDb.findUserByEmail("admin@whiold.com");
    return {
      success: true,
      message: "Admin logged in successfully!",
      token: "mock_admin_token_xyz987",
      role: "admin",
      data: {
        ...adminUser,
        role: "admin",
      },
    };
  }

  return fail("Invalid email or password");
};