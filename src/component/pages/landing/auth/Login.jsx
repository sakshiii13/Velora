import { useState } from "react";
import { ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import InputComponent from "../../../ui/InputComponent";
import ButtonComponent from "../../../ui/ButtonComponent";
import SnackBar from "../../../ui/SnackBar";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../layout/AuthLayout";
import { Router, userRoutes } from "../../../../constants/router";

import {
  validateEmail,
} from "../../../../utils/Validation";
import { userLogin } from "../../../../api/user/users.api";
import { useSnackbar } from "../../../../context/SnackBarContext";
import { useAuth } from "../../../../context/AuthContext";
import { setRole, setToken } from "../../../../utils/authStorage";

const Login = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const {showSnackbar} = useSnackbar();
  const {showLoader, hideLoader, login}= useAuth();

  const update = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

 const handleSubmit = async (e) => {
  
     e.preventDefault();
     
     if(!form?.email || !form?.password) {
      return showSnackbar("All fields are required!", "warning")
     }
     try {
      showLoader();
     setLoading(true);
       const res = await userLogin({userId: form?.email, ...form});
       if (res?.success) {
         showSnackbar(
           res?.message || "User logged in successfully!",
           "success",
         );
         setToken("token", res.token);
         setRole("role", res?.role || res?.data?.role);
         login(res?.token, res?.data);
         navigate(userRoutes?.DASHBOARD);
       } else {
         showSnackbar(res?.message || "Something went wrong!", "error");
       }
     } catch (error) {
      showSnackbar(
  error?.response?.data?.message ||
  error?.message ||
  "Internal server error",
  "error"
);
     } finally {
       setLoading(false);
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
          <ShieldCheck size={26} className="text-[var(--whiold-primary)] sm:hidden" />
          <ShieldCheck size={30} className="hidden text-[var(--whiold-primary)] sm:block" />
        </div>

        <h2 className="text-2xl font-bold text-[var(--whiold-text-heading)] sm:text-3xl">
          <span className="text-[var(--whiold-primary)] text-[28px] sm:text-4xl">Log In</span> to Your Account
        </h2>

        <p className="mt-1.5 px-2 text-[13px] text-[var(--whiold-text-body)] sm:text-[14.5px]">
          Welcome back! Please sign in to continue.
        </p>
      </div>

      <div className="rounded-[20px] border border-[var(--whiold-border)] bg-white/90 p-5 shadow-[var(--whiold-shadow-card)] backdrop-blur-sm sm:rounded-[28px] sm:p-9">

        {/* Email */}
        <div className="mt-2 sm:mt-3.5">
          <InputComponent
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={update("email")}
          />
        </div>

        {/* Password */}
        <div className="mt-3 sm:mt-3.5">
          <InputComponent
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={update("password")}
          />
        </div>

        {/* Button */}
        <div className="mt-5 sm:mt-6">
          <ButtonComponent
            fullWidth
            size="large"
            loading={loading}
            onClick={handleSubmit}
            endIcon={<ArrowRight size={17} />}
          >
            Log in
          </ButtonComponent>
        </div>

        <p className="mt-4 text-center text-[13px] text-[var(--whiold-text-muted)] sm:mt-5 sm:text-[13.5px]">
          Don't have an account?{" "}
          <span
            onClick={() => navigate(Router?.REGISTER)}
            className="cursor-pointer font-semibold text-[var(--whiold-primary)]"
          >
            Create An Account!
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
        </span>.
      </p>
    </AuthLayout>
  );
};

export default Login;