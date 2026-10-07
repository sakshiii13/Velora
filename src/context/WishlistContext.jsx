import { createContext, useContext, useState, useCallback, useEffect } from "react";

const WishlistContext = createContext(null);
const WISHLIST_STORAGE_KEY = "whiold_wishlist";

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const isWishlisted = useCallback(
    (productId) => wishlist.some((i) => i.id === productId),
    [wishlist]
  );

  const addToWishlist = useCallback((product) => {
    setWishlist((prev) => {
      if (prev.some((i) => i.id === product.id)) return prev;
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice || null,
          image: product.images?.[0] || product.image,
          inStock: (product.stock ?? 1) > 0,
        },
      ];
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlist((prev) => prev.filter((i) => i.id !== productId));
  }, []);

  const toggleWishlist = useCallback(
    (product) => {
      setWishlist((prev) => {
        const exists = prev.some((i) => i.id === product.id);
        if (exists) {
          return prev.filter((i) => i.id !== product.id);
        }
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            originalPrice: product.originalPrice || null,
            image: product.images?.[0] || product.image,
            inStock: (product.stock ?? 1) > 0,
          },
        ];
      });
    },
    []
  );

  const clearWishlist = useCallback(() => setWishlist([]), []);
  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isWishlisted,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
};