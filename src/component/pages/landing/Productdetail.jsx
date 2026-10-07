import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import {
  Breadcrumbs,
  Chip,
  Rating,
  IconButton,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Share2,
  X,
  Link2,
  Check,
  Mail,
  MoreHorizontal,
} from "lucide-react";
import gsap from "gsap";
import { getProductDetailsById } from "../../../api/user/products.api";

// This catalog's variants are a flat spec string + stock — e.g.
// { spec: "500g", stock: 20 } or { spec: "M", stock: 5 } — confirmed by
// the cart API, which takes the variant back as that exact string:
//   POST /cart  { productId, quantity, variant: "M" }
// `attributes.size` / `size` are kept as fallbacks in case a different
// backend shape is ever used.
const deriveSizes = (p) => {
  if (Array.isArray(p.sizes) && p.sizes.length) return p.sizes;

  if (Array.isArray(p.variants) && p.variants.length) {
    const sizes = p.variants
      .map((v) => v.spec || v.attributes?.size || v.size)
      .filter(Boolean);
    return [...new Set(sizes)];
  }

  return [];
};

// Pull a variant's size off `spec` first (the actual backend field),
// falling back to `attributes.size` / a flat `size` field.
// ⚠️ If your backend uses a different field name, adjust here too.
const getVariantSize = (v) => v?.spec ?? v?.attributes?.size ?? v?.size ?? null;

// Stock count on a variant — tries the common field names backends use.
const getVariantStock = (v) => {
  const raw = v?.stock ?? v?.quantity ?? v?.qty ?? v?.inventory;
  return typeof raw === "number" ? raw : null; // null = unknown/not tracked, treat as available
};

/* ─────────────────────────────────────────────────────────
   Brand-colored share icons (kept as real brand colors,
   not tokenized — recognizability matters more than theming
   for WhatsApp / Facebook / X / Telegram glyphs)
───────────────────────────────────────────────────────── */
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="#25D366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.148.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12.041 0h-.083C5.446 0 .134 5.313.134 11.851c0 2.629.848 5.062 2.288 7.038L.79 24l5.286-1.688a11.79 11.79 0 0 0 5.882 1.556h.083c6.51 0 11.822-5.313 11.822-11.851 0-3.166-1.234-6.14-3.474-8.383A11.774 11.774 0 0 0 12.041 0zm6.99 18.767a9.822 9.822 0 0 1-6.99 2.892h-.067a9.847 9.847 0 0 1-5.02-1.373l-.36-.213-3.135 1.001 1.017-3.06-.234-.372a9.83 9.83 0 0 1-1.505-5.238C2.737 6.502 6.981 2.263 12.166 2.263a9.79 9.79 0 0 1 6.968 2.892 9.79 9.79 0 0 1 2.885 6.964 9.83 9.83 0 0 1-2.988 6.648z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="#1877F2">
    <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.462h-1.26c-1.243 0-1.63.771-1.63 1.562v1.877h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="#000000">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="#26A5E4">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.18 1.897-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.064-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212-.07-.063-.174-.041-.249-.024-.106.024-1.793 1.14-5.061 3.345-.479.329-.913.489-1.302.48-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.14.121.098.154.23.17.323.016.093.036.306.02.472z" />
  </svg>
);

