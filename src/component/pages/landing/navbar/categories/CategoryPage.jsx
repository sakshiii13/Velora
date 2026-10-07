import React, { useState, useRef, useMemo, useLayoutEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Sparkles, ArrowRight, ChevronRight } from "lucide-react";
import { Router } from "../../../../../constants/router";
import ProductCard from "../../ProductCard";
import { getAllCategories } from "../../../../../api/admin/category.api";


const FRAUNCES = { fontFamily: "'Fraunces', serif", fontWeight: 500 };

/* ══════════════════════════════════════════════════════════════════
   CATEGORY_INFO — hero copy per category (title/highlight/desc/cta)
   ══════════════════════════════════════════════════════════════════ */
const CATEGORY_INFO = {
  men: {
    title: "Tailored",
    highlight: "for him.",
    description:
      "From festive bandhgalas to everyday kurtas — pieces built for how he actually lives.",
    button: "Shop Men's Collection",
  },
  women: {
    title: "Designed",
    highlight: "for her.",
    description:
      "Elegant sarees, lehengas and everyday styles crafted with timeless grace.",
    button: "Shop Women's Collection",
  },
  kids: {
    title: "Made",
    highlight: "for little ones.",
    description:
      "Comfortable, playful and festive outfits for every celebration.",
    button: "Shop Kids Collection",
  },
  sports: {
    title: "Built",
    highlight: "to perform.",
    description:
      "Activewear and sports essentials designed for movement and comfort.",
    button: "Shop Sports Collection",
  },
  accessories: {
    title: "Complete",
    highlight: "your look.",
    description: "Premium accessories that elevate every outfit.",
    button: "Shop Accessories",
  },
};

/* ══════════════════════════════════════════════════════════════════
   CATEGORY_DATA — per-category hero image, subcategory pills,
   promo banners, and (mock) product catalogue.
   Wire `products` up to your real API/store per category.
   ══════════════════════════════════════════════════════════════════ */
