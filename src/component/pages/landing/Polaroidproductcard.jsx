import { useState } from "react";
import { motion } from "framer-motion";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import { IconButton, Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Router } from "../../../constants/router";
import { useWishlist } from "../../../context/WishlistContext";
import { useCart } from "../../../context/CartContext";

const defaultProducts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    name: "Premium Cotton T-Shirt",
    category: "Fashion",
    price: 1499,
    originalPrice: 1999,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    name: "Premium Cotton T-Shirt",
    category: "Fashion",
    price: 1499,
    originalPrice: 1999,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    name: "Premium Cotton T-Shirt",
    category: "Fashion",
    price: 1499,
    originalPrice: 1999,
  },
];

const PolaroidProductCard = ({
  product = defaultProducts,
  onAdd,
  onToggleWishlist,
}) => {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const {
    image,
    name,
    category,
    price,
    originalPrice,
  } = product;

  const [hovered, setHovered] = useState(false);

  if (!Object.keys(product).length) {
    return null;
  }

  const wishlisted = isWishlisted(product.id || product._id);

  return (
    <motion.div
      className="relative w-[260px] cursor-pointer select-none"
      initial={{ rotate: -4 }}
      whileHover={{ rotate: 0, y: -8, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() =>
        navigate(Router.PRODUCT_DETAIL.replace(":id", product.id || product._id), {
          state: { product },
        })
      }
    >
      {/* pin */}
      <div
        className="absolute -top-3 left-1/2 z-20 h-5 w-5 -translate-x-1/2 rounded-full"
        style={{ background: "var(--whiold-500)", boxShadow: "var(--whiold-shadow-btn)" }}
      />

      {/* polaroid frame */}
      <div
        className="relative rounded-[6px] p-3 pb-14"
        style={{
          background: "var(--whiold-bg)",
          boxShadow: "var(--whiold-shadow-card)",
          border: "1px solid var(--whiold-border)",
        }}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[3px]">
          <motion.img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
              onToggleWishlist?.(product);
            }}
            className="!absolute !right-2 !top-2 !bg-white/90 backdrop-blur"
          >
            {wishlisted ? (
              <FavoriteRoundedIcon sx={{ fontSize: 18, color: "var(--whiold-500)" }} />
            ) : (
              <FavoriteBorderRoundedIcon sx={{ fontSize: 18, color: "var(--whiold-700)" }} />
            )}
          </IconButton>
        </div>

        <div className="px-1 pt-3">
          <p
            className="text-[10px] uppercase tracking-[0.14em]"
            style={{ color: "var(--whiold-text-muted)" }}
          >
            {category}
          </p>
          <h3
            className="mt-1 text-[14px] font-medium leading-snug line-clamp-2 h-[40px] overflow-hidden"
            style={{ color: "var(--whiold-text-heading)" }}
          >
            {name}
          </h3>
          {product.description && (
            <p className="mt-1 text-[11px] leading-snug line-clamp-2 h-[32px] overflow-hidden" style={{ color: "var(--whiold-text-muted)" }}>
              {product.description}
            </p>
          )}
          {product.rating != null && (
            <div className="mt-1.5 flex items-center gap-1">
              <Rating
                value={product.rating}
                readOnly
                precision={0.5}
                size="small"
                sx={{ color: "var(--whiold-primary)", fontSize: 13 }}
              />
              <span className="text-[10px] text-[var(--whiold-text-muted)]">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}
          {product.stockStatus && (
            <p className={`mt-1 text-[10px] font-medium ${product.stockStatus === 'Out of Stock' ? 'text-red-500' : 'text-emerald-500'}`}>
              {product.stockStatus}
            </p>
          )}
        </div>

        {/* torn-sticker price tag */}
        <motion.div
          className="absolute -bottom-3 -right-3 flex items-center gap-1 rounded-full px-3 py-1.5"
          style={{
            background: "var(--whiold-gradient-brand)",
            color: "var(--whiold-text-on-primary)",
            boxShadow: "var(--whiold-shadow-btn)",
          }}
          initial={{ rotate: 8 }}
          animate={{ rotate: hovered ? 0 : 8, scale: hovered ? 1.06 : 1 }}
        >
          <span className="text-sm font-semibold">₹{price}</span>
          {originalPrice && (
            <span className="text-[11px] line-through opacity-70">₹{originalPrice}</span>
          )}
        </motion.div>

        {/* add to bag, slides up on hover */}
        <motion.button
          className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
          style={{
            background: "var(--whiold-bg-soft)",
            color: "var(--whiold-700)",
            border: "1px solid var(--whiold-border)",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
            onAdd?.(product);
          }}
        >
          <ShoppingBagRoundedIcon sx={{ fontSize: 14 }} />
          Add
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PolaroidProductCard;