/* ─────────────────────────────────────────────────────────
   ShareModal — bottom-sheet on mobile, centered card on desktop
───────────────────────────────────────────────────────── */
const ShareModal = ({ open, onClose, product }) => {
  const [copied, setCopied] = useState(false);
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const [mounted, setMounted] = useState(open);

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";
  const shareText = product?.name
    ? `Check out ${product.name} on Whiold`
    : "Check out this find on Whiold";

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useLayoutEffect(() => {
    if (!mounted) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const ctx = gsap.context(() => {
      if (open) {
        gsap.set(backdropRef.current, { autoAlpha: 0 });
        gsap.set(panelRef.current, isMobile ? { y: "100%" } : { opacity: 0, scale: 0.94, y: 14 });

        gsap.to(backdropRef.current, { autoAlpha: 1, duration: 0.25, ease: "power2.out" });
        gsap.to(panelRef.current, isMobile
          ? { y: "0%", duration: 0.4, ease: "power3.out" }
          : { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "back.out(1.6)" }
        );
      } else {
        gsap.to(backdropRef.current, { autoAlpha: 0, duration: 0.2, ease: "power2.in" });
        gsap.to(panelRef.current, isMobile
          ? { y: "100%", duration: 0.3, ease: "power2.in", onComplete: () => setMounted(false) }
          : { opacity: 0, scale: 0.96, y: 10, duration: 0.2, ease: "power2.in", onComplete: () => setMounted(false) }
        );
      }
    });
    return () => ctx.revert();
  }, [open, mounted]);

  if (!mounted) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      gsap.fromTo(
        ".whiold-copy-check",
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(3)" }
      );
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — no-op, input remains selectable
    }
  };

  const openShareWindow = (url) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=520");
  };

  const shareTargets = [
    {
      label: "WhatsApp",
      icon: <WhatsAppIcon />,
      onClick: () =>
        openShareWindow(
          `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
        ),
    },
    {
      label: "Facebook",
      icon: <FacebookIcon />,
      onClick: () =>
        openShareWindow(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        ),
    },
    {
      label: "X",
      icon: <XIcon />,
      onClick: () =>
        openShareWindow(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        ),
    },
    {
      label: "Telegram",
      icon: <TelegramIcon />,
      onClick: () =>
        openShareWindow(
          `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
        ),
    },
    {
      label: "Email",
      icon: <Mail size={20} className="text-[var(--whiold-text-body)]" />,
      onClick: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`;
      },
    },
    ...(typeof navigator !== "undefined" && navigator.share
      ? [
          {
            label: "More",
            icon: <MoreHorizontal size={20} className="text-[var(--whiold-text-body)]" />,
            onClick: () =>
              navigator.share({ title: shareText, text: shareText, url: shareUrl }).catch(() => {}),
          },
        ]
      : []),
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center md:items-center">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={onClose}
        className="absolute inset-0 bg-[var(--whiold-900)]/50 backdrop-blur-sm"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative z-10 w-full max-w-md rounded-t-[var(--whiold-radius-lg)] border border-[var(--whiold-border)] bg-[var(--whiold-bg)] px-5 pb-6 pt-4 shadow-[var(--whiold-shadow-card)] md:rounded-[var(--whiold-radius-lg)] md:pb-7"
      >
        {/* Drag handle — mobile only */}
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[var(--whiold-border)] md:hidden" />

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="m-0 text-[15px] font-bold text-[var(--whiold-text-heading)]">
            Share this product
          </h3>
          <IconButton onClick={onClose} size="small" className="!bg-[var(--whiold-bg-soft)]">
            <X size={16} className="text-[var(--whiold-text-body)]" />
          </IconButton>
        </div>

        {/* Product mini-preview */}
        {product && (
          <div className="mb-5 flex items-center gap-3 rounded-[var(--whiold-radius-md)] border border-[var(--whiold-border)] bg-[var(--whiold-bg-soft)] p-2.5">
            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-[10px] bg-white">
              {product.images?.[0] && (
                <img
                  src={product.images[0]}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="min-w-0">
              <p className="m-0 truncate text-[12.5px] font-semibold text-[var(--whiold-text-heading)]">
                {product.name}
              </p>
              {product.price != null && (
                <p className="m-0 text-[12px] text-[var(--whiold-primary)]">
                  ₹{product.price}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Share targets grid */}
        <div className="mb-5 grid grid-cols-4 gap-y-4 sm:grid-cols-6">
          {shareTargets.map((t) => (
            <button
              key={t.label}
              onClick={t.onClick}
              className="flex flex-col items-center gap-1.5 transition-transform duration-150 hover:scale-105 active:scale-95"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--whiold-border)] bg-[var(--whiold-bg-soft)]">
                {t.icon}
              </span>
              <span className="text-[10.5px] font-medium text-[var(--whiold-text-muted)]">
                {t.label}
              </span>
            </button>
          ))}
        </div>

        <Divider className="!mb-4 !border-[var(--whiold-border)]" />

        {/* Copy link row */}
        <div className="flex items-center gap-2">
          <div className="flex h-11 flex-1 items-center gap-2 overflow-hidden rounded-[var(--whiold-radius-sm)] border border-[var(--whiold-border)] bg-[var(--whiold-bg-input)] px-3">
            <Link2 size={14} className="flex-shrink-0 text-[var(--whiold-text-muted)]" />
            <input
              readOnly
              value={shareUrl}
              onFocus={(e) => e.target.select()}
              className="w-full truncate bg-transparent text-[12px] text-[var(--whiold-text-body)] outline-none"
            />
          </div>
          <button
            onClick={handleCopy}
            className={`flex h-11 flex-shrink-0 items-center gap-1.5 rounded-[var(--whiold-radius-sm)] px-4 text-[12.5px] font-semibold uppercase tracking-wide text-white transition-transform duration-150 active:scale-95 ${
              copied ? "" : ""
            }`}
            style={{
              backgroundImage: copied
                ? "none"
                : "var(--whiold-gradient-brand)",
              backgroundColor: copied ? "#16a34a" : undefined,
            }}
          >
            {copied ? (
              <>
                <Check size={14} className="whiold-copy-check" /> Copied
              </>
            ) : (
              "Copy"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   ProductDetail
───────────────────────────────────────────────────────── */
const ProductDetail = ({ product: productProp }) => {
  const { id } = useParams();
  const { state } = useLocation();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(productProp || state?.product || null);
  const [loading, setLoading] = useState(!product);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    (async () => {
      if (!productProp && !state?.product) {
        setLoading(true);
      }
      try {
        const res = await getProductDetailsById(id);
        if (res?.success || res?.data || res) {
          const p = res?.data || res;

          const cat = p.category;
          const catName = (typeof cat === 'object' && cat !== null) ? (cat.title || cat.name) : cat;
          const brand = p.brand;
          const brandName = (typeof brand === 'object' && brand !== null) ? (brand.title || brand.name) : brand;

          const imgs = p.images?.length > 0 ? p.images : (p.image ? [p.image] : []);
          const imageList = imgs.map(img => {
            if (typeof img === 'object' && img !== null) return img.imageUrl || img.url || img.image || "";
            return img || "";
          }).filter(Boolean);

          const derivedSizes = deriveSizes(p);

          // TEMP DEBUG — remove once sizes render correctly.
          // If variants exist but derivedSizes is empty, the backend isn't
          // sending `spec` (or `attributes.size`/`size`) on each variant —
          // check the logged shape below against deriveSizes/getVariantSize
          // at the top of this file.
          if (Array.isArray(p.variants) && p.variants.length > 0 && derivedSizes.length === 0) {
            console.warn(
              "[ProductDetail] variants exist but no sizes could be derived. Raw first variant:",
              p.variants[0]
            );
          }

          setProduct({
            id: p._id,
            name: p.name || p.title,
            brand: brandName || "Whiold",
            category: catName || "Fashion",
            price: p.price,
            originalPrice: p.mrp,
            rating: p.rating || 4.5,
            reviewCount: p.reviewCount || 0,
            description: p.description,
            images: imageList.length > 0 ? imageList : [""],
            details: p.details || ["Made in India", "Premium Quality"],
            colors: p.colors || [],
            sizes: derivedSizes,
            variants: p.variants || [],
          });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id, productProp, state]);

  const productImages = product?.images?.length
    ? product.images
    : product?.image
    ? [product.image]
    : [];

  const [imgIndex, setImgIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [qty, setQty] = useState(1);
  const wishlisted = product ? isWishlisted(product.id) : false;
  const imgRefs = useRef([]);
  const galleryRef = useRef(null);
  const zoomBoxRef = useRef(null);
  const infoRef = useRef(null);
  const addBarRef = useRef(null);

  const hasVariants = Array.isArray(product?.variants) && product.variants.length > 0;

  // The variant matching the currently selected size. Variants here are
  // flat `{ spec, stock }` — spec IS the size/weight label (e.g. "M",
  // "500g"). `product.colors` is a separate, unrelated swatch feature.
  const selectedVariant = hasVariants
    ? product.variants.find((v) => getVariantSize(v) === selectedSize) || null
    : null;

  // Stock per size — used to disable sizes that are out of stock.
  const sizeStockMap = React.useMemo(() => {
    if (!hasVariants) return {};
    const map = {};
    product.variants.forEach((v) => {
      const size = getVariantSize(v);
      if (!size) return;
      const stock = getVariantStock(v);
      map[size] = stock === null ? 1 : stock;
    });
    return map;
  }, [hasVariants, product?.variants]);

  const isSizeOutOfStock = (size) => {
    if (!hasVariants) return false;
    const stock = sizeStockMap[size];
    return stock === undefined ? false : stock <= 0;
  };

  // Price/MRP shown to the user — falls back to the base product price
  // when the matched variant doesn't carry its own price, or when no
  // size has been picked yet.
  const displayPrice = selectedVariant?.price ?? product?.price;
  const displayOriginalPrice = selectedVariant?.mrp ?? product?.originalPrice;
  const variantStock = selectedVariant ? getVariantStock(selectedVariant) : null;

  useEffect(() => {
    if (product && product.colors?.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0].name);
    }
  }, [product, selectedColor]);

  useLayoutEffect(() => {
    if (!product) return;
    if (!galleryRef.current || !infoRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set([galleryRef.current, infoRef.current], {
        opacity: 0,
        y: 22,
      });

      gsap.to(galleryRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power3.out",
      });

      gsap.to(infoRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power3.out",
        delay: 0.12,
      });
    });

    return () => ctx.revert();
  }, [product]);

  const goTo = (index) => {
    const clamped = (index + productImages.length) % productImages.length;
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
    gsap.set(imgRefs.current[imgIndex], {
      scale: 1,
      transformOrigin: "50% 50%",
    });
    setImgIndex(clamped);
  };

  const handleImageMouseEnter = () => {
    const activeImg = imgRefs.current[imgIndex];
    if (!activeImg) return;
    gsap.to(activeImg, { scale: 1.7, duration: 0.45, ease: "power3.out" });
  };

  const handleImageMouseMove = (e) => {
    const activeImg = imgRefs.current[imgIndex];
    const box = zoomBoxRef.current;
    if (!activeImg || !box) return;
    const rect = box.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    gsap.to(activeImg, {
      transformOrigin: `${xPercent}% ${yPercent}%`,
      duration: 0.35,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const handleImageMouseLeave = () => {
    const activeImg = imgRefs.current[imgIndex];
    if (!activeImg) return;
    gsap.to(activeImg, {
      scale: 1,
      transformOrigin: "50% 50%",
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const handleAddToCart = () => {
    if (product.sizes?.length && !selectedSize) {
      setSizeError(true);
      gsap.fromTo(
        addBarRef.current,
        { x: -6 },
        { x: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" },
      );
      return;
    }
    if (hasVariants && selectedSize && (!selectedVariant || (variantStock !== null && variantStock <= 0))) {
      setSizeError(true);
      gsap.fromTo(
        addBarRef.current,
        { x: -6 },
        { x: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" },
      );
      return;
    }
    setSizeError(false);
    gsap.fromTo(
      addBarRef.current,
      { scale: 0.97 },
      { scale: 1, duration: 0.3, ease: "back.out(3)" },
    );

    addToCart(product, {
      // Matches the cart API contract: POST body is
      // { productId, quantity, variant } where `variant` is the exact
      // spec string, e.g. "M" or "500g" — not an id or an object.
      variant: selectedSize,
      quantity: qty,
      price: displayPrice,
    });
  };

  return (
    <div className="min-h-screen bg-[var(--whiold-bg-soft)] pb-28 md:pb-10">
      {loading || !product ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-gray-500">Loading product details...</p>
        </div>
      ) : (
        <>
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
            <Breadcrumbs
              separator={
                <ChevronRight size={12} className="text-[var(--whiold-text-muted)]" />
              }
              className="mb-5"
            >
              <span className="text-[12px] text-[var(--whiold-text-muted)]">
                {product.category}
              </span>
              <span className="text-[12px] font-medium text-[var(--whiold-text-heading)]">
                {product.name}
              </span>
            </Breadcrumbs>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
              {/* ══ GALLERY ══ */}
              <div
                ref={galleryRef}
                className="md:sticky md:top-24 md:self-start mx-auto w-full max-w-[380px] md:max-w-[420px]"
              >
                <div
                  ref={zoomBoxRef}
                  onMouseEnter={handleImageMouseEnter}
                  onMouseMove={handleImageMouseMove}
                  onMouseLeave={handleImageMouseLeave}
                  className="relative h-[300px] sm:h-[340px] md:h-[380px] lg:h-[420px] overflow-hidden rounded-[var(--whiold-radius-lg)] border border-[var(--whiold-border)] bg-white cursor-zoom-in"
                >
                  {productImages.map((src, i) => (
                    <img
                      key={src}
                      ref={(el) => (imgRefs.current[i] = el)}
                      src={src}
                      alt={`${product.name} ${i + 1}`}
                      className={`absolute inset-0 h-full w-full object-cover will-change-transform ${
                        i === 0 ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}

                  {productImages.length > 1 && (
                    <>
                      <button
                        onClick={() => goTo(imgIndex - 1)}
                        className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-transform duration-200 hover:scale-110"
                      >
                        <ChevronLeft size={17} className="text-[var(--whiold-text-heading)]" />
                      </button>
                      <button
                        onClick={() => goTo(imgIndex + 1)}
                        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-transform duration-200 hover:scale-110"
                      >
                        <ChevronRight size={17} className="text-[var(--whiold-text-heading)]" />
                      </button>
                    </>
                  )}

                  <IconButton
                    onClick={() => toggleWishlist(product)}
                    className="!absolute !right-3 !top-3 !h-9 !w-9 !bg-white/90 backdrop-blur-sm"
                  >
                    <Heart
                      size={16}
                      fill={wishlisted ? "var(--whiold-primary)" : "none"}
                      className="text-[var(--whiold-primary)]"
                    />
                  </IconButton>
                </div>

                {productImages.length > 1 && (
                  <div className="mt-3 flex gap-2.5">
                    {productImages.map((src, i) => (
                      <button
                        key={src}
                        onClick={() => goTo(i)}
                        className={`h-16 w-14 flex-shrink-0 overflow-hidden rounded-[10px] border-2 transition-colors duration-200 ${
                          i === imgIndex
                            ? "border-[var(--whiold-primary)]"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={src} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ══ INFO ══ */}
              <div ref={infoRef}>
                <p className="m-0 text-[11px] font-medium uppercase tracking-wider text-[var(--whiold-text-muted)]">
                  {product.brand}
                </p>
                <h1 className="m-0 mt-1 text-2xl font-bold text-[var(--whiold-text-heading)] sm:text-[28px]">
                  {product.name}
                </h1>

                {product.rating != null && (
                  <div className="mt-2 flex items-center gap-2">
                    <Rating
                      value={product.rating}
                      readOnly
                      precision={0.5}
                      size="small"
                      sx={{ color: "var(--whiold-primary)" }}
                    />
                    <span className="text-[12px] text-[var(--whiold-text-muted)]">
                      {product.rating} ({product.reviewCount || 0} reviews)
                    </span>
                  </div>
                )}

                <div className="mt-4 flex items-baseline gap-2.5">
                  {displayPrice != null ? (
                    <>
                      <span className="text-[26px] font-bold text-[var(--whiold-text-heading)]">
                        ₹{displayPrice}
                      </span>
                      {displayOriginalPrice && (
                        <>
                          <span className="text-[15px] text-[var(--whiold-text-muted)] line-through">
                            ₹{displayOriginalPrice}
                          </span>
                          <Chip
                            label={`${Math.round((1 - displayPrice / displayOriginalPrice) * 100)}% OFF`}
                            size="small"
                            className="!bg-[var(--whiold-primary-soft)] !text-[10px] !font-semibold !text-[var(--whiold-primary-hover)]"
                          />
                        </>
                      )}
                    </>
                  ) : (
                    <span className="text-[15px] font-medium text-[var(--whiold-text-muted)]">
                      Price on request
                    </span>
                  )}
                </div>

                <p className="mt-4 text-[13.5px] leading-relaxed text-[var(--whiold-text-body)]">
                  {product.description}
                </p>

                <Divider className="!my-5 !border-[var(--whiold-border)]" />

                {product.colors?.length > 0 && (
                  <div className="mb-5">
                    <p className="mb-2 text-[12px] font-semibold text-[var(--whiold-text-heading)]">
                      Color —{" "}
                      <span className="font-normal text-[var(--whiold-text-muted)]">
                        {selectedColor}
                      </span>
                    </p>
                    <div className="flex gap-2.5">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          title={c.name}
                          className={`h-8 w-8 rounded-full border-2 transition-all duration-200 ${
                            selectedColor === c.name
                              ? "scale-110 border-[var(--whiold-primary)]"
                              : "border-transparent hover:scale-105"
                          }`}
                          style={{
                            backgroundColor: c.hex,
                            boxShadow: "0 0 0 1px var(--whiold-border)",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {product.sizes?.length > 0 && (
                  <div className="mb-5">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="m-0 text-[12px] font-semibold text-[var(--whiold-text-heading)]">
                        Size
                      </p>
                      <button className="text-[11px] font-medium text-[var(--whiold-primary)] underline-offset-2 hover:underline">
                        Size guide
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => {
                        const outOfStock = isSizeOutOfStock(s);
                        return (
                          <button
                            key={s}
                            disabled={outOfStock}
                            onClick={() => {
                              if (outOfStock) return;
                              setSelectedSize(s);
                              setSizeError(false);
                            }}
                            title={outOfStock ? "Out of stock" : s}
                            className={`relative flex h-9 min-w-[38px] items-center justify-center rounded-[10px] border px-3 text-[12.5px] font-medium transition-colors duration-200 ${
                              outOfStock
                                ? "cursor-not-allowed border-[var(--whiold-border)] text-[var(--whiold-text-muted)] opacity-40 line-through"
                                : selectedSize === s
                                ? "border-[var(--whiold-primary)] bg-[var(--whiold-primary)] text-white"
                                : "border-[var(--whiold-border)] text-[var(--whiold-text-body)] hover:border-[var(--whiold-primary)]"
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                    {sizeError && (
                      <p className="mt-1.5 text-[11px] text-rose-500">
                        {hasVariants && selectedSize && (!selectedVariant || (variantStock !== null && variantStock <= 0))
                          ? "This size is currently out of stock"
                          : "Please select a size"}
                      </p>
                    )}
                    {hasVariants && selectedSize && variantStock !== null && variantStock > 0 && variantStock <= 5 && (
                      <p className="mt-1.5 text-[11px] font-medium text-[var(--whiold-primary)]">
                        Only {variantStock} left in stock
                      </p>
                    )}
                  </div>
                )}

                <div ref={addBarRef} className="mt-6 flex items-center gap-3">
                  <div className="flex h-12 items-center rounded-[var(--whiold-radius-md)] border border-[var(--whiold-border)]">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="flex h-full w-10 items-center justify-center text-[var(--whiold-text-body)] hover:text-[var(--whiold-primary)]"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-[13px] font-semibold text-[var(--whiold-text-heading)]">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="flex h-full w-10 items-center justify-center text-[var(--whiold-text-body)] hover:text-[var(--whiold-primary)]"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="hidden h-12 flex-1 items-center justify-center gap-2 rounded-[var(--whiold-radius-md)] text-[13px] font-semibold uppercase tracking-wide text-white shadow-[var(--whiold-shadow-btn)] transition-transform duration-200 hover:scale-[1.01] active:scale-[0.98] md:flex"
                    style={{ backgroundImage: "var(--whiold-gradient-brand)" }}
                  >
                    <ShoppingBag size={15} /> Add to Cart
                  </button>

                  <IconButton
                    onClick={() => setShareOpen(true)}
                    className="!hidden !h-12 !w-12 !flex-shrink-0 !rounded-[var(--whiold-radius-md)] !border !border-[var(--whiold-border)] md:!flex"
                  >
                    <Share2 size={16} className="text-[var(--whiold-text-body)]" />
                  </IconButton>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2 rounded-[var(--whiold-radius-md)] border border-[var(--whiold-border)] bg-white p-3">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <Truck size={16} className="text-[var(--whiold-primary)]" />
                    <span className="text-[9.5px] font-medium text-[var(--whiold-text-muted)]">
                      Free shipping
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 border-x border-[var(--whiold-border)] text-center">
                    <RotateCcw size={16} className="text-[var(--whiold-primary)]" />
                    <span className="text-[9.5px] font-medium text-[var(--whiold-text-muted)]">
                      30-day returns
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <ShieldCheck size={16} className="text-[var(--whiold-primary)]" />
                    <span className="text-[9.5px] font-medium text-[var(--whiold-text-muted)]">
                      Secure checkout
                    </span>
                  </div>
                </div>

                {product.details?.length > 0 && (
                  <Accordion
                    elevation={0}
                    defaultExpanded
                    className="!mt-5 !rounded-[var(--whiold-radius-md)] !border !border-[var(--whiold-border)] !bg-white before:!hidden"
                  >
                    <AccordionSummary
                      expandIcon={
                        <ChevronDown size={16} className="text-[var(--whiold-text-muted)]" />
                      }
                    >
                      <span className="text-[12.5px] font-semibold text-[var(--whiold-text-heading)]">
                        Product details
                      </span>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ul className="m-0 flex list-none flex-col gap-1.5 pl-0">
                        {product.details.map((d) => (
                          <li
                            key={d}
                            className="text-[12.5px] text-[var(--whiold-text-body)] before:mr-2 before:text-[var(--whiold-primary)] before:content-['—']"
                          >
                            {d}
                          </li>
                        ))}
                      </ul>
                    </AccordionDetails>
                  </Accordion>
                )}
              </div>
            </div>
          </div>

          <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-[var(--whiold-border)] bg-white/95 px-4 py-3 backdrop-blur-md md:hidden">
            <div>
              <p className="m-0 text-[10px] text-[var(--whiold-text-muted)]">Total</p>
              <p className="m-0 text-[15px] font-bold text-[var(--whiold-text-heading)]">
                ₹{((displayPrice ?? 0) * qty).toFixed(2)}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[var(--whiold-radius-md)] text-[13px] font-semibold uppercase tracking-wide text-white shadow-[var(--whiold-shadow-btn)]"
              style={{ backgroundImage: "var(--whiold-gradient-brand)" }}
            >
              <ShoppingBag size={15} /> Add to Cart
            </button>
          </div>

          <ShareModal
            open={shareOpen}
            onClose={() => setShareOpen(false)}
            product={product}
          />
        </>
      )}
    </div>
  );
};

export default ProductDetail;