import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Wallet,
  Truck,
  Plus,
  Edit2,
  Trash2,
  Check,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Lock,
  Tag,
  CheckCircle,
  AlertCircle,
  MapPin,
  ShoppingBag,
  PlusCircle
} from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Router } from "../../../constants/router";
import InputComponent from "../../ui/InputComponent";
import ButtonComponent from "../../ui/ButtonComponent";
import { mockDb } from "../../../mock/mockDb"; // [MOCK-MIGRATION] persist orders locally
// Mock saved addresses
const INITIAL_ADDRESSES = [
  {
    id: "addr-1",
    name: "Sakshi Sharma",
    type: "Home",
    street: "Penthouse B, Royal Residency, Sector 56",
    city: "Gurugram",
    state: "Haryana",
    zipCode: "122011",
    phone: "+91 98765 43210"
  },
  {
    id: "addr-2",
    name: "Sakshi Sharma",
    type: "Office",
    street: "DLF Cyber City, Building 10, Tower B, 14th Floor",
    city: "Gurugram",
    state: "Haryana",
    zipCode: "122002",
    phone: "+91 98765 43210"
  }
];

const ADDRESS_TYPE_OPTIONS = [
  { value: "Home", label: "Home" },
  { value: "Office", label: "Office" },
  { value: "Other", label: "Other" }
];

const DELIVERY_METHODS = [
  {
    id: "standard",
    name: "Standard Atelier Delivery",
    desc: "Delivered in signature linen packaging via premium courier.",
    time: "3-5 business days",
    price: 0,
    minCart: 3000
  },
  {
    id: "express",
    name: "Express Priority",
    desc: "Faster transit with real-time temperature-monitored tracking.",
    time: "1-2 business days",
    price: 250,
    minCart: 0
  },
  {
    id: "concierge",
    name: "White Glove Concierge",
    desc: "Hand-delivered by an atelier representative in pristine condition.",
    time: "Next day delivery",
    price: 490,
    minCart: 0
  }
];

// Mock wallet balance — replace with real balance from user/wallet context
const MOCK_WALLET_BALANCE = 5000;

