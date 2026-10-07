import React, { useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import { Routes, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Sparkles, ArrowRight } from "lucide-react";
import InputComponent from "../../../ui/InputComponent";
import ButtonComponent from "../../../ui/ButtonComponent";
import mainContent from "../../../../constants/mainContent";
import { adminRoutes, Router } from "../../../../constants/router";
import { useAuth } from "../../../../context/AuthContext";
import { AdminLoginApi } from "../../../../api/admin/admin.api";
import { useSnackbar } from "../../../../context/SnackBarContext";
import { setRole, setToken } from "../../../../utils/authStorage";

/* Organic wavy-line corner decoration (matches the blush reference art) */
const OrganicCorner = ({ className = "" }) => (
  <svg
    viewBox="0 0 400 400"
    className={`pointer-events-none absolute h-[280px] w-[280px] sm:h-[380px] sm:w-[380px] ${className}`}
  >
    <path
      d="M400,0 L400,180 C340,140 300,220 250,190 C190,155 180,80 100,60 C60,50 30,20 0,0 Z"
      fill="var(--whiold-primary-soft, #f0c9c3)"
      opacity="0.7"
    />
    <path
      d="M0,60 C70,90 110,40 170,90 C230,140 260,60 330,110 C360,132 380,150 400,170"
      fill="none"
      stroke="var(--whiold-primary, #b4553d)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M0,90 C70,120 110,70 170,120 C230,170 260,90 330,140 C360,162 380,180 400,200"
      fill="none"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M0,120 C70,150 110,100 170,150 C230,200 260,120 330,170 C360,192 380,210 400,230"
      fill="none"
      stroke="#5c3d30"
      strokeWidth="1.4"
      strokeLinecap="round"
      opacity="0.7"
    />
  </svg>
);

const features = [
  {
    icon: Zap,
    title: "Real-Time Inventory",
    desc: "Stock updates the moment an order lands.",
  },
  {
    icon: Sparkles,
    title: "Smart Insights",
    desc: "Sales trends without digging through sheets.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Access",
    desc: "Role-based admin logins, always encrypted.",
  },
];

const avatarColors = ["#d7a08c", "#c07a5f", "#a85b3f", "#8a4530"];

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const { showLoader, hideLoader, login } = useAuth();
  const { showSnackbar } = useSnackbar();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setLoginError("");
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Email is required";
    if (!form.password.trim()) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    showLoader();
    setLoading(true);
    try {
      const res = await AdminLoginApi(form);
      if (res?.success) {
        showSnackbar(
          res?.message || "Admin logged in successfully!",
          "success",
        );
        setToken("token", res.token);
        setRole("role", res?.data?.role || res?.role);
        login(res?.token, res?.data);
        navigate(adminRoutes?.ADMIN_DASHBOARD);
      } else {
        setLoginError(res?.message || "Something went wrong!");
        showSnackbar(res?.message || "Something went wrong!", "error");
      }
    } catch (error) {
      showSnackbar(res?.messsage || "Internal server error", "error");
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return (
    <Box className="relative min-h-screen w-full overflow-hidden bg-[#fbf0ec]">
      {/* Organic corner decorations */}
      <OrganicCorner className="-top-16 -right-16 rotate-0" />
      <OrganicCorner className="-bottom-16 -left-16 rotate-180" />

      <Box className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center gap-14 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        {/* ── Left: brand panel ── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="hidden w-full max-w-md lg:block"
        >
          <Box className="">
            <Box 
             onClick={() => navigate(Router?.HOME)}
            className="relative z-10 flex items-center justify-center cursor-pointer">
              <img
                src={mainContent.logo}
                alt={mainContent.appName}
                className="h-30 w-auto object-center"
              />
            </Box>
          </Box>

          <Typography
            component="h1"
            className="!m-0 !text-4xl sm:!text-5xl !font-extrabold !leading-[1.15] text-[var(--whiold-text-heading)]"
          >
            Every product,
            <br />
            <span style={{ color: "var(--whiold-primary)" }}>
              one dashboard.
            </span>
          </Typography>

          <Typography className="!mt-5 !max-w-sm !text-sm !leading-relaxed text-[var(--whiold-text-body)]">
            Manage inventory, orders and customers from a single admin workspace
            — built for the way Whiold's studio actually works.
          </Typography>

          <Box className="mt-10 flex flex-col gap-6">
            {features.map((f) => (
              <Box key={f.title} className="flex items-start gap-3.5">
                <Box className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--whiold-primary-soft)] text-[var(--whiold-primary)]">
                  <f.icon size={17} />
                </Box>
                <Box>
                  <Typography className="!m-0 !text-sm !font-semibold text-[var(--whiold-text-heading)]">
                    {f.title}
                  </Typography>
                  <Typography className="!m-0 !mt-0.5 !text-xs text-[var(--whiold-text-muted)]">
                    {f.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Box className="mt-10 flex items-center gap-3">
            <AvatarGroup
              max={4}
              className="[&_.MuiAvatar-root]:!h-8 [&_.MuiAvatar-root]:!w-8 [&_.MuiAvatar-root]:!border-2 [&_.MuiAvatar-root]:!border-[#fbf0ec] [&_.MuiAvatar-root]:!text-[10px]"
            >
              {avatarColors.map((c, i) => (
                <Avatar key={i} sx={{ bgcolor: c }}>
                  {" "}
                </Avatar>
              ))}
            </AvatarGroup>
            <Typography className="!m-0 !text-xs !font-medium text-[var(--whiold-text-body)]">
              40+ boutique brands trust Whiold
            </Typography>
          </Box>
        </motion.div>

        {/* ── Right: login card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Mobile-only brand mark */}
          <Box className="mb-8 text-center lg:hidden">
            <Box
            onClick={() => navigate("/")}
             className="relative z-10 flex items-center justify-center">
              <img              
                src={mainContent.logo}
                alt={mainContent.appName}
                className="h-35 w-auto object-center"
              />
            </Box>
          </Box>

          <Box className="rounded-3xl border border-[var(--whiold-border)] bg-white/90 p-8 shadow-[0_20px_60px_-15px_rgba(120,60,40,0.25)] backdrop-blur-xl sm:p-10">
            <Box className="flex flex-col items-center text-center">
              <Box className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--whiold-primary-soft)] text-[var(--whiold-primary)]">
                <ShieldCheck size={26} />
              </Box>
              <Typography
                component="h2"
                className="!m-0 !text-2xl !font-extrabold text-[var(--whiold-text-heading)]"
              >
                <span style={{ color: "var(--whiold-primary)" }}>Log In</span>{" "}
                to Admin Panel
              </Typography>
              <Typography className="!mt-2 !text-sm text-[var(--whiold-text-muted)]">
                Welcome back! Please sign in to continue.
              </Typography>
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col gap-5"
            >
              <InputComponent
                label="Email"
                type="email"
                placeholder="admin@whiold.com"
                value={form.email}
                onChange={handleChange("email")}
                error={!!errors.email}
                helperText={errors.email}
                required
              />

              <InputComponent
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange("password")}
                error={!!errors.password}
                helperText={errors.password}
                required
              />

              <Box className="flex items-center justify-between">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      size="small"
                      sx={{
                        color: "var(--whiold-border)",
                        "&.Mui-checked": { color: "var(--whiold-primary)" },
                      }}
                    />
                  }
                  label="Remember me"
                  className="[&_.MuiFormControlLabel-label]:!text-xs [&_.MuiFormControlLabel-label]:text-[var(--whiold-text-muted)]"
                />

                <Link
                  component="button"
                  type="button"
                  underline="hover"
                  className="!text-xs !font-semibold"
                  sx={{ color: "var(--whiold-primary)" }}
                >
                  Forgot password?
                </Link>
              </Box>

              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Typography className="!m-0 !rounded-lg !bg-rose-50 !px-3 !py-2 !text-xs !font-medium !text-rose-600">
                    {loginError}
                  </Typography>
                </motion.div>
              )}

              <ButtonComponent
                type="submit"
                fullWidth
                loading={loading}
                size="large"
                endIcon={<ArrowRight size={16} />}
              >
                Log in
              </ButtonComponent>
            </Box>

            <Typography className="!mt-7 !text-center !text-xs text-[var(--whiold-text-muted)]">
              Need access?{" "}
              <span
                className="font-semibold"
                style={{ color: "var(--whiold-primary)" }}
              >
                Contact your studio admin.
              </span>
            </Typography>
          </Box>

          <Typography className="!mt-6 !text-center !text-[11px] text-[var(--whiold-text-muted)]">
            Demo credentials: admin@whiold.com / admin123
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
};

export default AdminLogin;
