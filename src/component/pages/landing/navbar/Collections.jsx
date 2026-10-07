import { useRef, useMemo } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MoveHorizontal, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const COLLECTIONS = [
  {
    id: "wedding-edit",
    title: "The Wedding Edit",
    tagline: "Heirloom silhouettes, reimagined",
    count: 42,
    slug: "wedding-edit",
    image:
      "https://images.unsplash.com/photo-1610189844343-9c4f79952c53?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "festive-luxe",
    title: "Festive Luxe",
    tagline: "Zari, velvet & warm gold",
    count: 36,
    slug: "festive-luxe",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "contemporary-fusion",
    title: "Contemporary Fusion",
    tagline: "Drapes for the modern day",
    count: 51,
    slug: "contemporary-fusion",
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "minimal-essentials",
    title: "Minimal Essentials",
    tagline: "Quiet luxury, everyday",
    count: 28,
    slug: "minimal-essentials",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "winter-drapes",
    title: "Winter Drapes",
    tagline: "Layered warmth, rich texture",
    count: 19,
    slug: "winter-drapes",
    image:
      "https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?q=80&w=1200&auto=format&fit=crop",
  },
];

/* ---------- Animation variants ---------- */
const headingWord = {
  hidden: { y: "110%" },
  show: (i) => ({
    y: "0%",
    transition: { duration: 0.7, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] },
  }),
};

function CollectionTag({ item, index, prefersReducedMotion }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-10% 0px" });

  // Every tag settles at a slightly different resting angle and
  // idle-sways at a slightly different pace, so the row reads as
  // a real rail of hand-hung tags, not a repeated component.
  const restAngle = useMemo(() => (index % 2 === 0 ? -1.4 : 1.6), [index]);
  const swayDuration = useMemo(() => 4.6 + index * 0.35, [index]);

  return (
    <div
      className="whiold-collections-card"
      style={{ width: 280, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* Ring on the rail */}
      <div
        aria-hidden="true"
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          border: "2px solid var(--whiold-900)",
          background: "var(--whiold-50, #fff)",
          marginTop: -7,
          zIndex: 2,
        }}
      />
      {/* Thread */}
      <div
        aria-hidden="true"
        style={{ width: 1.5, height: 22, background: "var(--whiold-900)", opacity: 0.5 }}
      />

      <motion.div
        ref={cardRef}
        style={{
          width: "100%",
          borderRadius: "var(--whiold-radius-lg)",
          boxShadow: "var(--whiold-shadow-card)",
          overflow: "hidden",
          background: "var(--whiold-100)",
          transformOrigin: "top center",
          willChange: "transform",
        }}
        initial={{ rotate: 0 }}
        animate={
          prefersReducedMotion
            ? { rotate: restAngle }
            : {
                rotate: [restAngle - 1.1, restAngle + 1.1, restAngle - 1.1],
              }
        }
        transition={
          prefersReducedMotion
            ? { duration: 0.4 }
            : { duration: swayDuration, repeat: Infinity, ease: "easeInOut" }
        }
        whileHover={{ rotate: 0, y: -8, transition: { type: "spring", stiffness: 220, damping: 16 } }}
      >
        <Link to={`/shop?collection=${item.slug}`} className="block">
          {/* ---------- Image + folded-corner reveal ---------- */}
          <div className="relative h-[320px] overflow-hidden">
            <motion.img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover"
              initial={{ scale: 1.14 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.06 }}
            />

            {/* Folded fabric corner — peels open diagonally instead of sliding curtains */}
            <motion.div
              aria-hidden="true"
              initial={{ clipPath: "polygon(0% 0%, 100% 0%, 0% 100%)" }}
              animate={
                isInView
                  ? { clipPath: "polygon(0% 0%, 0% 0%, 0% 0%)" }
                  : {}
              }
              transition={{ duration: 0.85, delay: 0.12 * index, ease: [0.65, 0, 0.35, 1] }}
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, var(--whiold-900) 0%, var(--whiold-900) 55%, var(--whiold-gradient-brand) 100%)",
                boxShadow: "inset -6px -6px 14px rgba(0,0,0,0.25)",
              }}
            />

            {/* Small drop number, styled as a stitched fabric label — not a floating glass pill */}
            <span
              className="absolute top-4 left-4 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em]"
              style={{
                background: "var(--whiold-100)",
                color: "var(--whiold-900)",
                borderBottom: "2px dashed rgba(43,33,25,0.3)",
              }}
            >
              Drop {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* ---------- Paper label footer (no blur, no glass) ---------- */}
          <div className="px-5 py-4" style={{ borderTop: "1px dashed rgba(43,33,25,0.25)" }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold mb-0.5" style={{ color: "var(--whiold-900)" }}>
                  {item.title}
                </h3>
                <p className="text-sm" style={{ color: "var(--whiold-900)", opacity: 0.65 }}>
                  {item.tagline}
                </p>
              </div>
              <motion.span
                whileHover={{ x: 3, y: -3 }}
                className="flex-shrink-0 rounded-full p-1.5"
                style={{ background: "var(--whiold-gradient-brand)", marginTop: 2 }}
              >
                <ArrowUpRight size={15} color="var(--whiold-text-on-primary)" />
              </motion.span>
            </div>
            <p
              className="mt-2 text-xs uppercase tracking-[0.1em]"
              style={{ color: "var(--whiold-900)", opacity: 0.45 }}
            >
              {item.count} pieces
            </p>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}