export const CATEGORY_DATA = {
  men: {
    heroImage:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1800&auto=format&fit=crop",
    subcategories: [
      { name: "Kurtas", image: "/kurta.jpg" },
      { name: "Sherwanis", image: "/shervani/shervani1.jpg" },
      { name: "Nehru Jackets", image: "/nehru.jpg" },
      { name: "Bandhgalas", image: "/bandhgalas.jpg" },
      { name: "Casual Fits", image: "/casual.jpg" },
    ],
    promoBanners: [
      {
        title: "The Wedding Edit",
        subtitle: "Sherwanis & bandhgalas cut for the big day",
        sub: "Sherwanis",
        image: "/shervani/shervani1.jpg",
      },
      {
        title: "Everyday Comfort",
        subtitle: "Kurtas & casual fits, made to move with you",
        sub: "Kurtas",
        image: "/kurta.jpg",
      },
    ],
    trendingLabel: "Trending in Men",
    products: [
      {
        id: 101,
        category: "Men",
        subcategory: "Kurtas",
        brand: "Whiold Atelier",
        name: "Chikankari Cotton Kurta",
        price: 1499,
        originalPrice: 1999,
        rating: 4.4,
        reviewCount: 89,
        badge: "Bestseller",
        sizes: ["S", "M", "L", "XL"],
        colors: [
          { name: "Ivory", hex: "#F2E1D9" },
          { name: "Sage", hex: "#8A9A7E" },
        ],
        description:
          "Hand-embroidered chikankari work on breathable cotton — a warm-weather staple built for festive and everyday wear alike.",
        details: [
          "100% pure cotton",
          "Hand chikankari embroidery",
          "Regular fit",
          "Made in Lucknow",
        ],
        images: [
          "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=900&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 102,
        category: "Men",
        subcategory: "Kurtas",
        brand: "Whiold Atelier",
        name: "Linen Straight Kurta",
        price: 1299,
        rating: 4.2,
        reviewCount: 54,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: [{ name: "Charcoal", hex: "#3D2115" }],
        description:
          "A relaxed straight-cut kurta in pure linen, breathable and effortless — built for humid afternoons and easy layering.",
        details: ["100% linen", "Straight fit", "Side slits", "Made in Jaipur"],
        images: [
          "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 103,
        category: "Men",
        subcategory: "Sherwanis",
        brand: "Whiold Atelier",
        name: "Zari Embroidered Sherwani",
        price: 6999,
        originalPrice: 8999,
        rating: 4.7,
        reviewCount: 132,
        badge: "Trending",
        sizes: ["M", "L", "XL"],
        colors: [
          { name: "Maroon", hex: "#6E1F2B" },
          { name: "Gold", hex: "#C9A24B" },
        ],
        description:
          "Statement zari embroidery on a structured silhouette — the centrepiece for a wedding wardrobe.",
        details: [
          "Silk blend fabric",
          "Hand zari embroidery",
          "Comes with matching stole",
          "Dry clean only",
        ],
        images: [
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 104,
        category: "Men",
        subcategory: "Sherwanis",
        brand: "Whiold Atelier",
        name: "Silk Blend Wedding Sherwani",
        price: 8499,
        rating: 4.6,
        reviewCount: 77,
        sizes: ["M", "L", "XL"],
        colors: [{ name: "Ivory", hex: "#F2E1D9" }],
        description:
          "Understated silk-blend sherwani with a tailored fit — for the groom who prefers quiet luxury over shine.",
        details: [
          "Silk blend",
          "Tailored fit",
          "Concealed button placket",
          "Made in Varanasi",
        ],
        images: [
          "https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 105,
        category: "Men",
        subcategory: "Nehru Jackets",
        brand: "Whiold Atelier",
        name: "Textured Nehru Jacket",
        price: 2199,
        originalPrice: 2799,
        rating: 4.3,
        reviewCount: 41,
        sizes: ["S", "M", "L", "XL"],
        colors: [{ name: "Charcoal", hex: "#3D2115" }],
        description:
          "A textured weave Nehru jacket that layers over kurtas or shirts alike — festive, not fussy.",
        details: [
          "Textured cotton blend",
          "Mandarin collar",
          "Two front pockets",
          "Made in India",
        ],
        images: [
          "https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 106,
        category: "Men",
        subcategory: "Bandhgalas",
        brand: "Whiold Atelier",
        name: "Velvet Bandhgala Set",
        price: 5499,
        rating: 4.5,
        reviewCount: 63,
        badge: "New",
        sizes: ["M", "L", "XL"],
        colors: [{ name: "Maroon", hex: "#6E1F2B" }],
        description:
          "A velvet bandhgala with a structured collar and matching trousers — evening-ready from the first fitting.",
        details: [
          "Velvet outer, satin lining",
          "Matching trousers included",
          "Structured collar",
          "Dry clean only",
        ],
        images: [
          "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 107,
        category: "Men",
        subcategory: "Casual Fits",
        brand: "Whiold Atelier",
        name: "Relaxed Fit Shirt-Kurta",
        price: 999,
        rating: 4.1,
        reviewCount: 36,
        sizes: ["S", "M", "L", "XL"],
        colors: [
          { name: "Sage", hex: "#8A9A7E" },
          { name: "Ivory", hex: "#F2E1D9" },
        ],
        description:
          "Somewhere between a shirt and a kurta — a weekend piece that goes from errands to dinner.",
        details: [
          "Cotton poplin",
          "Curved hem",
          "Relaxed fit",
          "Machine washable",
        ],
        images: [
          "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 108,
        category: "Men",
        subcategory: "Casual Fits",
        brand: "Whiold Atelier",
        name: "Everyday Cotton Co-ord",
        price: 1799,
        originalPrice: 2199,
        rating: 4.3,
        reviewCount: 58,
        sizes: ["S", "M", "L"],
        colors: [{ name: "Charcoal", hex: "#3D2115" }],
        description:
          "A matching cotton co-ord set built for warm days — light, breathable, zero fuss.",
        details: [
          "100% cotton",
          "Matching set",
          "Elasticated waist",
          "Made in India",
        ],
        images: [
          "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=900&auto=format&fit=crop",
        ],
      },
    ],
  },

  women: {
    heroImage: "/women-hero.jpg",
    subcategories: [
      { name: "Sarees", image: "/women-cats/saree.jpg" },
      { name: "Lehengas", image: "/women-cats/lehenga.jpg" },
      { name: "Anarkalis", image: "/women-cats/anarkali.jpg" },
      { name: "Suits", image: "/women-cats/suit.jpg" },
      { name: "Indo-Western", image: "/women-cats/indo-western.jpg" },
    ],
    promoBanners: [
      {
        title: "The Wedding Edit",
        subtitle: "Lehengas & sarees made for the big celebrations",
        sub: "Lehengas",
        image: "/women-cats/lehenga.jpg",
      },
      {
        title: "Everyday Grace",
        subtitle: "Suits & anarkalis for the everyday elegance",
        sub: "Suits",
        image: "/women-cats/suit.jpg",
      },
    ],
    trendingLabel: "Trending in Women",
    products: [
      {
        id: 201,
        category: "Women",
        subcategory: "Sarees",
        brand: "Whiold Atelier",
        name: "Banarasi Silk Saree",
        price: 4999,
        originalPrice: 6499,
        rating: 4.6,
        reviewCount: 104,
        badge: "Bestseller",
        sizes: ["Free Size"],
        colors: [
          { name: "Maroon", hex: "#6E1F2B" },
          { name: "Gold", hex: "#C9A24B" },
        ],
        description:
          "Woven on traditional handlooms, this Banarasi silk saree carries rich zari work — a timeless piece for weddings and festivities.",
        details: [
          "Pure silk",
          "Handwoven zari border",
          "Comes with unstitched blouse piece",
          "Dry clean only",
        ],
        images: [
          "/women-cats/saree.jpg",
          "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 202,
        category: "Women",
        subcategory: "Sarees",
        brand: "Whiold Atelier",
        name: "Chiffon Printed Saree",
        price: 1899,
        rating: 4.2,
        reviewCount: 58,
        sizes: ["Free Size"],
        colors: [{ name: "Sage", hex: "#8A9A7E" }],
        description:
          "A lightweight chiffon saree with delicate prints — drapes effortlessly for everyday and office wear.",
        details: [
          "100% chiffon",
          "Printed pattern",
          "Comes with matching blouse fabric",
          "Machine washable",
        ],
        images: [
          "/women-cats/chifon.jpg",
        ],
      },
      {
        id: 203,
        category: "Women",
        subcategory: "Lehengas",
        brand: "Whiold Atelier",
        name: "Embroidered Bridal Lehenga",
        price: 12999,
        originalPrice: 15999,
        rating: 4.8,
        reviewCount: 76,
        badge: "Trending",
        sizes: ["S", "M", "L", "XL"],
        colors: [
          { name: "Maroon", hex: "#6E1F2B" },
          { name: "Ivory", hex: "#F2E1D9" },
        ],
        description:
          "Heavily embroidered bridal lehenga with a flared silhouette — the centrepiece for wedding-day glamour.",
        details: [
          "Velvet base with net dupatta",
          "Hand embroidery",
          "Comes with matching blouse",
          "Dry clean only",
        ],
        images: [
          "/women-cats/Bridal-Lehenga.jpg",
        ],
      },
      {
        id: 204,
        category: "Women",
        subcategory: "Lehengas",
        brand: "Whiold Atelier",
        name: "Festive Georgette Lehenga",
        price: 6999,
        rating: 4.4,
        reviewCount: 39,
        sizes: ["S", "M", "L"],
        colors: [{ name: "Sage", hex: "#8A9A7E" }],
        description:
          "A flowy georgette lehenga with mirror-work detailing — light enough for sangeet nights and festive get-togethers.",
        details: [
          "Georgette fabric",
          "Mirror-work embellishment",
          "Includes dupatta",
          "Dry clean only",
        ],
        images: [
          "/women-cats/Georgette-Lehenga.jpg",
        ],
      },
      {
        id: 205,
        category: "Women",
        subcategory: "Anarkalis",
        brand: "Whiold Atelier",
        name: "Floor-Length Anarkali Suit",
        price: 3499,
        originalPrice: 4299,
        rating: 4.5,
        reviewCount: 65,
        sizes: ["S", "M", "L", "XL"],
        colors: [{ name: "Charcoal", hex: "#3D2115" }],
        description:
          "A flowing floor-length anarkali with fine thread embroidery — festive without being over the top.",
        details: [
          "Georgette outer, satin lining",
          "Thread embroidery",
          "Includes churidar & dupatta",
          "Dry clean only",
        ],
        images: [
          "/women-cats/anarkali.jpg",
        ],
      },
      {
        id: 206,
        category: "Women",
        subcategory: "Suits",
        brand: "Whiold Atelier",
        name: "Cotton Straight-Cut Suit Set",
        price: 1599,
        rating: 4.1,
        reviewCount: 47,
        sizes: ["S", "M", "L", "XL"],
        colors: [
          { name: "Ivory", hex: "#F2E1D9" },
          { name: "Sage", hex: "#8A9A7E" },
        ],
        description:
          "A crisp cotton straight-cut suit set built for everyday wear — comfortable through long workdays.",
        details: [
          "100% cotton",
          "Straight fit kurta",
          "Includes bottom & dupatta",
          "Machine washable",
        ],
        images: [
          "/women-cats/cotton.jpg",
        ],
      },
      {
        id: 207,
        category: "Women",
        subcategory: "Indo-Western",
        brand: "Whiold Atelier",
        name: "Cape-Sleeve Indo-Western Gown",
        price: 4499,
        rating: 4.3,
        reviewCount: 31,
        badge: "New",
        sizes: ["S", "M", "L"],
        colors: [{ name: "Gold", hex: "#C9A24B" }],
        description:
          "A cape-sleeve gown that blends silhouette-forward western tailoring with traditional embroidery accents.",
        details: [
          "Crepe fabric",
          "Attached cape sleeves",
          "Concealed side zip",
          "Dry clean only",
        ],
        images: [
          "/women-cats/Indo-Western.jpg",
        ],
      },
      {
        id: 208,
        category: "Women",
        subcategory: "Indo-Western",
        brand: "Whiold Atelier",
        name: "Dhoti-Style Co-ord Set",
        price: 2799,
        originalPrice: 3299,
        rating: 4.2,
        reviewCount: 28,
        sizes: ["S", "M", "L"],
        colors: [{ name: "Maroon", hex: "#6E1F2B" }],
        description:
          "A dhoti-pant co-ord set with a fitted crop jacket — fusion styling for cocktail nights and sundowners.",
        details: [
          "Silk blend",
          "Matching set",
          "Elasticated dhoti waist",
          "Dry clean only",
        ],
        images: [
          "/women-cats/dhoti.jpg",
        ],
      },
    ],
  },

  kids: {
    heroImage:
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1800&auto=format&fit=crop",
    subcategories: [
      {
        name: "Boys Ethnic",
        image:
          "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Girls Ethnic",
        image:
          "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Festive Sets",
        image:
          "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Everyday Wear",
        image:
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=800&auto=format&fit=crop",
      },
    ],
    promoBanners: [
      {
        title: "Festive Edit",
        subtitle: "Sets made for celebrations, sized for little ones",
        sub: "Festive Sets",
        image:
          "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1200&auto=format&fit=crop",
      },
      {
        title: "Everyday Play",
        subtitle: "Comfortable everyday wear built for movement",
        sub: "Everyday Wear",
        image:
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    trendingLabel: "Trending in Kids",
    products: [
      {
        id: 301,
        category: "Kids",
        subcategory: "Boys Ethnic",
        brand: "Whiold Atelier",
        name: "Boys Silk Kurta-Pajama Set",
        price: 1299,
        originalPrice: 1699,
        rating: 4.5,
        reviewCount: 42,
        badge: "Bestseller",
        sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
        colors: [
          { name: "Gold", hex: "#C9A24B" },
          { name: "Ivory", hex: "#F2E1D9" },
        ],
        description:
          "A festive silk kurta-pajama set for little ones — comfortable enough for a full day of celebrations.",
        details: [
          "Silk blend",
          "Elasticated pajama waist",
          "Machine washable",
          "Made in India",
        ],
        images: [
          "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 302,
        category: "Kids",
        subcategory: "Boys Ethnic",
        brand: "Whiold Atelier",
        name: "Boys Nehru Jacket Set",
        price: 1599,
        rating: 4.3,
        reviewCount: 27,
        sizes: ["3-4Y", "5-6Y", "7-8Y"],
        colors: [{ name: "Charcoal", hex: "#3D2115" }],
        description:
          "A miniature Nehru jacket set that dresses up any festive kurta in seconds.",
        details: [
          "Textured cotton blend",
          "Mandarin collar",
          "Two-piece set",
          "Dry clean recommended",
        ],
        images: [
          "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 303,
        category: "Kids",
        subcategory: "Girls Ethnic",
        brand: "Whiold Atelier",
        name: "Girls Anarkali Frock",
        price: 1399,
        originalPrice: 1799,
        rating: 4.6,
        reviewCount: 51,
        badge: "New",
        sizes: ["2-3Y", "4-5Y", "6-7Y"],
        colors: [
          { name: "Maroon", hex: "#6E1F2B" },
          { name: "Sage", hex: "#8A9A7E" },
        ],
        description:
          "A flowing anarkali frock with delicate embroidery — festive twirl-friendly styling for little girls.",
        details: [
          "Georgette outer, cotton lining",
          "Thread embroidery",
          "Back zip closure",
          "Dry clean only",
        ],
        images: [
          "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 304,
        category: "Kids",
        subcategory: "Girls Ethnic",
        brand: "Whiold Atelier",
        name: "Girls Lehenga Choli Set",
        price: 1899,
        rating: 4.4,
        reviewCount: 33,
        sizes: ["3-4Y", "5-6Y", "7-8Y"],
        colors: [{ name: "Gold", hex: "#C9A24B" }],
        description:
          "A mini lehenga choli set with lightweight flare — built for dancing through every function.",
        details: [
          "Net skirt with satin lining",
          "Sequin work",
          "Includes dupatta",
          "Dry clean only",
        ],
        images: [
          "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 305,
        category: "Kids",
        subcategory: "Festive Sets",
        brand: "Whiold Atelier",
        name: "Twinning Sibling Festive Set",
        price: 2199,
        originalPrice: 2699,
        rating: 4.5,
        reviewCount: 22,
        badge: "Trending",
        sizes: ["S", "M", "L"],
        colors: [{ name: "Ivory", hex: "#F2E1D9" }],
        description:
          "A coordinated festive set designed for siblings to match on the big day.",
        details: [
          "Cotton silk blend",
          "Coordinated prints",
          "Machine washable",
          "Made in India",
        ],
        images: [
          "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 306,
        category: "Kids",
        subcategory: "Festive Sets",
        brand: "Whiold Atelier",
        name: "Diwali Special Co-ord Set",
        price: 1699,
        rating: 4.2,
        reviewCount: 19,
        sizes: ["2-3Y", "4-5Y", "6-7Y"],
        colors: [{ name: "Maroon", hex: "#6E1F2B" }],
        description:
          "A festive co-ord set with subtle shimmer detailing — built for Diwali evenings and family photos.",
        details: [
          "Cotton blend",
          "Shimmer thread accents",
          "Two-piece set",
          "Machine washable",
        ],
        images: [
          "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 307,
        category: "Kids",
        subcategory: "Everyday Wear",
        brand: "Whiold Atelier",
        name: "Everyday Cotton Kurta Set",
        price: 799,
        originalPrice: 999,
        rating: 4.1,
        reviewCount: 36,
        sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
        colors: [
          { name: "Sage", hex: "#8A9A7E" },
          { name: "Charcoal", hex: "#3D2115" },
        ],
        description:
          "A simple cotton kurta set built for school functions and everyday festive moments alike.",
        details: [
          "100% cotton",
          "Relaxed fit",
          "Machine washable",
          "Made in India",
        ],
        images: [
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 308,
        category: "Kids",
        subcategory: "Everyday Wear",
        brand: "Whiold Atelier",
        name: "Casual Playwear Set",
        price: 699,
        rating: 4.0,
        reviewCount: 15,
        sizes: ["3-4Y", "5-6Y", "7-8Y"],
        colors: [{ name: "Ivory", hex: "#F2E1D9" }],
        description:
          "A soft, breathable playwear set made to keep up with an active day.",
        details: [
          "Cotton jersey",
          "Elasticated waist",
          "Machine washable",
          "Made in India",
        ],
        images: [
          "https://images.unsplash.com/photo-1471286174890-9c112ffca564?q=80&w=900&auto=format&fit=crop",
        ],
      },
    ],
  },

  sports: {
    heroImage:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1800&auto=format&fit=crop",
    subcategories: [
      {
        name: "Activewear",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Footwear",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Trackpants",
        image:
          "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Accessories",
        image:
          "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?q=80&w=800&auto=format&fit=crop",
      },
    ],
    promoBanners: [
      {
        title: "Performance Edit",
        subtitle: "Activewear built to move with you",
        sub: "Activewear",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop",
      },
      {
        title: "Everyday Training",
        subtitle: "Trackpants & footwear for daily workouts",
        sub: "Trackpants",
        image:
          "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    trendingLabel: "Trending in Sports",
    products: [
      {
        id: 401,
        category: "Sports",
        subcategory: "Activewear",
        brand: "Whiold Atelier",
        name: "Performance Training Tee",
        price: 899,
        originalPrice: 1199,
        rating: 4.4,
        reviewCount: 61,
        badge: "Bestseller",
        sizes: ["S", "M", "L", "XL"],
        colors: [
          { name: "Charcoal", hex: "#3D2115" },
          { name: "Sage", hex: "#8A9A7E" },
        ],
        description:
          "A moisture-wicking training tee built to stay light through the toughest sets.",
        details: [
          "Polyester-spandex blend",
          "Quick-dry fabric",
          "Regular fit",
          "Machine washable",
        ],
        images: [
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 402,
        category: "Sports",
        subcategory: "Activewear",
        brand: "Whiold Atelier",
        name: "Seamless Training Leggings",
        price: 1299,
        rating: 4.6,
        reviewCount: 44,
        sizes: ["S", "M", "L", "XL"],
        colors: [{ name: "Charcoal", hex: "#3D2115" }],
        description:
          "Seamless-knit leggings with four-way stretch — built to move through every rep.",
        details: [
          "Four-way stretch fabric",
          "High-rise waistband",
          "Squat-proof",
          "Machine washable",
        ],
        images: [
          "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 403,
        category: "Sports",
        subcategory: "Footwear",
        brand: "Whiold Atelier",
        name: "Cushioned Running Shoes",
        price: 2799,
        originalPrice: 3499,
        rating: 4.5,
        reviewCount: 89,
        badge: "Trending",
        sizes: ["6", "7", "8", "9", "10"],
        colors: [{ name: "Ivory", hex: "#F2E1D9" }],
        description:
          "Lightweight running shoes with responsive cushioning for daily miles.",
        details: [
          "Breathable mesh upper",
          "EVA midsole",
          "Rubber outsole",
          "Lace-up closure",
        ],
        images: [
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 404,
        category: "Sports",
        subcategory: "Footwear",
        brand: "Whiold Atelier",
        name: "Everyday Training Sneakers",
        price: 1999,
        rating: 4.2,
        reviewCount: 37,
        sizes: ["6", "7", "8", "9", "10"],
        colors: [{ name: "Sage", hex: "#8A9A7E" }],
        description:
          "Versatile training sneakers built for gym floors and everyday errands alike.",
        details: [
          "Synthetic upper",
          "Cushioned insole",
          "Non-slip sole",
          "Lace-up closure",
        ],
        images: [
          "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 405,
        category: "Sports",
        subcategory: "Trackpants",
        brand: "Whiold Atelier",
        name: "Tapered Fit Trackpants",
        price: 1199,
        originalPrice: 1499,
        rating: 4.3,
        reviewCount: 52,
        sizes: ["S", "M", "L", "XL"],
        colors: [
          { name: "Charcoal", hex: "#3D2115" },
          { name: "Ivory", hex: "#F2E1D9" },
        ],
        description:
          "Tapered trackpants with a relaxed fit through the thigh and a snug ankle cuff.",
        details: [
          "Cotton-poly blend",
          "Zippered pockets",
          "Elasticated drawstring waist",
          "Machine washable",
        ],
        images: [
          "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 406,
        category: "Sports",
        subcategory: "Trackpants",
        brand: "Whiold Atelier",
        name: "Fleece-Lined Joggers",
        price: 1399,
        rating: 4.1,
        reviewCount: 28,
        sizes: ["S", "M", "L"],
        colors: [{ name: "Sage", hex: "#8A9A7E" }],
        description:
          "Fleece-lined joggers built for warmth on cooler training days.",
        details: [
          "Fleece-lined interior",
          "Ribbed cuffs",
          "Side pockets",
          "Machine washable",
        ],
        images: [
          "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 407,
        category: "Sports",
        subcategory: "Accessories",
        brand: "Whiold Atelier",
        name: "Quick-Dry Gym Towel Set",
        price: 499,
        originalPrice: 699,
        rating: 4.0,
        reviewCount: 21,
        sizes: ["Free Size"],
        colors: [{ name: "Gold", hex: "#C9A24B" }],
        description:
          "A set of quick-dry microfiber towels sized for gym bags and travel.",
        details: [
          "Microfiber fabric",
          "Set of 2",
          "Compact fold",
          "Machine washable",
        ],
        images: [
          "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 408,
        category: "Sports",
        subcategory: "Accessories",
        brand: "Whiold Atelier",
        name: "Adjustable Sports Cap",
        price: 599,
        rating: 4.2,
        reviewCount: 17,
        sizes: ["Free Size"],
        colors: [{ name: "Charcoal", hex: "#3D2115" }],
        description:
          "A breathable sports cap with an adjustable strap for a snug, all-day fit.",
        details: [
          "Breathable mesh panels",
          "Adjustable strap",
          "Curved brim",
          "Machine washable",
        ],
        images: [
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=900&auto=format&fit=crop",
        ],
      },
    ],
  },

  accessories: {
    heroImage:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1800&auto=format&fit=crop",
    subcategories: [
      {
        name: "Jewellery",
        image:
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Bags",
        image:
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Footwear",
        image:
          "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Dupattas",
        image:
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
      },
    ],
    promoBanners: [
      {
        title: "The Finishing Touch",
        subtitle: "Jewellery & dupattas that complete the look",
        sub: "Jewellery",
        image:
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop",
      },
      {
        title: "Everyday Carry",
        subtitle: "Bags & footwear for daily essentials",
        sub: "Bags",
        image:
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    trendingLabel: "Trending in Accessories",
    products: [
      {
        id: 501,
        category: "Accessories",
        subcategory: "Jewellery",
        brand: "Whiold Atelier",
        name: "Kundan Choker Necklace Set",
        price: 2499,
        originalPrice: 3199,
        rating: 4.6,
        reviewCount: 58,
        badge: "Bestseller",
        sizes: ["Free Size"],
        colors: [{ name: "Gold", hex: "#C9A24B" }],
        description:
          "A statement kundan choker set that pairs beautifully with sarees and lehengas alike.",
        details: [
          "Kundan and pearl detailing",
          "Adjustable dori closure",
          "Includes matching earrings",
          "Store in a dry pouch",
        ],
        images: [
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 502,
        category: "Accessories",
        subcategory: "Jewellery",
        brand: "Whiold Atelier",
        name: "Oxidised Silver Jhumkas",
        price: 899,
        rating: 4.3,
        reviewCount: 41,
        sizes: ["Free Size"],
        colors: [{ name: "Charcoal", hex: "#3D2115" }],
        description:
          "Classic oxidised jhumkas that dress up both ethnic and Indo-western outfits.",
        details: [
          "Oxidised silver finish",
          "Lightweight build",
          "Push-back closure",
          "Store away from moisture",
        ],
        images: [
          "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 503,
        category: "Accessories",
        subcategory: "Bags",
        brand: "Whiold Atelier",
        name: "Embroidered Potli Bag",
        price: 1299,
        originalPrice: 1699,
        rating: 4.4,
        reviewCount: 33,
        badge: "New",
        sizes: ["Free Size"],
        colors: [
          { name: "Maroon", hex: "#6E1F2B" },
          { name: "Gold", hex: "#C9A24B" },
        ],
        description:
          "A hand-embroidered potli bag sized to carry the essentials through a wedding evening.",
        details: [
          "Silk blend outer",
          "Drawstring closure",
          "Hand embroidery",
          "Dry clean only",
        ],
        images: [
          "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 504,
        category: "Accessories",
        subcategory: "Bags",
        brand: "Whiold Atelier",
        name: "Everyday Structured Tote",
        price: 1799,
        rating: 4.2,
        reviewCount: 26,
        sizes: ["Free Size"],
        colors: [{ name: "Ivory", hex: "#F2E1D9" }],
        description:
          "A structured tote built for everyday carry, from office days to weekend errands.",
        details: [
          "Vegan leather",
          "Interior zip pocket",
          "Reinforced handles",
          "Wipe clean",
        ],
        images: [
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 505,
        category: "Accessories",
        subcategory: "Footwear",
        brand: "Whiold Atelier",
        name: "Embellished Juttis",
        price: 1499,
        originalPrice: 1899,
        rating: 4.5,
        reviewCount: 47,
        badge: "Trending",
        sizes: ["36", "37", "38", "39", "40"],
        colors: [{ name: "Gold", hex: "#C9A24B" }],
        description:
          "Hand-embellished juttis that bring festive detailing to every step.",
        details: [
          "Genuine leather sole",
          "Hand embroidery",
          "Cushioned footbed",
          "Store in a dust bag",
        ],
        images: [
          "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 506,
        category: "Accessories",
        subcategory: "Footwear",
        brand: "Whiold Atelier",
        name: "Block Heel Sandals",
        price: 1699,
        rating: 4.1,
        reviewCount: 29,
        sizes: ["36", "37", "38", "39", "40"],
        colors: [{ name: "Charcoal", hex: "#3D2115" }],
        description:
          "Comfortable block heel sandals that carry through long festive evenings.",
        details: [
          "Synthetic leather straps",
          "Cushioned block heel",
          "Buckle closure",
          "Wipe clean",
        ],
        images: [
          "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 507,
        category: "Accessories",
        subcategory: "Dupattas",
        brand: "Whiold Atelier",
        name: "Zari Border Silk Dupatta",
        price: 1099,
        originalPrice: 1399,
        rating: 4.4,
        reviewCount: 38,
        sizes: ["Free Size"],
        colors: [{ name: "Maroon", hex: "#6E1F2B" }],
        description:
          "A pure silk dupatta with a hand-finished zari border — the finishing touch for festive suits.",
        details: [
          "Pure silk",
          "Hand-finished zari border",
          "2.5m length",
          "Dry clean only",
        ],
        images: [
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        id: 508,
        category: "Accessories",
        subcategory: "Dupattas",
        brand: "Whiold Atelier",
        name: "Organza Printed Dupatta",
        price: 699,
        rating: 4.0,
        reviewCount: 19,
        sizes: ["Free Size"],
        colors: [{ name: "Sage", hex: "#8A9A7E" }],
        description:
          "A lightweight organza dupatta with a delicate print, easy to drape and layer.",
        details: [
          "100% organza",
          "Printed pattern",
          "2.25m length",
          "Hand wash recommended",
        ],
        images: [
          "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=900&auto=format&fit=crop",
        ],
      },
    ],
  },
};

export const findCategoryProductById = (id) => {
  if (!id) return null;
  const idStr = String(id);
  for (const cat of Object.values(CATEGORY_DATA)) {
    const found = cat.products?.find(
      (p) => String(p.id) === idStr || String(p._id) === idStr
    );
    if (found) {
      const imgs = found.images?.length
        ? found.images
        : found.image
        ? [found.image]
        : [];
      return {
        ...found,
        _id: String(found.id || found._id),
        id: found.id || found._id,
        brand: found.brand || "Whiold Atelier",
        mrp: found.originalPrice || found.mrp || found.price,
        originalPrice: found.originalPrice || found.mrp,
        price: found.price,
        sizes: found.sizes || ["S", "M", "L", "XL"],
        details: found.details || ["Made in India", "Premium Quality"],
        colors: found.colors || [],
        images: imgs,
        image: imgs[0] || "",
      };
    }
  }
  return null;
};

const CategoryPage = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const subParam = searchParams.get("sub");

  const activeCategory = CATEGORY_DATA[category] ? category : "men";

  const pageData = CATEGORY_INFO[activeCategory] || CATEGORY_INFO.men;
  const { heroImage, subcategories, promoBanners, trendingLabel, products } =
    CATEGORY_DATA[activeCategory];

  const [activeSub, setActiveSub] = useState("All");

  const heroRef = useRef(null);
  const pillsRef = useRef(null);
  const promoRef = useRef(null);
  const gridRef = useRef(null);
  const gridSectionRef = useRef(null);

  // Sync active pill with URL sub param or reset on category change
  useLayoutEffect(() => {
    if (subParam) {
      setActiveSub(subParam);
      setTimeout(() => {
        gridSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    } else {
      setActiveSub("All");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeCategory, subParam]);

  // ── Fraunces font — skip if already injected elsewhere (e.g. HeroSection) ──
  useLayoutEffect(() => {
    if (document.getElementById("whiold-fraunces-font")) return;
    const link = document.createElement("link");
    link.id = "whiold-fraunces-font";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,500&display=swap";
    document.head.appendChild(link);
  }, []);

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Entrance animations ──
  useLayoutEffect(() => {
    if (reduceMotion) return;
    const ctx = gsap.context(() => {
      gsap.set(heroRef.current, { opacity: 0, y: 24 });
      gsap.to(heroRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.1,
      });

      if (pillsRef.current) {
        gsap.set(pillsRef.current.children, { opacity: 0, y: 14 });
        gsap.to(pillsRef.current.children, {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.06,
          ease: "power2.out",
          delay: 0.15,
        });
      }

      if (promoRef.current) {
        gsap.set(promoRef.current.children, { opacity: 0, y: 20 });
        gsap.to(promoRef.current.children, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        });
      }
    });
    return () => ctx.revert();
  }, [activeCategory]);

  // ── Re-run a light fade-in whenever the filtered set changes ──
  useLayoutEffect(() => {
    if (reduceMotion || !gridRef.current) return;
    gsap.fromTo(
      gridRef.current.children,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" },
    );
  }, [activeSub]);

  const filteredProducts = useMemo(
    () =>
      activeSub === "All"
        ? products
        : products.filter((p) => p.subcategory === activeSub),
    [activeSub, products],
  );

  const handleSelectSub = (name) => setActiveSub(name);

  const scrollToGrid = () =>
    gridSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

  const MAIN_CATEGORIES = [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "sports", label: "Sports" },
    { id: "accessories", label: "Accessories" },
  ];

  return (
    <section className="w-full" style={{ background: "var(--whiold-bg)" }}>
      {/* ══ STICKY TOP CATEGORY SELECTOR RAIL ══ */}
      <div className="sticky top-0 z-30 w-full border-b border-[var(--whiold-border)] bg-[rgba(255,255,255,0.92)] backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-start sm:justify-center gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {MAIN_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className={`relative min-h-[44px] min-w-[76px] flex items-center justify-center px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 shrink-0 select-none ${
                  isActive
                    ? "text-white shadow-md"
                    : "text-[var(--whiold-text-body)] hover:text-[var(--whiold-primary)] bg-[var(--whiold-bg-input)] hover:bg-[var(--whiold-primary-soft)]"
                }`}
                style={
                  isActive
                    ? { background: "var(--whiold-gradient-brand)" }
                    : {}
                }
              >
                {cat.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ══ HERO ══ */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(420px, 62dvh, 640px)" }}
      >
        <img
          src={heroImage}
          alt={`${activeCategory} collection`}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,14,10,0.1) 20%, rgba(20,14,10,0.78) 100%), linear-gradient(90deg, rgba(20,14,10,0.5) 0%, rgba(20,14,10,0) 60%)",
          }}
          aria-hidden="true"
        />

        <div className="absolute inset-0 flex flex-col justify-end px-4 pb-10 sm:px-8 sm:pb-14 lg:px-16 lg:pb-16">
          <nav className="mb-3 flex items-center gap-1.5 text-[11px] font-medium text-white/70">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight size={11} />
            <span className="text-white">
              {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
            </span>
          </nav>

          <div ref={heroRef} className="max-w-[540px]">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
              <Sparkles size={13} className="text-[#E8B98F]" />
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/85">
                New Season Edit
              </span>
            </div>

            <h1
              className="m-0 text-[38px] leading-[1.05] text-white sm:text-[52px] lg:text-[62px]"
              style={FRAUNCES}
            >
              {pageData.title}{" "}
              <em className="italic text-[#E8B98F]" style={{ fontWeight: 500 }}>
                {pageData.highlight}
              </em>
            </h1>

            <p className="mt-4 max-w-[420px] text-[14.5px] leading-relaxed text-white/75">
              {pageData.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={scrollToGrid}
                className="group inline-flex items-center gap-2 rounded-[var(--whiold-radius-md)] bg-white px-6 py-3.5 text-[13px] font-semibold uppercase tracking-wide shadow-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ color: "var(--whiold-primary)" }}
              >
                {pageData.button}
                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══ SUBCATEGORY QUICK-NAV ══ */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-8 lg:px-16">
        <h2 className="m-0 mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--whiold-text-muted)]">
          Shop by Category
        </h2>
        <div
          ref={pillsRef}
          className="flex gap-4 overflow-x-auto
             pt-2 pl-2 pr-2 pb-3
             [-ms-overflow-style:none]
             [scrollbar-width:none]
             [&::-webkit-scrollbar]:hidden"
        >
          <button
            type="button"
            onClick={() => handleSelectSub("All")}
            className="flex flex-shrink-0 flex-col items-center gap-2"
          >
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-full border-1 text-[11px] font-semibold uppercase tracking-wide transition-all duration-200 sm:h-20 sm:w-20 ${
                activeSub === "All"
                  ? "border-[var(--whiold-primary)] bg-[var(--whiold-primary-soft)] text-[var(--whiold-primary)] scale-105"
                  : "border-[var(--whiold-border)] text-[var(--whiold-text-muted)] hover:border-[var(--whiold-primary)]"
              }`}
            >
              All
            </span>
            <span
              className={`text-[11.5px] font-medium ${
                activeSub === "All"
                  ? "text-[var(--whiold-primary)]"
                  : "text-[var(--whiold-text-body)]"
              }`}
            >
              Everything
            </span>
          </button>

          {subcategories.map((sub) => (
            <button
              key={sub.name}
              type="button"
              onClick={() => handleSelectSub(sub.name)}
              className="flex flex-shrink-0 flex-col items-center gap-2"
            >
              <span
                className={`block h-16 w-16 overflow-hidden rounded-full border-2 transition-all duration-200 sm:h-20 sm:w-20 ${
                  activeSub === sub.name
                    ? "border-[var(--whiold-primary)] scale-105"
                    : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={sub.image}
                  alt={sub.name}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </span>
              <span
                className={`whitespace-nowrap text-[11.5px] font-medium ${
                  activeSub === sub.name
                    ? "text-[var(--whiold-primary)]"
                    : "text-[var(--whiold-text-body)]"
                }`}
              >
                {sub.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ══ PROMO SPLIT BANNER ══ */}
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-8 lg:px-16">
        <div ref={promoRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {promoBanners.map((b) => (
            <button
              key={b.title}
              type="button"
              onClick={() => {
                handleSelectSub(b.sub);
                scrollToGrid();
              }}
              className="group relative block h-[240px] w-full overflow-hidden rounded-[var(--whiold-radius-lg)] text-left sm:h-[300px]"
            >
              <img
                src={b.image}
                alt={b.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                draggable={false}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(20,14,10,0.75) 0%, rgba(20,14,10,0.1) 55%, rgba(20,14,10,0) 100%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <h3
                  className="m-0 text-[21px] text-white sm:text-[25px]"
                  style={FRAUNCES}
                >
                  {b.title}
                </h3>
                <p className="mt-1 max-w-[280px] text-[12.5px] text-white/80">
                  {b.subtitle}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-white">
                  Shop now
                  <ArrowRight
                    size={13}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ══ PRODUCT GRID ══ */}
      <div
        ref={gridSectionRef}
        className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-16 sm:px-8 lg:px-16"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              className="m-0 text-[23px] text-[var(--whiold-text-heading)] sm:text-[27px]"
              style={FRAUNCES}
            >
              {activeSub === "All" ? trendingLabel : activeSub}
            </h2>
            <p className="mt-1 text-[13px] text-[var(--whiold-text-muted)]">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "piece" : "pieces"}
            </p>
          </div>
          <Link
            to={`${Router.CATEGORY}?category=${activeCategory}`}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold uppercase tracking-wide text-[var(--whiold-primary)] transition-colors hover:text-[var(--whiold-primary-hover)]"
          >
            View all
            <ArrowRight size={13} />
          </Link>
        </div>

        {filteredProducts.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 rounded-[var(--whiold-radius-lg)] border border-dashed border-[var(--whiold-border)] py-16 text-center">
            <p className="m-0 text-[14px] font-medium text-[var(--whiold-text-heading)]">
              No pieces here yet
            </p>
            <p className="m-0 text-[12.5px] text-[var(--whiold-text-muted)]">
              Check back soon, or explore another category above.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryPage;