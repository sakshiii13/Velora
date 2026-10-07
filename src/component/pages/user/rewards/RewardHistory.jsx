import React, { useState, useMemo, useEffect } from "react";
import {
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ShoppingBag,
  Gift,
  Users,
  Cake,
  Star,
  ChevronRight,
  Info,
  Zap,
  Award,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data — replace with your real rewards API response           */
/*  Currency unit: "Threads" — Whiold's loyalty points, tied to the   */
/*  brand's handwoven identity                                        */
/* ------------------------------------------------------------------ */

const TIERS = [
  { key: "sprout", label: "Sprout", min: 0 },
  { key: "loom", label: "Loom Gold", min: 1000 },
  { key: "artisan", label: "Artisan Circle", min: 2000 },
];

const CURRENT_BALANCE = 1240;

const TRANSACTIONS = [
  {
    id: "t1",
    type: "earned",
    title: "Order delivered",
    detail: "Handwoven Jute Table Runner + 1 more · #WHD-24851",
    date: "2026-07-11T18:20:00",
    points: 162,
    icon: ShoppingBag,
  },
  {
    id: "t2",
    type: "earned",
    title: "Referral bonus",
    detail: "Priya S. placed her first order",
    date: "2026-07-08T09:00:00",
    points: 250,
    icon: Users,
  },
  {
    id: "t3",
    type: "redeemed",
    title: "Redeemed on order",
    detail: "₹150 off · #WHD-24710",
    date: "2026-07-02T15:40:00",
    points: -500,
    icon: Gift,
  },
  {
    id: "t4",
    type: "earned",
    title: "Order delivered",
    detail: "Hand-finished Mango Wood Coasters · #WHD-24710",
    date: "2026-07-02T15:40:00",
    points: 95,
    icon: ShoppingBag,
  },
  {
    id: "t5",
    type: "expiring",
    title: "Threads expiring soon",
    detail: "From your Jun welcome bonus",
    date: "2026-07-31T00:00:00",
    points: 120,
    icon: Clock,
  },
  {
    id: "t6",
    type: "earned",
    title: "Birthday gift",
    detail: "A little something from us 🎂",
    date: "2026-06-21T10:00:00",
    points: 200,
    icon: Cake,
  },
  {
    id: "t7",
    type: "earned",
    title: "Wrote a review",
    detail: "Terracotta Ceramic Vase — Set of 2",
    date: "2026-06-15T12:30:00",
    points: 40,
    icon: Star,
  },
  {
    id: "t8",
    type: "redeemed",
    title: "Redeemed on order",
    detail: "₹200 off · #WHD-24592",
    date: "2026-06-19T09:05:00",
    points: -700,
    icon: Gift,
  },
  {
    id: "t9",
    type: "expired",
    title: "Threads expired",
    detail: "Unused balance from 2025",
    date: "2026-06-01T00:00:00",
    points: -80,
    icon: Clock,
  },
];

const WAYS_TO_EARN = [
  { icon: ShoppingBag, label: "Shop", detail: "10 Threads per ₹100" },
  { icon: Star, label: "Review", detail: "40 Threads / review" },
  { icon: Users, label: "Refer a friend", detail: "250 Threads" },
  { icon: Cake, label: "Birthday gift", detail: "200 Threads" },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "earned", label: "Earned" },
  { key: "redeemed", label: "Redeemed" },
  { key: "expiring", label: "Expiring" },
];

/* ------------------------------------------------------------------ */

