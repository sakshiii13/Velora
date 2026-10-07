import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import Skeleton from "@mui/material/Skeleton";
import { getAllOrdersByID as adminGetOrder } from "../../../api/admin/orders.api";
import { getAllOrdersByID as userGetOrder } from "../../../api/user/orders.api";
import mainContent from "../../../constants/mainContent";
import { getRole } from "../../../utils/authStorage";

/* ─────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────── */
const InvoiceSkeleton = () => (
  <Paper elevation={0} sx={{ maxWidth: 900, mx: "auto", p: 3, border: "1px solid #ccc" }}>
    <Box display="flex" justifyContent="space-between" mb={2}>
      <Skeleton variant="rectangular" width={120} height={40} />
      <Box textAlign="right">
        <Skeleton width={150} />
        <Skeleton width={120} />
      </Box>
    </Box>
    {[1, 2, 3].map((r) => (
      <Box key={r} display="flex" gap={2} mb={1.5}>
        <Box flex={1}>
          <Skeleton />
          <Skeleton width="60%" />
        </Box>
        <Skeleton width={60} />
        <Skeleton width={60} />
        <Skeleton width={80} />
      </Box>
    ))}
  </Paper>
);

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const Invoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const id = location?.state?.data?._id || paramId;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate(-1);
      return;
    }
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const role = getRole();
        const apiCall = role === "admin" ? adminGetOrder : userGetOrder;
        const res = await apiCall(id);
        if (res?.success) setOrder(res.data);
      } catch (err) {
        console.error("Invoice fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  const user = order?.user || {};
  const address = order?.address || user?.address || {};
  const items = order?.items || [];

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + (i?.quantity || 0) * (i?.productId?.price || i?.price || 0), 0),
    [items]
  );

  const handlePrint = () => {
    document.body.classList.add("printing");
    setTimeout(() => {
      window.print();
      document.body.classList.remove("printing");
    }, 300);
  };

  if (loading) return <Box sx={{ bgcolor: "var(--whiold-bg)", minHeight: "100vh", py: 3, px: 2 }}><InvoiceSkeleton /></Box>;
  if (!order) return null;

  const fmtAddr = (a) => [a.house, a.area, a.city, a.state, a.pincode ? `- ${a.pincode}` : ""].filter(Boolean).join(", ");

  const gstRows = {};
  items.forEach((item) => {
    const product = item?.productId || {};
    const gstPct = product?.gst || 0;
    const taxable = (item?.quantity || 0) * (product?.price || item?.price || 0);
    if (!gstRows[gstPct]) gstRows[gstPct] = { taxable: 0, igst: 0 };
    gstRows[gstPct].taxable += taxable;
    gstRows[gstPct].igst += taxable * (gstPct / 100);
  });

  return (
    <Box sx={{ bgcolor: "var(--whiold-bg)", minHeight: { md: "100vh" }, py: 3, px: 2 }}>
      {/* ── ACTION BAR ── */}
      <Box className="no-print flex items-center w-full justify-between mb-2">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ color: "var(--whiold-text-heading)" }}>
          Back
        </Button>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{
            bgcolor: "var(--whiold-primary)",
            "&:hover": { bgcolor: "var(--whiold-600)" },
            textTransform: "none",
            px: 3,
          }}
        >
          Print Invoice
        </Button>
      </Box>

      {/* ════════════════════════════════════════
          INVOICE PAPER (Exact Trendistic Layout)
      ════════════════════════════════════════ */}
      <Paper
        id="print-invoice"
        elevation={0}
        sx={{
          maxWidth: 900,
          mx: "auto",
          bgcolor: "#fff",
          border: "1px solid var(--whiold-border, #000)",
          borderRadius: 0,
          fontFamily: "Arial, sans-serif",
          color: "#000",
          "@media (max-width: 899px)": { position: "absolute", left: -9999999 },
        }}
      >
        {/* ── WARNING BANNER ── */}
        <Box
          sx={{
            bgcolor: "var(--whiold-primary)",
            color: "#fff",
            px: 1.5,
            py: 0.8,
            fontSize: "0.7rem",
            lineHeight: 1.4,
          }}
        >
          Important - In case your packet is not sealed and you think that it is
          tampered or some item is missing from it, please do not ACCEPT it and
          inform us immediately on {mainContent?.mobile || "support"} or
          Submit a complain ticket through the Help button on the portal after login ({mainContent?.portal || "https://whiold.com/"})
        </Box>

        {/* ── TITLE ── */}
        <Box sx={{ textAlign: "center", borderBottom: "1px solid var(--whiold-border, #000)", py: 0.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1rem", letterSpacing: 1, color: "var(--whiold-primary)" }}>
            Tax Invoice
          </Typography>
        </Box>

        {/* ── HEADER ROW ── */}
        <Box sx={{ display: "grid", gridTemplateColumns: "160px 1fr auto", borderBottom: "1px solid var(--whiold-border, #000)" }}>
          <Box sx={{ borderRight: "1px solid var(--whiold-border, #000)", p: 1.5, display: "flex", alignItems: "center" }}>
            <img src={mainContent?.logo} alt="Logo" style={{ maxWidth: 120, width: "100%" }} />
          </Box>
          <Box sx={{ p: 1, fontSize: "0.72rem", borderRight: "1px solid var(--whiold-border, #000)" }}>
            <Typography sx={{ fontSize: "0.68rem" }}>
              <span className="font-bold text-[0.7rem]">Sold By:</span> {mainContent?.appName || "Whiold"} {mainContent?.address || ""}
              {mainContent?.gstin && <><br/>GSTIN NO: {mainContent.gstin}</>}
            </Typography>
          </Box>
        </Box>

        {/* ── META INFO ── */}
        <Box sx={{ fontSize: "0.72rem", px: 1, borderBottom: "1px solid var(--whiold-border, #000)", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <Box sx={{ borderRight: "1px solid var(--whiold-border, #000)" }}>
            <InfoLine label="Order #" value={order.invoiceNumber || order._id} />
            <InfoLine label="Order Date" value={new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} />
            <InfoLine label="Name" value={user?.name} />
          </Box>
          <Box sx={{ p: 1 }}>
            <InfoLine label="Invoice #" value={order.invoiceNumber || order._id} />
            <InfoLine label="Invoice Date" value={new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} />
            <InfoLine label="Email ID" value={user?.email} />
          </Box>
        </Box>

        {/* ── SOLD TO / SHIP TO ── */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--whiold-border, #000)" }}>
          {[
            { title: "Sold to:", name: user?.name, addr: fmtAddr(address), phone: address?.mobile || user?.mobile, state: address?.state },
            { title: "Ship to:", name: address?.name || user?.name, addr: fmtAddr(address), phone: address?.mobile || user?.mobile, state: address?.state },
          ].map((col, ci) => (
            <Box key={ci} sx={{ p: 1, borderRight: ci === 0 ? "1px solid var(--whiold-border, #000)" : "none", fontSize: "0.72rem" }}>
              <Typography sx={{ fontWeight: 700, fontSize: "0.72rem" }}>{col.title}</Typography>
              <Typography sx={{ fontWeight: 600, fontSize: "0.72rem" }}>{col.name}</Typography>
              <Typography sx={{ fontSize: "0.72rem" }}>{col.addr}</Typography>
              <Typography sx={{ fontSize: "0.72rem" }}>Tel: {col.phone}</Typography>
              {col.state && <Typography sx={{ fontSize: "0.72rem" }}><strong>State:</strong> {col.state}</Typography>}
            </Box>
          ))}
        </Box>

        {/* ── ITEMS TABLE ── */}
        <Table sx={{ borderCollapse: "collapse", width: "100%" }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "var(--whiold-bg-soft)" }}>
              <TH rowSpan={2} sx={{ width: 35 }}>S.No.</TH>
              <TH rowSpan={2}>Item</TH>
              <TH rowSpan={2} align="right">Gross Amount</TH>
              <TH rowSpan={2} align="right">Base Price</TH>
              <TH rowSpan={2} align="center">Qty</TH>
              <TH rowSpan={2} align="right">Total</TH>
              <TH colSpan={2} align="center" sx={{ borderBottom: "1px solid var(--whiold-border, #000)" }}>Discount</TH>
              <TH rowSpan={2} align="right">Taxable Value</TH>
              <TH colSpan={2} align="center" sx={{ borderBottom: "1px solid var(--whiold-border, #000)" }}>Tax</TH>
              <TH rowSpan={2} align="right">Total</TH>
            </TableRow>
            <TableRow sx={{ bgcolor: "var(--whiold-bg-soft)" }}>
              <TH align="center">Flat</TH>
              <TH align="center">Promo</TH>
              <TH align="center">IGST</TH>
              <TH align="right">Tax Value</TH>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((item, i) => {
              const product = item?.productId || {};
              const qty = item?.quantity || 0;
              const price = product?.price || item?.price || 0;
              const gross = qty * price;
              const discount = 0; // Replace if data exists
              const taxable = gross - discount;
              const gstPct = product?.gst || 0;
              const taxVal = +((taxable * gstPct) / 100).toFixed(2);
              const total = +(taxable + taxVal).toFixed(2);

              return (
                <TableRow key={i} sx={{ "&:nth-of-type(even)": { bgcolor: "#fafafa" } }}>
                  <TD align="center">{i + 1}</TD>
                  <TD>
                    <Typography sx={{ fontSize: "0.72rem" }}>{product?.name || item?.name || "—"} {product?.sku || item?.variant || ""}</Typography>
                    <Typography sx={{ fontSize: "0.65rem", color: "#555" }}>HSN: {product?.hsnCode || "—"}</Typography>
                  </TD>
                  <TD align="right">{fmt(gross)}</TD>
                  <TD align="right">{fmt(price)}</TD>
                  <TD align="center">{qty}.00</TD>
                  <TD align="right">{fmt(gross)}</TD>
                  <TD align="right">{fmt(discount)}</TD>
                  <TD align="right">0.00</TD>
                  <TD align="right">{fmt(taxable)}</TD>
                  <TD align="center">{fmt(taxVal)}<br /><span style={{ fontSize: "0.6rem" }}>({gstPct}.00%)</span></TD>
                  <TD align="right">{fmt(taxVal)}</TD>
                  <TD align="right">{fmt(total)}</TD>
                </TableRow>
              );
            })}

            {/* ── Sub Total row ── */}
            <TableRow sx={{ bgcolor: "var(--whiold-bg-soft)", fontWeight: 700 }}>
              <TD colSpan={2} sx={{ fontWeight: 900 }}>Sub Total</TD>
              <TD align="right" sx={{ fontWeight: 700 }}>{fmt(subtotal)}</TD>
              <TD align="right" sx={{ fontWeight: 700 }}>{fmt(subtotal)}</TD>
              <TD align="center" sx={{ fontWeight: 700 }}>{items.reduce((s, i) => s + (i?.quantity || 0), 0)}.00</TD>
              <TD align="right" sx={{ fontWeight: 700 }}>{fmt(subtotal)}</TD>
              <TD align="right" sx={{ fontWeight: 700 }}>—</TD>
              <TD align="right" sx={{ fontWeight: 700 }}>0.00</TD>
              <TD align="right" sx={{ fontWeight: 700 }}>{fmt(subtotal)}</TD>
              <TD align="right" sx={{ fontWeight: 700 }}>{fmt(order.totalGst)}</TD>
              <TD align="right" sx={{ fontWeight: 700 }}>{fmt(order.totalGst)}</TD>
              <TD align="right" sx={{ fontWeight: 700 }}>{fmt(subtotal + (order.totalGst || 0))}</TD>
            </TableRow>

            {/* ── Shipping Charges row ── */}
            <TableRow>
              <TD align="center"></TD>
              <TD>
                <Typography sx={{ fontWeight: 600, fontSize: "0.72rem" }}>Shipping Charges</Typography>
                <Typography sx={{ fontSize: "0.65rem", color: "#555" }}>SAC: 996812</Typography>
              </TD>
              <TD colSpan={7} />
              <TD align="center">{fmt(((order.deliveryCharges || 0) * 18) / 118)}<br /><span style={{ fontSize: "0.6rem" }}>(18.00%)</span></TD>
              <TD align="right">{fmt(((order.deliveryCharges || 0) * 18) / 118)}</TD>
              <TD align="right">{fmt(order.deliveryCharges)}</TD>
            </TableRow>

            {/* ── Grand Total row ── */}
            <TableRow sx={{ bgcolor: "var(--whiold-bg-soft)" }}>
              <TD colSpan={2} sx={{ fontWeight: 900 }}>Grand Total</TD>
              <TD align="right" sx={{ fontWeight: 700 }}>{fmt(subtotal)}</TD>
              <TD align="right" sx={{ fontWeight: 700 }}>{fmt(subtotal)}</TD>
              <TD align="center" sx={{ fontWeight: 700 }}>{items.reduce((s, i) => s + (i?.quantity || 0), 0)}.00</TD>
              <TD align="right" sx={{ fontWeight: 700 }}>{fmt(subtotal)}</TD>
              <TD align="right" sx={{ fontWeight: 700 }}>—</TD>
              <TD align="right" sx={{ fontWeight: 700 }}>0.00</TD>
              <TD align="right" sx={{ fontWeight: 700 }}>{fmt(subtotal)}</TD>
              <TD align="right" sx={{ fontWeight: 700 }}>{fmt((order.totalGst || 0) + ((order.deliveryCharges || 0) * 18) / 118)}</TD>
              <TD align="right" sx={{ fontWeight: 700 }}>{fmt((order.totalGst || 0) + ((order.deliveryCharges || 0) * 18) / 118)}</TD>
              <TD align="right" sx={{ fontWeight: 700, color: "var(--whiold-primary)" }}>{fmt(order.totalAmount)}</TD>
            </TableRow>
          </TableBody>
        </Table>

        {/* ── FOOTER ── */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid var(--whiold-border, #000)", fontSize: "0.72rem" }}>
          {/* Amount in words */}
          <Box sx={{ p: 1, borderRight: "1px solid var(--whiold-border, #000)" }}>
            <Typography sx={{ fontWeight: 700, fontSize: "0.72rem" }}>Amount Chargable (in words)</Typography>
            <Typography sx={{ fontSize: "0.72rem", fontStyle: "italic" }}>{numberToWords(order.totalAmount || 0)}</Typography>
            <Typography sx={{ fontSize: "0.65rem", mt: 1 }}>Tax is payable on reverse charge basis: <strong>No</strong></Typography>
          </Box>

          {/* Declaration */}
          <Box sx={{ p: 1, borderRight: "1px solid var(--whiold-border, #000)" }}>
            <Typography sx={{ fontWeight: 700, fontSize: "0.72rem", textAlign: "center", color: "var(--whiold-primary)" }}>Terms & Conditions</Typography>
            <Box component="ol" sx={{ m: 0, fontSize: "0.65rem", lineHeight: 1.3, pl: 1 }}>
              <li>1. All disputes subject to local jurisdiction only.</li>
              <li>2. Goods sold will only be refunded within 20 days of invoice generation.</li>
              <li>3. If your box is open or cracked, take a photo with the courier boy.</li>
              <li>4. Contact {mainContent?.appName || "Whiold"} care for any discrepancy.</li>
            </Box>
          </Box>

          {/* Signatory */}
          <Box sx={{ p: 1, textAlign: "right" }}>
            <Typography sx={{ fontWeight: 700, fontSize: "0.6rem" }}>For {mainContent?.companyName || mainContent?.appName || "WHIOLD"}</Typography>
            <Typography sx={{ fontSize: "0.72rem" }}>This is a computer generated receipt and does not require signature</Typography>
            <Box sx={{ mt: 2, borderTop: "1px solid var(--whiold-border, #000)", pt: 0.5 }}>
              <Typography sx={{ fontSize: "0.65rem" }}>Authorized Signatory</Typography>
            </Box>
          </Box>
        </Box>

        {/* ── COMPUTER GENERATED NOTE ── */}
        <Box sx={{ borderTop: "1px solid var(--whiold-border, #000)", p: 0.8, textAlign: "center" }}>
          <Typography sx={{ fontSize: "0.65rem", color: "#444" }}>
            This is a computer generated receipt. Submit a complain ticket through the Help button on the portal after login ({mainContent?.portal || "https://whiold.com/"})
          </Typography>
        </Box>
      </Paper>

      {/* ── PRINT CSS ── */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .app-header, .MuiAppBar-root, .MuiDrawer-root { display: none !important; }
          #print-invoice, #print-invoice * { visibility: visible !important; }
          #print-invoice { position: absolute; left: 0; top: 0; width: 100%; border: 1px solid #000 !important; }
          .no-print { display: none !important; }
          @page { margin: 0.8cm; }
        }
      `}</style>
    </Box>
  );
};

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
const cellBase = {
  border: "1px solid var(--whiold-border, #000)",
  padding: "3px 5px",
  fontSize: "0.72rem",
  lineHeight: 1.3,
  color: "#000",
};

const TH = ({ children, align, rowSpan, colSpan, sx = {} }) => (
  <TableCell component="th" align={align || "center"} rowSpan={rowSpan} colSpan={colSpan} sx={{ ...cellBase, fontWeight: 700, bgcolor: "var(--whiold-bg-soft, #f0f0f0)", verticalAlign: "middle", ...sx }}>
    {children}
  </TableCell>
);

const TD = ({ children, align, colSpan, sx = {} }) => (
  <TableCell align={align || "left"} colSpan={colSpan} sx={{ ...cellBase, verticalAlign: "top", ...sx }}>
    {children}
  </TableCell>
);

const InfoLine = ({ label, value }) => (
  <Typography sx={{ fontSize: "0.72rem", color: "#000" }}>
    <strong>{label}:</strong> {value || "—"}
  </Typography>
);

const fmt = (n) => (+(n || 0)).toFixed(2);

function numberToWords(n) {
  const num = Math.round(n);
  if (num === 0) return "zero";
  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const toWords = (n) => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + toWords(n % 100) : "");
    if (n < 100000) return toWords(Math.floor(n / 1000)) + " thousand" + (n % 1000 ? " " + toWords(n % 1000) : "");
    return toWords(Math.floor(n / 100000)) + " lakh" + (n % 100000 ? " " + toWords(n % 100000) : "");
  };
  return toWords(num);
}

export default Invoice;
