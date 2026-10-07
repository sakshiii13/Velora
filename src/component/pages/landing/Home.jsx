import Shop from "./Shop";
import TheEditSection from "./Theeditsection";
import HeroSection from "./HeroSection";
import PolaroidProductCard from "./Polaroidproductcard";
import EditorialProductCard from "./Editorialproductcard";
import { Typography, Skeleton, Box } from "@mui/material";
import BrandSection from "../landing/brands/BrandSection";
import CraftImpact from "../landing/CraftImpact";
import { useState, useEffect } from "react";
import { getAllProducts } from "../../../api/user/products.api";

const Home = () => {
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

          const mapped = list.slice(0, 3).map((p) => {
            const cat = p.category;
            const catName = (typeof cat === 'object' && cat !== null) ? (cat.title || cat.name) : cat;
            
            const imgObj = p.image || p.images?.[0];
            const imgSrc = (typeof imgObj === 'object' && imgObj !== null) ? (imgObj.imageUrl || imgObj.url || imgObj.image) : imgObj;

            return {
              id: p._id,
              image: imgSrc || "",
              name: p.name || p.title,
              category: catName || "Fashion",
              price: p.price,
              originalPrice: p.mrp,
            };
          });
          setProducts(mapped);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <HeroSection />
       <EditorialProductCard/>
      <Shop />

      {/* Polaroid Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
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
        Featured Products
        </Typography>

        <div className="flex flex-wrap justify-center gap-8">
          {loading ? (
            Array.from(new Array(3)).map((_, index) => (
              <Box 
                key={index} 
                sx={{ 
                  width: { xs: '100%', sm: 300 }, 
                  p: 2, 
                  backgroundColor: 'var(--whiold-bg)',
                  boxShadow: 'var(--whiold-shadow-card)',
                }}
              >
                <Skeleton variant="rectangular" width="100%" height={320} />
                <Box sx={{ pt: 2 }}>
                  <Skeleton width="70%" height={24} sx={{ mx: 'auto' }} />
                  <Skeleton width="50%" height={20} sx={{ mx: 'auto' }} />
                </Box>
              </Box>
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <PolaroidProductCard
                key={product.id}
                product={product}
              />
            ))
          ) : (
            <div className="py-10 text-center text-gray-500 w-full">No products found.</div>
          )}
        </div>
      </section>

      <TheEditSection />
      <CraftImpact/>
      <BrandSection />
    </>
  );
};

export default Home;