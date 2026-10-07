import React, { useRef, useState } from "react";
import { Card, IconButton, Chip, Rating } from "@mui/material";
import { ChevronLeft, ChevronRight, Heart, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { Router } from "../../../constants/router";
import { useWishlist } from "../../../context/WishlistContext";
// import { useCart } from "../../../context/CartContext";

const ProductCard = ({
  product,
  onAddToCart,
  fill = false,
  captionOverlay = false,
  className = "",
}) => {
  const navigate = useNavigate();
  const [imgIndex, setImgIndex] = useState(0);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  // const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]);
  const imgRefs = useRef([]);

  const images = product.images?.length ? product.images : [product.image];

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  const goTo = (index, e) => {
    e?.stopPropagation();
    const clamped = (index + images.length) % images.length;
    if (clamped === imgIndex) return;
    gsap.to(imgRefs.current[imgIndex], {
      opacity: 0,
      duration: 0.25,
      ease: "power2.out",
    });
    gsap.fromTo(
      imgRefs.current[clamped],
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: "power2.out" },
    );
    setImgIndex(clamped);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product);
    else console.log("Add to cart:", product.id);
  };

  return (
    <Card
      elevation={0}
      onClick={() =>
        navigate(Router.PRODUCT_DETAIL.replace(":id", product.id), {
          state: { product },
        })
      }
      className={`group relative cursor-pointer overflow-hidden !rounded-[var(--whiold-radius-lg)] !border !border-[var(--whiold-border)] !bg-[var(--whiold-bg)] transition-shadow duration-300 hover:!shadow-[var(--whiold-shadow-card)] ${
        fill ? "!h-full" : ""
      } ${className}`}
    >
      {/* ── Image stack — fill=true par h-full, warna default aspect-[4/5] ── */}
      <div
        className={`relative overflow-hidden bg-[var(--whiold-bg-soft)] ${fill ? "h-full" : "aspect-[4/5]"}`}
      >
        {images.map((src, i) => (
          <img
            key={src}
            ref={(el) => (imgRefs.current[i] = el)}
            src={src}
            alt={product.name}
            className={`absolute inset-0 h-full w-full object-cover object-top duration-700 ease-out group-hover:scale-[1.06] ${
              i === 0 ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionProperty: "scale, transform" }}
          />
        ))}

        {/* ── Badge / wishlist / arrows — sirf default (non-editorial) mode me ── */}
        {!captionOverlay && (
          <>
            {product.badge && (
              <Chip
                label={product.badge}
                size="small"
                className="!absolute !left-3 !top-3 !h-6 !bg-[var(--whiold-primary)] !text-[10px] !font-semibold !tracking-wide !text-white"
              />
            )}

            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className="!absolute !right-3 !top-3 !h-8 !w-8 !bg-white/90 backdrop-blur-sm transition-all duration-200 hover:!scale-110"
            >
              <Heart
                size={15}
                fill={wishlisted ? "var(--whiold-primary)" : "none"}
                className="text-[var(--whiold-primary)]"
              />
            </IconButton>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => goTo(imgIndex - 1, e)}
                  className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-md backdrop-blur-sm transition-all duration-200 hover:!scale-110 group-hover:opacity-100"
                >
                  <ChevronLeft
                    size={15}
                    className="text-[var(--whiold-text-heading)]"
                  />
                </button>
                <button
                  onClick={(e) => goTo(imgIndex + 1, e)}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-md backdrop-blur-sm transition-all duration-200 hover:!scale-110 group-hover:opacity-100"
                >
                  <ChevronRight
                    size={15}
                    className="text-[var(--whiold-text-heading)]"
                  />
                </button>

                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
                  {images.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        i === imgIndex ? "w-4 bg-white" : "w-1 bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

          </>
        )}

        {/* ── EDITORIAL caption — image ke andar hi, dark gradient scrim ke saath ── */}
        {captionOverlay && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-4 pb-4 pt-12 flex flex-col justify-end text-white">
            <h3 className="m-0 text-[13.5px] font-semibold text-white line-clamp-2 h-[38px] overflow-hidden leading-snug">
              {product.name}
            </h3>
            
            {product.rating != null && (
              <div className="mt-1 flex items-center gap-1">
                <Rating
                  value={product.rating}
                  readOnly
                  precision={0.5}
                  size="small"
                  sx={{
                    color: "var(--whiold-primary)",
                    fontSize: 12,
                    "& .MuiRating-icon": { color: "var(--whiold-primary)" },
                    "& .MuiRating-iconEmpty": { color: "rgba(255,255,255,0.3)" }
                  }}
                />
                <span className="text-[10px] text-white/70">
                  ({product.reviewCount || 0})
                </span>
              </div>
            )}

            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="text-[14px] font-bold text-white">₹{product.price}</span>
            </div>
          </div>
        )}

        {/* ── Add to cart — slides up on hover ── */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[var(--whiold-text-heading)]/92 py-2.5 text-center transition-all duration-300 ease-out group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white hover:opacity-90 active:scale-[0.98] transition cursor-pointer"
          >
            <ShoppingBag size={13} /> Add to Cart
          </button>
        </div>
      </div>

      {/* ── Info panel — sirf default (non-editorial) mode me, image ke NICHE ── */}
      {!captionOverlay && (
        <div className="p-3.5">
          {product.brand && (
            <p className="m-0 text-[10px] font-medium uppercase tracking-wider text-[var(--whiold-text-muted)]">
              {product.brand}
            </p>
          )}
          <h3 className="m-0 mt-0.5 text-[13.5px] font-semibold text-[var(--whiold-text-heading)] line-clamp-2 h-[38px] overflow-hidden leading-snug">
            {product.name}
          </h3>

          {product.description && (
            <p className="m-0 mt-1 text-[11.5px] text-[var(--whiold-text-muted)] line-clamp-2 overflow-hidden leading-snug">
              {product.description}
            </p>
          )}

          {product.rating != null && (
            <div className="mt-1 flex items-center gap-1">
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

          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
            <span className="text-[14px] font-bold">₹{product.price}</span>

            {product.originalPrice && (
              <>
                <span className="text-[11px] line-through text-gray-400">
                  ₹{product.originalPrice}
                </span>

                <Chip
                  label={`${discount}% OFF`}
                  size="small"
                  className="!bg-red-100 !text-red-600 !font-semibold"
                />
              </>
            )}
          </div>

          {product.stockStatus && (
            <p className={`m-0 mt-1 text-[10px] font-medium ${product.stockStatus === 'Out of Stock' ? 'text-red-500' : 'text-emerald-500'}`}>
              {product.stockStatus}
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export default ProductCard;
