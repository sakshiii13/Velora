import { useMemo, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Drawer,
  Avatar,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  X,
  MapPin,
  Phone,
  CreditCard,
  RefreshCcw,
  Receipt,
  IndianRupee,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TableComponent from "../../../ui/TableComponent";
import ButtonComponent from "../../../ui/ButtonComponent";
import { getAllOrders } from "../../../../api/user/orders.api";
import { useSnackbar } from "../../../../context/SnackBarContext";

const STATUS_FLOW = ["CREATED", "PENDING", "CONFIRMED", "DISPATCH", "DELIVERED"];

const STATUS_META = {
  CREATED: { label: "Created", icon: Clock, color: "#8E8E8E", bg: "rgba(142,142,142,0.12)" },
  PENDING: { label: "Pending", icon: Clock, color: "#B8862B", bg: "rgba(184,134,43,0.12)" },
  CONFIRMED: { label: "Confirmed", icon: RefreshCcw, color: "#3B6FB6", bg: "rgba(59,111,182,0.12)" },
  DISPATCH: { label: "Dispatched", icon: Truck, color: "#7A5CC7", bg: "rgba(122,92,199,0.12)" },
  DELIVERED: { label: "Delivered", icon: CheckCircle2, color: "#2E9E5B", bg: "rgba(46,158,91,0.12)" },
  CANCELLED: { label: "Cancelled", icon: XCircle, color: "#D64545", bg: "rgba(214,69,69,0.12)" },
};

const inr = (n) => `\u20B9${Number(n || 0).toLocaleString("en-IN")}`;

const StatusPill = ({ status }) => {
  const meta = STATUS_META[status?.toUpperCase()] || STATUS_META.PENDING;
  const Icon = meta.icon;
  return (
    <div
      className="inline-flex items-center gap-1 !h-fit !leading-none !px-3 !py-2 rounded-full text-[11px] font-semibold"
      style={{ background: meta.bg, color: meta.color }}
    >
      <Icon size={12} />
      {meta.label}
    </div>
  );
};

const StatCard = ({ label, value, accent, icon: Icon }) => (
  <Box
    className="relative flex-1 min-w-[170px] overflow-hidden rounded-2xl border p-5"
    sx={{ borderColor: "var(--whiold-border)", background: "var(--whiold-bg)" }}
  >
    <Box className="absolute left-0 top-0 h-full w-[3px]" sx={{ background: accent }} />
    <Box className="flex items-center justify-between">
      <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: "var(--whiold-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </Typography>
      <Box className="flex h-7 w-7 items-center justify-center rounded-lg" sx={{ background: `${accent}1f`, color: accent }}>
        <Icon size={14} />
      </Box>
    </Box>
    <Typography sx={{ fontSize: 23, fontWeight: 800, color: "var(--whiold-text-heading)", mt: 1 }}>
      {value}
    </Typography>
  </Box>
);

const OrderJourney = ({ status }) => {
  const currentStatus = status?.toUpperCase() || "PENDING";
  if (currentStatus === "CANCELLED") {
    return (
      <Box className="flex items-center gap-2 rounded-xl px-3.5 py-3" sx={{ background: STATUS_META.CANCELLED.bg, color: STATUS_META.CANCELLED.color }}>
        <XCircle size={16} />
        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>This order was cancelled</Typography>
      </Box>
    );
  }

  const currentIndex = STATUS_FLOW.indexOf(currentStatus);
  return (
    <Box className="flex items-start">
      {STATUS_FLOW.map((step, i) => {
        const meta = STATUS_META[step];
        const Icon = meta.icon;
        const reached = i <= currentIndex;
        const isLast = i === STATUS_FLOW.length - 1;
        return (
          <Box key={step} className="flex flex-1 flex-col items-center">
            <Box className="flex w-full items-center">
              <Box
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300"
                sx={{
                  background: reached ? "var(--whiold-primary)" : "var(--whiold-bg-soft, #F1EDE9)",
                  color: reached ? "#fff" : "var(--whiold-text-muted)",
                  border: reached ? "none" : "1px solid var(--whiold-border)",
                }}
              >
                <Icon size={14} />
              </Box>
              {!isLast && <Box className="mx-1 h-[2px] flex-1 rounded-full transition-colors duration-300" sx={{ background: i < currentIndex ? "var(--whiold-primary)" : "var(--whiold-border)" }} />}
            </Box>
            <Typography sx={{ fontSize: 10.5, fontWeight: reached ? 700 : 500, color: reached ? "var(--whiold-text-heading)" : "var(--whiold-text-muted)", mt: 0.75, textAlign: "center" }}>
              {meta.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrders();
      if (res?.success) {
        setOrders(res.data || []);
      } else {
        showSnackbar(res?.message || "Failed to load orders", "error");
      }
    } catch (error) {
      showSnackbar("An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const stats = useMemo(() => {
    const revenue = orders.filter((o) => o.orderStatus?.toUpperCase() !== "CANCELLED").reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    return {
      total: orders.length,
      pending: orders.filter((o) => o.orderStatus?.toUpperCase() === "PENDING").length,
      delivered: orders.filter((o) => o.orderStatus?.toUpperCase() === "DELIVERED").length,
      revenue,
    };
  }, [orders]);

  const filterCounts = useMemo(() => {
    const counts = { all: orders.length };
    Object.keys(STATUS_META).forEach((s) => {
      counts[s.toLowerCase()] = orders.filter((o) => o.orderStatus?.toUpperCase() === s).length;
    });
    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return orders;
    return orders.filter((o) => o.orderStatus?.toUpperCase() === activeFilter.toUpperCase());
  }, [orders, activeFilter]);

  const columns = [
    {
      field: "invoiceNumber",
      headerName: "Order ID",
      width: 150,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 12.5, fontWeight: 700, fontFamily: "monospace", color: "var(--whiold-text-heading)" }}>
          {params.value || params.row._id.slice(-6)}
        </Typography>
      ),
    },
    {
      field: "itemsCount",
      headerName: "Items",
      width: 100,
      valueGetter: (_, row) => (row.items || []).reduce((s, it) => s + (it.quantity || 1), 0),
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13, color: "var(--whiold-text-body)" }}>{params.value} pcs</Typography>
      ),
    },
    {
      field: "totalAmount",
      headerName: "Total",
      width: 130,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "var(--whiold-text-heading)" }}>
          {inr(params.value)}
        </Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Date",
      width: 120,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 12.5, color: "var(--whiold-text-muted)" }}>
          {new Date(params.value).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
        </Typography>
      ),
    },
    {
      field: "orderStatus",
      headerName: "Status",
      width: 140,
      renderCell: (params) => <StatusPill status={params.value} />,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <Box className="flex items-center gap-1.5">
          <IconButton size="small" onClick={() => setSelectedOrder(params.row)} title="View order">
            <Eye size={16} color="var(--whiold-text-muted)" />
          </IconButton>
          <IconButton size="small" onClick={() => navigate(`/invoice/${params.row._id}`, { state: { data: params.row } })} title="Invoice">
            <Receipt size={16} color="var(--whiold-text-muted)" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const filterTabs = [
    { key: "all", label: "All" },
    { key: "pending", label: STATUS_META.PENDING.label },
    { key: "confirmed", label: STATUS_META.CONFIRMED.label },
    { key: "dispatch", label: STATUS_META.DISPATCH.label },
    { key: "delivered", label: STATUS_META.DELIVERED.label },
    { key: "cancelled", label: STATUS_META.CANCELLED.label },
  ];

  return (
    <Box className="flex flex-col gap-7" sx={{ pt: { xs: 2, sm: 3 }, pb: 4, px: { xs: 0.5, sm: 0 } }}>
      <Box className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Box>
          <Typography sx={{ fontSize: 28, fontWeight: 900, color: "var(--whiold-text-heading)", lineHeight: 1.3 }}>All Orders</Typography>
          <Typography sx={{ fontSize: 13.5, color: "var(--whiold-text-muted)", mt: 0.5 }}>Track, update and manage every Whiold order in one place</Typography>
        </Box>
        <ButtonComponent variant="outlined" size="medium" startIcon={<RefreshCcw size={15} />} onClick={fetchOrders} loading={loading}>
          Refresh
        </ButtonComponent>
      </Box>

      <Box className="flex flex-wrap gap-5">
        <StatCard label="Total Orders" value={stats.total} accent="#B8703F" icon={Package} />
        <StatCard label="Pending" value={stats.pending} accent="#B8862B" icon={Clock} />
        <StatCard label="Delivered" value={stats.delivered} accent="#2E9E5B" icon={CheckCircle2} />
        <StatCard label="Total Spent" value={inr(stats.revenue)} accent="#3B6FB6" icon={IndianRupee} />
      </Box>

      <Box className="flex flex-wrap items-center gap-3" sx={{ py: 0.5 }}>
        {filterTabs.map((tab) => {
          const active = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className="rounded-full border px-4.5 py-2.5 text-[13px] font-semibold transition-colors"
              style={{
                borderColor: active ? "var(--whiold-primary)" : "var(--whiold-border)",
                background: active ? "var(--whiold-primary)" : "var(--whiold-bg)",
                color: active ? "#fff" : "var(--whiold-text-body)",
              }}
            >
              {tab.label}
              <span
                className="ml-2 rounded-full px-1.5 text-[11px]"
                style={{
                  background: active ? "rgba(255,255,255,0.22)" : "var(--whiold-primary-soft)",
                  color: active ? "#fff" : "var(--whiold-primary)",
                }}
              >
                {filterCounts[tab.key] ?? 0}
              </span>
            </button>
          );
        })}
      </Box>

      <TableComponent title="Orders" rows={filteredOrders.map(o => ({...o, id: o._id}))} columns={columns} />

      <Drawer anchor="right" open={Boolean(selectedOrder)} onClose={() => setSelectedOrder(null)}>
        {selectedOrder && (
          <Box className="flex h-full w-[92vw] max-w-[420px] flex-col" sx={{ background: "var(--whiold-bg)" }}>
            <Box className="flex items-start justify-between border-b p-5" sx={{ borderColor: "var(--whiold-border)" }}>
              <Box>
                <Typography sx={{ fontSize: 11, color: "var(--whiold-text-muted)", fontWeight: 600 }}>ORDER</Typography>
                <Typography sx={{ fontSize: 17, fontWeight: 800, color: "var(--whiold-text-heading)", fontFamily: "monospace" }}>{selectedOrder.invoiceNumber || selectedOrder._id}</Typography>
              </Box>
              <IconButton size="small" onClick={() => setSelectedOrder(null)}>
                <X size={18} />
              </IconButton>
            </Box>

            <Box className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
              <Box>
                <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "var(--whiold-text-muted)", mb: 1, textTransform: "uppercase", letterSpacing: "0.04em" }}>Status</Typography>
                <OrderJourney status={selectedOrder.orderStatus} />
              </Box>

              <Divider />

              <Box>
                <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "var(--whiold-text-muted)", mb: 1, textTransform: "uppercase", letterSpacing: "0.04em" }}>Customer</Typography>
                <Box className="flex items-center gap-2.5">
                  <Avatar sx={{ width: 36, height: 36, background: "var(--whiold-primary-soft)", color: "var(--whiold-primary)", fontWeight: 700 }}>
                    {(selectedOrder.user?.name || "U").charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "var(--whiold-text-heading)" }}>{selectedOrder.user?.name}</Typography>
                    <Box className="flex items-center gap-1">
                      <Phone size={11} color="var(--whiold-text-muted)" />
                      <Typography sx={{ fontSize: 12, color: "var(--whiold-text-muted)" }}>{selectedOrder.user?.mobile || selectedOrder.user?.email}</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box className="mt-2 flex items-start gap-1.5">
                  <MapPin size={13} color="var(--whiold-text-muted)" style={{ marginTop: 2 }} />
                  <Typography sx={{ fontSize: 12.5, color: "var(--whiold-text-body)", lineHeight: 1.4 }}>
                    {[selectedOrder.address?.house, selectedOrder.address?.area, selectedOrder.address?.city, selectedOrder.address?.state].filter(Boolean).join(", ")}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "var(--whiold-text-muted)", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.04em" }}>Items</Typography>
                <Box className="flex flex-col gap-2.5">
                  {(selectedOrder.items || []).map((it, i) => (
                    <Box key={i} className="flex items-center justify-between">
                      <Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "var(--whiold-text-heading)" }}>{it.productId?.name}</Typography>
                        <Typography sx={{ fontSize: 11.5, color: "var(--whiold-text-muted)" }}>Qty {it.quantity || 1} × {inr(it.productId?.price || it.price)}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: "var(--whiold-text-heading)" }}>{inr((it.quantity || 1) * (it.productId?.price || it.price || 0))}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Divider />

              <Box className="flex items-center justify-between rounded-xl p-3.5" sx={{ background: "var(--whiold-primary-soft)" }}>
                <Box className="flex items-center gap-1.5">
                  <CreditCard size={14} color="var(--whiold-primary)" />
                  <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: "var(--whiold-primary)" }}>{selectedOrder.paymentMode || "Online"}</Typography>
                </Box>
                <Typography sx={{ fontSize: 16, fontWeight: 800, color: "var(--whiold-primary)" }}>{inr(selectedOrder.totalAmount)}</Typography>
              </Box>

              <ButtonComponent fullWidth onClick={() => navigate(`/invoice/${selectedOrder._id}`, { state: { data: selectedOrder } })}>
                View Invoice
              </ButtonComponent>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default AllOrders;