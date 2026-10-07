import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";

// ── Map a category slug to its dedicated landing page route.        ──
// ── As you build Women/Kids/Sports/Accessories, just add them here. ──
const CATEGORY_ROUTES = {
  men: "/category/men",
  // women: "/category/women",
  // kids: "/category/kids",
  // sports: "/category/sports",
  // accessories: "/category/accessories",
};

export default function CategoryMegaMenu({ categories = [] }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);

  // Small delay on mouseleave so moving from trigger -> panel doesn't flicker-close
  const handleEnter = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* ---------- Trigger — same size/color/underline language as NAV_LINKS ---------- */}
      <button
        className="group relative flex items-center gap-1 px-3 py-2 text-[14.5px] font-medium rounded-[var(--whiold-radius-sm)] transition-colors duration-200 hover:text-[var(--whiold-primary)]"
        style={{
          color: open ? "var(--whiold-primary)" : "var(--whiold-text-body)",
        }}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        Categories
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="inline-flex"
        >
          <ChevronDown size={15} />
        </motion.span>
        <span
          className="absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full bg-[var(--whiold-primary)] origin-center transition-transform duration-300 ease-out"
          style={{ transform: open ? "scaleX(1)" : "scaleX(0)" }}
        />
      </button>

      {/* ---------- Panel ---------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="whiold-megamenu-panel"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid grid-cols-5">
              {categories.map((cat, i) => {
                // If this category has a dedicated landing page, go there.
                // Otherwise fall back to the generic shop filter (unchanged behaviour).
                return (
                  <motion.div
                    key={cat.id}
                    className="whiold-megamenu-col p-5"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.04 * i }}
                  >
                    {/* Featured thumbnail — makes the menu feel visual, not just a text list */}
                    <Link to={`/shopping`} state={{ categoryName: { _id: cat.id, name: cat.name } }} onClick={() => setOpen(false)}>
                      <div className="rounded-[var(--whiold-radius-md)] overflow-hidden mb-3 h-24">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      <h4
                        className="text-sm font-semibold mb-2"
                        style={{ color: "var(--whiold-text-heading)" }}
                      >
                        {cat.name}
                      </h4>
                    </Link>

                    <ul className="space-y-1.5">
                      {cat.subcategories.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            to={`/shopping`}
                            state={{ categoryName: { _id: cat.id, name: cat.name }, subCategoryName: { _id: sub.id, name: sub.name } }}
                            onClick={() => setOpen(false)}
                            className="whiold-megamenu-sublink text-xs inline-block"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer strip — quick link to full shop */}
            <Link
              to="/shop"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 py-3 text-xs font-medium border-t"
              style={{
                borderColor: "var(--whiold-border)",
                background: "var(--whiold-bg-soft)",
                color: "var(--whiold-primary)",
              }}
            >
              View all products <ArrowRight size={13} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
