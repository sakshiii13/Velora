import React, { useEffect, useState } from "react";
import { Card, Box, Grid, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  FolderTree,
  Star,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { adminRoutes } from "../../../constants/router";

const useCountUp = (end = 0, duration = 800) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = null;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(end * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);
  return value;
};

const StatCard = ({
  label,
  value,
  prefix = "",
  icon: Icon,
  trend,
  trendUp,
  gradient,
}) => {
  const animated = useCountUp(value);
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card
        elevation={0}
        className="!h-full !w-full !rounded-2xl !border !border-[var(--whiold-border)] !bg-[var(--whiold-bg)] !shadow-[var(--whiold-shadow-card)] !overflow-hidden relative"
      >
        <div
          className="absolute -top-10 -right-10 h-28 w-28 rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{ background: gradient }}
        />
        <Box className="relative flex h-full flex-col justify-between gap-5 p-5 sm:p-6">
          <Box className="flex items-center justify-between gap-3">
            <span className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-wide text-[var(--whiold-text-muted)]">
              {label}
            </span>
            <Box
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
              style={{ background: gradient }}
            >
              <Icon size={17} />
            </Box>
          </Box>
          <Box>
            <p className="m-0 truncate text-2xl sm:text-3xl font-bold leading-tight text-[var(--whiold-text-heading)]">
              {prefix}
              {prefix === "₹" ? animated.toFixed(2) : Math.round(animated)}
            </p>
            <Box className="mt-2 flex items-center gap-1 flex-wrap">
              {trendUp ? (
                <ArrowUpRight size={14} className="text-emerald-500 shrink-0" />
              ) : (
                <ArrowDownRight size={14} className="text-rose-500 shrink-0" />
              )}
              <span
                className={`text-xs font-semibold ₹{trendUp ? "text-emerald-500" : "text-rose-500"}`}
              >
                {trend}
              </span>
              <span className="text-xs text-[var(--whiold-text-muted)]">
                vs last week
              </span>
            </Box>
          </Box>
        </Box>
      </Card>
    </motion.div>
  );
};

const quickLinks = [
  {
    label: "Products",
    desc: "86 items in catalog",
    icon: Package,
    path: adminRoutes.MANAGE_PRODUCTS,
    gradient: "linear-gradient(135deg, var(--whiold-primary), #b45309)",
  },
  {
    label: "Orders",
    desc: "12 pending to process",
    icon: ShoppingBag,
    path: adminRoutes.ORDERS,
    gradient: "linear-gradient(135deg, #4f46e5, #6366f1)",
  },
  {
    label: "Categories",
    desc: "5 active categories",
    icon: FolderTree,
    path: adminRoutes.CATEGORIES,
    gradient: "linear-gradient(135deg, #059669, #10b981)",
  },
  {
    label: "Reviews",
    desc: "8 awaiting moderation",
    icon: Star,
    path: "/reviews",
    gradient: "linear-gradient(135deg, #d97706, #f59e0b)",
  },
];

const recentOrders = [
  {
    id: "#WA1042",
    customer: "Rohit Sharma",
    items: 2,
    total: 189,
    status: "Delivered",
  },
  {
    id: "#WA1041",
    customer: "Ayesha Khan",
    items: 1,
    total: 94,
    status: "Shipped",
  },
  {
    id: "#WA1040",
    customer: "Vikram Rao",
    items: 3,
    total: 342,
    status: "Processing",
  },
  {
    id: "#WA1039",
    customer: "Neha Gupta",
    items: 1,
    total: 65,
    status: "Delivered",
  },
];

const lowStock = [
  { name: "Copper Weave Tote", stock: 3, max: 20 },
  { name: "Clay Pendant Lamp", stock: 5, max: 20 },
];

const statusColor = {
  Delivered: "!bg-emerald-100 !text-emerald-700",
  Shipped: "!bg-indigo-100 !text-indigo-700",
  Processing: "!bg-amber-100 !text-amber-700",
};

// ═══ CHART DATA ═══
const revenueData = [
  { day: "Mon", revenue: 1820 },
  { day: "Tue", revenue: 2140 },
  { day: "Wed", revenue: 1690 },
  { day: "Thu", revenue: 2480 },
  { day: "Fri", revenue: 2890 },
  { day: "Sat", revenue: 3210 },
  { day: "Sun", revenue: 2650 },
];

