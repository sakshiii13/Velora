import React, { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown, Sparkles, ChevronRight } from "lucide-react";
import { CATEGORIES as DEFAULT_CATEGORIES } from "./CategoryData";

export default function CategoryMegaMenu({ categories = [] }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);
  const navigate = useNavigate();

  // Use provided categories if non-empty, otherwise fallback to curated CATEGORIES
  const categoryList =
    Array.isArray(categories) && categories.length > 0
      ? categories
      : DEFAULT_CATEGORIES;

  const handleEnter = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  };

  const handleCategoryClick = (catSlug) => {
    setOpen(false);
    navigate(`/category/${catSlug}`);
  };

  const handleSubcategoryClick = (catSlug, subName) => {
    setOpen(false);
    navigate(`/category/${catSlug}?sub=${encodeURIComponent(subName)}`);
  };

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* ---------- Trigger ---------- */}
      <button
        type="button"
        className="group relative flex items-center gap-1.5 px-3.5 py-2 text-[14.5px] font-semibold rounded-[var(--whiold-radius-sm)] transition-all duration-200 cursor-pointer select-none"
        style={{
          color: open ? "var(--whiold-primary)" : "var(--whiold-text-heading)",
        }}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>Categories</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="inline-flex text-[var(--whiold-primary)]"
        >
          <ChevronDown size={15} />
        </motion.span>

        {/* Bottom indicator underline */}
        <span
          className="absolute left-3 right-3 -bottom-0.5 h-[2.5px] rounded-full bg-[var(--whiold-primary)] origin-center transition-transform duration-300 ease-out"
          style={{ transform: open ? "scaleX(1)" : "scaleX(0)" }}
        />
      </button>

      {/* ---------- Mega Menu Panel ---------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.985 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 w-[1040px] max-w-[calc(100vw-32px)] z-50 overflow-hidden rounded-[var(--whiold-radius-lg)] border border-[var(--whiold-border)] bg-[rgba(255,255,255,0.98)] shadow-[0_24px_50px_-12px_rgba(59,33,21,0.2)] backdrop-blur-2xl before:absolute before:-top-3 before:inset-x-0 before:h-3 before:content-['']"
          >
            {/* Top luxury highlight bar */}
            <div
              className="h-[3px] w-full"
              style={{ background: "var(--whiold-gradient-brand)" }}
            />

            {/* 5-Column Grid */}
            <div className="grid grid-cols-5 divide-x divide-[var(--whiold-border)]/50 p-3 sm:p-5">
              {categoryList.map((cat, i) => {
                const catSlug = cat.slug || cat.id;
                const subList = Array.isArray(cat.subcategories)
                  ? cat.subcategories
                  : [];

                return (
                  <motion.div
                    key={cat.id || cat.name}
                    className="flex flex-col px-3.5 py-2"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: 0.03 * i }}
                  >
                    {/* Featured Category Card Link */}
                    <div
                      onClick={() => handleCategoryClick(catSlug)}
                      className="group cursor-pointer block mb-3.5"
                    >
                      <div className="relative h-28 w-full overflow-hidden rounded-[var(--whiold-radius-md)] border border-[var(--whiold-border)]/60 bg-[var(--whiold-bg-soft)] shadow-xs transition-all duration-300 group-hover:border-[var(--whiold-primary)] group-hover:shadow-md">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
                          loading="lazy"
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/80"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-2.5 flex items-end justify-between">
                          <span className="text-[13px] font-bold tracking-wide text-white uppercase drop-shadow-xs">
                            {cat.name}
                          </span>
                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-white/20 backdrop-blur-xs text-white transition-all duration-300 group-hover:bg-[var(--whiold-primary)] group-hover:translate-x-0.5">
                            <ChevronRight size={12} />
                          </span>
                        </div>
                      </div>

                      <div className="mt-1 flex items-center justify-between">
                        <span
                          className="text-[14px] font-bold tracking-tight text-[var(--whiold-text-heading)] transition-colors group-hover:text-[var(--whiold-primary)]"
                          style={{ fontFamily: "'Fraunces', serif" }}
                        >
                          {cat.name}
                        </span>
                        <span className="text-[11px] font-medium text-[var(--whiold-text-muted)] group-hover:text-[var(--whiold-primary)] flex items-center gap-0.5">
                          Explore
                          <ArrowRight
                            size={10}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </span>
                      </div>
                    </div>

                    {/* Subcategories list */}
                    <ul className="flex flex-col gap-1.5 flex-1">
                      {subList.map((sub, sIdx) => {
                        const subName = typeof sub === "string" ? sub : sub.name;
                        const subKey =
                          typeof sub === "string" ? `${cat.id}-${sIdx}` : (sub.id || sub.name);

                        return (
                          <li key={subKey}>
                            <button
                              type="button"
                              onClick={() => handleSubcategoryClick(catSlug, subName)}
                              className="group/item flex w-full items-center justify-between py-1 px-1.5 rounded-[6px] text-left text-[12.5px] font-medium text-[var(--whiold-text-body)] transition-all duration-200 hover:text-[var(--whiold-primary)] hover:bg-[var(--whiold-primary-soft)] hover:translate-x-1 cursor-pointer"
                            >
                              <span className="truncate">{subName}</span>
                              <ChevronRight
                                size={12}
                                className="opacity-0 transition-all duration-200 group-hover/item:opacity-100 text-[var(--whiold-primary)] shrink-0"
                              />
                            </button>
                          </li>
                        );
                      })}
                    </ul>

                    {/* View full category link */}
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(catSlug)}
                      className="mt-3 pt-2 border-t border-[var(--whiold-border)]/40 flex items-center gap-1 text-[11px] font-semibold text-[var(--whiold-primary)] hover:text-[var(--whiold-primary-hover)] transition-colors cursor-pointer"
                    >
                      All {cat.name}
                      <ArrowRight size={10} />
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Luxury Footer Strip */}
            <div
              className="flex items-center justify-between border-t border-[var(--whiold-border)] px-6 py-3"
              style={{
                background: "var(--whiold-bg-soft)",
              }}
            >
              <div className="flex items-center gap-2 text-[12.5px] text-[var(--whiold-text-body)] font-medium">
                <Sparkles size={14} className="text-[var(--whiold-primary)]" />
                <span>
                  Whiold Atelier · Handcrafted fabrics & contemporary silhouettes
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  to="/collections"
                  onClick={() => setOpen(false)}
                  className="text-[12px] font-semibold text-[var(--whiold-text-body)] hover:text-[var(--whiold-primary)] transition-colors"
                >
                  Seasonal Lookbook
                </Link>
                <Link
                  to="/shopping"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[12px] font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "var(--whiold-gradient-brand)" }}
                >
                  View All Products
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
