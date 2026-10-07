import React from "react";
import { useState,useEffect } from "react";
import ProductCard from "../landing/ProductCard";
import { Typography, Skeleton, Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../../context/CartContext";
import { getAllProducts } from "../../../api/user/products.api";

const Shop = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllProducts();
        if (res?.success || Array.isArray(res?.data) || Array.isArray(res)) {
          let list = [];
          if (Array.isArray(res?.data)) list = res.data;
          else if (Array.isArray(res?.data?.data)) list = res.data.data;
          else if (Array.isArray(res)) list = res;

          const mapped = list.slice(0, 8).map(p => {
            const brand = p.brand;
            const brandName = (typeof brand === 'object' && brand !== null) ? (brand.title || brand.name) : brand;

            const imgs = p.images?.length > 0 ? p.images : (p.image ? [p.image] : []);
            const imageList = imgs.map(img => {
              if (typeof img === 'object' && img !== null) return img.imageUrl || img.url || img.image || "";
              return img || "";
            }).filter(Boolean);

            return {
              id: p._id,
              name: p.name || p.title,
              brand: brandName || "Whiold Atelier",
              price: p.price,
              originalPrice: p.mrp,
              rating: p.rating || 4.5,
              reviewCount: p.reviewCount || 0,
              description: p.description,
              images: imageList.length > 0 ? imageList : [""],
              badge: p.featured ? "Featured" : (p.discount > 0 ? "Sale" : "")
            };
          });
          setProducts(mapped);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
     <Typography
          component="h2"
          className="!mb-8"
          sx={{
            fontSize: { xs: "24px", md: "33px" },
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--whiold-text-heading)",
            textAlign: "center",
          }}
        >
        shop the collection
        </Typography>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Box key={idx} className="space-y-3">
              <Skeleton
                variant="rectangular"
                height={300}
                className="!rounded-[var(--whiold-radius-lg)]"
              />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          ))
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))
        ) : (
          <div className="col-span-full py-10 text-center text-gray-500">No products found.</div>
        )}
      </div>
    </div>
  );
};

export default Shop;