/* ============================================================
   MAIN EXPORT
   ============================================================ */
export default function Collections() {
  const trackRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden">
      {/* ---------- FIXED BACKGROUND ---------- */}
      <div className="whiold-collections-bg" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1594633313739-9dabdaa8e5aa?q=80&w=1920&auto=format&fit=crop"
          alt=""
        />
        <div className="whiold-collections-scrim" />
        <div className="whiold-collections-grain" />
      </div>

      {/* ---------- CONTENT ---------- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="uppercase tracking-[0.25em] text-lg font-medium mb-4"
          style={{ color: "var(--whiold-900)" }}
        >
          Whiold &nbsp;·&nbsp; Atelier Drops
        </motion.p>

        <h2
          className="flex flex-wrap gap-x-3 text-4xl md:text-6xl font-semibold mb-4 leading-[1.05]"
          style={{ color: "var(--whiold-text-on-primary)" }}
        >
          {["Curated,", "not", "catalogued."].map((word, i) => (
            <span key={word} className="overflow-hidden inline-block">
              <motion.span
                custom={i}
                initial="hidden"
                animate="show"
                variants={headingWord}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-md text-base mb-10"
          style={{ color: "var(--whiold-200)" }}
        >
          Five drops, each built around a single idea — from wedding heirlooms
          to everyday minimalism. Scroll sideways to browse the rail.
        </motion.p>

        <div
          className="flex items-center gap-2 mb-8 text-xs md:hidden"
          style={{ color: "var(--whiold-300)" }}
        >
          <MoveHorizontal size={14} />
          Swipe to browse the rail
        </div>

        {/* ---------- The rail itself ---------- */}
        <div
          aria-hidden="true"
          style={{
            height: 3,
            borderRadius: 2,
            marginBottom: -1,
            background:
              "linear-gradient(90deg, transparent, var(--whiold-900) 6%, var(--whiold-gradient-brand) 50%, var(--whiold-900) 94%, transparent)",
            boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
          }}
        />

        {/* ---------- Horizontal snap-scroll gallery ---------- */}
        <div ref={trackRef} className="whiold-collections-track" style={{ alignItems: "flex-start" }}>
          {COLLECTIONS.map((item, i) => (
            <CollectionTag
              key={item.id}
              item={item}
              index={i}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}

          {/* Trailing "view all" tag — same rail, same hook, plain label instead of a card */}
          <div style={{ width: 220, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              aria-hidden="true"
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: "2px solid var(--whiold-900)",
                marginTop: -7,
              }}
            />
            <div aria-hidden="true" style={{ width: 1.5, height: 22, background: "var(--whiold-900)", opacity: 0.5 }} />
            <Link
              to="/shop"
              className="flex flex-col items-center justify-center gap-3 text-center w-full"
              style={{
                height: 320,
                borderRadius: "var(--whiold-radius-lg)",
                border: "1.5px dashed rgba(242,225,217,0.35)",
                color: "var(--whiold-100)",
              }}
            >
              <Plus size={22} />
              <span className="text-base font-medium">View the full rail</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}