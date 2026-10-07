import React, { useState, useRef } from "react";
import { ArrowRight, ArrowLeft, UserPlus, KeyRound, X } from "lucide-react";
import { Dialog, DialogContent, IconButton, Typography, Box, Slide } from "@mui/material";
import InputComponent from "../../../ui/InputComponent";
import ButtonComponent from "../../../ui/ButtonComponent";
import SnackBar from "../../../ui/SnackBar";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../layout/AuthLayout";

import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
} from "../../../../utils/Validation";
import { userRegister, userVerify } from "../../../../api/user/users.api";
import { useAuth } from "../../../../context/AuthContext";
import { useSnackbar } from "../../../../context/SnackBarContext";
import { setRole, setToken } from "../../../../utils/authStorage";
import { Router, userRoutes } from "../../../../constants/router";

const SlideUp = React.forwardRef(function SlideUp(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { showLoader, hideLoader, login } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    referralId: "",
  });

  // OTP State
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef([]);

  const update = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.password ||
      !form.confirmPassword
    ) {
      showSnackbar("Please fill in all required fields.", "info");
      return;
    }

    if (form.name.trim().length < 2) {
      showSnackbar("Please enter a valid name.", "error");
      return;
    }

    const emailError = validateEmail(form.email);
    if (emailError) {
      showSnackbar(emailError, "error");
      return;
    }

    const phoneError = validatePhone(form.phone);
    if (phoneError) {
      showSnackbar(phoneError, "error");
      return;
    }

    const passwordError = validatePassword(form.password);
    if (passwordError) {
      showSnackbar(passwordError, "error");
      return;
    }

    const confirmPasswordError = validateConfirmPassword(
      form.password,
      form.confirmPassword,
    );
    if (confirmPasswordError) {
      showSnackbar(confirmPasswordError, "error");
      return;
    }

    const user = {
      name: form.name,
      email: form.email,
      mobile: form.phone,
      password: form.password,
      referralId: form?.referralId,
    };

    setLoading(true);
    showLoader();
    try {
      const res = await userRegister(user);
      if (res?.success) {
        showSnackbar(res?.message || "OTP sent successfully to your email.", "success");
        setShowOtpPopup(true);
      } else {
        showSnackbar(res?.message || "Something went wrong!", "error");
      }
    } catch (error) {
      showSnackbar(error?.message || "Internal server error!", "error");
    } finally {
      hideLoader();
      setLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Take only the last character entered
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      showSnackbar("Please enter the complete 6-digit OTP", "info");
      return;
    }
    showLoader();

    setVerifying(true);
    try {
      const res = await userVerify({ email: form.email, otp: enteredOtp, password: form.password });
      if (res?.success) {
        showSnackbar(res?.message || "Verification successful! You can now log in.", "success");
        setShowOtpPopup(false);
        setToken(res?.token);
        setRole(res?.role)
        login(res?.token, res?.data)
        navigate(userRoutes?.DASHBOARD);
      } else {
        showSnackbar(res?.message || "Invalid OTP", "error");
      }
    } catch (error) {
      showSnackbar(error?.message || "Internal server error!", "error");
    } finally {
      setVerifying(false);
      hideLoader();
    }
  };

  return (
    <AuthLayout>
      <div className="mb-4 sm:mb-5">
        <ButtonComponent
          variant="text"
          color="inherit"
          size="small"
          startIcon={<ArrowLeft size={15} />}
          onClick={() => navigate(Router?.HOME || "/")}
          sx={{
            color: "var(--whiold-text-muted)",
            paddingInline: "10px",
            fontSize: "13px",
            "&:hover": { background: "var(--whiold-primary-soft)", color: "var(--whiold-primary)" },
          }}
        >
          Back to Home
        </ButtonComponent>
      </div>

      <div className="mb-6 text-center sm:mb-8">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--whiold-primary-soft)] sm:mb-4 sm:h-14 sm:w-14">
          <UserPlus size={26} className="text-[var(--whiold-primary)] sm:hidden" />
          <UserPlus size={30} className="hidden text-[var(--whiold-primary)] sm:block" />
        </div>

        <h2 className="text-2xl font-bold text-[var(--whiold-text-heading)] sm:text-3xl">
          <span className="text-[var(--whiold-primary)] text-[28px] sm:text-4xl">Create</span>{" "}
          an Account
        </h2>

        <p className="mt-1.5 px-2 text-[13px] text-[var(--whiold-text-body)] sm:text-[14.5px]">
          Sign up to get started with your account.
        </p>
      </div>

      <div className="w-full rounded-[20px] border border-[var(--whiold-border)] bg-white/90 p-5 shadow-[var(--whiold-shadow-card)] backdrop-blur-sm sm:rounded-[28px] sm:p-9">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InputComponent
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={update("name")}
          />
          <InputComponent
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={update("email")}
          />
          <InputComponent 
            type="tel"
            placeholder="Mobile number"
            value={form.phone}
            onChange={update("phone")}
          />
          <InputComponent
            type="tel"
            placeholder="Referral ID"
            value={form.referralId}
            onChange={update("referralId")}
          />
          <InputComponent
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={update("password")}
          />
          <InputComponent
            type="password"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={update("confirmPassword")}
          />
        </div>

        <div className="mt-5 sm:mt-6">
          <ButtonComponent
            fullWidth
            size="large"
            loading={loading}
            onClick={handleSubmit}
            endIcon={<ArrowRight size={17} />}
          >
            Create Account
          </ButtonComponent>
        </div>

        <p className="mt-4 text-center text-[13px] text-[var(--whiold-text-muted)] sm:mt-5 sm:text-[13.5px]">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer font-semibold text-[var(--whiold-primary)]"
          >
            Log In
          </span>
        </p>
      </div>

      <p className="mt-4 px-2 text-center text-[11px] leading-relaxed text-[var(--whiold-text-muted)] sm:mt-5 sm:text-[12px]">
        By signing up, you agree to our{" "}
        <span className="cursor-pointer text-[var(--whiold-text-body)] underline">
          Terms of Service
        </span>{" "}
        and{" "}
        <span className="cursor-pointer text-[var(--whiold-text-body)] underline">
          Privacy Policy
        </span>
        .
      </p>

      {/* OTP Verification Modal */}
      <Dialog
        open={showOtpPopup}
        TransitionComponent={SlideUp}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: { xs: "18px", sm: "24px" },
            padding: "4px",
            margin: { xs: "16px", sm: "32px" },
            background: "var(--whiold-bg)",
            boxShadow: "var(--whiold-shadow-card)",
            width: { xs: "calc(100% - 32px)", sm: "auto" },
          },
        }}
      >
        <DialogContent className="relative flex flex-col items-center p-6 pt-9 text-center sm:p-10">
          <IconButton
            size="small"
            onClick={() => setShowOtpPopup(false)}
            sx={{ position: "absolute", top: 10, right: 10 }}
          >
            <X size={20} />
          </IconButton>

          <Box
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl sm:mb-5 sm:h-16 sm:w-16"
            sx={{ background: "var(--whiold-primary-soft)", color: "var(--whiold-primary)" }}
          >
            <KeyRound size={24} className="sm:hidden" />
            <KeyRound size={28} className="hidden sm:block" />
          </Box>

          <Typography sx={{ fontSize: { xs: 19, sm: 22 }, fontWeight: 700, color: "var(--whiold-text-heading)", mb: 1 }}>
            Verify your Email
          </Typography>
          <Typography sx={{ fontSize: { xs: 13, sm: 14 }, color: "var(--whiold-text-muted)", mb: { xs: 3, sm: 4 }, px: { xs: 0.5, sm: 2 }, lineHeight: 1.5 }}>
            We've sent a 6-digit verification code to <br />
            <strong className="text-[var(--whiold-text-body)]">{form.email}</strong>
          </Typography>

          <div className="mb-7 flex gap-1.5 sm:mb-8 sm:gap-3">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                name="otp"
                maxLength="1"
                value={data}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                ref={(ref) => (inputRefs.current[index] = ref)}
                className="h-11 w-9 rounded-xl border text-center text-lg font-bold outline-none transition-all duration-200 sm:h-14 sm:w-12 sm:text-xl"
                style={{
                  borderColor: data ? "var(--whiold-primary)" : "var(--whiold-border)",
                  backgroundColor: data ? "var(--whiold-bg)" : "var(--whiold-bg-input, #FAF8F6)",
                  color: "var(--whiold-text-heading)",
                  boxShadow: data ? "0 0 0 1px var(--whiold-primary)" : "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--whiold-primary)";
                  e.target.style.boxShadow = "0 0 0 2px var(--whiold-primary-soft)";
                  e.target.select();
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = data ? "var(--whiold-primary)" : "var(--whiold-border)";
                  e.target.style.boxShadow = data ? "0 0 0 1px var(--whiold-primary)" : "none";
                }}
              />
            ))}
          </div>

          <ButtonComponent
            fullWidth
            size="large"
            loading={verifying}
            onClick={handleVerifyOtp}
            endIcon={<ArrowRight size={17} />}
          >
            Verify & Continue
          </ButtonComponent>

          <Typography sx={{ fontSize: { xs: 12.5, sm: 13 }, color: "var(--whiold-text-muted)", mt: { xs: 3, sm: 4 } }}>
            Didn't receive the code?{" "}
            <span className="font-semibold text-[var(--whiold-primary)] cursor-pointer hover:underline">
              Resend OTP
            </span>
          </Typography>
        </DialogContent>
      </Dialog>
    </AuthLayout>
  );
};

export default Register;