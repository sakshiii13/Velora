import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Landmark,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import ButtonComponent from "../../../ui/ButtonComponent";
import InputComponent from "../../../ui/InputComponent";
import TableComponent from "../../../ui/TableComponent";

// ---- fallback/demo data — replace with real props from parent ----
const demoBankAccounts = [
  { id: "b1", label: "HDFC Bank •• 4821", holder: "Sakshi Kacher", isDefault: true },
  { id: "b2", label: "ICICI Bank •• 0932", holder: "Sakshi Kacher", isDefault: false },
];

const demoRequests = [
  { id: "w1", bank: "HDFC •• 4821", amount: 5000, date: "22 Jul, 2026", status: "approved" },
  { id: "w2", bank: "HDFC •• 4821", amount: 3000, date: "17 Jul, 2026", status: "approved" },
  { id: "w3", bank: "ICICI •• 0932", amount: 2000, date: "10 Jul, 2026", status: "pending" },
  { id: "w4", bank: "HDFC •• 4821", amount: 1500, date: "03 Jul, 2026", status: "rejected" },
];

const quickAmounts = [500, 1000, 2500, 5000];
const MIN_WITHDRAW = 200;

const statusConfig = {
  approved: { label: "Approved", color: "#2E9B5F", bg: "rgba(46, 155, 95, 0.1)", icon: CheckCircle2 },
  pending: { label: "Pending", color: "#B8860B", bg: "rgba(184, 134, 11, 0.1)", icon: Clock },
  rejected: { label: "Rejected", color: "#C0392B", bg: "rgba(192, 57, 43, 0.1)", icon: XCircle },
};

const Withdraw = ({
  balance = 24680,
  bankAccounts = demoBankAccounts,
  requests = demoRequests,
  onSubmit,
}) => {
  const [amount, setAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState(
    bankAccounts.find((b) => b.isDefault)?.id || bankAccounts[0]?.id || ""
  );
  const [submitting, setSubmitting] = useState(false);

  const numericAmount = Number(amount) || 0;

  const amountError = useMemo(() => {
    if (!amount) return "";
    if (numericAmount < MIN_WITHDRAW) return `Minimum withdrawal is ₹${MIN_WITHDRAW}`;
    if (numericAmount > balance) return "Amount exceeds available balance";
    return "";
  }, [amount, numericAmount, balance]);

  const bankOptions = bankAccounts.map((b) => ({ value: b.id, label: b.label }));
  const canSubmit = numericAmount > 0 && !amountError && selectedBank && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await onSubmit?.({ amount: numericAmount, bankId: selectedBank });
      setAmount("");
    } finally {
      setSubmitting(false);
    }
  };

  // ---- columns for withdrawal history table ----
  const historyColumns = [
    {
      field: "bank",
      headerName: "Bank Account",
      flex: 1.3,
      minWidth: 190,
      renderCell: (params) => (
        <div className="flex items-center gap-2.5">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-full shrink-0"
            style={{ background: "var(--whiold-primary-soft)" }}
          >
            <Landmark size={14} style={{ color: "var(--whiold-primary)" }} />
          </span>
          <span className="font-medium truncate" style={{ color: "var(--whiold-text-heading)" }}>
            {params.value}
          </span>
        </div>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.8,
      minWidth: 110,
      renderCell: (params) => (
        <span className="font-semibold" style={{ color: "var(--whiold-text-heading)" }}>
          ₹{Number(params.value).toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.9,
      minWidth: 130,
      renderCell: (params) => {
        const cfg = statusConfig[params.value] || statusConfig.pending;
        const StatusIcon = cfg.icon;
        return (
          <span
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            <StatusIcon size={12} />
            {cfg.label}
          </span>
        );
      },
    },
  ];

  return (
    <div className="w-full mx-auto max-w-7xl">
      {/* ---------- Header ---------- */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: "var(--whiold-text-heading)" }}>
          Withdraw
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--whiold-text-body)" }}>
          Move your wallet balance to your bank account
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ---------- Withdraw form ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="whiold-foil-border lg:col-span-2 relative overflow-hidden rounded-[var(--whiold-radius-lg)] p-6 sm:p-8"
          style={{
            background: "var(--whiold-gradient-panel)",
            border: "1px solid var(--whiold-border)",
            boxShadow: "var(--whiold-shadow-card)",
          }}
        >
          <div
            className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full opacity-10 pointer-events-none"
            style={{ background: "var(--whiold-gradient-brand)" }}
          />

          <div className="flex items-center justify-between relative z-10 mb-6">
            <span className="text-sm" style={{ color: "var(--whiold-text-muted)" }}>
              Available Balance
            </span>
            <span className="text-lg font-semibold" style={{ color: "var(--whiold-text-heading)" }}>
              ₹{balance.toLocaleString("en-IN")}
            </span>
          </div>

          {/* amount input via InputComponent */}
          <div className="relative z-10">
            <InputComponent
              label="Enter Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/^0+/, ""))}
              placeholder="0"
              error={Boolean(amountError)}
              helperText={amountError}
            />

            <div className="flex flex-wrap gap-2 mt-3.5">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(String(q))}
                  className="px-3.5 py-1.5 text-xs font-medium rounded-full transition-all"
                  style={
                    numericAmount === q
                      ? { background: "var(--whiold-gradient-brand)", color: "var(--whiold-text-on-primary)" }
                      : { background: "var(--whiold-bg)", color: "var(--whiold-text-body)", border: "1px solid var(--whiold-border)" }
                  }
                >
                  ₹{q.toLocaleString("en-IN")}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAmount(String(balance))}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-full"
                style={{ color: "var(--whiold-primary)", background: "var(--whiold-primary-soft)" }}
              >
                MAX
              </button>
            </div>
          </div>

          {/* bank select via InputComponent */}
          <div className="mt-5 relative z-10">
            <InputComponent
              label="Withdraw To"
              type="select"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              options={bankOptions}
            />
          </div>

          {/* submit */}
          <div className="mt-7 relative z-10">
            <ButtonComponent
              fullWidth
              size="large"
              loading={submitting}
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              {submitting
                ? "Processing..."
                : `Withdraw ${numericAmount ? `₹${numericAmount.toLocaleString("en-IN")}` : ""}`}
            </ButtonComponent>
            <p
              className="flex items-center gap-1.5 text-xs mt-3 justify-center"
              style={{ color: "var(--whiold-text-muted)" }}
            >
              <ShieldCheck size={13} />
              Secured — funds settle in 2–3 business days
            </p>
          </div>
        </motion.div>

        {/* ---------- Sidebar rules ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
          className="rounded-[var(--whiold-radius-lg)] p-6"
          style={{
            background: "var(--whiold-bg)",
            border: "1px solid var(--whiold-border)",
            boxShadow: "var(--whiold-shadow-card)",
          }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--whiold-text-heading)" }}>
            Withdrawal Rules
          </h3>
          <ul className="space-y-3.5">
            {[
              `Minimum withdrawal amount is ₹${MIN_WITHDRAW}`,
              "No withdrawal fee for verified accounts",
              "Requests are processed once daily",
              "Bank name must match your registered name",
            ].map((rule, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--whiold-text-body)" }}>
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--whiold-primary)" }} />
                {rule}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* ---------- Withdrawal history — TableComponent (DataGrid) ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
        className="mt-8"
      >
        <TableComponent title="Withdrawal History" rows={requests} columns={historyColumns} />
      </motion.div>
    </div>
  );
};

export default Withdraw;