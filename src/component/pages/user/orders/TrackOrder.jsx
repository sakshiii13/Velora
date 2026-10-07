import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Package,
  CheckCircle2,
  PackageOpen,
  Truck,
  Home,
  MapPin,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  XCircle,
  Phone,
  Star,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data — replace with your real orders API response            */
/* ------------------------------------------------------------------ */

const MOCK_ORDERS = [
  {
    id: "WHD-24851",
    placedOn: "2026-07-04T10:12:00",
    status: "out_for_delivery",
    eta: "Today, by 9:00 PM",
    courier: "Delhivery",
    awb: "1298374651029",
    total: 3247,
    address: {
      name: "Shanu Verma",
      line: "204, Sundar Nagar, Near Vijay Nagar Square",
      city: "Indore, Madhya Pradesh - 452010",
      phone: "+91 98765 43210",
    },
    items: [
      {
        name: "Handwoven Jute Table Runner",
        variant: "Natural / 72\"",
        qty: 1,
        price: 1499,
        image:
          "https://images.unsplash.com/photo-1600166898405-da9535204843?w=200&h=200&fit=crop",
      },
      {
        name: "Terracotta Ceramic Vase — Set of 2",
        variant: "Rust Glaze",
        qty: 1,
        price: 1748,
        image:
          "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=200&h=200&fit=crop",
      },
    ],
    history: [
      { key: "placed", label: "Order placed", time: "4 Jul, 10:12 AM", note: "We've received your order" },
      { key: "confirmed", label: "Order confirmed", time: "4 Jul, 11:40 AM", note: "Seller has confirmed your order" },
      { key: "shipped", label: "Shipped", time: "5 Jul, 6:05 PM", note: "Handed over to Delhivery" },
      { key: "out_for_delivery", label: "Out for delivery", time: "Today, 8:02 AM", note: "Your parcel is on the way" },
      { key: "delivered", label: "Delivered", time: null, note: "Arriving today" },
    ],
  },
  {
    id: "WHD-24710",
    placedOn: "2026-06-28T15:40:00",
    status: "delivered",
    eta: "Delivered on 2 Jul",
    courier: "Blue Dart",
    awb: "7734021988451",
    total: 1899,
    address: {
      name: "Shanu Verma",
      line: "204, Sundar Nagar, Near Vijay Nagar Square",
      city: "Indore, Madhya Pradesh - 452010",
      phone: "+91 98765 43210",
    },
    items: [
      {
        name: "Hand-finished Mango Wood Coasters",
        variant: "Set of 6",
        qty: 1,
        price: 1899,
        image:
          "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=200&h=200&fit=crop",
      },
    ],
    history: [
      { key: "placed", label: "Order placed", time: "28 Jun, 3:40 PM", note: "We've received your order" },
      { key: "confirmed", label: "Order confirmed", time: "28 Jun, 4:55 PM", note: "Seller has confirmed your order" },
      { key: "shipped", label: "Shipped", time: "29 Jun, 1:20 PM", note: "Handed over to Blue Dart" },
      { key: "out_for_delivery", label: "Out for delivery", time: "2 Jul, 9:10 AM", note: "Your parcel was on the way" },
      { key: "delivered", label: "Delivered", time: "2 Jul, 4:47 PM", note: "Left at the front desk" },
    ],
  },
  {
    id: "WHD-24592",
    placedOn: "2026-06-19T09:05:00",
    status: "cancelled",
    eta: "Cancelled on 20 Jun",
    courier: "—",
    awb: "—",
    total: 2499,
    address: {
      name: "Shanu Verma",
      line: "204, Sundar Nagar, Near Vijay Nagar Square",
      city: "Indore, Madhya Pradesh - 452010",
      phone: "+91 98765 43210",
    },
    items: [
      {
        name: "Handloom Cotton Bedcover",
        variant: "Indigo Block Print / Queen",
        qty: 1,
        price: 2499,
        image:
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&h=200&fit=crop",
      },
    ],
    history: [
      { key: "placed", label: "Order placed", time: "19 Jun, 9:05 AM", note: "We've received your order" },
      { key: "cancelled", label: "Order cancelled", time: "20 Jun, 11:15 AM", note: "Cancelled — item out of stock" },
    ],
  },
];

const STEPS = [
  { key: "placed", label: "Placed", icon: Package },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "shipped", label: "Shipped", icon: PackageOpen },
  { key: "out_for_delivery", label: "Out for delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Home },
];

const STATUS_META = {
  placed: { label: "Order Placed", tone: "muted" },
  confirmed: { label: "Confirmed", tone: "muted" },
  shipped: { label: "Shipped", tone: "info" },
  out_for_delivery: { label: "Out for Delivery", tone: "active" },
  delivered: { label: "Delivered", tone: "success" },
  cancelled: { label: "Cancelled", tone: "danger" },
};