function currentTier(balance) {
  let idx = 0;
  TIERS.forEach((t, i) => {
    if (balance >= t.min) idx = i;
  });
  return idx;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

/* ------------------------------------------------------------------ */

function TxnRow({ txn, index }) {
  const Icon = txn.icon;
  const isPositive = txn.points > 0;
  const isExpiring = txn.type === "expiring";
  const isExpired = txn.type === "expired";

  const iconBg = isExpired
    ? "#F1EDE9"
    : isExpiring
    ? "#FCEFD8"
    : isPositive
    ? "var(--whiold-primary-soft)"
    : "#F1EDE9";
  const iconColor = isExpired
    ? "var(--whiold-text-muted)"
    : isExpiring
    ? "#B8720B"
    : isPositive
    ? "var(--whiold-primary)"
    : "var(--whiold-text-body)";

  return (
    <div
      className="flex items-center gap-3.5 py-3.5 opacity-0 animate-[fadeIn_0.5s_ease_forwards]"
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        style={{ background: iconBg }}
      >
        <Icon size={18} style={{ color: iconColor }} strokeWidth={2.2} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className="truncate text-sm font-semibold"
            style={{ color: "var(--whiold-text-heading)" }}
          >
            {txn.title}
          </p>
          {isExpiring && (
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ background: "#FCEFD8", color: "#B8720B" }}
            >
              Expires {formatDate(txn.date)}
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-xs" style={{ color: "var(--whiold-text-muted)" }}>
          {txn.detail} {!isExpiring && `· ${formatDate(txn.date)}`}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p
          className="inline-flex items-center gap-1 text-sm font-bold"
          style={{
            color: isExpired
              ? "var(--whiold-text-muted)"
              : isPositive
              ? "#1E8A4C"
              : "var(--whiold-text-heading)",
          }}
        >
          {isPositive && !isExpiring ? (
            <ArrowUpRight size={14} />
          ) : txn.points < 0 ? (
            <ArrowDownRight size={14} />
          ) : null}
          {isPositive ? "+" : ""}
          {txn.points}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function RewardHistory() {
  const [filter, setFilter] = useState("all");
  const animatedBalance = useCountUp(CURRENT_BALANCE);
  const tierIdx = currentTier(CURRENT_BALANCE);
  const tier = TIERS[tierIdx];
  const nextTier = TIERS[tierIdx + 1];
  const progressPct = nextTier
    ? Math.min(
        100,
        ((CURRENT_BALANCE - tier.min) / (nextTier.min - tier.min)) * 100
      )
    : 100;

  const filtered = useMemo(() => {
    if (filter === "all") return TRANSACTIONS;
    return TRANSACTIONS.filter((t) => t.type === filter);
  }, [filter]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((t) => {
      const key = new Date(t.date).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      });
      map[key] = map[key] || [];
      map[key].push(t);
    });
    return map;
  }, [filtered]);

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "var(--whiold-bg-soft)", fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Fallback tokens so this preview renders standalone.
          Safe to delete inside your app — Whiold's global CSS already defines these. */}
      <style>{`
        :root {
          --whiold-50:#FAF3F0; --whiold-100:#F2E1D9; --whiold-200:#E5C2B3; --whiold-300:#D59E86;
          --whiold-400:#C57A58; --whiold-500:#BA704F; --whiold-600:#9F5737; --whiold-700:#79422A;
          --whiold-800:#5B321F; --whiold-900:#3D2115;
          --whiold-primary:var(--whiold-500); --whiold-primary-hover:var(--whiold-600);
          --whiold-primary-soft:var(--whiold-100); --whiold-primary-ring:rgba(186,112,79,0.16);
          --whiold-text-heading:#2B2119; --whiold-text-body:#6B5B4F; --whiold-text-muted:#A5978C;
          --whiold-text-on-primary:#FFFFFF;
          --whiold-bg:#FFFFFF; --whiold-bg-soft:#FAF3F0; --whiold-bg-input:#FAF8F6;
          --whiold-border:#ECE0D8; --whiold-border-hover:#D59E86; --whiold-border-focus:#BA704F;
          --whiold-radius-sm:10px; --whiold-radius-md:14px; --whiold-radius-lg:24px;
          --whiold-shadow-card:0 16px 40px -12px rgba(59,33,21,0.14);
          --whiold-shadow-btn:0 10px 24px -8px rgba(186,112,79,0.45);
          --whiold-shadow-focus:0 0 0 4px var(--whiold-primary-ring);
          --whiold-gradient-brand:linear-gradient(90deg,var(--whiold-400) 0%,var(--whiold-500) 50%,var(--whiold-600) 100%);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--whiold-primary)" }}
          >
            Rewards
          </p>
          <h1
            className="mt-1 text-2xl font-bold md:text-3xl"
            style={{ color: "var(--whiold-text-heading)" }}
          >
            Your Threads history
          </h1>
        </div>

        {/* Balance hero card */}
        <div
          className="relative overflow-hidden rounded-[var(--whiold-radius-lg)] p-6 md:p-8"
          style={{
            background: "var(--whiold-gradient-brand)",
            boxShadow: "var(--whiold-shadow-btn)",
          }}
        >
          {/* decorative weave texture */}
          <svg
            className="pointer-events-none absolute -right-8 -top-8 opacity-15"
            width="220"
            height="220"
            viewBox="0 0 220 220"
            fill="none"
          >
            {[...Array(8)].map((_, i) => (
              <line
                key={`h${i}`}
                x1="0"
                y1={i * 28 + 10}
                x2="220"
                y2={i * 28 + 10}
                stroke="white"
                strokeWidth="3"
              />
            ))}
            {[...Array(8)].map((_, i) => (
              <line
                key={`v${i}`}
                x1={i * 28 + 10}
                y1="0"
                x2={i * 28 + 10}
                y2="220"
                stroke="white"
                strokeWidth="3"
              />
            ))}
          </svg>

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} style={{ color: "rgba(255,255,255,0.85)" }} />
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  {tier.label} member
                </span>
              </div>
              <p className="mt-2 text-4xl font-extrabold text-white md:text-5xl">
                {animatedBalance.toLocaleString("en-IN")}
                <span className="ml-2 text-lg font-semibold text-white/80">Threads</span>
              </p>
              <p className="mt-1 text-sm text-white/80">≈ ₹{Math.floor(CURRENT_BALANCE / 5)} in rewards</p>
            </div>

            <button
              className="inline-flex shrink-0 items-center gap-2 rounded-[var(--whiold-radius-md)] px-6 text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{
                height: "var(--whiold-button-height-md)",
                background: "white",
                color: "var(--whiold-primary)",
              }}
            >
              <Gift size={16} /> Redeem now
            </button>
          </div>

          {/* tier progress */}
          {nextTier && (
            <div className="relative mt-6">
              <div className="mb-1.5 flex items-center justify-between text-xs text-white/85">
                <span className="inline-flex items-center gap-1">
                  <Award size={13} /> {tier.label}
                </span>
                <span>{nextTier.min - CURRENT_BALANCE} Threads to {nextTier.label}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/25">
                <div
                  className="h-full rounded-full bg-white transition-all duration-[1200ms] ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Ways to earn */}
        <div className="mt-6">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--whiold-text-muted)" }}
          >
            Ways to earn more
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {WAYS_TO_EARN.map((w, i) => {
              const Icon = w.icon;
              return (
                <div
                  key={i}
                  className="rounded-[var(--whiold-radius-md)] p-4 transition-colors"
                  style={{
                    background: "var(--whiold-bg)",
                    border: "1px solid var(--whiold-border)",
                  }}
                >
                  <div
                    className="mb-2 flex h-9 w-9 items-center justify-center rounded-full"
                    style={{ background: "var(--whiold-primary-soft)" }}
                  >
                    <Icon size={16} style={{ color: "var(--whiold-primary)" }} />
                  </div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--whiold-text-heading)" }}
                  >
                    {w.label}
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--whiold-text-muted)" }}>
                    {w.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all"
                style={{
                  background: active ? "var(--whiold-gradient-brand)" : "var(--whiold-bg)",
                  color: active ? "white" : "var(--whiold-text-body)",
                  border: `1px solid ${active ? "transparent" : "var(--whiold-border)"}`,
                  boxShadow: active ? "var(--whiold-shadow-btn)" : "none",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Transaction list */}
        <div
          className="mt-4 rounded-[var(--whiold-radius-lg)] px-5"
          style={{
            background: "var(--whiold-bg)",
            border: "1px solid var(--whiold-border)",
            boxShadow: "var(--whiold-shadow-card)",
          }}
        >
          {Object.keys(grouped).length === 0 && (
            <div className="flex flex-col items-center gap-2 py-14 text-center">
              <Info size={22} style={{ color: "var(--whiold-text-muted)" }} />
              <p className="text-sm" style={{ color: "var(--whiold-text-muted)" }}>
                No {filter} activity yet
              </p>
            </div>
          )}

          {Object.entries(grouped).map(([month, txns]) => (
            <div key={month}>
              <p
                className="pt-4 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--whiold-text-muted)" }}
              >
                {month}
              </p>
              <div style={{ borderTop: "1px solid transparent" }}>
                {txns.map((t, i) => (
                  <div
                    key={t.id}
                    style={{
                      borderBottom:
                        i === txns.length - 1 ? "none" : "1px solid var(--whiold-border)",
                    }}
                  >
                    <TxnRow txn={t} index={i} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* footer note */}
        <p
          className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs"
          style={{ color: "var(--whiold-text-muted)" }}
        >
          <Zap size={12} /> Threads earned on delivery, valid for 12 months from date of credit
        </p>
      </div>
    </div>
  );
}