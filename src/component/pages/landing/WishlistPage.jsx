import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, X, ArrowRight, PackageX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../../context/WishlistContext"; // apna actual relative path
import { useCart } from "../../../context/CartContext";
import { Router } from "../../../constants/router";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 36, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const WishlistCard = ({ item, onRemove, onMoveToBag }) => {
  const navigate = useNavigate();
  const discount =
    item.originalPrice && item.originalPrice > item.price
      ? Math.round(
          ((item.originalPrice - item.price) / item.originalPrice) * 100,
        )
      : null;

  return (
    <motion.div
      layout
      variants={cardVariants}
      exit="exit"
      onClick={() =>
        navigate(Router.PRODUCT_DETAIL.replace(":id", item.id), {
          state: { product: item },
        })
      }
      className="group relative flex flex-col overflow-hidden rounded-[16px] sm:rounded-[22px] transition-shadow duration-300 hover:shadow-xl"
      style={{
        background: "var(--whiold-bg-soft)",
        border: "1px solid var(--whiold-border)",
      }}
    >
      <div
        className="absolute left-2.5 sm:left-4 top-0 z-20 flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[11px] font-semibold uppercase tracking-wider text-white"
        style={{
          background: "var(--whiold-600)",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
        }}
      >
        <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current" />
        Saved
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(item.id);
        }}
        aria-label="Remove from wishlist"
        className="absolute right-2 sm:right-3 top-2 sm:top-3 z-20 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full opacity-100 sm:opacity-0 backdrop-blur-md transition-all duration-300 sm:group-hover:opacity-100"
        style={{ background: "rgba(0,0,0,0.35)" }}
      >
        <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
      </button>

      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        {!item.inStock && (
          <div
            className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]"
            style={{ background: "rgba(0,0,0,0.4)" }}
          >
            <span className="rounded-full bg-white px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-neutral-800">
              Out of stock
            </span>
          </div>
        )}
        {discount && item.inStock && (
          <span
            className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-bold text-white"
            style={{ background: "var(--whiold-500)" }}
          >
            {discount}% off
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 sm:gap-2 p-3 pt-4 sm:p-4 sm:pt-5">
        <p
          className="text-[9px] sm:text-[11px] uppercase tracking-wider"
          style={{ color: "var(--whiold-text-muted)" }}
        >
          {item.category}
        </p>
        <h3
          className="text-xs sm:text-sm font-semibold leading-snug line-clamp-2"
          style={{ color: "var(--whiold-text-heading)" }}
        >
          {item.name}
        </h3>

        <div className="mt-0.5 sm:mt-1 flex flex-wrap items-baseline gap-1.5 sm:gap-2">
          <span
            className="text-sm sm:text-base font-bold"
            style={{ color: "var(--whiold-700)" }}
          >
            ₹{item.price.toLocaleString("en-IN")}
          </span>
          {item.originalPrice && (
            <span
              className="text-[10px] sm:text-xs line-through"
              style={{ color: "var(--whiold-text-muted)" }}
            >
              ₹{item.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveToBag(item);
          }}
          disabled={!item.inStock}
          className="mt-2 sm:mt-3 flex items-center justify-center gap-1.5 sm:gap-2 rounded-full py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: "var(--whiold-600)" }}
        >
          <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          {item.inStock ? "Move to bag" : "Notify me"}
        </button>
      </div>
    </motion.div>
  );
};

const EmptyWishlist = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center gap-3 sm:gap-4 rounded-[20px] sm:rounded-[28px] px-4 py-16 sm:py-24 text-center"
      style={{
        background: "var(--whiold-bg-soft)",
        border: "1px dashed var(--whiold-border)",
      }}
    >
      <div
        className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full"
        style={{
          background: "color-mix(in srgb, var(--whiold-500) 15%, transparent)",
        }}
      >
        <PackageX className="h-6 w-6 sm:h-7 sm:w-7" style={{ color: "var(--whiold-600)" }} />
      </div>

      <h3
        className="text-base sm:text-lg font-semibold"
        style={{ color: "var(--whiold-text-heading)" }}
      >
        Your wishlist is empty
      </h3>

      <p
        className="max-w-xs text-xs sm:text-sm"
        style={{ color: "var(--whiold-text-body)" }}
      >
        Tap the heart on anything you love and it'll show up here.
      </p>

      <button
        className="mt-1 sm:mt-2 flex items-center gap-2 rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white transition-transform duration-300 hover:scale-105"
        style={{ background: "var(--whiold-600)" }}
        onClick={() => navigate("/shopping")}
      >
        Explore products
        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </button>
    </motion.div>
  );
};

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleRemove = (id) => removeFromWishlist(id);

  const handleMoveToBag = (item) => {
    addToCart(item);
    removeFromWishlist(item.id);
  };

  const inStockCount = wishlist.filter((i) => i.inStock).length;
  const onSaleCount = wishlist.filter(
    (i) => i.originalPrice && i.originalPrice > i.price,
  ).length;

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden py-8 sm:py-16"
      style={{ background: "var(--whiold-bg)" }}
    >
      <div
        className="pointer-events-none absolute -left-16 sm:-left-32 top-0 h-40 w-40 sm:h-72 sm:w-72 rounded-full blur-3xl"
        style={{ background: "var(--whiold-500)", opacity: 0.14 }}
      />
      <div
        className="pointer-events-none absolute -right-12 sm:-right-24 bottom-0 h-52 w-52 sm:h-96 sm:w-96 rounded-full blur-3xl"
        style={{ background: "var(--whiold-700)", opacity: 0.12 }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 sm:mb-12 flex flex-col items-start gap-3 sm:gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p
              className="mb-1.5 sm:mb-2 text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] sm:tracking-[0.25em]"
              style={{ color: "var(--whiold-600)" }}
            >
              Your saved picks
            </p>
            <h1 className="flex flex-wrap items-baseline gap-2 sm:gap-3">
              <span
                className="bg-clip-text text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(120deg, var(--whiold-700) 0%, var(--whiold-500) 60%, var(--whiold-600) 100%)",
                }}
              >
                {wishlist.length}
              </span>
              <span
                className="text-base sm:text-2xl font-semibold"
                style={{ color: "var(--whiold-text-heading)" }}
              >
                {wishlist.length === 1 ? "item" : "items"} in wishlist
              </span>
            </h1>
          </div>

          {wishlist.length > 0 && (
            <div className="flex gap-2 sm:gap-3">
              <div
                className="rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 text-center"
                style={{
                  background: "var(--whiold-bg-soft)",
                  border: "1px solid var(--whiold-border)",
                }}
              >
                <p
                  className="text-base sm:text-lg font-bold"
                  style={{ color: "var(--whiold-700)" }}
                >
                  {inStockCount}
                </p>
                <p
                  className="text-[9px] sm:text-[11px] uppercase tracking-wide"
                  style={{ color: "var(--whiold-text-muted)" }}
                >
                  In stock
                </p>
              </div>
              <div
                className="rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 text-center"
                style={{
                  background: "var(--whiold-bg-soft)",
                  border: "1px solid var(--whiold-border)",
                }}
              >
                <p
                  className="text-base sm:text-lg font-bold"
                  style={{ color: "var(--whiold-700)" }}
                >
                  {onSaleCount}
                </p>
                <p
                  className="text-[9px] sm:text-[11px] uppercase tracking-wide"
                  style={{ color: "var(--whiold-text-muted)" }}
                >
                  On sale
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {wishlist.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-3 lg:grid-cols-4"
          >
            <AnimatePresence>
              {wishlist.map((item) => (
                <WishlistCard
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                  onMoveToBag={handleMoveToBag}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default WishlistPage;