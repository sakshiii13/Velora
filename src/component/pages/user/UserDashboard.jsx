import React, { useState } from "react";
import { Box } from "@mui/material";
import { RefreshCw, ShoppingBag, Copy, Check, Users, ChevronRight, Gift } from "lucide-react";
import { motion } from "framer-motion";

import {
  StatCard,
  FeatureSection,
  OrderHighlightCard,
  AccountStatusCard,
} from "./Index";
import FeatureCard from "./FeatureCard";

import { statsData, productCards, teamCards, earningCards } from "./DashboardData";
import { useAuth } from "../../../context/AuthContext";
import { Router, userRoutes } from "../../../constants/router";

const UserDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const referralLink = `${window.location.origin}/register?ref=${user?.referralCode || user?.userId || ""}`;

  const handleCopyReferral = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <Box className="min-h-screen bg-[var(--whiold-bg-soft)]">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[var(--whiold-text-heading)]">
              Welcome Back !!
            </h1>
            <p className="mt-2 text-sm text-[var(--whiold-text-body)]">
              Manage your wallet, products, team and earnings from one place.
            </p>
          </div>

          <button
            onClick={refresh}
            className="hidden md:flex items-center gap-2 rounded-2xl border border-[var(--whiold-border)] bg-white px-5 py-3 font-semibold shadow-sm transition-all hover:border-[var(--whiold-primary)] hover:shadow-lg  "
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statsData.map((item) => (
            <StatCard key={item.title} item={item} />
          ))}
        </div>

        {/* Products */}
        <FeatureSection
          title="Products"
          description="Manage all your product activities."
          chipLabel="6 Modules"
          items={productCards}
          gridClassName="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
          className="mt-7"
        />

        {/* Team — rendered manually so the Referral Link tile can be a real, working widget */}
        <div className="mt-7">
          <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-2xl font-bold text-[var(--whiold-text-heading)]">Team</h2>
              <p className="mt-1 text-sm text-[var(--whiold-text-body)]">
                Grow and manage your referral network.
              </p>
            </div>
            <span className="rounded-full bg-[var(--whiold-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--whiold-primary)]">
              5 Modules
            </span>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {/* Referral tile — deliberately distinct: dark copper gradient, not a white FeatureCard */}
            <motion.div
              initial="initial"
              whileHover="hover"
              variants={{
                initial: { y: 0, boxShadow: "var(--whiold-shadow-card)" },
                hover: { y: -2, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)" }
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative overflow-hidden rounded-3xl p-6"
              style={{
                background: "linear-gradient(135deg, var(--whiold-800) 0%, var(--whiold-900) 100%)",
              }}
            >
              {/* Diagonal shine sweep */}
              <motion.div
                variants={{ initial: { opacity: 0 }, hover: { opacity: 1 } }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(115deg, transparent 30%, rgba(242,225,217,0.12) 50%, transparent 70%)",
                }}
              />

              {/* Corner glow — copper, not the soft tint used elsewhere */}
              <motion.div
                variants={{ initial: { scale: 1, opacity: 0.35 }, hover: { scale: 1.5, opacity: 0.5 } }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full"
                style={{ background: "var(--whiold-600)", filter: "blur(6px)" }}
              />

              <div className="relative flex items-center justify-between">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ background: "var(--whiold-gradient-brand)" }}
                >
                  <Users size={24} color="var(--whiold-text-on-primary)" />
                </div>

                <div
                  className="flex items-center gap-1 rounded-full px-2.5 py-1"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <Gift size={12} style={{ color: "var(--whiold-300)" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "var(--whiold-200)" }}>
                    Earn per signup
                  </span>
                </div>
              </div>

              <h3 className="relative mt-1 text-lg font-bold" style={{ color: "var(--whiold-50)" }}>
                Referral Link
              </h3>
              <p className="relative mt-1 text-sm leading-6" style={{ color: "var(--whiold-200)" }}>
                Invite new members and grow your team.
              </p>

              <div
                className="relative mt-1 flex items-center justify-between gap-2 rounded-xl px-3 py-2"
                style={{ background: "rgba(0,0,0,0.18)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="truncate text-xs font-mono" style={{ color: "var(--whiold-300)" }}>
                  {referralLink}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyReferral();
                  }}
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-all cursor-pointer"
                  style={{ color: copied ? "var(--whiold-300)" : "var(--whiold-200)" }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>

              {/* <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyReferral();
                }}
                variants={{ initial: { gap: "8px" }, hover: { gap: "12px" } }}
                transition={{ duration: 0.3 }}
                className="relative mt-5 flex items-center text-sm font-semibold"
                style={{ color: "var(--whiold-300)" }}
              >
                {copied ? "Copied!" : "Copy Link"}
              </motion.button> */}
            </motion.div>

            {teamCards
              .filter((item) => item.title !== "Referral Link")
              .map((item) => (
                <FeatureCard key={item.title} item={item} />
              ))}
          </div>
        </div>

        {/* Earnings */}
        <FeatureSection
          title="Earnings"
          description="Track every income generated from your business."
          chipLabel="4 Modules"
          items={earningCards}
          gridClassName="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
          className="mt-7"
        />

        {/* Orders spotlight */}
        <div className="mt-7">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[var(--whiold-text-heading)]">Orders</h2>
            <p className="mt-1 text-sm text-[var(--whiold-text-body)]">
              Manage and track all your product orders.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <OrderHighlightCard
              title="Orders"
              desc="View active orders, completed purchases and delivery status."
              icon={ShoppingBag}
              gradient="from-orange-500 to-yellow-500"
              path={userRoutes?.ALL_ORDERS}
            />
          </div>
        </div>

        {/* Account status */}
        <div className="mt-7">
          <AccountStatusCard
            heading="Everything looks great!"
            description="Your account is active and running smoothly. Continue growing your business by purchasing products, building your team and earning exciting rewards."
            stats={[
              { label: "Wallet", value: "₹2,450" },
              { label: "Income", value: "₹980" },
              { label: "Orders", value: "18" },
              { label: "Team", value: "56" },
            ]}
          />
        </div>
      </div>
    </Box>
  );
};

export default UserDashboard;