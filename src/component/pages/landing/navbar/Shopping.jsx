import { useState, useMemo, useEffect } from "react";
import {
  Drawer,
  Slider,
  Checkbox,
  Menu,
  MenuItem,
  Skeleton,
  Box,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Check,
  ShoppingBag,
  SearchX,
} from "lucide-react";

import ButtonComponent from "../../../ui/ButtonComponent";
import ProductCard from "../ProductCard";
import { useCart } from "../../../../context/CartContext";

/* ------------------------------------------------------------------ */
/* Sample data — replace with your real catalog / API response.        */
/* ------------------------------------------------------------------ */

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

import {
  getAllProducts,
  getProductsByCategory,
  getProductsByCategoryAndSub,
} from "../../../../api/user/products.api";
import { useAuth } from "../../../../context/AuthContext";
import { useSnackbar } from "../../../../context/SnackBarContext";
import { useLocation } from "react-router-dom";

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */
const FilterChip = ({ label, onRemove }) => (
  <button
    onClick={onRemove}
    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
    style={{
      background: "var(--whiold-primary-soft)",
      color: "var(--whiold-700)",
      border: "1px solid var(--whiold-border)",
    }}
  >
    {label}
    <X size={12} />
  </button>
);

const SectionTitle = ({ children }) => (
  <p
    className="mb-3 text-[13px] font-semibold"
    style={{ color: "var(--whiold-text-heading)" }}
  >
    {children}
  </p>
);

const EmptyState = ({ onClear }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
    <div
      className="flex h-16 w-16 items-center justify-center rounded-full"
      style={{ background: "var(--whiold-bg-soft)" }}
    >
      <SearchX size={26} style={{ color: "var(--whiold-500)" }} />
    </div>
    <div>
      <h3
        className="text-base font-semibold"
        style={{ color: "var(--whiold-text-heading)" }}
      >
        No products match your filters
      </h3>
      <p className="mt-1 text-sm" style={{ color: "var(--whiold-text-muted)" }}>
        Try removing a few filters to see more results.
      </p>
    </div>
    <ButtonComponent variant="outlined" size="small" onClick={onClear}>
      Clear all filters
    </ButtonComponent>
  </div>
);

