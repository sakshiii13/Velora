import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard"; 
import { getAllProducts } from "../../../api/user/products.api";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const TheEditSection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getAllProducts();
      if (res?.success || Array.isArray(res?.data) || Array.isArray(res)) {
        let list = [];
        if (Array.isArray(res?.data)) list = res.data;
        else if (Array.isArray(res?.data?.data)) list = res.data.data;
        else if (Array.isArray(res)) list = res;

        // Map up to 6 products
        const mapped = list.slice(0, 6).map((p, idx) => {
          const cat = p.category;
          const catName = (typeof cat === 'object' && cat !== null) ? (cat.title || cat.name) : cat;
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
            caption: `${idx + 1}. ${p.name || p.title}`,
            category: catName || "Home",
            brand: brandName || "Whiold",
            price: p.price,
            rating: p.rating || 4.5,
            reviewCount: p.reviewCount || 0,
            description: p.description,
            images: imageList.length > 0 ? imageList : [""],
          };
        });
        
        // Pad with duplicates if fewer than 6
        while (mapped.length > 0 && mapped.length < 6) {
          mapped.push({...mapped[mapped.length % mapped.length], id: `pad-${mapped.length}`});
        }
        
        setProducts(mapped);
      }
    })();
  }, []);

  if (products.length < 6) return null;

  return (
    <section className="bg-[var(--whiold-bg)] px-4 py-16 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1180px]">
        <Typography
          component="h2"
          className="!mb-8"
          sx={{
            fontSize: { xs: "24px", md: "35px" },
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--whiold-text-heading)",
             textAlign: "center",
          }}
        >
          great products, curated for you
        </Typography>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:items-start lg:gap-6 lg:grid-cols-[1.5fr_1fr_1fr_1.5fr]"
        >
          {/* ── Decorative solid circle — cards ke peeche, sirf gaps se peek karta hai ── */}
          <div
            className="pointer-events-none absolute z-0 hidden rounded-full lg:block"
            style={{
              width: "460px",
              height: "460px",
              left: "52%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "var(--whiold-300)",
            }}
          />

          {/* ══ COLUMN 1 — Big left (STAGGERED — thoda niche se start hota hai) ══ */}
          <motion.div
            variants={itemVariants}
            className="relative z-10 h-[380px] sm:col-span-2 lg:col-span-1 lg:mt-16 lg:h-[480px]"
          >
            <ProductCard product={products[0]} fill captionOverlay />
          </motion.div>

          {/* ══ COLUMN 2 — image / image (dono me overlay caption, dusre me nahi) ══ */}
          <motion.div variants={itemVariants} className="relative z-10 flex h-[440px] flex-col gap-3 lg:h-[560px]">
            <div className="flex-[1.15]">
              <ProductCard product={products[1]} fill captionOverlay />
            </div>
            <div className="flex-1">
              <ProductCard product={products[2]} fill captionOverlay />
            </div>
          </motion.div>

          {/* ══ COLUMN 3 — Handwoven Basket + Bath Towel Set (caption+price overlay) ══ */}
          <motion.div variants={itemVariants} className="relative z-10 flex h-[440px] flex-col gap-3 lg:h-[560px]">
            <div className="flex-1">
              <ProductCard product={products[3]} fill captionOverlay />
            </div>
            <div className="flex-1">
              <ProductCard product={products[4]} fill captionOverlay />
            </div>
          </motion.div>

          {/* ══ COLUMN 4 — Big right (top-aligned, columns 2/3 jaisi hi height) ══ */}
          <motion.div
            variants={itemVariants}
            className="relative z-10 h-[380px] sm:col-span-2 lg:col-span-1 lg:h-[560px]"
          >
            <ProductCard product={products[5]} fill captionOverlay />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TheEditSection;