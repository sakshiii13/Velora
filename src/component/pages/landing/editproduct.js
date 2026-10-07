const products = [
  {
    id: 1,
    name: "Premium Cotton T-Shirt",
    brand: "Whiold",
    category: "Fashion",

    price: 1499,
    originalPrice: 1999,

    rating: 4.7,
    reviewCount: 124,

    tag: "New Arrival",

    description:
      "Premium heavyweight cotton t-shirt with relaxed fit.",

    colors: [
      {
        name: "White",
        hex: "#ffffff",
      },
      {
        name: "Black",
        hex: "#222222",
      },
      {
        name: "Blue",
        hex: "#4b6cb7",
      },
    ],

    sizes: ["S", "M", "L", "XL"],

    details: [
      "100% Cotton",
      "Machine Wash",
      "Relaxed Fit",
      "Made in India",
    ],

    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800",
    ],
  },

  {
    id: 2,
    name: "Running Sneakers",
    brand: "Nike",
    category: "Shoes",

    price: 2999,
    originalPrice: 3999,

    rating: 4.8,
    reviewCount: 84,

    tag: "Trending",

    description:
      "Lightweight sneakers for daily running.",

    colors: [
      {
        name: "Red",
        hex: "#ff3b30",
      },
      {
        name: "Black",
        hex: "#000",
      },
    ],

    sizes: ["7", "8", "9", "10"],

    details: [
      "Breathable Mesh",
      "Rubber Sole",
      "Cushioned Footbed",
    ],

    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800",
    ],
  },
];

export default products;