import { Zap, Sparkles, ShieldCheck } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import mainContant from "../../constants/mainContent";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Setup",
    desc: "Go live in minutes, no configuration headaches.",
  },
  {
    icon: Sparkles,
    title: "Smart Automation",
    desc: "Workflows that adapt as your data changes.",
  },
  {
    icon: ShieldCheck,
    title: "Bank-grade Security",
    desc: "Your data encrypted end-to-end, always.",
  },
];

const AuthLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isRegister = location.pathname.includes("register");
  const isLogin = !isRegister;

  const activeBtnStyle = { background: "var(--whiold-gradient-brand)" };

  return (
    <div className="relative min-h-screen w-full flex" style={{ backgroundColor: "var(--whiold-bg)" }}>
      {/* ================= LEFT ================= */}
      <div
        className="relative hidden lg:flex lg:w-[32%] flex-col justify-between overflow-hidden px-12 py-14"
        style={{ background: "var(--whiold-gradient-panel)" }}
      >
        {/* Soft brand-tinted orbs */}
        <div
          className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full blur-[100px]"
          style={{ backgroundColor: "var(--whiold-200)", opacity: 0.6 }}
        />
        <div
          className="pointer-events-none absolute top-1/3 -right-32 h-80 w-80 rounded-full blur-[110px]"
          style={{ backgroundColor: "var(--whiold-300)", opacity: 0.45 }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full blur-[100px]"
          style={{ backgroundColor: "var(--whiold-100)", opacity: 0.7 }}
        />

        {/* subtle border to separate from right panel */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-px"
          style={{ backgroundColor: "var(--whiold-border)" }}
        />

        {/* Logo */}
  <div 
  onClick={() => navigate("/")}
  className="relative z-10 flex items-center">
  <img
    src={mainContant.logo}
    alt={mainContant.appName}
    className="h-35 w-auto object-center cursor-pointer"
  />
</div>

        {/* Content */}
        <div className="relative z-10">
          <h1
            className="text-[2.6rem] font-extrabold leading-[1.1]"
            style={{ color: "var(--whiold-text-heading)" }}
          >
            One market,
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--whiold-gradient-brand)" }}
            >
              every source.
            </span>
          </h1>

          <p
            className="mt-4 max-w-sm text-[15px] leading-relaxed"
            style={{ color: "var(--whiold-text-body)" }}
          >
            Join thousands of teams shipping faster with one unified workspace.
          </p>

          <div className="mt-10 flex flex-col gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "var(--whiold-100)", color: "var(--whiold-600)" }}
                >
                  <Icon size={18} strokeWidth={2.25} />
                </span>

                <div>
                  <p
                    className="text-[15px] font-semibold"
                    style={{ color: "var(--whiold-text-heading)" }}
                  >
                    {title}
                  </p>
                  <p className="text-[13px]" style={{ color: "var(--whiold-text-body)" }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-2.5">
            {["300", "400", "500", "600"].map((shade) => (
              <div
                key={shade}
                className="h-8 w-8 rounded-full border-2 shadow-sm"
                style={{
                  backgroundColor: `var(--whiold-${shade})`,
                  borderColor: "var(--whiold-bg)",
                }}
              />
            ))}
          </div>

          <p className="text-[13px]" style={{ color: "var(--whiold-text-body)" }}>
            <span className="font-semibold" style={{ color: "var(--whiold-text-heading)" }}>
              12,000+
            </span>{" "}
            teams onboard
          </p>
        </div>
      </div>

      {/* ========== LOGIN / SIGN UP TOGGLE (desktop — floats on the panel boundary) ========== */}
      <div
        className="pointer-events-auto absolute top-1/2 left-[32%] z-30 hidden -translate-x-1/2 -translate-y-1/2 flex-col gap-2 rounded-full p-5 shadow-(--whiold-shadow-card) lg:flex"
        style={{ backgroundColor: "var(--whiold-bg)" }}
      >
        <button
          type="button"
          onClick={() => navigate("/login")}
          className={`rounded-full px-7 py-2.5 text-[12.5px] font-bold tracking-wide transition-all ${
            isLogin
              ? "text-white shadow-(--whiold-shadow-btn)"
              : "text-(--whiold-text-muted) hover:text-(--whiold-primary)"
          }`}
          style={isLogin ? activeBtnStyle : undefined}
        >
          LOGIN
        </button>
        <button
          type="button"
          onClick={() => navigate("/register")}
          className={`rounded-full px-7 py-2.5 text-[12.5px] font-bold tracking-wide transition-all ${
            isRegister
              ? "text-white shadow-(--whiold-shadow-btn)"
              : "text-(--whiold-text-muted) hover:text-(--whiold-primary)"
          }`}
          style={isRegister ? activeBtnStyle : undefined}
        >
          SIGN UP
        </button>
      </div>

      {/* ================= RIGHT ================= */}
      <div
        className="relative flex flex-1 items-center justify-center px-6 py-12"
        style={{ backgroundColor: "var(--whiold-bg)" }}
      >
        <div
          className="pointer-events-none absolute h-105 w-105 rounded-full blur-[90px]"
          style={{ backgroundColor: "var(--whiold-100)", opacity: 0.5 }}
        />

        <div className="relative z-10 w-full max-w-130">
          {/* Mobile-only toggle since the left panel is hidden below lg */}
          <div
            className="mb-6 flex rounded-full p-1.5 lg:hidden"
            style={{ backgroundColor: "var(--whiold-bg-soft)" }}
          >
            <button
              type="button"
              onClick={() => navigate("/login")}
              className={`flex-1 rounded-full py-2.5 text-[13px] font-semibold transition-all ${
                isLogin ? "text-white" : "text-(--whiold-text-muted)"
              }`}
              style={isLogin ? activeBtnStyle : undefined}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className={`flex-1 rounded-full py-2.5 text-[13px] font-semibold transition-all ${
                isRegister ? "text-white" : "text-(--whiold-text-muted)"
              }`}
              style={isRegister ? activeBtnStyle : undefined}
            >
              Sign Up
            </button>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;