const orderStatusData = [
  { name: "Delivered", value: 210, color: "#10b981" },
  { name: "Shipped", value: 78, color: "#6366f1" },
  { name: "Processing", value: 54, color: "#f59e0b" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box className="rounded-xl border border-[var(--whiold-border)] bg-[var(--whiold-bg)] px-3 py-2 shadow-lg">
      <p className="m-0 text-xs font-semibold text-[var(--whiold-text-heading)]">
        {label}
      </p>
      <p className="m-0 text-xs text-[var(--whiold-text-muted)]">
        ₹{payload[0].value.toLocaleString()}
      </p>
    </Box>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const totalOrders = orderStatusData.reduce((a, b) => a + b.value, 0);

  return (
    <Box className="min-h-screen bg-[var(--whiold-bg-soft)]">
      <Box className="w-full flex flex-col gap-4">
        {/* Header */}
        <Box>
          <h1 className="m-0 text-2xl font-bold text-[var(--whiold-text-heading)]">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-[var(--whiold-text-body)]">
            Whiold Atelier store ka overview.
          </p>
        </Box>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* <Grid item xs={12} sm={6} md={3} sx={{ minWidth: 0 }}> */}
          <StatCard
            label="Total Revenue"
            prefix="₹"
            value={18420}
            icon={DollarSign}
            trend="+14.2%"
            trendUp
            gradient="linear-gradient(135deg, var(--whiold-primary), #b45309)"
          />
          {/* </Grid> */}
          {/* <Grid item xs={12} sm={6} md={3} sx={{ minWidth: 0 }}> */}
          <StatCard
            label="Total Orders"
            value={342}
            icon={ShoppingBag}
            trend="+6.8%"
            trendUp
            gradient="linear-gradient(135deg, #4f46e5, #6366f1)"
          />
          {/* </Grid> */}
          {/* <Grid item xs={12} sm={6} md={3} sx={{ minWidth: 0 }}> */}
          <StatCard
            label="Total Products"
            value={86}
            icon={Package}
            trend="+2 new"
            trendUp
            gradient="linear-gradient(135deg, #059669, #10b981)"
          />
          {/* </Grid> */}
          {/* <Grid item xs={12} sm={6} md={3} sx={{ minWidth: 0 }}> */}
          <StatCard
            label="Customers"
            value={512}
            icon={Users}
            trend="+9.4%"
            trendUp
            gradient="linear-gradient(135deg, #e11d48, #f43f5e)"
          />
          {/* </Grid> */}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* <Grid item xs={12} md={5} sx={{ minWidth: 0 }}> */}
          <Card
            elevation={0}
            className="!h-full !w-full !rounded-2xl !border !border-[var(--whiold-border)] !bg-[var(--whiold-bg)] !shadow-[var(--whiold-shadow-card)] !p-5 sm:!p-6"
          >
            <Box className="mb-4 flex items-center justify-between gap-3">
              <Box>
                <h2 className="m-0 text-sm font-semibold text-[var(--whiold-text-heading)]">
                  Revenue Trend
                </h2>
                <p className="m-0 mt-0.5 text-xs text-[var(--whiold-text-muted)]">
                  Last 7 days
                </p>
              </Box>
              <Box className="flex shrink-0 items-center gap-1.5">
                <ArrowUpRight size={14} className="text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-500">
                  +14.2%
                </span>
              </Box>
            </Box>
            <Box className="h-[240px] sm:h-[260px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" debounce={1}>
                <AreaChart
                  data={revenueData}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="revenueFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--whiold-primary)"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--whiold-primary)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--whiold-border)"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: "var(--whiold-text-muted)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--whiold-text-muted)" }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--whiold-primary)"
                    strokeWidth={2.5}
                    fill="url(#revenueFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
          {/* </Grid> */}

          {/* <Grid item xs={12} md={5} sx={{ minWidth: 0 }}> */}
          <Card
            elevation={0}
            className="!h-full !w-full !rounded-2xl !border !border-[var(--whiold-border)] !bg-[var(--whiold-bg)] !shadow-[var(--whiold-shadow-card)] !p-5 sm:!p-6"
          >
            <Box className="mb-4">
              <h2 className="m-0 text-sm font-semibold text-[var(--whiold-text-heading)]">
                Order Status
              </h2>
              <p className="m-0 mt-0.5 text-xs text-[var(--whiold-text-muted)]">
                {totalOrders} total orders
              </p>
            </Box>
            <Box className="h-[180px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" debounce={1}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {orderStatusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`₹{value} orders`, name]}
                    contentStyle={{
                      background: "var(--whiold-bg)",
                      border: "1px solid var(--whiold-border)",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box className="mt-4 flex flex-col gap-2.5">
              {orderStatusData.map((s) => (
                <Box
                  key={s.name}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <Box className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: s.color }}
                    />
                    <span className="truncate text-[var(--whiold-text-body)]">
                      {s.name}
                    </span>
                  </Box>
                  <span className="shrink-0 font-semibold text-[var(--whiold-text-heading)]">
                    {((s.value / totalOrders) * 100).toFixed(0)}%
                  </span>
                </Box>
              ))}
            </Box>
          </Card>
          {/* </Grid> */}
        </div>

        {/* Quick links */}
        {/* Quick Links */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {quickLinks.map((q) => (
            <motion.div
              key={q.label}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Card
                elevation={0}
                onClick={() => navigate(q.path)}
                className="!h-full !w-full !cursor-pointer !rounded-2xl !border !border-[var(--whiold-border)] !bg-[var(--whiold-bg)] !p-5 sm:!p-6 !shadow-[var(--whiold-shadow-card)] hover:!shadow-lg transition-all duration-300"
              >
                <Box className="flex h-full flex-col">
                  {/* Top */}
                  <Box className="flex items-center justify-between">
                    <Box
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                      style={{ background: q.gradient }}
                    >
                      <q.icon size={18} />
                    </Box>

                    <ChevronRight
                      size={18}
                      className="text-[var(--whiold-text-muted)] transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Box>

                  {/* Content */}
                  <Box className="mt-4 flex-1">
                    <p className="m-0 text-sm font-semibold text-[var(--whiold-text-heading)]">
                      {q.label}
                    </p>

                    <p className="mt-1 text-xs text-[var(--whiold-text-muted)]">
                      {q.desc}
                    </p>
                  </Box>
                </Box>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Orders + Low stock */}
        <Grid container spacing={{ xs: 2, sm: 2, md: 2 }} alignItems="stretch">
          <Grid item xs={12} md={7} sx={{ minWidth: 0 }}>
            <Card
              elevation={0}
              className="!h-full !w-full !rounded-2xl !border !border-[var(--whiold-border)] !bg-[var(--whiold-bg)] !shadow-[var(--whiold-shadow-card)] !p-5 sm:!p-6"
            >
              <Box className="mb-4 flex items-center justify-between gap-3">
                <h2 className="m-0 text-sm font-semibold text-[var(--whiold-text-heading)]">
                  Recent Orders
                </h2>
                <button
                  onClick={() => navigate(adminRoutes?.ORDERS)}
                  className="shrink-0 text-xs font-semibold text-[var(--whiold-primary)] hover:underline"
                >
                  View all
                </button>
              </Box>
              <Box className="flex flex-col gap-3">
                {recentOrders.map((o) => (
                  <Box
                    key={o.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--whiold-border)] p-3"
                  >
                    <Box className="min-w-0">
                      <p className="m-0 truncate text-sm font-semibold text-[var(--whiold-text-heading)]">
                        {o.id}
                      </p>
                      <p className="m-0 truncate text-xs text-[var(--whiold-text-muted)]">
                        {o.customer} · {o.items} items
                      </p>
                    </Box>
                    <Box className="flex shrink-0 items-center gap-3">
                      <span className="text-sm font-semibold text-[var(--whiold-text-heading)]">
                        ₹{o.total}
                      </span>
                      <Chip
                        label={o.status}
                        size="small"
                        className={`₹{statusColor[o.status]} !font-medium`}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={5} sx={{ minWidth: 0 }}>
            <Card
              elevation={0}
              className="!h-full !w-full !rounded-2xl !border !border-amber-200 !bg-amber-50 !p-5 sm:!p-6"
            >
              <Box className="mb-4 flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0 text-amber-600" />
                <h2 className="m-0 text-sm font-semibold text-amber-800">
                  Low Stock Alert
                </h2>
              </Box>
              <Box className="flex flex-col gap-3.5">
                {lowStock.map((p) => (
                  <Box key={p.name}>
                    <Box className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                      <span className="truncate text-amber-900">{p.name}</span>
                      <span className="shrink-0 font-semibold text-amber-700">
                        {p.stock} left
                      </span>
                    </Box>
                    <Box className="h-1.5 w-full overflow-hidden rounded-full bg-amber-200">
                      <Box
                        className="h-full rounded-full bg-amber-500"
                        style={{
                          width: `₹{Math.min((p.stock / p.max) * 100, 100)}%`,
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
              <button
                onClick={() => navigate(adminRoutes?.ADMIN_PRODUCTS)}
                className="mt-5 w-full rounded-xl border border-amber-300 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100"
              >
                Restock Products
              </button>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
