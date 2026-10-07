import React from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, LayoutGrid, Heart, ShoppingBag, User } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { isBottomNavVisible } from "../../utils/navigationConfig";
import MobileBottomNavItem from "./MobileBottomNavItem";

const MobileBottomNavigation = () => {
  const location = useLocation();
  const { itemCount: cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { isAuthenticated } = useAuth();

  const pathname = location.pathname;
  const isVisible = isBottomNavVisible(pathname);

  const navItems = [
    {
      id: "home",
      label: "Home",
      to: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      id: "categories",
      label: "Categories",
      to: "/shopping",
      icon: LayoutGrid,
      isActive:
        pathname.startsWith("/shopping") ||
        pathname === "/collections" ||
        pathname === "/shopping",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      to: "/wishlist",
      icon: Heart,
      badgeCount: wishlistCount || 0,
      isActive: pathname === "/wishlist",
    },
    {
      id: "cart",
      label: "Cart",
      to: "/cart",
      icon: ShoppingBag,
      badgeCount: cartCount || 0,
      isActive: pathname === "/cart",
    },
    {
      id: "profile",
      label: isAuthenticated ? "Profile" : "Login",
      to: isAuthenticated ? "/dashboard" : "/login",
      icon: User,
      isActive:
        pathname === "/dashboard" ||
        pathname === "/profile",
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Mobile Bottom Navigation"
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden pointer-events-none pb-[calc(10px+env(safe-area-inset-bottom))] px-3 pt-1"
        >
          <div
            className="pointer-events-auto w-full max-w-[430px] mx-auto px-2 py-1 flex items-center justify-between rounded-3xl transition-all duration-300"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.88)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid var(--whiold-border)",
              boxShadow:
                "0 16px 40px -10px rgba(59, 33, 21, 0.16), 0 4px 14px -2px rgba(186, 112, 79, 0.08)",
            }}
          >
            {navItems.map((item) => (
              <MobileBottomNavItem
                key={item.id}
                label={item.label}
                to={item.to}
                icon={item.icon}
                isActive={item.isActive}
                badgeCount={item.badgeCount}
              />
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default MobileBottomNavigation;
