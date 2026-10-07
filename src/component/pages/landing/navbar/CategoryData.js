import { Router } from "../../../../constants/router";

export const CATEGORIES = [
  {
    id: "men",
    name: "Men",
    slug: "men",
    path: Router.MEN || "/category/men",
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop",
    description: "Royal sherwanis, kurtas & bespoke bandhgalas",
    subcategories: [
      { id: "kurtas", name: "Kurtas" },
      { id: "sherwanis", name: "Sherwanis" },
      { id: "nehru-jackets", name: "Nehru Jackets" },
      { id: "bandhgalas", name: "Bandhgalas" },
      { id: "casual-fits", name: "Casual Fits" },
    ],
  },
  {
    id: "women",
    name: "Women",
    slug: "women",
    path: Router.WOMEN || "/category/women",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
    description: "Timeless sarees, bridal lehengas & suits",
    subcategories: [
      { id: "sarees", name: "Sarees" },
      { id: "lehengas", name: "Lehengas" },
      { id: "anarkalis", name: "Anarkalis" },
      { id: "suits", name: "Suits" },
      { id: "indo-western", name: "Indo-Western" },
    ],
  },
  {
    id: "kids",
    name: "Kids",
    slug: "kids",
    path: Router.KIDS || "/category/kids",
    image:
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop",
    description: "Festive sets & playful ethnic wear for kids",
    subcategories: [
      { id: "boys-ethnic", name: "Boys Ethnic" },
      { id: "girls-ethnic", name: "Girls Ethnic" },
      { id: "festive-sets", name: "Festive Sets" },
      { id: "everyday-wear", name: "Everyday Wear" },
    ],
  },
  {
    id: "sports",
    name: "Sports",
    slug: "sports",
    path: Router.SPORTS || "/category/sports",
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
    description: "High-performance activewear & training gear",
    subcategories: [
      { id: "activewear", name: "Activewear" },
      { id: "footwear", name: "Footwear" },
      { id: "trackpants", name: "Trackpants" },
      { id: "accessories", name: "Accessories" },
    ],
  },
  {
    id: "accessories",
    name: "Accessories",
    slug: "accessories",
    path: Router.ACCESSORIES || "/category/accessories",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    description: "Artisanal jewellery, embroidered potlis & juttis",
    subcategories: [
      { id: "jewellery", name: "Jewellery" },
      { id: "bags", name: "Bags" },
      { id: "footwear", name: "Footwear" },
      { id: "dupattas", name: "Dupattas" },
    ],
  },
];