import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  Heart,
  Tag,
  Truck,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  X,
} from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { Link } from "react-router-dom";
import { Router } from "../../../constants/router";




const SAMPLE_CART = [
  {
    id: "1",
    name: "Terracotta Weave Tote",
    category: "Bags",
    size: "Regular",
    price: 1899,
    originalPrice: 2499,
    image: "https://placehold.co/300x360",
    quantity: 1,
    maxQuantity: 5,
    inStock: true,
  },
  {
    id: "2",
    name: "Copper Stitch Kurta",
    category: "Apparel",
    size: "M",
    price: 2299,
    originalPrice: null,
    image: "https://placehold.co/300x360",
    quantity: 2,
    maxQuantity: 4,
    inStock: true,
  },
  {
    id: "3",
    name: "Clay Dust Earrings",
    category: "Jewellery",
    size: "-",
    price: 799,
    originalPrice: 999,
    image: "https://placehold.co/300x360",
    quantity: 1,
    maxQuantity: 3,
    inStock: false,
  },
];

const FREE_DELIVERY_THRESHOLD = 3000;
const DELIVERY_FEE = 99;
const TAX_RATE = 0.05;
const COUPONS = {
  WELCOME10: { label: "WELCOME10", type: "percent", value: 10 },
  FLAT200: { label: "FLAT200", type: "flat", value: 200 },
};

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, x: -40, transition: { duration: 0.3, ease: "easeIn" } },
};

const QuantityStepper = ({ value, max, onChange, disabled }) => (
  <div
    className="flex items-center gap-3 rounded-full px-1.5 py-1"
    style={{
      background: "var(--whiold-bg-input)",
      border: `1px solid var(--whiold-border)`,
    }}
  >
    <button
      onClick={() => onChange(Math.max(1, value - 1))}
      disabled={disabled || value <= 1}
      className="flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-200 disabled:opacity-30"
      style={{ color: "var(--whiold-700)" }}
      aria-label="Decrease quantity"
    >
      <Minus className="h-3.5 w-3.5" />
    </button>
    <span
      className="w-4 text-center text-sm font-semibold"
      style={{ color: "var(--whiold-text-heading)" }}
    >
      {value}
    </span>
    <button
      onClick={() => onChange(Math.min(max, value + 1))}
      disabled={disabled || value >= max}
      className="flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-200 disabled:opacity-30"
      style={{ color: "var(--whiold-700)" }}
      aria-label="Increase quantity"
    >
      <Plus className="h-3.5 w-3.5" />
    </button>
  </div>
);

