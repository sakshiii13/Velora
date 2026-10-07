import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Drawer from "@mui/material/Drawer";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu as MenuIcon,
  X,
  ChevronDown,
} from "lucide-react";
import ButtonComponent from "../../../ui/ButtonComponent";
import mainContent from "../../../../constants/mainContent";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCart } from "../../../../context/CartContext";
import { useWishlist } from "../../../../context/WishlistContext";
import CategoryMegaMenu from "./Categorymenu";
import { CATEGORIES } from "./CategoryData";
import { Router } from "../../../../constants/router";
import { getAllProducts } from "../../../../api/user/products.api";
import { useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shopping" },
  { label: "Collections", to: "/collections" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false); // "Shop by Category" accordion toggle
  const [openSubCat, setOpenSubCat] = useState({}); // To track which category's subcategories are open
  const navigate = useNavigate();
  const { itemCount: cartCount } = useCart();
  const { wishlistCount } = useWishlist(); // ⬅️ ab real wishlist context se aa raha hai

  const [dynamicCategories, setDynamicCategories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllProducts();
        if (res?.success || Array.isArray(res?.data) || Array.isArray(res)) {
          let list = [];
          if (Array.isArray(res?.data)) list = res.data;
          else if (Array.isArray(res?.data?.data)) list = res.data.data;
          else if (Array.isArray(res)) list = res;

          const catMap = new Map();
          list.forEach(p => {
             if (!p.category) return;
             const catName = typeof p.category === 'object' ? (p.category.name || p.category.title) : p.category;
             if (!catName) return;
             
             let catImage = "";
             if (p.images && p.images.length > 0) {
                const img = p.images[0];
                catImage = typeof img === 'object' ? (img.imageUrl || img.url || img.image) : img;
             } else if (p.image) {
                catImage = typeof p.image === 'object' ? (p.image.imageUrl || p.image.url || p.image.image) : p.image;
             }
             
             if (!catMap.has(catName)) {
                 catMap.set(catName, {
                    id: typeof p.category === 'object' ? p.category._id : catName,
                    name: catName,
                    slug: catName.toLowerCase().trim().replace(/\s+/g, "-"),
                    image: catImage || "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop",
                    subcategories: new Map()
                 });
             }
             const existingCat = catMap.get(catName);
             if (p.subCategory) {
                 const subName = typeof p.subCategory === 'object' ? (p.subCategory.name || p.subCategory.title) : p.subCategory;
                 const subId = typeof p.subCategory === 'object' ? p.subCategory._id : subName;
                 if (subName) {
                     existingCat.subcategories.set(subName, { id: subId, name: subName });
                 }
             }
             if (!existingCat.image && catImage) {
                 existingCat.image = catImage;
             }
          });
          
          const finalCategories = Array.from(catMap.values()).map(cat => ({
             ...cat,
             subcategories: Array.from(cat.subcategories.values())
          }));
          
          setDynamicCategories(finalCategories);
        }
      } catch(err) {
        console.error(err);
      }
    })();
  }, []);

  const toggleSubCat = (catId, e) => {
    e.preventDefault();
    setOpenSubCat((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  return (
    <>
      {/* Announcement strip */}
      <div
        className="hidden sm:block text-center text-[13px] font-medium py-1.5 tracking-wide"
        style={{
          background: "var(--whiold-gradient-brand)",
          color: "var(--whiold-text-on-primary)",
        }}
      >
        Free shipping on orders above ₹2,999 · Use code{" "}
        <span className="font-semibold">WHIOLD10</span> for 10% off ·{" "}
        <Link
          to="/register"
          className="underline font-bold hover:opacity-80 transition"
          style={{ color: "inherit" }}
        >
          Sign Up
        </Link>
      </div>

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 0,
          backgroundColor: "#ffff",
          backdropFilter: "blur(80px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid var(--whiold-border)",
          boxShadow: "var(--whiold-shadow-card)",
          color: "var(--whiold-text-heading)",
        }}
      >
        <Toolbar
          disableGutters
          className="relative mx-auto w-full max-w-7xl px-4 lg:px-10"
          sx={{ minHeight: "85px !important", py: 0.5 }}
        >
          {/* Logo — hides on mobile while the mobile search takeover is open */}
          <div
            onClick={() => navigate("/")}
            className={`relative z-10 items-center mr-8 lg:mr-12 ${
              mobileSearchOpen ? "hidden lg:flex" : "flex"
            }`}
          >
            <img
              src={mainContent.logo}
              alt={mainContent.appName}
              className="h-18 lg:h-20 w-auto object-contain cursor-pointer"
            />
          </div>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            <CategoryMegaMenu categories={CATEGORIES} />
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="group relative flex items-center gap-1 px-3 py-2 text-[14.5px] font-medium rounded-(--whiold-radius-sm) transition-colors duration-200 hover:text-(--whiold-primary)"
                style={{ color: "var(--whiold-text-body)" }}
              >
                {link.label}
                {link.hasDropdown && (
                  <ChevronDown
                    size={16}
                    className="transition-transform duration-200 group-hover:rotate-180"
                  />
                )}
                <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 scale-x-0 origin-center rounded-full bg-(--whiold-primary) transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          
          {/* Right icons — desktop */}
          <div className="hidden lg:flex items-center gap-1">
            <IconButton
              className="transition-transform duration-200 hover:scale-110"
              onClick={() => navigate(isAuthenticated ? Router.HOME_PROFILE : Router.LOGIN)}
              sx={{
                color: "var(--whiold-text-body)",
                "&:hover": { backgroundColor: "var(--whiold-primary-soft)" },
              }}
            >
              <User size={19} />
            </IconButton>

            <IconButton
              onClick={() => navigate("/wishlist")}
              className="transition-transform duration-200 hover:scale-110"
              title="Favorite"
              sx={{
                color: "var(--whiold-text-body)",
                "&:hover": { backgroundColor: "var(--whiold-primary-soft)" },
              }}
            >
              <Badge
                badgeContent={wishlistCount}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "var(--whiold-primary)",
                    color: "#fff",
                    fontSize: "10px",
                    height: "16px",
                    minWidth: "16px",
                  },
                }}
              >
                <Heart size={19} />
              </Badge>
            </IconButton>

            <IconButton
              onClick={() => navigate("/cart")}
              className="transition-transform duration-200 hover:scale-110"
              title="Cart"
              sx={{
                color: "var(--whiold-text-body)",
                "&:hover": { backgroundColor: "var(--whiold-primary-soft)" },
              }}
            >
              <Badge
                badgeContent={cartCount}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "var(--whiold-primary)",
                    color: "#fff",
                    fontSize: "10px",
                    height: "16px",
                    minWidth: "16px",
                  },
                }}
              >
                <ShoppingBag size={19} />
              </Badge>
            </IconButton>

            <ButtonComponent
              onClick={() => navigate(isAuthenticated ? "/shopping" : "/login")}
              size="small"
              sx={{ ml: 1.5 }}
            >
              Shop Now
            </ButtonComponent>
          </div>

          {/* Mobile row — icons OR the in-navbar search takeover */}
          <div className="flex lg:hidden items-center flex-1 ml-auto justify-end">
            <AnimatePresence mode="wait" initial={false}>
              {mobileSearchOpen ? (
                <motion.div
                  key="mobile-search-bar"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center w-full gap-2"
                >
                  {/* Gradient-bordered glassy pill search */}
                  <div
                    className="relative flex-1 rounded-full"
                    style={{
                      background: "var(--whiold-gradient-brand)",
                      padding: "1.5px",
                      boxShadow: "var(--whiold-shadow-focus)",
                    }}
                  >
                    <div
                      className="flex items-center w-full rounded-full px-4"
                      style={{
                        height: "46px",
                        backgroundColor: "rgba(255,255,255,0.97)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                      }}
                    >
                      <Search
                        size={18}
                        className="shrink-0"
                        style={{ color: "var(--whiold-primary)" }}
                      />
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search for products, brands..."
                        className="w-full bg-transparent border-none outline-none px-3 text-[14.5px]"
                        style={{ color: "var(--whiold-text-heading)" }}
                      />
                    </div>
                  </div>

                  <IconButton
                    onClick={() => setMobileSearchOpen(false)}
                    sx={{
                      backgroundColor: "var(--whiold-primary-soft)",
                      color: "var(--whiold-primary)",
                      width: 42,
                      height: 42,
                      flexShrink: 0,
                    }}
                  >
                    <X size={18} />
                  </IconButton>
                </motion.div>
              ) : (
                <motion.div
                  key="mobile-default-icons"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1"
                >
                  <IconButton
                    onClick={() => setMobileSearchOpen(true)}
                    className="transition-transform duration-200 active:scale-90"
                    sx={{ color: "var(--whiold-text-body)" }}
                  >
                    <Search size={20} />
                  </IconButton>

                  <IconButton
                    onClick={() => navigate("/cart")}
                    sx={{ color: "var(--whiold-text-body)" }}
                  >
                    <Badge
                      badgeContent={cartCount}
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: "var(--whiold-primary)",
                          color: "#fff",
                          fontSize: "9px",
                          height: "15px",
                          minWidth: "15px",
                        },
                      }}
                    >
                      <ShoppingBag size={20} />
                    </Badge>
                  </IconButton>

                  <IconButton
                    onClick={() => setMobileOpen(true)}
                    sx={{ color: "var(--whiold-text-heading)" }}
                  >
                    <MenuIcon size={22} />
                  </IconButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: "80%",
            maxWidth: "340px",
            background: "var(--whiold-gradient-panel)",
          },
        }}
      >
        <div className="flex flex-col h-full px-6 py-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <span
              className="text-2xl font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--whiold-gradient-brand)" }}
            >
              Whiold
            </span>
            <IconButton
              onClick={() => setMobileOpen(false)}
              sx={{ color: "var(--whiold-text-heading)" }}
            >
              <X size={22} />
            </IconButton>
          </div>

          <InputBase
            placeholder="Search products..."
            startAdornment={
              <Search
                size={17}
                style={{ marginRight: 8, color: "var(--whiold-text-muted)" }}
              />
            }
            sx={{
              height: "46px",
              px: 2,
              mb: 3,
              borderRadius: "var(--whiold-radius-sm)",
              backgroundColor: "var(--whiold-input-bg)",
              border: "1px solid var(--whiold-border)",
              fontSize: "14px",
            }}
          />

          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="group flex items-center justify-between px-3 py-3.5 rounded-(--whiold-radius-sm) text-[15px] font-medium transition-colors duration-200 hover:text-(--whiold-primary) hover:bg-(--whiold-primary-soft)"
                style={{ color: "var(--whiold-text-body)" }}
              >
                {link.label}
                {link.hasDropdown && (
                  <ChevronDown
                    size={16}
                    className="transition-transform duration-200 group-hover:rotate-180"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* ---------- Shop by Category — mobile accordion, reuses shared CATEGORIES data ---------- */}
          <button
            onClick={() => setMobileCatOpen((v) => !v)}
            className="group flex items-center justify-between px-3 py-3.5 mt-1 rounded-(--whiold-radius-sm) text-[15px] font-medium transition-colors duration-200 hover:text-(--whiold-primary) hover:bg-(--whiold-primary-soft)"
            style={{ color: "var(--whiold-text-body)" }}
          >
            Shop by Category
            <ChevronDown
              size={16}
              className="transition-transform duration-200"
              style={{ transform: mobileCatOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>

          <AnimatePresence initial={false}>
            {mobileCatOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden pl-3"
              >
                {CATEGORIES.map((cat) => {
                  const catSlug = cat.slug || cat.id;
                  const isSubOpen = openSubCat[cat.id];
                  const subList = Array.isArray(cat.subcategories) ? cat.subcategories : [];

                  return (
                    <div key={cat.id} className="flex flex-col border-b border-[var(--whiold-border)]/40 last:border-b-0 py-1">
                      <div className="flex items-center justify-between py-1.5 transition-colors duration-200">
                        <Link
                          to={`/category/${catSlug}`}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 text-[14px] font-medium flex-1 hover:text-[var(--whiold-primary)]"
                          style={{ color: "var(--whiold-text-heading)" }}
                        >
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-9 h-9 rounded-full object-cover shrink-0 border border-[var(--whiold-border)]"
                          />
                          <span>{cat.name}</span>
                        </Link>
                        {subList.length > 0 && (
                          <button
                            onClick={(e) => toggleSubCat(cat.id, e)}
                            className="p-2 text-gray-500 hover:text-[var(--whiold-primary)]"
                          >
                            <ChevronDown
                              size={16}
                              className={`transition-transform duration-200 ${
                                isSubOpen ? "rotate-180 text-[var(--whiold-primary)]" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      <AnimatePresence initial={false}>
                        {isSubOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-12 flex flex-col gap-1 pb-2"
                          >
                            {subList.map((sub, sIdx) => {
                              const subName = typeof sub === "string" ? sub : sub.name;
                              const subKey = typeof sub === "string" ? `${cat.id}-${sIdx}` : (sub.id || sub.name);

                              return (
                                <Link
                                  key={subKey}
                                  to={`/category/${catSlug}?sub=${encodeURIComponent(subName)}`}
                                  onClick={() => setMobileOpen(false)}
                                  className="text-[13px] py-1 text-[var(--whiold-text-muted)] hover:text-[var(--whiold-primary)] transition-colors"
                                >
                                  {subName}
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          <Divider sx={{ my: 3, borderColor: "var(--whiold-border)" }} />

          <div className="flex items-center gap-3 mb-6">
            <IconButton
              className="transition-transform duration-200 hover:scale-110"
              onClick={() => navigate(isAuthenticated ? Router.HOME_PROFILE : Router.LOGIN)}
              sx={{
                backgroundColor: "var(--whiold-primary-soft)",
                color: "var(--whiold-primary)",
              }}
            >
              <User size={18} />
            </IconButton>
            <IconButton
              onClick={() => navigate("/wishlist")}
              className="transition-transform duration-200 hover:scale-110"
              sx={{
                backgroundColor: "var(--whiold-primary-soft)",
                color: "var(--whiold-primary)",
              }}
            >
              <Badge
                badgeContent={wishlistCount}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "var(--whiold-primary)",
                    color: "#fff",
                    fontSize: "9px",
                    height: "15px",
                    minWidth: "15px",
                  },
                }}
              >
                <Heart size={18} />
              </Badge>
            </IconButton>
          </div>

          <div className="mt-auto">
            <ButtonComponent
              onClick={() => navigate(isAuthenticated ? "/shopping" : "/login")}
              fullWidth
            >
              Shop Now
            </ButtonComponent>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;