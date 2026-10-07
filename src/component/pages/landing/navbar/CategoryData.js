import { Router } from "../../../../constants/router";


export const CATEGORIES = [
  {
    id: "men",
    name: "Men",
    slug: "men",
    path: Router.MEN,
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop",
    subcategories: ["Kurtas", "Sherwanis", "Nehru Jackets", "Bandhgalas", "Casual Fits"],
  },
  {
    id: "women",
    name: "Women",
    slug: "women",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
    subcategories: ["Sarees", "Lehengas", "Anarkalis", "Suits", "Indo-Western"],
  },
  {
    id: "kids",
    name: "Kids",
    slug: "kids",
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=800&auto=format&fit=crop",
    subcategories: ["Boys Ethnic", "Girls Ethnic", "Festive Sets", "Everyday Wear"],
  },
  {
    id: "sports",
    name: "Sports",
    slug: "sports",
    image:
      "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=800&auto=format&fit=crop",
    subcategories: ["Activewear", "Footwear", "Trackpants", "Accessories"],
  },
  {
    id: "accessories",
    name: "Accessories",
    slug: "accessories",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
    subcategories: ["Jewellery", "Bags", "Footwear", "Dupattas"],
  },
];