const CartItem = ({ item, onQtyChange, onRemove, onSaveForLater }) => (
  <motion.div
    layout
    variants={itemVariants}
    exit="exit"
    className="relative flex gap-4 overflow-hidden p-4 sm:p-5"
    style={{
      background: "var(--whiold-bg)",
      border: "1px solid var(--whiold-border)",
      borderRadius: "var(--whiold-radius-lg)",
      boxShadow: "var(--whiold-shadow-card)",
    }}
  >
    <Link
  to={Router.PRODUCT_DETAIL.replace(":id", item.id)}
  className="relative h-24 w-20 shrink-0 overflow-hidden sm:h-28 sm:w-24 block"
  style={{ borderRadius: "var(--whiold-radius-md)" }}
>
  <img
    src={item.image}
    alt={item.name}
    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
  />
    {!item.inStock && (
        <div
          className="absolute inset-0 flex items-center justify-center text-center text-[10px] font-semibold uppercase text-white"
          style={{ background: "rgba(43,33,25,0.6)" }}
        >
          Out of
          <br />
          stock
        </div>
      )}
</Link>

    <div className="flex flex-1 flex-col justify-between gap-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p
            className="text-[11px] uppercase tracking-wider"
            style={{ color: "var(--whiold-text-muted)" }}
          >
            {item.category} · {item.size}
          </p>
          <h3
            className="text-sm font-semibold leading-snug sm:text-base"
            style={{ color: "var(--whiold-text-heading)" }}
          >
            {item.name}
          </h3>
        </div>
        <button
          onClick={() => onRemove(item.lineId)}
          aria-label="Remove item"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-200 hover:bg-[var(--whiold-bg-soft)]"
          style={{ color: "var(--whiold-text-muted)" }}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-baseline gap-2">
        <span
          className="text-base font-bold"
          style={{ color: "var(--whiold-700)" }}
        >
          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
        </span>
        {item.originalPrice && (
          <span
            className="text-xs line-through"
            style={{ color: "var(--whiold-text-muted)" }}
          >
            ₹{(item.originalPrice * item.quantity).toLocaleString("en-IN")}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <QuantityStepper
          value={item.quantity}
          max={item.maxQuantity}
          disabled={!item.inStock}
          onChange={(v) => onQtyChange(item.lineId, v)}
        />
        <button
          onClick={() => onSaveForLater(item.lineId)}
          className="flex items-center gap-1.5 text-xs font-medium transition-colors duration-200"
          style={{ color: "var(--whiold-600)" }}
        >
          <Heart className="h-3.5 w-3.5" />
          Save for later
        </button>
      </div>
    </div>
  </motion.div>
);

const FreeDeliveryBar = ({ subtotal }) => {
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "var(--whiold-bg-soft)",
        border: "1px solid var(--whiold-border)",
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <Truck className="h-4 w-4" style={{ color: "var(--whiold-600)" }} />
        <p
          className="text-xs font-medium"
          style={{ color: "var(--whiold-text-body)" }}
        >
          {remaining > 0 ? (
            <>
              Add{" "}
              <span style={{ color: "var(--whiold-700)", fontWeight: 700 }}>
                ₹{remaining.toLocaleString("en-IN")}
              </span>{" "}
              more for FREE delivery
            </>
          ) : (
            <span style={{ color: "var(--whiold-700)", fontWeight: 600 }}>
              You've unlocked FREE delivery! 🎉
            </span>
          )}
        </p>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full"
        style={{ background: "var(--whiold-100)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: "var(--whiold-gradient-brand)" }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
};

const CouponBox = ({ applied, onApply, onRemove }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleApply = () => {
    const match = COUPONS[code.trim().toUpperCase()];
    if (match) {
      onApply(match);
      setError("");
      setCode("");
    } else {
      setError("Invalid coupon code");
    }
  };

  if (applied) {
    return (
      <div
        className="flex items-center justify-between rounded-2xl px-4 py-3"
        style={{
          background: "var(--whiold-primary-soft)",
          border: `1px solid var(--whiold-300)`,
        }}
      >
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4" style={{ color: "var(--whiold-700)" }} />
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--whiold-700)" }}
          >
            {applied.label} applied
          </span>
        </div>
        <button
          onClick={onRemove}
          aria-label="Remove coupon"
          style={{ color: "var(--whiold-600)" }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // return (
  //   <div>
  //     <div className="flex gap-2">
  //       <div className="relative flex-1">
  //         <Tag
  //           className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
  //           style={{ color: "var(--whiold-input-placeholder-color)" }}
  //         />
  //         <input
  //           value={code}
  //           onChange={(e) => setCode(e.target.value)}
  //           onKeyDown={(e) => e.key === "Enter" && handleApply()}
  //           placeholder="Enter coupon code"
  //           className="w-full pl-9 pr-3 text-sm outline-none transition-colors duration-200"
  //           style={{
  //             height: "var(--whiold-input-height)",
  //             borderRadius: "var(--whiold-input-radius)",
  //             background: "var(--whiold-input-bg)",
  //             border: `1px solid var(--whiold-input-border)`,
  //             color: "var(--whiold-input-text-color)",
  //           }}
  //           onFocus={(e) =>
  //             (e.target.style.boxShadow = "var(--whiold-input-focus-ring)")
  //           }
  //           onBlur={(e) => (e.target.style.boxShadow = "none")}
  //         />
  //       </div>
  //       <button
  //         onClick={handleApply}
  //         className="shrink-0 rounded-xl px-5 text-sm font-semibold text-white transition-transform duration-200 active:scale-95"
  //         style={{ background: "var(--whiold-button-bg)" }}
  //       >
  //         Apply
  //       </button>
  //     </div>
  //     {error && (
  //       <p
  //         className="mt-1.5 text-xs"
  //         style={{ color: "var(--whiold-input-error-text)" }}
  //       >
  //         {error}
  //       </p>
  //     )}
  //     <p
  //       className="mt-2 text-[11px]"
  //       style={{ color: "var(--whiold-text-muted)" }}
  //     >
  //       Try{" "}
  //       <span style={{ color: "var(--whiold-600)", fontWeight: 600 }}>
  //         WELCOME10
  //       </span>{" "}
  //       or{" "}
  //       <span style={{ color: "var(--whiold-600)", fontWeight: 600 }}>
  //         FLAT200
  //       </span>
  //     </p>
  //   </div>
  // );
};

const OrderSummary = ({
  subtotal,
  discountAmount,
  tax,
  deliveryFee,
  total,
  itemCount,
  coupon,
  onApplyCoupon,
  onRemoveCoupon,
}) => (
  <div className="sticky top-6 flex flex-col gap-4">
    <FreeDeliveryBar subtotal={subtotal} />

    <div
      className="relative overflow-visible p-6"
      style={{
        background: "var(--whiold-bg)",
        border: "1px solid var(--whiold-border)",
        borderRadius: "var(--whiold-radius-lg)",
        boxShadow: "var(--whiold-shadow-card)",
      }}
    >
      <h3
        className="mb-4 text-base font-bold"
        style={{ color: "var(--whiold-text-heading)" }}
      >
        Order summary
      </h3>

      <div className="flex flex-col gap-2.5 text-sm">
        <div className="flex justify-between">
          <span style={{ color: "var(--whiold-text-body)" }}>
            Subtotal ({itemCount} items)
          </span>
          <span style={{ color: "var(--whiold-text-heading)" }}>
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between">
            <span style={{ color: "var(--whiold-text-body)" }}>Discount</span>
            <span style={{ color: "var(--whiold-600)" }}>
              −₹{discountAmount.toLocaleString("en-IN")}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span style={{ color: "var(--whiold-text-body)" }}>Delivery</span>
          <span
            style={{
              color:
                deliveryFee === 0
                  ? "var(--whiold-600)"
                  : "var(--whiold-text-heading)",
            }}
          >
            {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: "var(--whiold-text-body)" }}>Tax</span>
          <span style={{ color: "var(--whiold-text-heading)" }}>
            ₹{tax.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* perforation with punched notches */}
      <div className="relative my-5">
        <div
          className="absolute -left-9 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full"
          style={{
            background: "var(--whiold-bg)",
            border: "1px solid var(--whiold-border)",
          }}
        />
        <div
          className="absolute -right-9 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full"
          style={{
            background: "var(--whiold-bg)",
            border: "1px solid var(--whiold-border)",
          }}
        />
        <div
          className="h-px w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, var(--whiold-border) 0 8px, transparent 8px 16px)",
          }}
        />
      </div>

      <div className="mb-5 flex items-center justify-between">
        <span
          className="text-base font-bold"
          style={{ color: "var(--whiold-text-heading)" }}
        >
          Total
        </span>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={total}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25 }}
            className="text-xl font-bold"
            style={{ color: "var(--whiold-700)" }}
          >
            ₹{total.toLocaleString("en-IN")}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="mb-5">
        <CouponBox
          applied={coupon}
          onApply={onApplyCoupon}
          onRemove={onRemoveCoupon}
        />
      </div>

      <Link to={Router.CHECKOUT} className="w-full block">
        <button
          className="flex w-full items-center justify-center gap-2 text-white transition-transform duration-200 active:scale-[0.98]"
          style={{
            height: "var(--whiold-button-height-lg)",
            borderRadius: "var(--whiold-button-radius)",
            background: "var(--whiold-button-bg)",
            fontWeight: "var(--whiold-button-font-weight)",
            fontSize: "var(--whiold-button-font-size)",
            boxShadow: "var(--whiold-button-shadow)",
            cursor: "pointer",
          }}
        >
          Proceed to checkout
          <ArrowRight className="h-4 w-4" />
        </button>
      </Link>

      <div
        className="mt-4 flex items-center justify-center gap-1.5 text-[11px]"
        style={{ color: "var(--whiold-text-muted)" }}
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        100% secure checkout
      </div>
    </div>
  </div>
);

const EmptyCart = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center gap-4 py-24 text-center"
    style={{
      background: "var(--whiold-bg-soft)",
      border: "1px dashed var(--whiold-border)",
      borderRadius: "var(--whiold-radius-lg)",
    }}
  >
    <div
      className="flex h-16 w-16 items-center justify-center rounded-full"
      style={{ background: "var(--whiold-primary-soft)" }}
    >
      <ShoppingBag className="h-7 w-7" style={{ color: "var(--whiold-600)" }} />
    </div>
    <h3
      className="text-lg font-semibold"
      style={{ color: "var(--whiold-text-heading)" }}
    >
      Your cart is empty
    </h3>
    <p
      className="max-w-xs text-sm"
      style={{ color: "var(--whiold-text-body)" }}
    >
      Looks like you haven't added anything yet. Let's fix that.
    </p>
    <button
      className="mt-2 flex items-center gap-2 rounded-full px-6 text-sm font-semibold text-white"
      style={{
        height: "var(--whiold-button-height-md)",
        background: "var(--whiold-button-bg)",
      }}
    >
      Start shopping
      <ArrowRight className="h-4 w-4" />
    </button>
  </motion.div>
);

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, saveForLater } = useCart();
  const [coupon, setCoupon] = useState(null);

  const handleQtyChange = (lineId, qty) => updateQuantity(lineId, qty);
  const handleRemove = (lineId) => removeFromCart(lineId);
  const handleSaveForLater = (lineId) => saveForLater(lineId);

  const { subtotal, discountAmount, tax, deliveryFee, total, itemCount } =
    useMemo(() => {
      const sub = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
      let discount = 0;
      if (coupon) {
        discount =
          coupon.type === "percent"
            ? Math.round((sub * coupon.value) / 100)
            : coupon.value;
        discount = Math.min(discount, sub);
      }
      const afterDiscount = sub - discount;
      const fee =
        afterDiscount >= FREE_DELIVERY_THRESHOLD || afterDiscount === 0
          ? 0
          : DELIVERY_FEE;
      const taxAmt = Math.round(afterDiscount * TAX_RATE);
      return {
        subtotal: sub,
        discountAmount: discount,
        tax: taxAmt,
        deliveryFee: fee,
        total: afterDiscount + fee + taxAmt,
        itemCount: cart.reduce((n, i) => n + i.quantity, 0),
      };
    }, [cart, coupon]);

  return (
    <section
      className="relative min-h-screen w-full py-12"
      style={{ background: "var(--whiold-bg)" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-3xl font-bold tracking-tight md:text-4xl"
          style={{ color: "var(--whiold-text-heading)" }}
        >
          Shopping bag
          {cart.length > 0 && (
            <span
              className="ml-2 text-lg font-medium"
              style={{ color: "var(--whiold-text-muted)" }}
            >
              ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
          )}
        </motion.h1>

        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
            <motion.div
              initial="hidden"
              animate="show"
              variants={listVariants}
              className="flex flex-col gap-4"
            >
              <AnimatePresence>
                {cart.map((item) => (
                  <CartItem
                    key={item.lineId}
                    item={item}
                    onQtyChange={handleQtyChange}
                    onRemove={handleRemove}
                    onSaveForLater={handleSaveForLater}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            <OrderSummary
              subtotal={subtotal}
              discountAmount={discountAmount}
              tax={tax}
              deliveryFee={deliveryFee}
              total={total}
              itemCount={itemCount}
              coupon={coupon}
              onApplyCoupon={setCoupon}
              onRemoveCoupon={() => setCoupon(null)}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
