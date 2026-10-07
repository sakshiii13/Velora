// [MOCK-MIGRATION] original API code commented out - backend unavailable
/*
import { Axios } from "../../constants/mainContent";

export const getAllUsers = async () => {
  try {
    const response = await Axios.get(`/admin/get-all-users`);
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

export const toggleUsersStatus = async (id) => {
  try {
    const response = await Axios.get(`/admin/update-user-block/${id}`);
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

export const accessUser = async (userId) => {
  try {
    const response = await Axios.post(`/admin/access-user`, { userId });
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};
*/

import { delay, ok, fail } from "../../mock/mockDelay";
import { mockDb } from "../../mock/mockDb";

export const getAllUsers = async () => {
  await delay(400);
  const users = mockDb.getUsers();
  return ok(users);
};

export const toggleUsersStatus = async (id) => {
  await delay(400);
  const user = mockDb.toggleUserBlock(id);
  if (user) {
    return ok(user, `User ${user.blocked ? "blocked" : "unblocked"} successfully`);
  }
  return fail("User not found");
};

export const accessUser = async (userId) => {
  await delay(400);
  const users = mockDb.getUsers();
  const target = users.find(u => u._id === userId || u.userId === userId);
  if (target) {
    return {
      success: true,
      message: "Impersonation access granted",
      token: `mock_impersonate_token_${target._id}`,
      user: {
        ...target,
        role: "user",
      },
      data: {
        token: `mock_impersonate_token_${target._id}`,
        user: {
          ...target,
          role: "user",
        }
      }
    };
  }
  return fail("User not found");
};
