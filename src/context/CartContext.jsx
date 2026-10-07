import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useSnackbar } from "./SnackBarContext";
import {
  addToCart as addToCartApi,
  getCart as getCartApi,
  updateCartQuantity as updateCartQuantityApi,
  deleteCartProduct as deleteCartProductApi,
} from "../api/user/addToCart.api"; // 👈 adjust this path to wherever cart.api.js actually lives

const CartContext = createContext(null);

// "Save for later" has no backend endpoint among the 4 given APIs
// (add / get / update-quantity / delete), so it stays local-only —
// persisted in localStorage the same way the whole cart used to be.
const SAVED_STORAGE_KEY = "whiold_saved_for_later";

// ─── Confirmed request shape (from the backend) ─────────────────────────────
// addToCart payload: { productId, quantity, variant }
//   → `variant` is a plain STRING (e.g. "500g"), not a variant ObjectId.
// There's no separate cart-item id — a cart line is identified purely by
// the (productId, variant) pair. So, same as the old localStorage version,
// lineId is a composite string built from those two fields.
const buildLineId = (productId, variant) => `${productId}-${variant}`;

// ─── Resolve which variant to add ───────────────────────────────────────────
// Tries every place a size/variant could legitimately come from, in order:
//   1. options.size / options.variant — explicitly passed by the caller
//      (e.g. ProductDetail.jsx after the user picks a size).
//   2. product.sizes — if the product object only has ONE size, that's an
//      unambiguous default (no picker needed).
//   3. product.variants[].attributes.size — same idea, but derived from a
//      raw variants array if `sizes` wasn't already flattened onto the
//      product object.
// Returns `null` (not "-") when nothing could be resolved, so the caller
// can refuse to add to cart instead of silently sending a bad payload.
const resolveVariant = (product, options) => {
  if (options.size) return options.size;
  if (options.variant) return options.variant;

  if (Array.isArray(product.sizes) && product.sizes.length === 1) {
    return product.sizes[0];
  }

  if (Array.isArray(product.variants) && product.variants.length) {
    const sizes = [
      ...new Set(
        product.variants.map((v) => v.attributes?.size || v.size).filter(Boolean)
      ),
    ];
    if (sizes.length === 1) return sizes[0];
  }

  return null;
};

// ─── Normalizer ──────────────────────────────────────────────────────────────
// Converts one raw cart item from `getCart` into the flat shape the rest of
// the app already expects:
//   { lineId, id, variant, name, category, size, color, price,
//     originalPrice, image, quantity, maxQuantity, inStock }
//
// ⚠️ ASSUMPTION: `getCart` returns each line with `productId` (string or
// populated product object) and `variant` (the same string, e.g. "500g"),
// plus `quantity`. If the backend nests variant-level pricing/stock
// differently, this is the ONLY place that needs adjusting — every
// consumer (Cart.jsx, header cart icon, etc.) just reads these fields.
const normalizeCartItem = (raw) => {
  const product =
    typeof raw.productId === "object" ? raw.productId : raw.product || {};
  const productId =
    typeof raw.productId === "object" ? raw.productId._id : raw.productId;

  const variantLabel = raw.variant;
  // Some backends populate a matching variant sub-document for pricing/stock
  // even though `variant` itself is just the label string — check for it,
  // but fall back to whatever's on the product/cart line directly.
  const variantDoc =
    product.variants?.find((v) => v.weight + (v.unit || "") === variantLabel) ||
    {};

  const image =
    variantDoc.thumbnail ||
    product.thumbnail ||
    product.images?.[0]?.url ||
    product.images?.[0] ||
    "https://placehold.co/300x360";

  const price = variantDoc.finalPrice ?? variantDoc.sellingPrice ?? raw.price ?? 0;
  const mrp = variantDoc.mrp ?? raw.originalPrice ?? null;
  const originalPrice = mrp && mrp > price ? mrp : null;

  return {
    lineId: buildLineId(productId, variantLabel),
    id: productId,
    variant: variantLabel,
    name: product.name || raw.name || "Product",
    category: product.category?.name || raw.category || "",
    size: variantLabel || "-",
    color: raw.color || null,
    price,
    originalPrice,
    image,
    quantity: raw.quantity ?? 1,
    maxQuantity: variantDoc.stock ?? raw.maxQuantity ?? 10,
    inStock:
      variantDoc.isActive !== false &&
      (variantDoc.stock === undefined || variantDoc.stock > 0),
  };
};

