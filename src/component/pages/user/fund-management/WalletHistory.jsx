import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet as WalletIcon,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Minus,
  Filter,
  Eye,
  EyeOff,
} from "lucide-react";
import ButtonComponent from "../../../ui/ButtonComponent";

// ---- fallback/demo data — replace with real props from parent ----
const demoTransactions = [
  { id: "t1", type: "credit", title: "Order refund — #WD1042", amount: 2450, date: "24 Jul, 2026" },
  { id: "t2", type: "debit", title: "Withdrawal to bank", amount: 5000, date: "22 Jul, 2026" },
  { id: "t3", type: "credit", title: "Payout — Order #WD0998", amount: 8120, date: "20 Jul, 2026" },
  { id: "t4", type: "debit", title: "Withdrawal to bank", amount: 3000, date: "17 Jul, 2026" },
  { id: "t5", type: "credit", title: "Payout — Order #WD0971", amount: 1290, date: "14 Jul, 2026" },
];

const filters = ["All", "Credit", "Debit"];

const WalletHistory = ({
  balance = 24680,
  transactions = demoTransactions,
  onAddMoney,
  onWithdraw,
}) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [hideBalance, setHideBalance] = useState(false);

  const filteredTransactions = useMemo(() => {
    if (activeFilter === "All") return transactions;
    return transactions.filter(
      (t) => t.type === activeFilter.toLowerCase()
    );
  }, [transactions, activeFilter]);

  const totalCredit = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="w-full mx-auto max-w-7xl">
      {/* ---------- Header ---------- */}
      <div className="mb-6">
        <h1
          className="text-2xl sm:text-3xl font-semibold"
          style={{ color: "var(--whiold-text-heading)" }}
        >
          Wallet History
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--whiold-text-body)" }}
        >
          Track your balance, payouts and withdrawals in one place
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ---------- Balance hero card ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="whiold-collections-card whiold-foil-border lg:col-span-2 relative overflow-hidden rounded-[var(--whiold-radius-lg)] p-6 sm:p-8"
          style={{
            background: "var(--whiold-gradient-panel)",
            boxShadow: "var(--whiold-shadow-card)",
            border: "1px solid var(--whiold-border)",
          }}
        >
          {/* decorative icon */}
          <div
            className="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-10"
            style={{ background: "var(--whiold-gradient-brand)" }}
          />

          <div className="flex items-center justify-between relative z-10">
            <div
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: "var(--whiold-text-muted)" }}
            >
              <span
                className="flex items-center justify-center w-9 h-9 rounded-full"
                style={{
                  background: "var(--whiold-gradient-brand)",
                  color: "var(--whiold-text-on-primary)",
                }}
              >
                <WalletIcon size={18} />
              </span>
              Available Balance
            </div>

            <button
              onClick={() => setHideBalance((p) => !p)}
              className="p-2 rounded-full transition-colors"
              style={{ color: "var(--whiold-text-muted)" }}
              aria-label={hideBalance ? "Show balance" : "Hide balance"}
            >
              {hideBalance ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="mt-4 relative z-10">
            <span
              className="text-4xl sm:text-5xl font-bold tracking-tight"
              style={{ color: "var(--whiold-text-heading)" }}
            >
              {hideBalance ? "₹ ••••••" : `₹${balance.toLocaleString("en-IN")}`}
            </span>
          </div>

          {/* mini stats row */}
          <div className="mt-6 grid grid-cols-2 gap-4 relative z-10">
            <div
              className="rounded-[var(--whiold-radius-md)] p-3"
              style={{
                background: "var(--whiold-bg)",
                border: "1px solid var(--whiold-border)",
              }}
            >
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--whiold-text-muted)" }}>
                <ArrowDownLeft size={14} color="#2E9B5F" />
                Total Credited
              </div>
              <div className="text-lg font-semibold mt-1" style={{ color: "var(--whiold-text-heading)" }}>
                ₹{totalCredit.toLocaleString("en-IN")}
              </div>
            </div>
            <div
              className="rounded-[var(--whiold-radius-md)] p-3"
              style={{
                background: "var(--whiold-bg)",
                border: "1px solid var(--whiold-border)",
              }}
            >
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--whiold-text-muted)" }}>
                <ArrowUpRight size={14} color="#C0392B" />
                Total Withdrawn
              </div>
              <div className="text-lg font-semibold mt-1" style={{ color: "var(--whiold-text-heading)" }}>
                ₹{totalDebit.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          {/* actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 relative z-10">
            <ButtonComponent
           
              startIcon={<Plus size={16} />}
              onClick={onAddMoney}
              fullWidth
            >
              Add Money
            </ButtonComponent>
            <ButtonComponent
              variant="outlined"
              startIcon={<Minus size={16} />}
              onClick={onWithdraw}
              fullWidth
              sx={{
                borderColor: "var(--whiold-border)",
                color: "var(--whiold-text-heading)",
                "&:hover": {
                  borderColor: "var(--whiold-primary)",
                  background: "var(--whiold-primary-soft)",
                },
              }}
            >
              Withdraw
            </ButtonComponent>
          </div>
        </motion.div>

        {/* ---------- Quick summary side card ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
          className="rounded-[var(--whiold-radius-lg)] p-6 flex flex-col justify-between"
          style={{
            background: "var(--whiold-bg)",
            border: "1px solid var(--whiold-border)",
            boxShadow: "var(--whiold-shadow-card)",
          }}
        >
          <div>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--whiold-text-heading)" }}>
              This Month
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "var(--whiold-text-body)" }}>
                  Payouts received
                </span>
                <span className="text-sm font-semibold" style={{ color: "var(--whiold-text-heading)" }}>
                  {transactions.filter((t) => t.type === "credit").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "var(--whiold-text-body)" }}>
                  Withdrawals made
                </span>
                <span className="text-sm font-semibold" style={{ color: "var(--whiold-text-heading)" }}>
                  {transactions.filter((t) => t.type === "debit").length}
                </span>
              </div>
            </div>
          </div>

          <div
            className="mt-6 rounded-[var(--whiold-radius-md)] p-4 text-sm"
            style={{
              background: "var(--whiold-primary-soft)",
              color: "var(--whiold-text-body)",
            }}
          >
            Withdrawals usually settle within <strong style={{ color: "var(--whiold-primary)" }}>2–3 business days</strong>.
          </div>
        </motion.div>
      </div>

      {/* ---------- Transactions ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
        className="mt-8 rounded-[var(--whiold-radius-lg)] p-5 sm:p-6"
        style={{
          background: "var(--whiold-bg)",
          border: "1px solid var(--whiold-border)",
          boxShadow: "var(--whiold-shadow-card)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h3 className="text-base font-semibold" style={{ color: "var(--whiold-text-heading)" }}>
            Recent Transactions
          </h3>

          <div className="flex items-center gap-2">
            <Filter size={14} style={{ color: "var(--whiold-text-muted)" }} />
            <div
              className="flex gap-1 p-1 rounded-full"
              style={{ background: "var(--whiold-bg-soft)" }}
            >
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="px-3 py-1.5 text-xs font-medium rounded-full transition-all"
                  style={
                    activeFilter === f
                      ? {
                          background: "var(--whiold-gradient-brand)",
                          color: "var(--whiold-text-on-primary)",
                        }
                      : { color: "var(--whiold-text-body)" }
                  }
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y" style={{ borderColor: "var(--whiold-border)" }}>
          <AnimatePresence mode="popLayout">
            {filteredTransactions.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm py-8 text-center"
                style={{ color: "var(--whiold-text-muted)" }}
              >
                No transactions to show yet.
              </motion.p>
            ) : (
              filteredTransactions.map((t, i) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  className="flex items-center justify-between py-3.5 gap-4"
                  style={{ borderColor: "var(--whiold-border)" }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="flex items-center justify-center w-9 h-9 rounded-full shrink-0"
                      style={{
                        background:
                          t.type === "credit"
                            ? "rgba(46, 155, 95, 0.12)"
                            : "rgba(192, 57, 43, 0.1)",
                      }}
                    >
                      {t.type === "credit" ? (
                        <ArrowDownLeft size={16} color="#2E9B5F" />
                      ) : (
                        <ArrowUpRight size={16} color="#C0392B" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: "var(--whiold-text-heading)" }}
                      >
                        {t.title}
                      </p>
                      <p className="text-xs" style={{ color: "var(--whiold-text-muted)" }}>
                        {t.date}
                      </p>
                    </div>
                  </div>

                  <span
                    className="text-sm font-semibold whitespace-nowrap"
                    style={{ color: t.type === "credit" ? "#2E9B5F" : "#C0392B" }}
                  >
                    {t.type === "credit" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                  </span>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default WalletHistory;