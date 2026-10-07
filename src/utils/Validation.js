
export const validateEmail = (email) => {
  if (!email) {
    return "Email is required.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Please enter a valid email address.";
  }

  return "";
};


export const validatePhone = (phone) => {
  if (!phone) {
    return "Phone number is required.";
  }

  const phoneRegex = /^[6-9]\d{9}$/;

  if (!phoneRegex.test(phone)) {
    return "Please enter a valid 10-digit mobile number.";
  }

  return "";
};

export const validatePassword = (password) => {
  if (!password) {
    return "Password is required.";
  }

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

  if (!passwordRegex.test(password)) {
    return "Password must be at least 8 characters long and include 1 uppercase letter, 1 number, and 1 special character.";
  }

  return "";
};


export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return "Confirm Password is required.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return "";
};