/* ------------------------------------------------------------------ */
/* Main page                                                            */
/* ------------------------------------------------------------------ */
const Shopping = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortAnchor, setSortAnchor] = useState(null);
  const [sortBy, setSortBy] = useState("featured");

  const [activePill, setActivePill] = useState("All");
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const { addToCart } = useCart();
  const [allProducts, setAllProducts] = useState([]);

  const dynamicCategories = useMemo(() => {
    const cats = new Set(allProducts.map((p) => p.category).filter(Boolean));
    return Array.from(cats);
  }, [allProducts]);

  const dynamicSizes = useMemo(() => {
    const szs = new Set();
    allProducts.forEach((p) => {
      if (Array.isArray(p.sizes)) {
        p.sizes.forEach((s) => szs.add(s));
      }
    });
    return Array.from(szs);
  }, [allProducts]);

  const dynamicColors = useMemo(() => {
    const cls = new Map();
    allProducts.forEach((p) => {
      if (Array.isArray(p.colors)) {
        p.colors.forEach((c) => {
          if (c && c.name && c.hex) {
            cls.set(c.name, c);
          }
        });
      }
    });
    return Array.from(cls.values());
  }, [allProducts]);

  const maxProductPrice = useMemo(() => {
    if (allProducts.length === 0) return 5000;
    const max = Math.max(...allProducts.map((p) => p.price || 0));
    return Math.ceil(max / 100) * 100 || 5000;
  }, [allProducts]);

  useEffect(() => {
    setPriceRange([0, maxProductPrice]);
  }, [maxProductPrice]);
  const { showLoader, hideLoader } = useAuth();
  const { showSnackbar } = useSnackbar();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const { state } = useLocation();

  const categoryName = state?.categoryName?.name;
  const subCategoryName = state?.subCategoryName?.name;
  const subCategoryNameId = state?.subCategoryName?._id;
  const categoryNameId = state?.categoryName?._id;

  const onlyCategory = categoryName && subCategoryName === undefined;
  const bothCatAndSub =
    categoryName !== undefined && subCategoryName !== undefined;

  useEffect(() => {
    (async () => {
      try {
        let res;
        if (bothCatAndSub) {
          res = await getProductsByCategoryAndSub(
            categoryNameId,
            subCategoryNameId,
          );
        } else if (onlyCategory) {
          res = await getProductsByCategory(categoryNameId);
        } else {
          res = await getAllProducts();
        }

        if (res?.success || Array.isArray(res?.data) || Array.isArray(res)) {
          let list = [];
          if (Array.isArray(res?.data)) list = res.data;
          else if (Array.isArray(res?.data?.data)) list = res.data.data;
          else if (Array.isArray(res)) list = res;

          const mapped = list.map((p) => {
            const brand = p.brand;
            const brandName =
              typeof brand === "object" && brand !== null
                ? brand.title || brand.name
                : brand;
            const cat = p.category;
            const catName =
              typeof cat === "object" && cat !== null
                ? cat.title || cat.name
                : cat;

            const imgs =
              p.images?.length > 0 ? p.images : p.image ? [p.image] : [];
            const imageList = imgs
              .map((img) => {
                if (typeof img === "object" && img !== null)
                  return img.imageUrl || img.url || img.image || "";
                return img || "";
              })
              .filter(Boolean);

            return {
              id: p._id,
              name: p.name || p.title,
              brand: brandName || "Whiold Basics",
              category: catName || "Fashion",
              price: p.price,
              originalPrice: p.mrp,
              rating: p.rating || 4.5,
              reviewCount: p.reviewCount || 0,
              description: p.description,
              images: imageList.length > 0 ? imageList : [""],
              badge: p.featured ? "Featured" : p.discount > 0 ? "Sale" : "",
              colors: p.colors || [],
              sizes: p.variants
                ? p.variants.map((v) => v.spec).filter(Boolean)
                : p.sizes || [],
            };
          });
          setAllProducts(mapped);
        }
      } catch (err) {
        console.error(err);
        showSnackbar(err?.message || "Internal Server Error!");
      }
    })();
  }, [state, categoryNameId, subCategoryNameId, bothCatAndSub, onlyCategory]);

  // initial page load skeleton — waits for the app boot loader to finish
  // first (if present), then shows the skeleton for a bit so it's actually
  // visible instead of being hidden behind the full-page boot loader.
  useEffect(() => {
    let timeoutId;

    const startSkeletonTimer = () => {
      timeoutId = setTimeout(() => setIsLoading(false), 700);
    };

    const bootLoaderEl = document.getElementById("whiold-boot-loader");
    if (!bootLoaderEl) {
      // no boot loader on screen (e.g. client-side route change) — start immediately
      startSkeletonTimer();
    } else {
      window.addEventListener("whiold:boot-loader-done", startSkeletonTimer, {
        once: true,
      });
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("whiold:boot-loader-done", startSkeletonTimer);
    };
  }, []);

  // brief skeleton whenever filters/sort/category change
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePill, categories, priceRange, colors, sizes, sortBy]);

  const toggle = (list, setList, value) =>
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    );

  const filtered = useMemo(() => {
    let list = allProducts.filter((p) => {
      if (activePill !== "All" && p.category !== activePill) return false;
      if (categories.length && !categories.includes(p.category)) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (colors.length && !p.colors?.some((c) => colors.includes(c.name)))
        return false;
      if (sizes.length && !p.sizes?.some((s) => sizes.includes(s)))
        return false;
      return true;
    });

    if (sortBy === "price-asc")
      list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc")
      list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "newest") list = [...list].sort((a, b) => b.id - a.id);

    return list;
  }, [allProducts, activePill, categories, priceRange, colors, sizes, sortBy]);

  const activeFilterCount =
    categories.length +
    colors.length +
    sizes.length +
    (priceRange[0] > 0 || priceRange[1] < maxProductPrice ? 1 : 0);

  const clearAll = () => {
    setCategories([]);
    setColors([]);
    setSizes([]);
    setPriceRange([0, maxProductPrice]);
    setActivePill("All");
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--whiold-bg-soft)" }}
    >
      {/* ── page header ── */}
      <div
        style={{
          background: "var(--whiold-bg)",
          borderBottom: "1px solid var(--whiold-border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 pb-2 pt-8 md:px-10">
          <p
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--whiold-text-muted)" }}
          >
            Home / Shop
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <h1
              className="text-3xl font-semibold md:text-4xl"
              style={{ color: "var(--whiold-text-heading)" }}
            >
              {bothCatAndSub ? (
                <>
                  {categoryName}{" "}
                  <span className="text-[var(--whiold-primary)] text-2xl">
                    › {subCategoryName}
                  </span>
                </>
              ) : onlyCategory ? (
                <>
                  {categoryName}{" "}
                  <span className="text-[var(--whiold-text-muted)] text-xl">
                    Products
                  </span>
                </>
              ) : (
                "Shop All"
              )}
            </h1>
            <p className="text-sm" style={{ color: "var(--whiold-text-body)" }}>
              {!isLoading && `${filtered.length} products`}
            </p>
          </div>
        </div>

        {/* quick category pills — horizontal scroll, Pinterest-style */}
        <div className="mx-auto max-w-7xl overflow-x-auto px-6 py-4 md:px-10">
          <div className="flex w-max gap-2">
            {["All", ...dynamicCategories].map((cat) => {
              const active = activePill === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActivePill(cat)}
                  className="shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-colors"
                  style={
                    active
                      ? {
                          background: "var(--whiold-gradient-brand)",
                          color: "var(--whiold-text-on-primary)",
                        }
                      : {
                          background: "var(--whiold-bg-soft)",
                          color: "var(--whiold-text-body)",
                          border: "1px solid var(--whiold-border)",
                        }
                  }
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── sticky toolbar: filter trigger + sort ── */}
      <div
        className="sticky top-0 z-30 backdrop-blur"
        style={{
          background: "rgba(255,255,255,0.9)",
          borderBottom: "1px solid var(--whiold-border)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:px-10">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 rounded-[var(--whiold-radius-sm)] px-4 py-2 text-sm font-medium"
            style={{
              border: "1px solid var(--whiold-border)",
              color: "var(--whiold-text-heading)",
            }}
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold"
                style={{ background: "var(--whiold-500)", color: "#fff" }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          <button
            onClick={(e) => setSortAnchor(e.currentTarget)}
            className="flex items-center gap-1.5 text-sm font-medium"
            style={{ color: "var(--whiold-text-heading)" }}
          >
            Sort: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
            <ChevronDown size={15} />
          </button>

          <Menu
            anchorEl={sortAnchor}
            open={!!sortAnchor}
            onClose={() => setSortAnchor(null)}
          >
            {SORT_OPTIONS.map((o) => (
              <MenuItem
                key={o.value}
                selected={o.value === sortBy}
                onClick={() => {
                  setSortBy(o.value);
                  setSortAnchor(null);
                }}
                sx={{
                  fontSize: 14,
                  "&.Mui-selected": {
                    color: "var(--whiold-500)",
                    fontWeight: 600,
                  },
                }}
              >
                {o.label}
              </MenuItem>
            ))}
          </Menu>
        </div>

        {/* active filter chips */}
        {activeFilterCount > 0 && (
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-6 pb-3 md:px-10">
            {categories.map((c) => (
              <FilterChip
                key={c}
                label={c}
                onRemove={() => toggle(categories, setCategories, c)}
              />
            ))}
            {colors.map((c) => (
              <FilterChip
                key={c}
                label={c}
                onRemove={() => toggle(colors, setColors, c)}
              />
            ))}
            {sizes.map((s) => (
              <FilterChip
                key={s}
                label={`Size ${s}`}
                onRemove={() => toggle(sizes, setSizes, s)}
              />
            ))}
            <button
              onClick={clearAll}
              className="text-xs font-semibold underline"
              style={{ color: "var(--whiold-500)" }}
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── product grid ── */}
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from(new Array(8)).map((_, index) => (
              <Box key={index} sx={{ width: "100%" }}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={320}
                  sx={{ borderRadius: 2 }}
                />
                <Box sx={{ pt: 1.5 }}>
                  <Skeleton width="80%" height={24} />
                  <Skeleton width="50%" height={20} />
                  <Skeleton width="30%" height={24} sx={{ mt: 1 }} />
                </Box>
              </Box>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState onClear={clearAll} />
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── filter drawer, slides in from the left ── */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "340px !important",
            maxWidth: "85vw",
            background: "var(--whiold-bg)",
            boxSizing: "border-box",
            overflowX: "hidden",
          },
        }}
      >
        <div className="flex h-full flex-col">
          {/* header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid var(--whiold-border)" }}
          >
            <h2
              className="text-base font-semibold"
              style={{ color: "var(--whiold-text-heading)" }}
            >
              Filters
            </h2>
            <button
              onClick={() => setDrawerOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ background: "var(--whiold-bg-soft)" }}
            >
              <X size={16} style={{ color: "var(--whiold-text-heading)" }} />
            </button>
          </div>

          {/* scrollable body */}
          <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6">
            {/* category */}
            <div>
              <SectionTitle>Category</SectionTitle>
              <div className="space-y-2">
                {dynamicCategories.map((cat) => (
                  <label
                    key={cat}
                    className="flex cursor-pointer items-center gap-2.5"
                  >
                    <Checkbox
                      checked={categories.includes(cat)}
                      onChange={() => toggle(categories, setCategories, cat)}
                      size="small"
                      sx={{
                        color: "var(--whiold-border-hover)",
                        "&.Mui-checked": { color: "var(--whiold-500)" },
                        padding: "4px",
                      }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--whiold-text-body)" }}
                    >
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--whiold-border)" }} />

            {/* price range */}
            <div>
              <SectionTitle>Price Range</SectionTitle>
              <div className="px-1">
                <Slider
                  value={priceRange}
                  onChange={(_, v) => setPriceRange(v)}
                  min={0}
                  max={maxProductPrice}
                  step={maxProductPrice > 500 ? 50 : 5}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(v) => `₹${v}`}
                  sx={{
                    color: "var(--whiold-500)",
                    "& .MuiSlider-thumb": {
                      backgroundColor: "var(--whiold-bg)",
                      border: "2px solid var(--whiold-500)",
                      "&:hover, &.Mui-focusVisible": {
                        boxShadow: "0 0 0 8px var(--whiold-primary-ring)",
                      },
                    },
                    "& .MuiSlider-track": {
                      backgroundColor: "var(--whiold-500)",
                    },
                    "& .MuiSlider-rail": {
                      backgroundColor: "var(--whiold-border)",
                    },
                  }}
                />
                <div
                  className="mt-1 flex justify-between text-xs"
                  style={{ color: "var(--whiold-text-muted)" }}
                >
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--whiold-border)" }} />

            {/* colors */}
            {dynamicColors.length > 0 && (
              <>
                <div>
                  <SectionTitle>Color</SectionTitle>
                  <div className="flex flex-wrap gap-3">
                    {dynamicColors.map((c) => {
                      const active = colors.includes(c.name);
                      return (
                        <button
                          key={c.name}
                          onClick={() => toggle(colors, setColors, c.name)}
                          className="relative flex h-9 w-9 items-center justify-center rounded-full"
                          style={{
                            background: c.hex,
                            border: "2px solid var(--whiold-bg)",
                            boxShadow: "0 0 0 1px var(--whiold-border)",
                          }}
                          title={c.name}
                        >
                          {active && (
                            <Check
                              size={14}
                              strokeWidth={3}
                              style={{
                                color:
                                  c.name === "Ivory"
                                    ? "var(--whiold-700)"
                                    : "#fff",
                              }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--whiold-border)" }} />
              </>
            )}

            {/* sizes */}
            {dynamicSizes.length > 0 && (
              <>
                <div>
                  <SectionTitle>Size</SectionTitle>
                  <div className="flex flex-wrap gap-2">
                    {dynamicSizes.map((s) => {
                      const active = sizes.includes(s);
                      return (
                        <button
                          key={s}
                          onClick={() => toggle(sizes, setSizes, s)}
                          className="h-9 w-9 rounded-[var(--whiold-radius-sm)] text-xs font-medium"
                          style={
                            active
                              ? {
                                  background: "var(--whiold-gradient-brand)",
                                  color: "var(--whiold-text-on-primary)",
                                }
                              : {
                                  border: "1px solid var(--whiold-border)",
                                  color: "var(--whiold-text-heading)",
                                  background: "var(--whiold-bg)",
                                }
                          }
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--whiold-border)" }} />
              </>
            )}
          </div>

          {/* sticky footer */}
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{
              borderTop: "1px solid var(--whiold-border)",
              background: "var(--whiold-bg)",
            }}
          >
            <button
              onClick={clearAll}
              className="text-sm font-medium shrink-0"
              style={{ color: "var(--whiold-text-muted)" }}
            >
              Clear all
            </button>
            <ButtonComponent
              fullWidth
              onClick={() => setDrawerOpen(false)}
              sx={{ flexShrink: 1, minWidth: 0 }}
            >
              Show {filtered.length} results
            </ButtonComponent>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default Shopping;
