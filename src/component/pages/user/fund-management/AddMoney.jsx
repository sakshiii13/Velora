import React, { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import {
  Wallet,
  IndianRupee,
  Smartphone,
  CreditCard,
  Building2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Clock,
  Headphones,
  Zap,
} from "lucide-react";
import ButtonComponent from "../../../ui/ButtonComponent";
const quickAmounts = [500, 1000, 2000, 5000, 10000, 25000];

const paymentMethods = [
  { id: "upi", label: "UPI", desc: "GPay, PhonePe, Paytm", icon: Smartphone },
  { id: "card", label: "Card", desc: "Debit / Credit", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", desc: "All major banks", icon: Building2 },
];

const benefits = [
  { icon: Zap, text: "Instant credit — funds reflect in seconds" },
  { icon: TrendingUp, text: "Use across products, bulk orders and team purchases" },
  { icon: Clock, text: "No expiry — balance stays until you use it" },
];

const AddMoney = ({
  currentBalance = 2450,
  monthlyAdded = 6200,
  onSubmit,
  onBack,
}) => {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [loading, setLoading] = useState(false);

  const handleQuickSelect = (val) => setAmount(String(val));

  const handleAmountChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setAmount(val);
  };

  const handleAddMoney = async () => {
    if (!amount || Number(amount) <= 0) return;
    setLoading(true);
    try {
      if (onSubmit) await onSubmit({ amount: Number(amount), method: selectedMethod });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="mx-auto w-full max-w-7xl">
      {/* Balance hero */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: "var(--whiold-radius-lg)",
          background: "linear-gradient(135deg, var(--whiold-800) 0%, var(--whiold-900) 100%)",
          boxShadow: "var(--whiold-shadow-card)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "var(--whiold-600)",
            opacity: 0.3,
            filter: "blur(20px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -60,
            left: "20%",
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "var(--whiold-500)",
            opacity: 0.15,
            filter: "blur(30px)",
          }}
        />

        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl sm:h-16 sm:w-16"
              style={{ background: "var(--whiold-gradient-brand)" }}
            >
              <Wallet size={26} color="var(--whiold-text-on-primary)" />
            </div>
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider sm:text-sm"
                style={{ color: "var(--whiold-300)" }}
              >
                Current Balance
              </p>
              <p
                className="mt-1 text-3xl font-black sm:text-4xl"
                style={{ color: "var(--whiold-50)" }}
              >
                ₹{currentBalance.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className="flex items-center gap-2 rounded-2xl px-4 py-2.5"
              style={{ background: "rgba(255,255,255,0.07)" }}
            >
              <TrendingUp size={16} style={{ color: "var(--whiold-300)" }} />
              <div>
                <p className="text-[11px] font-medium" style={{ color: "var(--whiold-200)" }}>
                  Added this month
                </p>
                <p className="text-sm font-bold" style={{ color: "var(--whiold-50)" }}>
                  ₹{monthlyAdded.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <div
              className="flex items-center gap-1.5 rounded-full px-3.5 py-2"
              style={{ background: "rgba(255,255,255,0.07)" }}
            >
              <Sparkles size={13} style={{ color: "var(--whiold-300)" }} />
              <span className="text-[11px] font-semibold" style={{ color: "var(--whiold-200)" }}>
                Instant Top-up
              </span>
            </div>
          </div>
        </div>
      </Paper>

      {/* Main grid — form + sidebar */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form — takes 2/3 width on desktop */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: "var(--whiold-radius-lg)",
            border: "1px solid var(--whiold-border)",
            background: "var(--whiold-bg)",
            boxShadow: "var(--whiold-shadow-card)",
            gridColumn: { lg: "span 2" },
          }}
          className="lg:col-span-2"
        >
          
          <Typography sx={{ fontWeight: 800, fontSize: 22, color: "var(--whiold-text-heading)" }}>
            Add Money to Wallet
          </Typography>
          <Typography sx={{ fontSize: 14, color: "var(--whiold-text-body)", mt: 0.5, mb: 4 }}>
            Top up instantly and use it across all your purchases.
          </Typography>

          {/* Amount input */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              border: "1.5px solid var(--whiold-border)",
              borderRadius: "var(--whiold-radius-md)",
              background: "var(--whiold-bg-input)",
              px: { xs: 2.5, sm: 3 },
              py: { xs: 2, sm: 2.5 },
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              "&:focus-within": {
                borderColor: "var(--whiold-border-focus)",
                boxShadow: "var(--whiold-shadow-focus)",
                background: "var(--whiold-bg)",
              },
            }}
          >
            <IndianRupee size={26} style={{ color: "var(--whiold-primary)", flexShrink: 0 }} />
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              className="w-full min-w-0 bg-transparent outline-none text-2xl font-bold sm:text-3xl"
              style={{ color: "var(--whiold-text-heading)" }}
            />
          </Box>

          {/* Quick select chips — responsive grid, not a wrapping row */}
          <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
            {quickAmounts.map((val) => {
              const active = amount === String(val);
              return (
                <button
                  key={val}
                  onClick={() => handleQuickSelect(val)}
                  className="rounded-xl px-2 py-2.5 text-xs font-bold transition-all sm:text-sm"
                  style={
                    active
                      ? {
                          background: "var(--whiold-gradient-brand)",
                          color: "var(--whiold-text-on-primary)",
                          boxShadow: "var(--whiold-button-shadow)",
                        }
                      : {
                          background: "var(--whiold-primary-soft)",
                          color: "var(--whiold-primary)",
                        }
                  }
                >
                  ₹{val >= 1000 ? `${val / 1000}k` : val}
                </button>
              );
            })}
          </div>

          {/* Payment methods */}
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--whiold-text-muted)",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              mt: 5,
              mb: 2,
            }}
          >
            Choose Payment Method
          </Typography>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const active = selectedMethod === method.id;
              return (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className="flex cursor-pointer flex-col items-start gap-3 rounded-2xl border p-4 transition-all sm:items-center sm:text-center"
                  style={{
                    borderColor: active ? "var(--whiold-primary)" : "var(--whiold-border)",
                    background: active ? "var(--whiold-primary-soft)" : "var(--whiold-bg)",
                  }}
                >
                  <div className="flex w-full items-center justify-between sm:flex-col sm:gap-2.5">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{
                        background: active ? "var(--whiold-gradient-brand)" : "var(--whiold-bg-soft)",
                        color: active ? "var(--whiold-text-on-primary)" : "var(--whiold-text-body)",
                      }}
                    >
                      <Icon size={19} />
                    </div>
                    <div
                      className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 sm:hidden"
                      style={{ borderColor: active ? "var(--whiold-primary)" : "var(--whiold-border)" }}
                    >
                      {active && (
                        <div className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--whiold-primary)" }} />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--whiold-text-heading)" }}>
                      {method.label}
                    </p>
                    <p className="text-xs" style={{ color: "var(--whiold-text-muted)" }}>
                      {method.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit */}
          <ButtonComponent
            fullWidth
            loading={loading}
            disabled={!amount || Number(amount) <= 0}
            onClick={handleAddMoney}
            sx={{ mt: 5 }}
          >
            {amount ? `Add ₹${Number(amount).toLocaleString("en-IN")}` : "Add Money"}
          </ButtonComponent>

          <div className="mt-4 flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} style={{ color: "var(--whiold-text-muted)" }} />
            <span className="text-xs" style={{ color: "var(--whiold-text-muted)" }}>
              100% secure payments · Powered by trusted gateways
            </span>
          </div>
        </Paper>

        {/* Sidebar — 1/3 width on desktop, stacks below on mobile */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Benefits card */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 3.5 },
              borderRadius: "var(--whiold-radius-lg)",
              border: "1px solid var(--whiold-border)",
              background: "var(--whiold-gradient-panel)",
              boxShadow: "var(--whiold-shadow-card)",
            }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: 16, color: "var(--whiold-text-heading)", mb: 2.5 }}>
              Why add money?
            </Typography>
            <div className="flex flex-col gap-4">
              {benefits.map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "var(--whiold-primary-soft)", color: "var(--whiold-primary)" }}
                  >
                    <Icon size={16} />
                  </div>
                  <p className="pt-1.5 text-sm leading-5" style={{ color: "var(--whiold-text-body)" }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </Paper>

          {/* Support card */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 3.5 },
              borderRadius: "var(--whiold-radius-lg)",
              border: "1px solid var(--whiold-border)",
              background: "var(--whiold-bg)",
              boxShadow: "var(--whiold-shadow-card)",
              display: "flex",
              alignItems: "center",
              gap: 2.5,
            }}
          >
            <div
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
              style={{ background: "var(--whiold-gradient-brand)" }}
            >
              <Headphones size={19} color="var(--whiold-text-on-primary)" />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--whiold-text-heading)" }}>
                Need help?
              </p>
              <p className="text-xs" style={{ color: "var(--whiold-text-muted)" }}>
                Our support team is here 24/7
              </p>
            </div>
          </Paper>
        </div>
      </div>
    </Box>
  );
};

export default AddMoney;