function stepIndex(status) {
  return STEPS.findIndex((s) => s.key === status);
}

function formatMoney(n) {
  return `₹${n.toLocaleString("en-IN")}`;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StatusPill({ status }) {
  const meta = STATUS_META[status] || STATUS_META.placed;
  const toneStyles = {
    muted: { bg: "var(--whiold-100)", fg: "var(--whiold-700)" },
    info: { bg: "var(--whiold-100)", fg: "var(--whiold-600)" },
    active: { bg: "var(--whiold-primary-soft)", fg: "var(--whiold-primary)" },
    success: { bg: "#E7F5EC", fg: "#1E8A4C" },
    danger: { bg: "#FDEBEA", fg: "#C0392B" },
  }[meta.tone];

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
      style={{ background: toneStyles.bg, color: toneStyles.fg }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: toneStyles.fg }}
      />
      {meta.label}
    </span>
  );
}

function OrderListItem({ order, active, onClick }) {
  const thumb = order.items[0].image;
  const extra = order.items.length - 1;

  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center gap-3 p-3.5 rounded-[var(--whiold-radius-md)] transition-all"
      style={{
        background: active ? "var(--whiold-primary-soft)" : "var(--whiold-bg)",
        border: `1px solid ${active ? "var(--whiold-border-focus)" : "var(--whiold-border)"}`,
        boxShadow: active ? "var(--whiold-shadow-focus)" : "none",
      }}
    >
      <div
        className="relative h-14 w-14 shrink-0 rounded-[var(--whiold-radius-sm)] overflow-hidden"
        style={{ border: "1px solid var(--whiold-border)" }}
      >
        <img src={thumb} alt="" className="h-full w-full object-cover" />
        {extra > 0 && (
          <div
            className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-white"
            style={{ background: "rgba(43,33,25,0.55)" }}
          >
            +{extra}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="truncate text-sm font-semibold"
          style={{ color: "var(--whiold-text-heading)" }}
        >
          {order.items[0].name}
          {order.items.length > 1 ? ` & ${order.items.length - 1} more` : ""}
        </p>
        <p className="mt-0.5 text-xs" style={{ color: "var(--whiold-text-muted)" }}>
          #{order.id} · {formatMoney(order.total)}
        </p>
        <div className="mt-1.5">
          <StatusPill status={order.status} />
        </div>
      </div>

      <ChevronRight
        size={18}
        style={{ color: "var(--whiold-text-muted)" }}
        className="shrink-0"
      />
    </button>
  );
}

function Timeline({ order }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, [order.id]);

  if (order.status === "cancelled") {
    return (
      <div
        className="flex items-start gap-3 rounded-[var(--whiold-radius-md)] p-4"
        style={{ background: "#FDEBEA", border: "1px solid #F6C9C4" }}
      >
        <XCircle size={20} style={{ color: "#C0392B" }} className="mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold" style={{ color: "#C0392B" }}>
            This order was cancelled
          </p>
          <p className="mt-0.5 text-xs" style={{ color: "var(--whiold-text-body)" }}>
            {order.history[order.history.length - 1].note} ·{" "}
            {order.history[order.history.length - 1].time}
          </p>
        </div>
      </div>
    );
  }

  const activeIndex = stepIndex(order.status);
  const fillPct = (activeIndex / (STEPS.length - 1)) * 100;

  return (
    <div className="relative pl-1">
      {/* track */}
      <div
        className="absolute left-[19px] top-4 bottom-4 w-[2px] rounded-full"
        style={{ background: "var(--whiold-border)" }}
      />
      {/* fill */}
      <div
        className="absolute left-[19px] top-4 w-[2px] rounded-full transition-all duration-[1200ms] ease-out"
        style={{
          background: "var(--whiold-gradient-brand)",
          height: animated ? `calc(${fillPct}% - ${fillPct > 0 ? "16px" : "0px"})` : "0%",
        }}
      />

      <div className="space-y-6">
        {STEPS.map((step, i) => {
          const done = i < activeIndex;
          const isCurrent = i === activeIndex;
          const upcoming = i > activeIndex;
          const Icon = step.icon;
          const histEntry = order.history.find((h) => h.key === step.key);

          return (
            <div key={step.key} className="relative flex items-start gap-4">
              <div
                className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500"
                style={{
                  background: done || isCurrent ? "var(--whiold-gradient-brand)" : "var(--whiold-bg)",
                  border: `2px solid ${
                    done || isCurrent ? "var(--whiold-500)" : "var(--whiold-border)"
                  }`,
                  boxShadow: isCurrent ? "0 0 0 5px var(--whiold-primary-ring)" : "none",
                }}
              >
                <Icon
                  size={17}
                  strokeWidth={2.4}
                  style={{
                    color: done || isCurrent ? "var(--whiold-text-on-primary)" : "var(--whiold-text-muted)",
                  }}
                />
                {isCurrent && (
                  <span
                    className="absolute inline-flex h-full w-full rounded-full animate-ping"
                    style={{ background: "var(--whiold-primary)", opacity: 0.25 }}
                  />
                )}
              </div>

              <div className="min-w-0 flex-1 pt-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p
                    className="text-sm font-semibold"
                    style={{
                      color: upcoming ? "var(--whiold-text-muted)" : "var(--whiold-text-heading)",
                    }}
                  >
                    {step.label}
                  </p>
                  {histEntry?.time && (
                    <span className="text-xs" style={{ color: "var(--whiold-text-muted)" }}>
                      {histEntry.time}
                    </span>
                  )}
                </div>
                <p
                  className="mt-0.5 text-xs"
                  style={{ color: upcoming ? "var(--whiold-text-muted)" : "var(--whiold-text-body)" }}
                >
                  {histEntry?.note || (upcoming ? "Pending" : "")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CopyRow({ label, value }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs" style={{ color: "var(--whiold-text-muted)" }}>
        {label}
      </span>
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
        style={{ color: copied ? "#1E8A4C" : "var(--whiold-primary)" }}
      >
        {value}
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function TrackOrder() {
  const [orders] = useState(MOCK_ORDERS);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(MOCK_ORDERS[0].id);
  const [mobileDetail, setMobileDetail] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.items.some((it) => it.name.toLowerCase().includes(q))
    );
  }, [orders, query]);

  const selected = orders.find((o) => o.id === selectedId) || filtered[0];

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
      `}</style>

      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--whiold-primary)" }}
            >
              My Orders
            </p>
            <h1
              className="mt-1 text-2xl font-bold md:text-3xl"
              style={{ color: "var(--whiold-text-heading)" }}
            >
              Track your order
            </h1>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: "var(--whiold-text-muted)" }}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search order ID or product"
              className="w-full rounded-[var(--whiold-radius-md)] py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
              style={{
                height: "var(--whiold-input-height)",
                background: "var(--whiold-input-bg)",
                border: "1px solid var(--whiold-input-border)",
                color: "var(--whiold-input-text-color)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--whiold-border-focus)";
                e.target.style.boxShadow = "var(--whiold-shadow-focus)";
                e.target.style.background = "var(--whiold-bg)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--whiold-input-border)";
                e.target.style.boxShadow = "none";
                e.target.style.background = "var(--whiold-input-bg)";
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[340px_1fr]">
          {/* Order list */}
          <div
            className={`${mobileDetail ? "hidden md:block" : "block"} space-y-3`}
          >
            {filtered.length === 0 && (
              <div
                className="rounded-[var(--whiold-radius-md)] p-6 text-center text-sm"
                style={{
                  color: "var(--whiold-text-muted)",
                  border: "1px dashed var(--whiold-border)",
                }}
              >
                No orders match "{query}"
              </div>
            )}
            {filtered.map((o) => (
              <OrderListItem
                key={o.id}
                order={o}
                active={selected?.id === o.id}
                onClick={() => {
                  setSelectedId(o.id);
                  setMobileDetail(true);
                }}
              />
            ))}
          </div>

          {/* Detail panel */}
          {selected && (
            <div
              className={`${mobileDetail ? "block" : "hidden md:block"} rounded-[var(--whiold-radius-lg)] p-5 md:p-7`}
              style={{
                background: "var(--whiold-bg)",
                border: "1px solid var(--whiold-border)",
                boxShadow: "var(--whiold-shadow-card)",
              }}
            >
              {/* back button (mobile only) */}
              <button
                onClick={() => setMobileDetail(false)}
                className="mb-4 inline-flex items-center gap-1 text-xs font-semibold md:hidden"
                style={{ color: "var(--whiold-primary)" }}
              >
                <ChevronLeft size={15} /> Back to orders
              </button>

              {/* top row */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2
                      className="text-base font-bold md:text-lg"
                      style={{ color: "var(--whiold-text-heading)" }}
                    >
                      Order #{selected.id}
                    </h2>
                    <StatusPill status={selected.status} />
                  </div>
                  <p className="mt-1 text-xs" style={{ color: "var(--whiold-text-muted)" }}>
                    Placed on{" "}
                    {new Date(selected.placedOn).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className="text-xs font-medium"
                    style={{ color: "var(--whiold-text-muted)" }}
                  >
                    {selected.status === "cancelled" ? "Order value" : "Arriving"}
                  </p>
                  <p
                    className="text-sm font-bold"
                    style={{
                      color:
                        selected.status === "delivered"
                          ? "#1E8A4C"
                          : "var(--whiold-primary)",
                    }}
                  >
                    {selected.eta}
                  </p>
                </div>
              </div>

              {/* items */}
              <div
                className="mt-5 space-y-3 rounded-[var(--whiold-radius-md)] p-3"
                style={{ background: "var(--whiold-bg-soft)" }}
              >
                {selected.items.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      className="h-14 w-14 shrink-0 overflow-hidden rounded-[var(--whiold-radius-sm)]"
                      style={{ border: "1px solid var(--whiold-border)" }}
                    >
                      <img src={it.image} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-sm font-semibold"
                        style={{ color: "var(--whiold-text-heading)" }}
                      >
                        {it.name}
                      </p>
                      <p className="text-xs" style={{ color: "var(--whiold-text-muted)" }}>
                        {it.variant} · Qty {it.qty}
                      </p>
                    </div>
                    <p
                      className="shrink-0 text-sm font-semibold"
                      style={{ color: "var(--whiold-text-heading)" }}
                    >
                      {formatMoney(it.price)}
                    </p>
                  </div>
                ))}
                <div
                  className="flex items-center justify-between pt-2"
                  style={{ borderTop: "1px solid var(--whiold-border)" }}
                >
                  <span className="text-xs font-medium" style={{ color: "var(--whiold-text-muted)" }}>
                    Order total
                  </span>
                  <span className="text-sm font-bold" style={{ color: "var(--whiold-text-heading)" }}>
                    {formatMoney(selected.total)}
                  </span>
                </div>
              </div>

              {/* timeline */}
              <div className="mt-6">
                <p
                  className="mb-4 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--whiold-text-muted)" }}
                >
                  Tracking status
                </p>
                <Timeline order={selected} />
              </div>

              {/* courier + address */}
              {selected.status !== "cancelled" && (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div
                    className="rounded-[var(--whiold-radius-md)] p-4"
                    style={{ border: "1px solid var(--whiold-border)" }}
                  >
                    <p
                      className="mb-1 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--whiold-text-muted)" }}
                    >
                      Courier details
                    </p>
                    <CopyRow label="Courier partner" value={selected.courier} />
                    <CopyRow label="Tracking ID (AWB)" value={selected.awb} />
                  </div>

                  <div
                    className="rounded-[var(--whiold-radius-md)] p-4"
                    style={{ border: "1px solid var(--whiold-border)" }}
                  >
                    <div className="mb-2 flex items-center gap-1.5">
                      <MapPin size={14} style={{ color: "var(--whiold-primary)" }} />
                      <p
                        className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--whiold-text-muted)" }}
                      >
                        Delivering to
                      </p>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: "var(--whiold-text-heading)" }}>
                      {selected.address.name}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "var(--whiold-text-body)" }}>
                      {selected.address.line}, {selected.address.city}
                    </p>
                    <p
                      className="mt-1.5 inline-flex items-center gap-1 text-xs"
                      style={{ color: "var(--whiold-text-muted)" }}
                    >
                      <Phone size={12} /> {selected.address.phone}
                    </p>
                  </div>
                </div>
              )}

              {/* actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                {selected.status === "delivered" ? (
                  <button
                    className="inline-flex items-center gap-2 rounded-[var(--whiold-button-radius)] px-6 text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      height: "var(--whiold-button-height-md)",
                      background: "var(--whiold-gradient-brand)",
                      color: "var(--whiold-text-on-primary)",
                      boxShadow: "var(--whiold-shadow-btn)",
                    }}
                  >
                    <Star size={15} /> Rate this order
                  </button>
                ) : selected.status !== "cancelled" ? (
                  <button
                    className="inline-flex items-center gap-2 rounded-[var(--whiold-button-radius)] px-6 text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      height: "var(--whiold-button-height-md)",
                      background: "var(--whiold-gradient-brand)",
                      color: "var(--whiold-text-on-primary)",
                      boxShadow: "var(--whiold-shadow-btn)",
                    }}
                  >
                    <Truck size={15} /> Track on courier site
                  </button>
                ) : null}

                <button
                  className="inline-flex items-center gap-2 rounded-[var(--whiold-button-radius)] px-6 text-sm font-semibold transition-colors"
                  style={{
                    height: "var(--whiold-button-height-md)",
                    background: "var(--whiold-bg)",
                    color: "var(--whiold-text-heading)",
                    border: "1px solid var(--whiold-border)",
                  }}
                >
                  Need help?
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}