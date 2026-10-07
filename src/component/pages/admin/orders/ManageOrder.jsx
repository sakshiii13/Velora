import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Drawer,
  IconButton,
  Divider,
  Fade,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  X,
  MapPin,
  Eye,
  Receipt,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TableComponent from "../../../ui/TableComponent";
import ButtonComponent from "../../../ui/ButtonComponent";
import InputComponent from "../../../ui/InputComponent";
import {
  getAllPendingOrders,
  getAllDeliveredOrders,
  getAllCancelledOrders,
  updateOrderStatus,
  postDeliveryDetails,
} from "../../../../api/admin/orders.api";
import { useSnackbar } from "../../../../context/SnackBarContext";
import { RoundedCorner } from "@mui/icons-material";

const statusMeta = {
  CREATED: { label: "Created", color: "#8E8E8E", soft: "rgba(142,142,142,0.12)", icon: Clock },
  PENDING: { label: "Pending", color: "#F59E0B", soft: "rgba(245,158,11,0.12)", icon: Clock },
  CONFIRMED: { label: "Confirmed", color: "#3B82F6", soft: "rgba(59,130,246,0.12)", icon: Package },
  DISPATCH: { label: "Dispatched", color: "#9333EA", soft: "rgba(147,51,234,0.12)", icon: Truck },
  DELIVERED: { label: "Delivered", color: "#0F9D58", soft: "rgba(15,157,88,0.12)", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", color: "#F43F5E", soft: "rgba(244,63,94,0.12)", icon: XCircle },
};

const currency = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

const StatusChip = ({ status }) => {
  const meta = statusMeta[status?.toUpperCase()] || statusMeta.PENDING;
  const Icon = meta.icon;
  return (
    <Chip
      size="small"
      icon={<Icon size={13} />}
      label={meta.label}
      sx={{
        height: 26,
        fontWeight: 600,
        fontSize: "12px",
        borderRadius: "8px",
        color: meta.color,
        backgroundColor: meta.soft,
        "& .MuiChip-icon": { color: "inherit", marginLeft: "8px" },
      }}
    />
  );
};

const STATUS_FLOW = ["CREATED", "PENDING", "CONFIRMED", "DISPATCH", "DELIVERED"];

const OrderJourney = ({ status }) => {
  const currentStatus = status?.toUpperCase() || "PENDING";
  if (currentStatus === "CANCELLED") {
    return (
      <Box className="flex items-center gap-2 rounded-xl px-3.5 py-3" sx={{ background: statusMeta.CANCELLED.soft, color: statusMeta.CANCELLED.color }}>
        <XCircle size={16} />
        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>This order was cancelled</Typography>
      </Box>
    );
  }

  const currentIndex = STATUS_FLOW.indexOf(currentStatus);
  return (
    <Box className="flex items-start">
      {STATUS_FLOW.map((step, i) => {
        const meta = statusMeta[step];
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

const ManageOrder = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [deliveryOrder, setDeliveryOrder] = useState(null);
  const [deliveryData, setDeliveryData] = useState({ courierName: "", trackingId: "", trackingUrl: "" });
  
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let res;
      if (tabIndex === 0) {
        res = await getAllPendingOrders();
      } else if (tabIndex === 1) {
        res = await getAllDeliveredOrders();
      } else if (tabIndex === 2) {
        res = await getAllCancelledOrders();
      }
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
  }, [tabIndex]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await updateOrderStatus(id, { orderStatus: newStatus });
      if (res?.success) {
        showSnackbar(`Order marked as ${newStatus}`, "success");
        fetchOrders();
        setViewOrder(null);
      } else {
        showSnackbar(res?.message || "Update failed", "error");
      }
    } catch (error) {
      showSnackbar("Update failed", "error");
    }
  };

  const handleDeliverySubmit = async () => {
    if (!deliveryData.courierName || !deliveryData.trackingId) {
      showSnackbar("Please fill courier name and tracking ID", "error");
      return;
    }
    try {
      const res = await postDeliveryDetails(deliveryOrder._id, deliveryData);
      if (res?.success) {
        showSnackbar("Delivery details added successfully", "success");
        setDeliveryModalOpen(false);
        fetchOrders();
      } else {
        showSnackbar(res?.message || "Failed to add delivery details", "error");
      }
    } catch (error) {
      showSnackbar("Failed to add delivery details", "error");
    }
  };

  const columns = [
    {
      field: "invoiceNumber",
      headerName: "Order ID",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box>
          <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "var(--whiold-text-heading)" }}>
            {params.row.invoiceNumber || params.row._id.slice(-6)}
          </Typography>
          <Typography sx={{ fontSize: 11.5, color: "var(--whiold-text-muted)" }}>
            {new Date(params.row.createdAt).toLocaleDateString("en-IN")}
          </Typography>
        </Box>
      ),
    },
    {
      field: "user",
      headerName: "Customer",
      flex: 1.2,
      minWidth: 200,
      renderCell: (params) => {
        const user = params.row.user || {};
        return (
          <Box className="flex h-full items-center gap-2">
            <Avatar sx={{ width: 30, height: 30, fontSize: 12.5, fontWeight: 700, background: "var(--whiold-gradient-brand)", color: "#fff" }}>
              {(user.name || "U").charAt(0)}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: "var(--whiold-text-heading)" }}>{user.name}</Typography>
              <Typography sx={{ fontSize: 11, color: "var(--whiold-text-muted)" }}>{user.email}</Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "totalAmount",
      headerName: "Total",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "var(--whiold-text-heading)" }}>
          {currency(params.value)}
        </Typography>
      ),
    },
    {
      field: "orderStatus",
      headerName: "Status",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const currentStatus = params.value?.toUpperCase() || "PENDING";
        const isTerminal = currentStatus === "DELIVERED" || currentStatus === "CANCELLED";

        return (
          <Select
            size="small"
            value={currentStatus}
            disabled={isTerminal}
            onChange={(e) => handleStatusUpdate(params.row._id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            renderValue={(val) => <StatusChip status={val} />}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "& .MuiSelect-select": { paddingY: "2px !important" },
              "&.Mui-disabled": { opacity: 0.8 },
            }}
          >
            {Object.entries(statusMeta).map(([key, meta]) => (
              <MenuItem key={key} value={key} sx={{ fontSize: 13 }}>
                {meta.label}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 140,
      sortable: false,
      renderCell: (params) => {
        const currentStatus = params.row.orderStatus?.toUpperCase() || "PENDING";
        const isTerminal = currentStatus === "DELIVERED" || currentStatus === "CANCELLED";

        return (
          <Box display="flex" gap={1}>
            <IconButton
              size="small"
              title="View Details"
              onClick={() => setViewOrder(params.row)}
              sx={{ color: "var(--whiold-text-muted)", "&:hover": { color: "var(--whiold-primary)", background: "var(--whiold-primary-soft)" } }}
            >
              <Eye size={17} />
            </IconButton>
            <IconButton
              size="small"
              title={isTerminal ? "Cannot dispatch terminal order" : "Delivery Details"}
              disabled={isTerminal}
              onClick={() => {
                setDeliveryOrder(params.row);
                setDeliveryData({
                  courierName: params.row.deliveryDetails?.courierName || "",
                  trackingId: params.row.deliveryDetails?.trackingId || "",
                  trackingUrl: params.row.deliveryDetails?.trackingUrl || "",
                });
                setDeliveryModalOpen(true);
              }}
              sx={{ color: isTerminal ? "rgba(0,0,0,0.2)" : "var(--whiold-text-muted)", "&:hover": { color: "var(--whiold-primary)", background: "var(--whiold-primary-soft)" } }}
            >
              <Truck size={17} />
            </IconButton>
            <IconButton
              size="small"
              title="Invoice"
              onClick={() => navigate(`/invoice/${params.row._id}`, { state: { data: params.row } })}
              sx={{ color: "var(--whiold-text-muted)", "&:hover": { color: "var(--whiold-primary)", background: "var(--whiold-primary-soft)" } }}
            >
              <Receipt size={17} />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Box className="flex flex-col gap-4">
      <Fade in timeout={350}>
        <Box className="flex flex-col gap-1">
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: "var(--whiold-text-heading)" }}>Orders Management</Typography>
          <Typography sx={{ fontSize: 13, color: "var(--whiold-text-muted)" }}>View, update and manage customer orders.</Typography>
        </Box>
      </Fade>

      <Box sx={{ borderBottom: 1, borderColor: "var(--whiold-border)", mb: 2 }}>
        <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40, py: 1, textTransform: "none", fontWeight: 600, fontSize: "14px", color: "var(--whiold-text-muted)" }, "& .Mui-selected": { color: "var(--whiold-primary) !important" }, "& .MuiTabs-indicator": { backgroundColor: "var(--whiold-primary)" } }}>
          <Tab label="Pending & Processing" />
          <Tab label="Delivered" />
          <Tab label="Cancelled" />
        </Tabs>
      </Box>

      <Box sx={{ width: "100%", overflowX: "auto" }}>
         <TableComponent title={["Pending", "Delivered", "Cancelled"][tabIndex] + " Orders"} rows={orders.map((o) => ({ ...o, id: o._id }))} columns={columns} />
      </Box>

      {/* Drawer */}
      <Drawer anchor="right" open={Boolean(viewOrder)} onClose={() => setViewOrder(null)} PaperProps={{ sx: { width: { xs: "100%", sm: 460 }, borderRadius: "20px 0 0 20px" } }}>
        {viewOrder && (
          <Box className="flex h-full flex-col bg-[var(--whiold-bg)]">
            {/* Header section with gradient */}
            <Box className="relative px-6 pb-6 pt-8" sx={{ background: "linear-gradient(to right bottom, var(--whiold-primary-soft), transparent)" }}>
              <IconButton size="small" onClick={() => setViewOrder(null)} sx={{ position: "absolute", top: 12, right: 12, bgcolor: "rgba(255,255,255,0.5)" }}>
                <X size={18} />
              </IconButton>
              
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: "var(--whiold-primary)", letterSpacing: "0.05em", mb: 0.5 }}>
                ORDER DETAILS
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="flex-end">
                <Box>
                  <Typography sx={{ fontSize: 22, fontWeight: 800, color: "var(--whiold-text-heading)", fontFamily: "monospace", lineHeight: 1.2 }}>
                    {viewOrder.invoiceNumber || viewOrder._id}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "var(--whiold-text-muted)", mt: 0.5 }}>
                    Placed on {new Date(viewOrder.createdAt).toLocaleString("en-IN")}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-4">
              
              {/* Order Journey */}
              <Box className="rounded-2xl border p-5" sx={{ borderColor: "var(--whiold-border)", bgcolor: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "var(--whiold-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", mb: 2 }}>
                  Tracking Status
                </Typography>
                <OrderJourney status={viewOrder.orderStatus} />
              </Box>

              {/* Customer Info Card */}
              <Box className="rounded-2xl border p-5" sx={{ borderColor: "var(--whiold-border)", bgcolor: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "var(--whiold-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", mb: 2 }}>
                  Customer Details
                </Typography>
                <Box display="flex" gap={2} alignItems="center" mb={2.5}>
                  <Avatar sx={{ width: 44, height: 44, background: "var(--whiold-gradient-brand)", color: "#fff", fontWeight: 700, fontSize: 18 }}>
                    {(viewOrder.user?.name || "U").charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: "var(--whiold-text-heading)", lineHeight: 1.2 }}>{viewOrder.user?.name}</Typography>
                    <Typography sx={{ fontSize: 13, color: "var(--whiold-text-muted)" }}>{viewOrder.user?.email}</Typography>
                    <Typography sx={{ fontSize: 13, color: "var(--whiold-text-muted)" }}>{viewOrder.user?.mobile}</Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2, borderColor: "var(--whiold-border-soft, #f0f0f0)" }} />

                <Box display="flex" gap={1.5} alignItems="flex-start">
                  <Box className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full" sx={{ bgcolor: "var(--whiold-primary-soft)", color: "var(--whiold-primary)" }}>
                    <MapPin size={14} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "var(--whiold-text-heading)", mb: 0.5 }}>Shipping Address</Typography>
                    <Typography sx={{ fontSize: 13, color: "var(--whiold-text-body)", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                      {[viewOrder.address?.house, viewOrder.address?.area, viewOrder.address?.city, viewOrder.address?.state, viewOrder.address?.pincode].filter(Boolean).join(", ")}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Items Card */}
              <Box className="rounded-2xl border p-5" sx={{ borderColor: "var(--whiold-border)", bgcolor: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "var(--whiold-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", mb: 2 }}>
                  Ordered Items
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  {viewOrder.items?.map((item, i) => (
                    <Box key={i} display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" gap={2} alignItems="center">
                        <Box className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border" sx={{ borderColor: "var(--whiold-border)", bgcolor: "var(--whiold-bg-soft)" }}>
                          <Package size={20} color="var(--whiold-text-muted)" />
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: 14, fontWeight: 600, color: "var(--whiold-text-heading)", lineHeight: 1.2 }}>
                            {item.productId?.name || "Product"}
                          </Typography>
                          <Typography sx={{ fontSize: 12, color: "var(--whiold-text-muted)", mt: 0.5 }}>
                            Qty: {item.quantity || 1} <span className="mx-1">•</span> {currency(item.productId?.price || 0)}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: "var(--whiold-text-heading)" }}>
                        {currency((item.productId?.price || 0) * (item.quantity || 1))}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 2.5, borderColor: "var(--whiold-border-soft, #f0f0f0)" }} />

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography sx={{ fontSize: 13, color: "var(--whiold-text-muted)" }}>Subtotal</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: "var(--whiold-text-heading)" }}>
                    {currency(viewOrder.totalAmount - (viewOrder.totalGst || 0) - (viewOrder.deliveryCharges || 0))}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography sx={{ fontSize: 13, color: "var(--whiold-text-muted)" }}>Tax</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: "var(--whiold-text-heading)" }}>
                    {currency(viewOrder.totalGst || 0)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography sx={{ fontSize: 13, color: "var(--whiold-text-muted)" }}>Shipping</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: "var(--whiold-text-heading)" }}>
                    {currency(viewOrder.deliveryCharges || 0)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" className="rounded-xl p-3" sx={{ bgcolor: "var(--whiold-primary-soft)" }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: "var(--whiold-primary)" }}>Grand Total</Typography>
                  <Typography sx={{ fontSize: 17, fontWeight: 800, color: "var(--whiold-primary)" }}>{currency(viewOrder.totalAmount)}</Typography>
                </Box>
              </Box>

            </Box>

            {/* Actions Footer */}
            <Box className="border-t p-5" sx={{ borderColor: "var(--whiold-border)", bgcolor: "#fff" }}>
               <ButtonComponent fullWidth startIcon={<Receipt size={16} />} onClick={() => navigate(`/invoice/${viewOrder._id}`, { state: { data: viewOrder } })}>
                 Generate Invoice
               </ButtonComponent>
            </Box>
          </Box>
        )}
      </Drawer>

      {/* Delivery Details Modal */}
      <Dialog open={deliveryModalOpen} onClose={() => setDeliveryModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle sx={{ marginTop:1, fontWeight: 700, fontSize: "16px", color: "var(--whiold-text-heading)" }}>Add Delivery Details</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <InputComponent
              label="Courier Name"
              placeholder="e.g. BlueDart"
              value={deliveryData.courierName}
              sx={{my:2}}
              onChange={(e) => setDeliveryData({ ...deliveryData, courierName: e.target.value })}
            />
            <InputComponent
              label="Tracking ID"
              placeholder="e.g. BD123456789"
              value={deliveryData.trackingId}
              sx={{mb:2}}
              onChange={(e) => setDeliveryData({ ...deliveryData, trackingId: e.target.value })}
            />
            <InputComponent
              label="Tracking URL (Optional)"
              placeholder="e.g. https://bluedart.com/track..."
              value={deliveryData.trackingUrl}
              onChange={(e) => setDeliveryData({ ...deliveryData, trackingUrl: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <ButtonComponent variant="outlined" onClick={() => setDeliveryModalOpen(false)}>Cancel</ButtonComponent>
          <ButtonComponent onClick={handleDeliverySubmit}>Save Details</ButtonComponent>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageOrder;