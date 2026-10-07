// [MOCK-MIGRATION] original API code commented out - backend unavailable
/*
import { Axios } from "../../constants/mainContent";

export const userRegister = async (payload) => {
  try {
    const response = await Axios.post("/user/register", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}; 

export const userVerify = async (payload) => {
  try {
    const response = await Axios.post("/user/verify-otp", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const userLogin = async (payload) => {
  try {
    const response = await Axios.post("/user/login", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const resendOtp = async (payload) => {
  try {
    const response = await Axios.post("/user/resend-otp", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getProfile = async(role) => {
    try {
        const response = await Axios.get(`/${role}/profile`);
        return response?.data;
    } catch (error) {
        console.log(error);
        return error?.response?.data;
    }
}

export const editProfile = async (payload) => {
  try {
    const response = await Axios.put("/user/update-profile", payload);
    return response.data;
  } catch (error) {
    console.error(error);
    return error?.response?.data || { success: false, message: "Update failed" };
  }
};
*/

import { delay, ok, fail } from "../../mock/mockDelay";
import { mockDb } from "../../mock/mockDb";

// Temporary pending-OTP store (in-memory; survives page refresh via sessionStorage)
const getPendingUsers = () => {
  try {
    return JSON.parse(sessionStorage.getItem("whiold_pending_users") || "{}");
  } catch {
    return {};
  }
};
const setPendingUsers = (data) => {
  sessionStorage.setItem("whiold_pending_users", JSON.stringify(data));
};

export const userRegister = async (payload) => {
  await delay(600);
  const existing = mockDb.findUserByEmail(payload.email);
  if (existing) {
    return fail("An account with this email already exists.");
  }
  // Store pending registration awaiting OTP
  const pending = getPendingUsers();
  pending[payload.email] = { ...payload, otp: "123456" };
  setPendingUsers(pending);
  return ok(null, "OTP sent to your email. Use 123456 to verify.");
};

export const userVerify = async (payload) => {
  await delay(500);
  // OTP "123456" is always accepted (demo mode)
  if (payload.otp !== "123456") {
    return fail("Invalid OTP. Please try again.");
  }
  const pending = getPendingUsers();
  const userData = pending[payload.email];
  if (!userData) {
    return fail("Session expired. Please register again.");
  }
  // Create the user in mockDb
  const newUser = mockDb.addUser(userData);
  delete pending[payload.email];
  setPendingUsers(pending);
  return ok(newUser, "Account verified successfully! You can now log in.");
};

export const userLogin = async (payload) => {
  await delay(500);
  const email = payload?.email || payload?.userId;
  const pass = payload?.password;
  const user = mockDb.findUserByEmail(email);

  if (!user) return fail("No account found with this email.");
  if (user.password !== pass) return fail("Incorrect password.");
  if (user.blocked) return fail("Your account has been blocked. Please contact support.");

  // [MOCK-MIGRATION] Store email hint so getProfile can resolve the user after page reload
  sessionStorage.setItem("whiold_logged_email", user.email);

  return {
    success: true,
    message: "Logged in successfully!",
    token: "mock_user_token_abc123",
    role: "user",
    data: user,
  };
};

export const resendOtp = async (payload) => {
  await delay(400);
  // In demo mode OTP is always 123456; just acknowledge
  return ok(null, "OTP resent. Use 123456 to verify.");
};

export const getProfile = async (role) => {
  await delay(300);
  // Resolve the logged-in user's email from the mock token stored in sessionStorage.
  // The token values are set by userLogin/AdminLoginApi — both are deterministic strings.
  const token = sessionStorage.getItem("token");
  let email;
  if (token === "mock_admin_token_xyz987" || role === "admin") {
    email = "admin@whiold.com";
  } else {
    // For non-admin users, derive email from a persisted hint (set on login below)
    email = sessionStorage.getItem("whiold_logged_email") || "user@whiold.com";
  }
  const user = mockDb.findUserByEmail(email);
  if (user) return ok(user);
  return fail("Profile not found");
};

export const editProfile = async (payload) => {
  await delay(500);
  const updated = mockDb.updateUserProfile(payload);
  if (updated) return ok(updated, "Profile updated successfully.");
  return fail("Profile update failed.");
};