export const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const ok = (data = null, message = "Success") => ({
  success: true,
  message,
  data,
});

export const fail = (message = "Operation failed") => ({
  success: false,
  message,
});
