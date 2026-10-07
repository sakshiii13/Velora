import React, { useRef, useLayoutEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Divider, IconButton } from "@mui/material";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
  LogIn,
  ShieldCheck,
} from "lucide-react";
import gsap from "gsap";

/* ─────────────────────────────────────────────────────────
   LoggedOutState — shown when no user session exists
───────────────────────────────────────────────────────── */
const LoggedOutState = () => {
  const cardRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(cardRef.current, { opacity: 0, y: 24 });
      gsap.to(cardRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power3.out",
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[var(--whiold-bg-soft)] px-4 py-10">
      <div
        ref={cardRef}
        className="w-full max-w-sm rounded-[var(--whiold-radius-lg)] border border-[var(--whiold-border)] bg-[var(--whiold-bg)] p-8 text-center shadow-[var(--whiold-shadow-card)]"
      >
        <div
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundImage: "var(--whiold-gradient-brand)" }}
        >
          <User size={26} className="text-white" />
        </div>

        <h2 className="m-0 text-[19px] font-bold text-[var(--whiold-text-heading)]">
          You're not logged in
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--whiold-text-muted)]">
          Sign in to view your profile, track orders, and manage your
          wishlist.
        </p>

        <Link
          to="/login"
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--whiold-radius-md)] text-[13px] font-semibold uppercase tracking-wide text-white no-underline shadow-[var(--whiold-shadow-btn)] transition-transform duration-200 hover:scale-[1.01] active:scale-[0.98]"
          style={{ backgroundImage: "var(--whiold-gradient-brand)" }}
        >
          <LogIn size={15} /> Login to continue
        </Link>

        <p className="mt-4 text-[12px] text-[var(--whiold-text-muted)]">
          New to Whiold?{" "}
          <Link
            to="/signup"
            className="font-semibold text-[var(--whiold-primary)] no-underline hover:underline"
          >
            Create an account
          </Link>
        </p>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[10.5px] text-[var(--whiold-text-muted)]">
          <ShieldCheck size={13} className="text-[var(--whiold-primary)]" />
          Your data is safe and secure with us
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   LoggedInState — shown when a user session exists
───────────────────────────────────────────────────────── */
const LoggedInState = ({ user, logout }) => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([headerRef.current, menuRef.current], { opacity: 0, y: 22 });
      gsap.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      });
      gsap.to(menuRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        delay: 0.1,
      });
    });
    return () => ctx.revert();
  }, []);

  const initials = (user?.name || user?.email || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const menuItems = [
    { label: "My Orders", icon: Package, to: "/orders" },
    { label: "Wishlist", icon: Heart, to: "/wishlist" },
    { label: "Saved Addresses", icon: MapPin, to: "/addresses" },
    { label: "Account Settings", icon: Settings, to: "/settings" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--whiold-bg-soft)] pb-10">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {/* Header card */}
        <div
          ref={headerRef}
          className="rounded-[var(--whiold-radius-lg)] border border-[var(--whiold-border)] bg-[var(--whiold-bg)] p-6 shadow-[var(--whiold-shadow-card)]"
        >
          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-16 w-16 flex-shrink-0 rounded-full object-cover"
                style={{ boxShadow: "0 0 0 3px var(--whiold-primary-soft)" }}
              />
            ) : (
              <div
                className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-[20px] font-bold text-white"
                style={{ backgroundImage: "var(--whiold-gradient-brand)" }}
              >
                {initials}
              </div>
            )}

            <div className="min-w-0">
              <h1 className="m-0 truncate text-[19px] font-bold text-[var(--whiold-text-heading)]">
                {user?.name || "Whiold Member"}
              </h1>
              {user?.email && (
                <div className="mt-1 flex items-center gap-1.5 text-[12.5px] text-[var(--whiold-text-muted)]">
                  <Mail size={12} /> {user.email}
                </div>
              )}
              {user?.phone && (
                <div className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-[var(--whiold-text-muted)]">
                  <Phone size={12} /> {user.phone}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu list */}
        <div
          ref={menuRef}
          className="mt-5 overflow-hidden rounded-[var(--whiold-radius-lg)] border border-[var(--whiold-border)] bg-[var(--whiold-bg)] shadow-[var(--whiold-shadow-card)]"
        >
          {menuItems.map((item, i) => (
            <React.Fragment key={item.label}>
              <Link
                to={item.to}
                className="flex items-center justify-between px-5 py-4 no-underline transition-colors duration-150 hover:bg-[var(--whiold-bg-soft)]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--whiold-primary-soft)]">
                    <item.icon size={16} className="text-[var(--whiold-primary)]" />
                  </span>
                  <span className="text-[13.5px] font-medium text-[var(--whiold-text-heading)]">
                    {item.label}
                  </span>
                </div>
                <ChevronRight size={16} className="text-[var(--whiold-text-muted)]" />
              </Link>
              {i < menuItems.length - 1 && (
                <Divider className="!border-[var(--whiold-border)]" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--whiold-radius-md)] border border-[var(--whiold-border)] bg-[var(--whiold-bg)] text-[13px] font-semibold uppercase tracking-wide text-rose-500 transition-colors duration-150 hover:bg-rose-50"
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   Profile — decides which state to render
───────────────────────────────────────────────────────── */
const Profile = () => {
  const { user, isAuthenticated, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[var(--whiold-bg-soft)]">
        <p className="text-[13px] text-[var(--whiold-text-muted)]">
          Loading your profile...
        </p>
      </div>
    );
  }

  return isAuthenticated && user ? (
    <LoggedInState user={user} logout={logout} />
  ) : (
    <LoggedOutState />
  );
};

export default Profile;