export const CartProvider = ({ children }) => {
  const { showSnackbar } = useSnackbar();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [savedForLater, setSavedForLater] = useState(() => {
    try {
      const stored = localStorage.getItem(SAVED_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedForLater));
  }, [savedForLater]);

  // ─── Fetch cart from backend ─────────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCartApi();
      if (res?.success) {
        const items = res.data?.items || res.data || [];
        setCart(items.map(normalizeCartItem));
      } else {
        setError(res?.message || "Failed to load cart");
        setCart([]);
      }
    } catch (err) {
      console.error("fetchCart error:", err);
      setError("Failed to load cart");
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ─── Add to cart ──────────────────────────────────────────────────────────
  // Signature kept IDENTICAL to the old local version — addToCart(product, options) —
  // so every place in the app that already calls this keeps working with
  // zero changes. Internally it now builds the confirmed backend payload:
  //   { productId, quantity, variant }
  const addToCart = useCallback(
    async (product, options = {}) => {
      const qty = options.quantity || 1;
      const variant = resolveVariant(product, options);

      // Never send a placeholder like "-" to the backend — if we couldn't
      // confidently resolve a size/variant (multiple sizes exist but the
      // caller didn't pass one), refuse and tell the user instead of
      // silently adding a bad cart line that the server will reject anyway.
      if (!variant) {
        console.warn(
          `addToCart: could not resolve a size/variant for product ${product.id}. Pass options.size explicitly, or make sure the product has exactly one size/variant.`
        );
        showSnackbar("Please select a size before adding to cart.", "error", {
          title: "Size Required",
          position: "top-right",
          autoHideDuration: 3000,
        });
        return;
      }

      const payload = {
        productId: product.id,
        quantity: qty,
        variant,
      };

      try {
        const res = await addToCartApi(payload);
        if (res?.success) {
          await fetchCart(); // server is the source of truth
          showSnackbar("Your item has been added successfully.", "success", {
            title: "Added to Cart",
            position: "top-right",
            autoHideDuration: 3000,
          });
        } else {
          showSnackbar(res?.message || "Could not add item to cart.", "error", {
            title: "Add to Cart Failed",
            position: "top-right",
            autoHideDuration: 3000,
          });
        }
      } catch (err) {
        console.error("addToCart error:", err);
        showSnackbar("Could not add item to cart.", "error", {
          title: "Add to Cart Failed",
          position: "top-right",
          autoHideDuration: 3000,
        });
      }
    },
    [fetchCart, showSnackbar]
  );

  // ─── Update quantity (optimistic) ────────────────────────────────────────
  // ⚠️ ASSUMPTION: updateCartQuantity uses the same identifying pair as
  // addToCart — { productId, variant, quantity } — since no separate
  // cart-item id exists. Adjust here if the backend expects a different
  // field name for the new quantity.
  const updateQuantity = useCallback(
    async (lineId, qty) => {
      const item = cart.find((i) => i.lineId === lineId);
      if (!item) return;

      const previous = cart;
      setCart((prev) =>
        prev.map((i) => (i.lineId === lineId ? { ...i, quantity: qty } : i))
      );

      try {
        const res = await updateCartQuantityApi({
          productId: item.id,
          variant: item.variant,
          quantity: qty,
        });
        if (!res?.success) {
          setCart(previous);
          showSnackbar(res?.message || "Could not update quantity.", "error", {
            position: "top-right",
            autoHideDuration: 3000,
          });
        }
      } catch (err) {
        setCart(previous);
        console.error("updateQuantity error:", err);
        showSnackbar("Could not update quantity.", "error", {
          position: "top-right",
          autoHideDuration: 3000,
        });
      }
    },
    [cart, showSnackbar]
  );

  // ─── Remove from cart (optimistic) ───────────────────────────────────────
  // ⚠️ ASSUMPTION: deleteCartProduct also identifies the line via
  // { productId, variant } (no quantity needed for a full removal).
  const removeFromCart = useCallback(
    async (lineId) => {
      const item = cart.find((i) => i.lineId === lineId);
      if (!item) return;

      const previous = cart;
      setCart((prev) => prev.filter((i) => i.lineId !== lineId));

      try {
        const res = await deleteCartProductApi({
          productId: item.id,
          variant: item.variant,
        });
        if (!res?.success) {
          setCart(previous);
          showSnackbar(res?.message || "Could not remove item.", "error", {
            position: "top-right",
            autoHideDuration: 3000,
          });
        }
      } catch (err) {
        setCart(previous);
        console.error("removeFromCart error:", err);
        showSnackbar("Could not remove item.", "error", {
          position: "top-right",
          autoHideDuration: 3000,
        });
      }
    },
    [cart, showSnackbar]
  );

  // ─── Save for later ───────────────────────────────────────────────────────
  // No backend endpoint exists for this yet, so the item is kept locally in
  // `savedForLater` (persisted to localStorage) and ALSO removed from the
  // server cart via deleteCartProduct so totals/counts stay correct there.
  const saveForLater = useCallback(
    (lineId) => {
      const found = cart.find((i) => i.lineId === lineId);
      if (!found) return;

      setSavedForLater((s) => [...s, found]);
      setCart((prev) => prev.filter((i) => i.lineId !== lineId));

      deleteCartProductApi({ productId: found.id, variant: found.variant }).catch(
        (err) =>
          console.error("saveForLater: failed to remove from server cart:", err)
      );
    },
    [cart]
  );

  // ─── Move back to cart ────────────────────────────────────────────────────
  const moveToCart = useCallback(
    async (lineId) => {
      const found = savedForLater.find((i) => i.lineId === lineId);
      if (!found) return;

      setSavedForLater((prev) => prev.filter((i) => i.lineId !== lineId));
      await addToCart(
        { id: found.id },
        { variant: found.variant, quantity: found.quantity }
      );
    },
    [savedForLater, addToCart]
  );

  // ─── Clear cart ───────────────────────────────────────────────────────────
  // ⚠️ No bulk "clear cart" endpoint was provided among the 4 APIs, so this
  // removes every line item individually via deleteCartProduct, then
  // re-syncs from the server. Swap this for a single API call if/when a
  // dedicated clear-cart endpoint exists.
  const clearCart = useCallback(async () => {
    const previous = cart;
    setCart([]);
    try {
      await Promise.all(
        previous.map((item) =>
          deleteCartProductApi({ productId: item.id, variant: item.variant })
        )
      );
      await fetchCart();
    } catch (err) {
      console.error("clearCart error:", err);
      await fetchCart(); // resync with whatever actually got deleted
    }
  }, [cart, fetchCart]);

  const itemCount = useMemo(
    () => cart.reduce((n, i) => n + i.quantity, 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      cart,
      savedForLater,
      loading,
      error,
      fetchCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      saveForLater,
      moveToCart,
      clearCart,
      itemCount,
    }),
    [
      cart,
      savedForLater,
      loading,
      error,
      fetchCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      saveForLater,
      moveToCart,
      clearCart,
      itemCount,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};