const TAX_RATE = 0.05;
const FREE_DELIVERY_THRESHOLD = 3000;

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Page States
  const [activeStep, setActiveStep] = useState(2); // Step 1: Cart, Step 2: Checkout / Shipping, Step 3: Payment, Step 4: Confirmation
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [showPaymentSuccessPopup, setShowPaymentSuccessPopup] = useState(false); // NEW: Payment Successful popup
  const [orderTotal, setOrderTotal] = useState(0); // NEW: snapshot of grandTotal, taken before clearCart() zeroes it

  // Address States
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState("addr-1");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    name: "",
    type: "Home",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: ""
  });
  const [addressErrors, setAddressErrors] = useState({});

  // Redirect if cart is empty (but not while the success flow is playing out)
  useEffect(() => {
    if ((!cart || cart.length === 0) && !showPaymentSuccessPopup && !showSuccessScreen) {
      const timer = setTimeout(() => {
        navigate(Router.CART);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [cart, navigate, showPaymentSuccessPopup, showSuccessScreen]);

  // Contact States
  const [contactInfo, setContactInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: ""
  });
  const [contactErrors, setContactErrors] = useState({});

  // Delivery Method State
  const [deliveryMethodId, setDeliveryMethodId] = useState("standard");

  // Wallet Payment State
  const [walletBalance, setWalletBalance] = useState(MOCK_WALLET_BALANCE);
  const [walletError, setWalletError] = useState("");

  // Promo/Coupon Code States
  const [promoCode, setPromoCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  // Terms and conditions
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsError, setTermsError] = useState("");

  // Load Simulating
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Sync contact info when user changes or loads
  useEffect(() => {
    if (user) {
      setContactInfo(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  // Totals calculations
  const totals = useMemo(() => {
    const sub = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;
    if (appliedCoupon) {
      discount = appliedCoupon.type === "percent"
        ? Math.round((sub * appliedCoupon.value) / 100)
        : appliedCoupon.value;
      discount = Math.min(discount, sub);
    }
    const afterDiscount = sub - discount;

    // Delivery pricing
    const method = DELIVERY_METHODS.find(m => m.id === deliveryMethodId);
    let deliveryFee = method ? method.price : 0;
    if (deliveryMethodId === "standard" && afterDiscount >= FREE_DELIVERY_THRESHOLD) {
      deliveryFee = 0;
    }

    const taxAmt = Math.round(afterDiscount * TAX_RATE);
    return {
      subtotal: sub,
      discount,
      deliveryFee,
      tax: taxAmt,
      grandTotal: afterDiscount + deliveryFee + taxAmt
    };
  }, [cart, appliedCoupon, deliveryMethodId]);

  const walletShortfall = Math.max(0, totals.grandTotal - walletBalance);
  const hasSufficientBalance = walletBalance >= totals.grandTotal;

  // Estimated Delivery Dates helper
  const estDeliveryDate = useMemo(() => {
    const method = DELIVERY_METHODS.find(m => m.id === deliveryMethodId);
    const today = new Date();
    let minDays = 3;
    let maxDays = 5;

    if (method?.id === "express") {
      minDays = 1;
      maxDays = 2;
    } else if (method?.id === "concierge") {
      minDays = 1;
      maxDays = 1;
    }

    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDays);

    const options = { month: "short", day: "numeric" };
    if (minDays === maxDays) {
      return minDate.toLocaleDateString("en-IN", options);
    }
    return `${minDate.toLocaleDateString("en-IN", options)} - ${maxDate.toLocaleDateString("en-IN", { day: "numeric" })} ${maxDate.toLocaleDateString("en-IN", { month: "short" })}`;
  }, [deliveryMethodId]);

  // Form Validation Handlers
  const validateContact = () => {
    const errors = {};
    if (!contactInfo.name.trim()) errors.name = "Full name is required";
    if (!contactInfo.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(contactInfo.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!contactInfo.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(contactInfo.phone.replace(/[^0-9]/g, ""))) {
      errors.phone = "Please enter a valid 10-digit mobile number";
    }
    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAddress = () => {
    const errors = {};
    if (!addressForm.name.trim()) errors.name = "Recipient name is required";
    if (!addressForm.street.trim()) errors.street = "Street address is required";
    if (!addressForm.city.trim()) errors.city = "City is required";
    if (!addressForm.state.trim()) errors.state = "State is required";
    if (!addressForm.zipCode.trim()) {
      errors.zipCode = "ZIP/Postal code is required";
    } else if (!/^\d{6}$/.test(addressForm.zipCode)) {
      errors.zipCode = "Must be a valid 6-digit PIN code";
    }
    if (!addressForm.phone.trim()) {
      errors.phone = "Phone number is required";
    }
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Action: Add / Update Address
  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!validateAddress()) return;

    if (editingAddressId) {
      setAddresses(prev => prev.map(addr => addr.id === editingAddressId ? { ...addressForm, id: editingAddressId } : addr));
      setEditingAddressId(null);
    } else {
      const newId = `addr-${Date.now()}`;
      setAddresses(prev => [...prev, { ...addressForm, id: newId }]);
      setSelectedAddressId(newId);
    }

    setAddressForm({
      name: "",
      type: "Home",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      phone: ""
    });
    setShowAddressForm(false);
  };

  const handleEditAddress = (addr) => {
    setAddressForm(addr);
    setEditingAddressId(addr.id);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id, e) => {
    e.stopPropagation();
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    if (selectedAddressId === id) {
      setSelectedAddressId(addresses.find(addr => addr.id !== id)?.id || "");
    }
  };

  // Action: Apply Coupon
  const handleApplyCoupon = () => {
    setPromoError("");
    setPromoSuccess("");
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoError("Please enter a promo code");
      return;
    }

    const availableCoupons = {
      WELCOME10: { type: "percent", value: 10 },
      FLAT200: { type: "flat", value: 200 },
      ATELIER20: { type: "percent", value: 20 }
    };

    if (availableCoupons[code]) {
      setAppliedCoupon({ label: code, ...availableCoupons[code] });
      setPromoSuccess(`Promo code "${code}" applied successfully!`);
    } else {
      setPromoError("Invalid promo code. Please try another one.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setPromoSuccess("");
    setPromoCode("");
  };

  // Main Submit Action: Place Order
  const handlePlaceOrder = async () => {
    // 1. Validate contact info
    if (!validateContact()) {
      setActiveStep(2); // Go back to step 2 (Shipping & Contact info)
      const element = document.getElementById("contact-section");
      element?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // 2. Validate selected address
    if (!selectedAddressId) {
      setActiveStep(2);
      alert("Please select or add a delivery address.");
      return;
    }

    // 3. Step validation
    if (activeStep === 2) {
      // Advance to payment step
      setActiveStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // 4. Validate wallet balance
    setWalletError("");
    if (!hasSufficientBalance) {
      setWalletError(
        `Insufficient wallet balance. Add ₹${walletShortfall.toLocaleString("en-IN")} more to place this order.`
      );
      return;
    }

    if (!acceptTerms) {
      setTermsError("You must accept the terms and conditions to proceed.");
      return;
    }
    setTermsError("");

    // Simulate Order Placement — persist to mockDb and deduct from wallet
    setIsPlacingOrder(true);
    setTimeout(() => {
      const selectedAddr = addresses.find(a => a.id === selectedAddressId) || addresses[0];
      const deliveryMethod = DELIVERY_METHODS.find(m => m.id === deliveryMethodId);

      // [MOCK-MIGRATION] persist new order so AllOrders / Invoice / ManageOrder can read it
      mockDb.createOrder({
        totalAmount: totals.grandTotal,
        deliveryFee: totals.deliveryFee,
        paymentMode: "Wallet",
        contactInfo,
        address: {
          name: selectedAddr.name,
          house: selectedAddr.street,
          area: "",
          city: selectedAddr.city,
          state: selectedAddr.state,
          pincode: selectedAddr.zipCode,
          mobile: selectedAddr.phone,
        },
        items: cart.map(item => ({
          id: item.id,
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          variant: item.variant || item.size,
        })),
        deliveryMethod: deliveryMethod?.name || "Standard",
      });

      setOrderTotal(totals.grandTotal); // snapshot BEFORE clearCart() zeroes totals.grandTotal
      setWalletBalance(prev => prev - totals.grandTotal);
      setIsPlacingOrder(false);
      setShowPaymentSuccessPopup(true); // Show "Payment Successful" popup first
      clearCart();

      // After the payment popup plays out, transition to the full Order Confirmed screen
      setTimeout(() => {
        setShowPaymentSuccessPopup(false);
        setShowSuccessScreen(true);
      }, 2200);
    }, 2000);
  };

  // Empty State fallback (skip while the success popups are still playing)
  if ((!cart || cart.length === 0) && !showPaymentSuccessPopup && !showSuccessScreen) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-(--whiold-bg-soft) p-6 text-center font-sans">
        <style>{`
          @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap");
          .whiold-checkout-serif { font-family: 'Cormorant Garamond', serif; }
        `}</style>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex max-w-md flex-col items-center gap-6 rounded-3xl border border-(--whiold-border) bg-(--whiold-bg) p-10"
          style={{ boxShadow: "var(--whiold-shadow-card)" }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--whiold-primary-soft) text-(--whiold-primary)">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="whiold-checkout-serif text-3xl font-bold tracking-tight text-(--whiold-text-heading)">Your bag is empty</h1>
            <p className="text-sm text-(--whiold-text-body)">
              There are no products in your cart. You will be redirected back to the shop page shortly.
            </p>
          </div>
          <Link
            to="/shopping"
            className="w-full rounded-full py-3 text-center text-sm font-semibold transition"
            style={{
              background: "var(--whiold-gradient-brand)",
              color: "var(--whiold-text-on-primary)",
              boxShadow: "var(--whiold-shadow-btn)",
            }}
          >
            Browse Products
          </Link>
        </motion.div>
      </div>
    );
  }

  // Skeleton Loading Page
  if (isLoading) {
    return (
      <div className="min-h-screen bg-(--whiold-bg-soft) py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-8 space-y-8 animate-pulse">
          <div className="h-6 w-48 bg-(--whiold-border) rounded"></div>
          <div className="h-10 w-full bg-(--whiold-border) rounded-lg"></div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
            <div className="space-y-6">
              <div className="h-48 bg-(--whiold-border) rounded-2xl"></div>
              <div className="h-64 bg-(--whiold-border) rounded-2xl"></div>
            </div>
            <div className="h-96 bg-(--whiold-border) rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-(--whiold-bg-soft) py-10 font-sans">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap");
        .whiold-checkout-serif { font-family: 'Cormorant Garamond', serif; }
      `}</style>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header Back Button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => {
              if (activeStep > 2) setActiveStep(activeStep - 1);
              else navigate(Router.CART);
            }}
            className="flex items-center gap-2 text-sm font-medium text-(--whiold-text-body) hover:text-(--whiold-text-heading) transition duration-200 group"
          >
            <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" />
            Back to {activeStep === 3 ? "Shipping" : "Cart"}
          </button>

          <div className="flex items-center gap-1.5 text-xs text-(--whiold-text-muted) font-medium tracking-wider uppercase">
            <Lock className="h-3 w-3" />
            Order Securely
          </div>
        </div>

        {/* Premium Step Progress Indicator */}
        <div
          className="mb-10 rounded-2xl border border-(--whiold-border) bg-(--whiold-bg) p-6"
          style={{ boxShadow: "var(--whiold-shadow-card)" }}
        >
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: "Shopping Bag" },
              { step: 2, label: "Shipping & Delivery" },
              { step: 3, label: "Secure Payment" },
              { step: 4, label: "Confirmation" }
            ].map((s, idx) => (
              <React.Fragment key={s.step}>
                <div className="flex flex-col items-center gap-2 flex-1 relative z-10">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold border transition-all duration-300"
                    style={
                      activeStep > s.step
                        ? {
                            background: "var(--whiold-gradient-brand)",
                            borderColor: "transparent",
                            color: "var(--whiold-text-on-primary)",
                            boxShadow: "var(--whiold-shadow-btn)",
                          }
                        : activeStep === s.step
                        ? {
                            background: "var(--whiold-bg)",
                            borderColor: "var(--whiold-primary)",
                            color: "var(--whiold-primary)",
                            boxShadow: "var(--whiold-shadow-focus)",
                            fontWeight: 800,
                          }
                        : {
                            background: "var(--whiold-bg-soft)",
                            borderColor: "var(--whiold-border)",
                            color: "var(--whiold-text-muted)",
                          }
                    }
                  >
                    {activeStep > s.step ? <Check className="h-4 w-4" /> : s.step}
                  </div>
                  <span
                    className="text-xs md:text-sm font-medium tracking-wide text-center transition-colors"
                    style={{
                      color: activeStep === s.step ? "var(--whiold-primary)" : "var(--whiold-text-muted)",
                      fontWeight: activeStep === s.step ? 600 : 500,
                    }}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div className="flex-1 h-0.5 max-w-[20%] mx-2 bg-(--whiold-border) relative -top-4">
                    <div
                      className="absolute top-0 left-0 h-full transition-all duration-500"
                      style={{
                        width: activeStep > s.step ? "100%" : "0%",
                        background: "var(--whiold-gradient-brand)",
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">

          {/* LEFT SIDE: Inputs / Forms */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {activeStep === 2 ? (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-8"
                >
                  {/* Contact Information */}
                  <section
                    id="contact-section"
                    className="rounded-2xl border border-(--whiold-border) bg-(--whiold-bg) p-6 sm:p-8"
                    style={{ boxShadow: "var(--whiold-shadow-card)" }}
                  >
                    <h2 className="whiold-checkout-serif text-2xl font-bold tracking-tight text-(--whiold-text-heading) mb-6 flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-(--whiold-primary-soft) text-sm text-(--whiold-primary) font-sans font-bold">1</span>
                      Contact Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <InputComponent
                        label="Full Name"
                        placeholder="Your full name"
                        value={contactInfo.name}
                        onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                        error={!!contactErrors.name}
                        helperText={contactErrors.name}
                        required
                      />
                      <InputComponent
                        label="Email Address"
                        type="email"
                        placeholder="name@example.com"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                        error={!!contactErrors.email}
                        helperText={contactErrors.email}
                        required
                      />
                      <div className="md:col-span-2">
                        <InputComponent
                          label="Mobile Phone Number"
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                          error={!!contactErrors.phone}
                          helperText={contactErrors.phone}
                          required
                        />
                      </div>
                    </div>
                  </section>

                  {/* Delivery Address */}
                  <section
                    className="rounded-2xl border border-(--whiold-border) bg-(--whiold-bg) p-6 sm:p-8"
                    style={{ boxShadow: "var(--whiold-shadow-card)" }}
                  >
                    <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
                      <h2 className="whiold-checkout-serif text-2xl font-bold tracking-tight text-(--whiold-text-heading) flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-(--whiold-primary-soft) text-sm text-(--whiold-primary) font-sans font-bold">2</span>
                        Delivery Address
                      </h2>
                      {!showAddressForm && (
                        <ButtonComponent
                          variant="text"
                          size="small"
                          startIcon={<Plus className="h-3.5 w-3.5" />}
                          onClick={() => {
                            setEditingAddressId(null);
                            setAddressForm({
                              name: "",
                              type: "Home",
                              street: "",
                              city: "",
                              state: "",
                              zipCode: "",
                              phone: ""
                            });
                            setAddressErrors({});
                            setShowAddressForm(true);
                          }}
                        >
                          Add Address
                        </ButtonComponent>
                      )}
                    </div>

                    {/* Address Addition Form */}
                    <AnimatePresence>
                      {showAddressForm && (
                        <motion.form
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mb-6 overflow-hidden rounded-xl border border-(--whiold-border) bg-(--whiold-bg-soft) p-5 space-y-4"
                          onSubmit={handleSaveAddress}
                        >
                          <h3 className="text-sm font-bold text-(--whiold-text-heading) mb-2">
                            {editingAddressId ? "Edit Address Details" : "New Address Details"}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputComponent
                              label="Recipient Name"
                              placeholder="Full name"
                              value={addressForm.name}
                              onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                              error={!!addressErrors.name}
                              helperText={addressErrors.name}
                            />
                            <InputComponent
                              label="Address Label"
                              type="select"
                              value={addressForm.type}
                              onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value })}
                              options={ADDRESS_TYPE_OPTIONS}
                            />
                            <div className="md:col-span-2">
                              <InputComponent
                                label="Street Address"
                                placeholder="Apartment, unit, suite, villa, building number, street name"
                                value={addressForm.street}
                                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                                error={!!addressErrors.street}
                                helperText={addressErrors.street}
                              />
                            </div>
                            <InputComponent
                              label="City"
                              placeholder="City"
                              value={addressForm.city}
                              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                              error={!!addressErrors.city}
                              helperText={addressErrors.city}
                            />
                            <InputComponent
                              label="State"
                              placeholder="State"
                              value={addressForm.state}
                              onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                              error={!!addressErrors.state}
                              helperText={addressErrors.state}
                            />
                            <InputComponent
                              label="PIN / ZIP Code"
                              placeholder="6-digit PIN code"
                              value={addressForm.zipCode}
                              onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                              error={!!addressErrors.zipCode}
                              helperText={addressErrors.zipCode}
                            />
                            <InputComponent
                              label="Contact Phone"
                              placeholder="Phone for delivery coordination"
                              value={addressForm.phone}
                              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                              error={!!addressErrors.phone}
                              helperText={addressErrors.phone}
                            />
                          </div>
                          <div className="flex justify-end gap-3 pt-2">
                            <ButtonComponent
                              type="button"
                              variant="text"
                              size="small"
                              onClick={() => {
                                setShowAddressForm(false);
                                setEditingAddressId(null);
                              }}
                            >
                              Cancel
                            </ButtonComponent>
                            <ButtonComponent type="submit" size="small">
                              Save Address
                            </ButtonComponent>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    {/* Address Selection list */}
                    {addresses.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-(--whiold-border) p-8 text-center bg-(--whiold-bg-soft)">
                        <MapPin className="h-8 w-8 text-(--whiold-text-muted) mx-auto mb-2" />
                        <p className="text-sm font-medium text-(--whiold-text-body)">No delivery addresses saved yet.</p>
                        <p className="text-xs text-(--whiold-text-muted) mb-3">Add a new delivery address to continue.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className="relative rounded-xl border p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between"
                            style={{
                              borderColor: selectedAddressId === addr.id ? "var(--whiold-primary)" : "var(--whiold-border)",
                              background: selectedAddressId === addr.id ? "var(--whiold-primary-soft)" : "var(--whiold-bg)",
                              boxShadow: selectedAddressId === addr.id ? "var(--whiold-shadow-focus)" : "none",
                            }}
                          >
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-(--whiold-text-heading)">{addr.name}</span>
                                <span
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                                  style={
                                    addr.type === "Home"
                                      ? { background: "var(--whiold-100)", color: "var(--whiold-700)" }
                                      : { background: "var(--whiold-200)", color: "var(--whiold-800)" }
                                  }
                                >
                                  {addr.type}
                                </span>
                                {selectedAddressId === addr.id && (
                                  <span className="ml-auto text-[10px] font-bold text-(--whiold-primary) uppercase tracking-wide flex items-center gap-0.5">
                                    <Check className="h-3 w-3" /> Selected
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-(--whiold-text-body) leading-relaxed mb-3">{addr.street}, {addr.city}, {addr.state} - {addr.zipCode}</p>
                            </div>
                            <div className="flex items-center justify-between border-t border-(--whiold-border) pt-3 mt-auto text-[11px] font-bold text-(--whiold-text-muted)">
                              <span>{addr.phone}</span>
                              <div className="flex items-center gap-2.5">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditAddress(addr);
                                  }}
                                  className="text-(--whiold-text-muted) hover:text-(--whiold-text-heading) transition"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={(e) => handleDeleteAddress(addr.id, e)}
                                  className="text-(--whiold-text-muted) hover:text-(--whiold-input-error-text) transition"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* Delivery Methods */}
                  <section
                    className="rounded-2xl border border-(--whiold-border) bg-(--whiold-bg) p-6 sm:p-8"
                    style={{ boxShadow: "var(--whiold-shadow-card)" }}
                  >
                    <h2 className="whiold-checkout-serif text-2xl font-bold tracking-tight text-(--whiold-text-heading) mb-6 flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-(--whiold-primary-soft) text-sm text-(--whiold-primary) font-sans font-bold">3</span>
                      Select Delivery Method
                    </h2>
                    <div className="space-y-4">
                      {DELIVERY_METHODS.map((method) => {
                        const price = totals.subtotal >= FREE_DELIVERY_THRESHOLD && method.id === "standard" ? 0 : method.price;
                        const active = deliveryMethodId === method.id;
                        return (
                          <div
                            key={method.id}
                            onClick={() => setDeliveryMethodId(method.id)}
                            className="rounded-xl border p-4 cursor-pointer transition-all duration-300 flex items-start gap-4"
                            style={{
                              borderColor: active ? "var(--whiold-primary)" : "var(--whiold-border)",
                              background: active ? "var(--whiold-primary-soft)" : "var(--whiold-bg)",
                            }}
                          >
                            <div className="pt-0.5">
                              <div
                                className="h-5 w-5 rounded-full border flex items-center justify-center transition-all"
                                style={
                                  active
                                    ? { borderColor: "var(--whiold-primary)", background: "var(--whiold-primary)", color: "var(--whiold-text-on-primary)" }
                                    : { borderColor: "var(--whiold-border)" }
                                }
                              >
                                {active && <Check className="h-3 w-3" />}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-(--whiold-text-heading)">{method.name}</span>
                                <span className="text-sm font-bold text-(--whiold-text-heading)">
                                  {price === 0 ? (
                                    <span className="text-(--whiold-primary) font-semibold uppercase tracking-wider text-xs">Free</span>
                                  ) : (
                                    `₹${price}`
                                  )}
                                </span>
                              </div>
                              <p className="text-xs text-(--whiold-text-muted) mt-1 leading-relaxed">{method.desc}</p>
                              <div className="flex items-center gap-1.5 text-xs text-(--whiold-primary) font-semibold mt-2.5">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Est. Delivery: {method.time}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </motion.div>
              ) : (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-8"
                >
                  {/* Shipping Info Summary Box */}
                  <section
                    className="rounded-xl border border-(--whiold-border) bg-(--whiold-bg) p-5 flex items-center justify-between flex-wrap gap-4"
                    style={{ boxShadow: "var(--whiold-shadow-card)" }}
                  >
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-(--whiold-text-muted) uppercase tracking-wider">Deliver To:</div>
                      <div className="text-xs font-semibold text-(--whiold-text-heading)">
                        {addresses.find(a => a.id === selectedAddressId)?.name} (
                        {addresses.find(a => a.id === selectedAddressId)?.phone})
                      </div>
                      <div className="text-xs text-(--whiold-text-muted) truncate max-w-sm md:max-w-md">
                        {addresses.find(a => a.id === selectedAddressId)?.street}, {addresses.find(a => a.id === selectedAddressId)?.city}
                      </div>
                    </div>
                    <ButtonComponent variant="outlined" size="small" onClick={() => setActiveStep(2)}>
                      Change
                    </ButtonComponent>
                  </section>

                  {/* Wallet Payment */}
                  <section
                    className="rounded-2xl border border-(--whiold-border) bg-(--whiold-bg) p-6 sm:p-8"
                    style={{ boxShadow: "var(--whiold-shadow-card)" }}
                  >
                    <h2 className="whiold-checkout-serif text-2xl font-bold tracking-tight text-(--whiold-text-heading) mb-6 flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-(--whiold-primary-soft) text-sm text-(--whiold-primary) font-sans font-bold">4</span>
                      Payment
                    </h2>

                    {/* Wallet balance card */}
                    <div
                      className="relative overflow-hidden rounded-2xl p-6 sm:p-7 text-white"
                      style={{
                        background: "linear-gradient(135deg, var(--whiold-800) 0%, var(--whiold-900) 100%)",
                        boxShadow: "var(--whiold-shadow-card)",
                      }}
                    >
                      {/* decorative ambient blobs */}
                      <div
                        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
                        style={{ background: "var(--whiold-500)", opacity: 0.25 }}
                      />
                      <div
                        className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full blur-3xl"
                        style={{ background: "var(--whiold-300)", opacity: 0.15 }}
                      />

                      <div className="relative flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                            style={{ background: "rgba(255,255,255,0.12)" }}
                          >
                            <Wallet className="h-5 w-5" style={{ color: "var(--whiold-300)" }} />
                          </div>
                          <div>
                            <p
                              className="whiold-checkout-serif text-sm uppercase tracking-widest font-bold"
                              style={{ color: "var(--whiold-300)" }}
                            >
                              Whiold Wallet
                            </p>
                            <p className="text-[11px]" style={{ color: "var(--whiold-400)" }}>
                              Instant, secure & no extra fees
                            </p>
                          </div>
                        </div>
                        <span
                          className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
                          style={{ background: "rgba(255,255,255,0.12)", color: "var(--whiold-100)" }}
                        >
                          Default
                        </span>
                      </div>

                      <div className="relative mt-6 flex flex-wrap items-end justify-between gap-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-wider" style={{ color: "var(--whiold-400)" }}>
                            Available Balance
                          </p>
                          <p className="whiold-checkout-serif mt-1 text-3xl sm:text-4xl font-bold" style={{ color: "var(--whiold-50)" }}>
                            ₹{walletBalance.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] uppercase tracking-wider" style={{ color: "var(--whiold-400)" }}>
                            Order Amount
                          </p>
                          <p className="mt-1 text-lg sm:text-xl font-bold" style={{ color: "var(--whiold-100)" }}>
                            − ₹{totals.grandTotal.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <div
                        className="relative mt-5 flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold"
                        style={{ background: "rgba(255,255,255,0.08)" }}
                      >
                        <span style={{ color: "var(--whiold-300)" }}>Balance after this order</span>
                        <span style={{ color: hasSufficientBalance ? "var(--whiold-100)" : "#fca5a5" }}>
                          ₹{Math.max(0, walletBalance - totals.grandTotal).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* Insufficient balance warning + top-up */}
                    {!hasSufficientBalance ? (
                      <div
                        className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-xl border p-4"
                        style={{ borderColor: "var(--whiold-input-error-border)", background: "rgba(244,63,94,0.06)" }}
                      >
                        <div className="flex items-start gap-2.5 flex-1">
                          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--whiold-input-error-text)" }} />
                          <p className="text-xs leading-relaxed" style={{ color: "var(--whiold-input-error-text)" }}>
                            Your wallet balance is short by{" "}
                            <span className="font-bold">₹{walletShortfall.toLocaleString("en-IN")}</span>. Add money to
                            your wallet to place this order.
                          </p>
                        </div>
                        <ButtonComponent
                          size="small"
                          startIcon={<PlusCircle className="h-3.5 w-3.5" />}
                          onClick={() => {
                            // Mock top-up — replace with real wallet top-up flow
                            setWalletBalance(prev => prev + walletShortfall + 500);
                            setWalletError("");
                          }}
                          sx={{ whiteSpace: "nowrap" }}
                        >
                          Add Money
                        </ButtonComponent>
                      </div>
                    ) : (
                      <div
                        className="mt-5 flex items-center gap-2.5 rounded-xl border p-4"
                        style={{ borderColor: "var(--whiold-border)", background: "var(--whiold-primary-soft)" }}
                      >
                        <CheckCircle className="h-4 w-4 shrink-0" style={{ color: "var(--whiold-primary)" }} />
                        <p className="text-xs font-semibold" style={{ color: "var(--whiold-text-heading)" }}>
                          You're all set — this amount will be deducted from your wallet instantly on placing the order.
                        </p>
                      </div>
                    )}

                    {walletError && (
                      <p className="mt-3 text-xs font-medium" style={{ color: "var(--whiold-input-error-text)" }}>
                        {walletError}
                      </p>
                    )}
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT SIDE: Sticky Summary panel */}
          <div className="lg:sticky lg:top-24 space-y-6">

            {/* Summary card — signature foil-border wrap for the atelier premium feel */}
            <div className="whiold-foil-border relative">
              <div
                className="rounded-[24px] border border-(--whiold-border) bg-(--whiold-bg) p-6 space-y-6"
                style={{ boxShadow: "var(--whiold-shadow-card)" }}
              >
              <h3 className="whiold-checkout-serif text-xl font-bold text-(--whiold-text-heading)">Order Summary</h3>

              {/* Items breakdown list */}
              <div className="max-h-[220px] overflow-y-auto divide-y divide-(--whiold-border) pr-1 space-y-3">
                {cart.map((item, i) => (
                  <motion.div
                    key={item.lineId}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="flex gap-3 pt-3 first:pt-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-12 rounded-lg object-cover bg-(--whiold-bg-soft) border border-(--whiold-border)"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-(--whiold-text-heading) truncate">{item.name}</h4>
                      <p className="text-[10px] text-(--whiold-text-muted) mt-0.5">Size: {item.size} | Qty: {item.quantity}</p>
                      <span className="text-xs font-bold text-(--whiold-text-heading) mt-1 block">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Coupon Box */}
              {/* <div className="border-t border-(--whiold-border) pt-5">
                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    <InputComponent
                      placeholder="ENTER PROMO CODE"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={!!appliedCoupon}
                      startIcon={<Tag className="h-3.5 w-3.5" />}
                    />
                  </div>
                  {appliedCoupon ? (
                    <ButtonComponent
                      variant="outlined"
                      size="medium"
                      onClick={handleRemoveCoupon}
                      sx={{
                        borderColor: "var(--whiold-input-error-border)",
                        color: "var(--whiold-input-error-text)",
                        "&:hover": {
                          borderColor: "var(--whiold-input-error-text)",
                          backgroundColor: "rgba(244,63,94,0.06)",
                        },
                      }}
                    >
                      Remove
                    </ButtonComponent>
                  ) : (
                    <ButtonComponent
                      size="medium"
                      onClick={handleApplyCoupon}
                      sx={{
                        background: "var(--whiold-900)",
                        boxShadow: "none",
                        "&:hover": { background: "var(--whiold-800)", boxShadow: "none" },
                      }}
                    >
                      Apply
                    </ButtonComponent>
                  )}
                </div>
                {promoError && <p className="mt-1.5 text-xs text-(--whiold-input-error-text) font-medium">{promoError}</p>}
                {promoSuccess && <p className="mt-1.5 text-xs text-emerald-600 font-bold">{promoSuccess}</p>}
                <div className="mt-2 text-[10px] text-(--whiold-text-muted)">
                  Try <span className="font-semibold text-(--whiold-text-body)">ATELIER20</span> for 20% off
                </div>
              </div> */}

              {/* Fee Breakdown */}
              <div className="border-t border-(--whiold-border) pt-5 space-y-3 text-xs">
                <div className="flex justify-between text-(--whiold-text-body)">
                  <span>Subtotal</span>
                  <span>₹{totals.subtotal.toLocaleString("en-IN")}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>−₹{totals.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-(--whiold-text-body)">
                  <span>Estimated Delivery</span>
                  <span>
                    {totals.deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-semibold uppercase text-[10px] tracking-wide">Free</span>
                    ) : (
                      `₹${totals.deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-(--whiold-text-body)">
                  <span>Estimated Taxes (5%)</span>
                  <span>₹{totals.tax.toLocaleString("en-IN")}</span>
                </div>

                <div className="border-t border-(--whiold-border) pt-4 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-(--whiold-text-heading)">Grand Total</span>
                  <span className="whiold-checkout-serif text-2xl font-bold text-(--whiold-primary)">
                    ₹{totals.grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Delivery ETA summary banner */}
              <div className="rounded-xl border p-4 text-xs space-y-1.5" style={{ background: "var(--whiold-primary-soft)", borderColor: "var(--whiold-border)" }}>
                <div className="font-semibold text-(--whiold-text-heading) flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-(--whiold-primary)" />
                  Delivery details
                </div>
                <p className="text-(--whiold-text-muted)">Expect arrival: <span className="font-bold text-(--whiold-text-body)">{estDeliveryDate}</span></p>
              </div>

              {/* Wallet balance mini banner (shown on step 2 as a preview too) */}
              <div className="rounded-xl border p-4 text-xs flex items-center justify-between" style={{ background: "var(--whiold-bg-soft)", borderColor: "var(--whiold-border)" }}>
                <div className="flex items-center gap-1.5 font-semibold text-(--whiold-text-heading)">
                  <Wallet className="h-4 w-4 text-(--whiold-primary)" />
                  Wallet balance
                </div>
                <span className="font-bold text-(--whiold-text-heading)">₹{walletBalance.toLocaleString("en-IN")}</span>
              </div>

              {/* Secure checkout badges */}
              <div className="border-t border-(--whiold-border) pt-4 space-y-3">
                <div className="flex items-center gap-2 justify-center text-[10px] text-(--whiold-text-muted) font-semibold uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-(--whiold-text-muted)" />
                  Secure Luxury Transaction
                </div>

                {/* Terms and conditions */}
                <div>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 rounded border-(--whiold-border) text-(--whiold-primary) focus:ring-(--whiold-primary)"
                    />
                    <span className="text-[11px] text-(--whiold-text-muted) leading-normal">
                      I agree to the <span className="underline hover:text-(--whiold-text-heading)">Terms of Purchase</span> and <span className="underline hover:text-(--whiold-text-heading)">Return Policy</span>.
                    </span>
                  </label>
                  {termsError && <p className="mt-1.5 text-xs text-(--whiold-input-error-text)">{termsError}</p>}
                </div>

                {/* Primary place order button */}
                <ButtonComponent
                  fullWidth
                  loading={isPlacingOrder}
                  disabled={activeStep === 3 && !hasSufficientBalance}
                  onClick={handlePlaceOrder}
                  endIcon={activeStep === 2 ? <ChevronRight className="h-4 w-4" /> : null}
                  startIcon={activeStep === 3 ? <Wallet className="h-3.5 w-3.5" /> : null}
                >
                  {activeStep === 2 ? "Proceed to Payment" : `Pay ₹${totals.grandTotal.toLocaleString("en-IN")} from Wallet`}
                </ButtonComponent>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Successful Popup - attractive, auto-transitions to Order Confirmed */}
      <AnimatePresence>
        {showPaymentSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto p-6"
            style={{ background: "rgba(15, 23, 42, 0.55)", backdropFilter: "blur(6px)" }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative w-full max-w-sm my-auto rounded-[28px] bg-(--whiold-bg) p-8 sm:p-10 text-center overflow-hidden"
              style={{ boxShadow: "0 25px 60px -12px rgba(0,0,0,0.35)" }}
            >
              {/* Confetti particles */}
              {[...Array(14)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
                  animate={{
                    y: 260,
                    x: (i % 2 === 0 ? 1 : -1) * (20 + i * 6),
                    opacity: 0,
                    rotate: 180 + i * 20,
                  }}
                  transition={{ duration: 1.6, delay: 0.15 + i * 0.03, ease: "easeOut" }}
                  className="absolute top-0 left-1/2 h-2 w-2 rounded-sm"
                  style={{
                    background: i % 3 === 0 ? "var(--whiold-primary)" : i % 3 === 1 ? "var(--whiold-300)" : "#facc15",
                  }}
                />
              ))}

              {/* Animated checkmark with pulse rings */}
              <div className="relative flex justify-center mb-6">
                <div
                  className="relative flex h-24 w-24 items-center justify-center rounded-full"
                  style={{ background: "var(--whiold-primary-soft)" }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.15 }}
                    className="flex h-14 w-14 items-center justify-center rounded-full"
                    style={{ background: "var(--whiold-gradient-brand)", boxShadow: "var(--whiold-shadow-btn)" }}
                  >
                    <Check className="h-7 w-7 text-white" strokeWidth={3} />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: "var(--whiold-primary)" }}
                  />
                  <motion.div
                    initial={{ scale: 1, opacity: 0.4 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: "var(--whiold-primary)" }}
                  />
                </div>
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="whiold-checkout-serif text-3xl font-bold text-(--whiold-text-heading)"
              >
                Payment Successful
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-2 text-sm text-(--whiold-text-body)"
              >
                ₹{orderTotal.toLocaleString("en-IN")} paid securely from your Whiold Wallet
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-(--whiold-text-muted)"
              >
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-3.5 w-3.5 rounded-full border-2 border-(--whiold-primary) border-t-transparent"
                />
                Confirming your order...
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen premium success drawing overlay animation */}
      <AnimatePresence>
        {showSuccessScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] flex items-center justify-center overflow-y-auto p-6"
            style={{ background: "var(--whiold-gradient-panel)" }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
              className="whiold-foil-border relative max-w-lg w-full my-auto"
            >
              <div
                className="rounded-[24px] border border-(--whiold-border) bg-(--whiold-bg) p-6 sm:p-12 text-center space-y-6 overflow-y-auto max-h-[85vh]"
                style={{ boxShadow: "var(--whiold-shadow-card)" }}
              >
              {/* Animated checkmark circle */}
              <div className="flex justify-center">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <CheckCircle className="h-12 w-12" />
                  </motion.div>
                  <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping opacity-75" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="whiold-checkout-serif text-4xl font-bold tracking-tight text-(--whiold-text-heading)">Order Placed Successfully</h1>
                <p className="text-sm text-(--whiold-text-body)">
                  Thank you for shopping at Whiold Atelier. We have received your order and are preparing your linen delivery box.
                </p>
              </div>

              {/* Receipt details */}
              <div className="rounded-2xl bg-(--whiold-bg-soft) p-5 text-left text-xs divide-y divide-(--whiold-border) space-y-3">
                <div className="flex justify-between pb-3">
                  <span className="font-bold text-(--whiold-text-heading)">Order Number</span>
                  <span className="font-mono text-(--whiold-text-body) uppercase">WHI-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="font-bold text-(--whiold-text-heading)">Delivery Address</span>
                  <span className="text-(--whiold-text-body) text-right truncate max-w-[200px]">
                    {addresses.find(a => a.id === selectedAddressId)?.street}, {addresses.find(a => a.id === selectedAddressId)?.city}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="font-bold text-(--whiold-text-heading)">Paid via</span>
                  <span className="font-semibold text-(--whiold-text-body) flex items-center gap-1">
                    <Wallet className="h-3.5 w-3.5" /> Whiold Wallet
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="font-bold text-(--whiold-text-heading)">Estimated Delivery</span>
                  <span className="font-semibold text-(--whiold-primary)">{estDeliveryDate}</span>
                </div>
                <div className="flex justify-between pt-3 text-sm">
                  <span className="font-bold text-(--whiold-text-heading)">Paid Amount</span>
                  <span className="whiold-checkout-serif text-xl font-bold text-(--whiold-primary)">₹{orderTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <ButtonComponent
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      setShowSuccessScreen(false);
                      navigate("/");
                    }}
                  >
                    Continue Shopping
                  </ButtonComponent>
                </div>
                <div className="flex-1 min-w-0">
                  <ButtonComponent
                    fullWidth
                    onClick={() => {
                      setShowSuccessScreen(false);
                      navigate("/dashboard");
                    }}
                  >
                    Track Order
                  </ButtonComponent>
                </div>
              </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}