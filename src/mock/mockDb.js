/**
 * DEMO CREDENTIALS:
 * Customer: user@whiold.com / password 123456
 * Admin: admin@whiold.com / password 123456
 * OTP: 123456 (always accepted)
 */

const STORAGE_KEYS = {
  CATEGORIES: "whiold_mock_categories",
  SUBCATEGORIES: "whiold_mock_subcategories",
  BRANDS: "whiold_mock_brands",
  PRODUCTS: "whiold_mock_products",
  USERS: "whiold_mock_users",
  ORDERS: "whiold_mock_orders",
  TICKETS: "whiold_mock_tickets",
  CART: "whiold_mock_cart",
};

const SEED_CATEGORIES = [
  { _id: "cat-1", name: "Saree", title: "Saree", slug: "saree", image: "/women-cats/women-cat1.png", isActive: true },
  { _id: "cat-2", name: "Lehenga", title: "Lehenga", slug: "lehenga", image: "/women-cats/women-cat2.png", isActive: true },
  { _id: "cat-3", name: "Bridal Lehenga", title: "Bridal Lehenga", slug: "bridal-lehenga", image: "/women-cats/women-cat3.png", isActive: true },
  { _id: "cat-4", name: "Georgette Lehenga", title: "Georgette Lehenga", slug: "georgette-lehenga", image: "/women-cats/women-cat4.png", isActive: true },
  { _id: "cat-5", name: "Anarkali", title: "Anarkali", slug: "anarkali", image: "/women-cats/women-cat5.png", isActive: true },
  { _id: "cat-6", name: "Suit", title: "Suit", slug: "suit", image: "/women-cats/women-cat6.png", isActive: true },
  { _id: "cat-7", name: "Indo-Western", title: "Indo-Western", slug: "indo-western", image: "/women-cats/women-cat7.png", isActive: true },
  { _id: "cat-8", name: "Dhoti", title: "Dhoti", slug: "dhoti", image: "/women-cats/women-cat8.png", isActive: true },
  { _id: "cat-9", name: "Cotton", title: "Cotton", slug: "cotton", image: "/women-cats/women-cat9.png", isActive: true },
  { _id: "cat-10", name: "Chiffon", title: "Chiffon", slug: "chiffon", image: "/women-cats/women-cat10.png", isActive: true },
  { _id: "cat-11", name: "Kurta", title: "Kurta", slug: "kurta", image: "/kurta.jpg", isActive: true },
  { _id: "cat-12", name: "Sherwani", title: "Sherwani", slug: "sherwani", image: "/shervani/shervani1.jpg", isActive: true },
  { _id: "cat-13", name: "Nehru Jacket", title: "Nehru Jacket", slug: "nehru-jacket", image: "/nehru.jpg", isActive: true },
  { _id: "cat-14", name: "Bandhgala", title: "Bandhgala", slug: "bandhgala", image: "/bandhgalas.jpg", isActive: true },
  { _id: "cat-15", name: "Denim", title: "Denim", slug: "denim", image: "/casual.jpg", isActive: true },
  { _id: "cat-16", name: "Linen", title: "Linen", slug: "linen", image: "/items/item1.png", isActive: false },
];

const SEED_SUBCATEGORIES = [
  { _id: "sub-1", name: "Silk Sarees", category: "cat-1", slug: "silk-sarees", image: "/women-cats/women-cat1.png", isActive: true },
  { _id: "sub-2", name: "Cotton Sarees", category: "cat-1", slug: "cotton-sarees", image: "/women-cats/women-cat9.png", isActive: true },
  { _id: "sub-3", name: "Bridal Lehengas", category: "cat-2", slug: "bridal-lehengas", image: "/women-cats/women-cat3.png", isActive: true },
  { _id: "sub-4", name: "Partywear Lehengas", category: "cat-2", slug: "partywear-lehengas", image: "/women-cats/women-cat2.png", isActive: true },
  { _id: "sub-5", name: "Festive Kurtas", category: "cat-11", slug: "festive-kurtas", image: "/kurta.jpg", isActive: true },
  { _id: "sub-6", name: "Royal Sherwanis", category: "cat-12", slug: "royal-sherwanis", image: "/shervani/shervani1.jpg", isActive: true },
  { _id: "sub-7", name: "Silk Nehru Jackets", category: "cat-13", slug: "silk-nehru-jackets", image: "/nehru.jpg", isActive: true },
  { _id: "sub-8", name: "Embroidered Bandhgalas", category: "cat-14", slug: "embroidered-bandhgalas", image: "/bandhgalas.jpg", isActive: true },
];

const SEED_BRANDS = [
  { _id: "brand-1", title: "Manyavar", tagline: "Celebration Wear", image: { imageUrl: "/shervani/shervani1.jpg", imageId: "b-1" }, website: "manyavar.com", isActive: true, featured: true },
  { _id: "brand-2", title: "Sabyasachi", tagline: "Heritage Indian Craft", image: { imageUrl: "/women-cats/women-cat3.png", imageId: "b-2" }, website: "sabyasachi.com", isActive: true, featured: true },
  { _id: "brand-3", title: "FabIndia", tagline: "Celebrate India", image: { imageUrl: "/kurta.jpg", imageId: "b-3" }, website: "fabindia.com", isActive: true, featured: true },
  { _id: "brand-4", title: "Raw Mango", tagline: "Contemporary Handloom", image: { imageUrl: "/women-cats/women-cat1.png", imageId: "b-4" }, website: "rawmango.com", isActive: true, featured: true },
  { _id: "brand-5", title: "Anita Dongre", tagline: "Sustainable Couture", image: { imageUrl: "/women-cats/women-cat2.png", imageId: "b-5" }, website: "anitadongre.com", isActive: true, featured: true },
  { _id: "brand-6", title: "Tarun Tahiliani", tagline: "Draped Perfection", image: { imageUrl: "/bandhgalas.jpg", imageId: "b-6" }, website: "taruntahiliani.com", isActive: true, featured: false },
];

const SEED_USERS = [
  {
    _id: "user-demo-1",
    userId: "USR-1001",
    name: "Sakshi Verma",
    email: "user@whiold.com",
    mobile: "+91 98765 43210",
    role: "user",
    password: "123456",
    blocked: false,
    address: {
      name: "Sakshi Verma",
      house: "204, Sundar Nagar",
      area: "Vijay Nagar Square",
      city: "Indore",
      state: "Madhya Pradesh",
      pincode: "452010",
      mobile: "+91 98765 43210",
    },
    wallets: { fundWallet: 25000 },
    image: { imageUrl: "/logo.png" },
    createdAt: "2025-01-10T08:00:00.000Z",
  },
  {
    _id: "user-admin-1",
    userId: "ADM-9001",
    name: "Whiold Atelier Admin",
    email: "admin@whiold.com",
    mobile: "+91 91111 22222",
    role: "admin",
    password: "123456",
    blocked: false,
    address: {
      name: "Admin Office",
      house: "Atelier Studio, Plot 42",
      area: "Design District",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      mobile: "+91 91111 22222",
    },
    wallets: { fundWallet: 100000 },
    image: { imageUrl: "/logo.png" },
    createdAt: "2024-12-01T10:00:00.000Z",
  },
  {
    _id: "user-demo-2",
    userId: "USR-1002",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    mobile: "+91 98234 56789",
    role: "user",
    password: "123456",
    blocked: false,
    address: { house: "12B", area: "Jubilee Hills", city: "Hyderabad", state: "Telangana", pincode: "500033", mobile: "+91 98234 56789" },
    wallets: { fundWallet: 5400 },
    createdAt: "2025-02-15T11:20:00.000Z",
  },
  {
    _id: "user-demo-3",
    userId: "USR-1003",
    name: "Ananya Mehta",
    email: "ananya.m@example.com",
    mobile: "+91 97112 33445",
    role: "user",
    password: "123456",
    blocked: false,
    address: { house: " Flat 402", area: "Bandra West", city: "Mumbai", state: "Maharashtra", pincode: "400050", mobile: "+91 97112 33445" },
    wallets: { fundWallet: 12000 },
    createdAt: "2025-03-01T09:15:00.000Z",
  },
  {
    _id: "user-demo-4",
    userId: "USR-1004",
    name: "Rohan Gupta",
    email: "rohan.g@example.com",
    mobile: "+91 98998 77665",
    role: "user",
    password: "123456",
    blocked: true,
    address: { house: "77", area: "Vasant Vihar", city: "New Delhi", state: "Delhi", pincode: "110057", mobile: "+91 98998 77665" },
    wallets: { fundWallet: 0 },
    createdAt: "2025-01-20T14:30:00.000Z",
  },
  {
    _id: "user-demo-5",
    userId: "USR-1005",
    name: "Priya Sundaram",
    email: "priya.s@example.com",
    mobile: "+91 94441 22334",
    role: "user",
    password: "123456",
    blocked: false,
    address: { house: "15", area: "T. Nagar", city: "Chennai", state: "Tamil Nadu", pincode: "600017", mobile: "+91 94441 22334" },
    wallets: { fundWallet: 3100 },
    createdAt: "2025-03-10T16:45:00.000Z",
  },
  {
    _id: "user-demo-6",
    userId: "USR-1006",
    name: "Kabir Roy",
    email: "kabir.roy@example.com",
    mobile: "+91 98301 99887",
    role: "user",
    password: "123456",
    blocked: false,
    address: { house: "55A", area: "Park Street", city: "Kolkata", state: "West Bengal", pincode: "700016", mobile: "+91 98301 99887" },
    wallets: { fundWallet: 8900 },
    createdAt: "2025-03-18T10:10:00.000Z",
  },
  {
    _id: "user-demo-7",
    userId: "USR-1007",
    name: "Diya Patel",
    email: "diya.patel@example.com",
    mobile: "+91 99090 11223",
    role: "user",
    password: "123456",
    blocked: false,
    address: { house: "301", area: "Satellite", city: "Ahmedabad", state: "Gujarat", pincode: "380015", mobile: "+91 99090 11223" },
    wallets: { fundWallet: 15400 },
    createdAt: "2025-03-22T13:00:00.000Z",
  },
];

const SEED_PRODUCTS = [
  {
    _id: "prod-1",
    name: "Royal Heritage Silk Sherwani",
    title: "Royal Heritage Silk Sherwani",
    brand: { _id: "brand-1", title: "Manyavar", name: "Manyavar" },
    category: { _id: "cat-12", title: "Sherwani", name: "Sherwani" },
    subCategory: { _id: "sub-6", name: "Royal Sherwanis" },
    price: 18999,
    mrp: 24999,
    actualPrice: 15000,
    gst: 12,
    bp: 200,
    hsnCode: "6204",
    description: "Handcrafted Zardozi embroidered silk sherwani with tonal stole for grand celebrations.",
    rating: 4.8,
    reviewCount: 34,
    isActive: true,
    isBestSeller: true,
    featured: true,
    colors: [{ name: "Ivory", hex: "#FFFFF0" }, { name: "Gold", hex: "#D4AF37" }],
    sizes: ["S", "M", "L", "XL"],
    details: ["Pure Raw Silk", "Zardozi Hand Embroidery", "Includes Stole & Churidar", "Dry Clean Only"],
    images: [
      { imageUrl: "/shervani/shervani1.jpg", imageId: "img-1-1" },
      { imageUrl: "/shervani/shervani2.jpg", imageId: "img-1-2" },
      { imageUrl: "/shervani/shervani3.jpg", imageId: "img-1-3" },
    ],
    thumbnail: "/shervani/shervani1.jpg",
    variants: [
      { _id: "v-1-1", spec: "S", weight: "S", unit: "", mrp: 24999, sellingPrice: 18999, finalPrice: 18999, stock: 5, isActive: true, thumbnail: "/shervani/shervani1.jpg" },
      { _id: "v-1-2", spec: "M", weight: "M", unit: "", mrp: 24999, sellingPrice: 18999, finalPrice: 18999, stock: 10, isActive: true, thumbnail: "/shervani/shervani1.jpg" },
      { _id: "v-1-3", spec: "L", weight: "L", unit: "", mrp: 24999, sellingPrice: 18999, finalPrice: 18999, stock: 8, isActive: true, thumbnail: "/shervani/shervani1.jpg" },
      { _id: "v-1-4", spec: "XL", weight: "XL", unit: "", mrp: 24999, sellingPrice: 18999, finalPrice: 18999, stock: 0, isActive: true, thumbnail: "/shervani/shervani1.jpg" },
    ],
    createdAt: "2025-01-15T10:00:00.000Z",
  },
  {
    _id: "prod-2",
    name: "Handwoven Banarasi Silk Saree",
    title: "Handwoven Banarasi Silk Saree",
    brand: { _id: "brand-4", title: "Raw Mango", name: "Raw Mango" },
    category: { _id: "cat-1", title: "Saree", name: "Saree" },
    subCategory: { _id: "sub-1", name: "Silk Sarees" },
    price: 12499,
    mrp: 16999,
    actualPrice: 10000,
    gst: 12,
    bp: 150,
    hsnCode: "5007",
    description: "Classic Katan silk Banarasi saree adorned with real zari flora motifs.",
    rating: 4.9,
    reviewCount: 52,
    isActive: true,
    isBestSeller: true,
    featured: true,
    colors: [{ name: "Crimson Red", hex: "#DC143C" }, { name: "Mustard Yellow", hex: "#FFDB58" }],
    sizes: ["Free Size"],
    details: ["100% Katan Silk", "Pure Silver Zari Work", "Unstitched Blouse Piece Included"],
    images: [
      { imageUrl: "/women-cats/women-cat1.png", imageId: "img-2-1" },
      { imageUrl: "/women-cats/women-cat9.png", imageId: "img-2-2" },
    ],
    thumbnail: "/women-cats/women-cat1.png",
    variants: [
      { _id: "v-2-1", spec: "Free Size", weight: "Free Size", unit: "", mrp: 16999, sellingPrice: 12499, finalPrice: 12499, stock: 12, isActive: true, thumbnail: "/women-cats/women-cat1.png" },
    ],
    createdAt: "2025-01-20T12:00:00.000Z",
  },
  {
    _id: "prod-3",
    name: "Crimson Velvet Velvet Bridal Lehenga",
    title: "Crimson Velvet Velvet Bridal Lehenga",
    brand: { _id: "brand-2", title: "Sabyasachi", name: "Sabyasachi" },
    category: { _id: "cat-3", title: "Bridal Lehenga", name: "Bridal Lehenga" },
    subCategory: { _id: "sub-3", name: "Bridal Lehengas" },
    price: 45999,
    mrp: 59999,
    actualPrice: 38000,
    gst: 12,
    bp: 500,
    hsnCode: "6204",
    description: "Opulent micro-velvet bridal lehenga with heavy Marodi and tilla hand embroidery.",
    rating: 5.0,
    reviewCount: 19,
    isActive: true,
    isBestSeller: true,
    featured: true,
    colors: [{ name: "Deep Crimson", hex: "#800020" }],
    sizes: ["M", "L"],
    details: ["Micro Velvet", "Dual Dupatta Set", "Heavy Can-can Layer"],
    images: [
      { imageUrl: "/women-cats/women-cat3.png", imageId: "img-3-1" },
      { imageUrl: "/women-cats/women-cat2.png", imageId: "img-3-2" },
    ],
    thumbnail: "/women-cats/women-cat3.png",
    variants: [
      { _id: "v-3-1", spec: "M", weight: "M", unit: "", mrp: 59999, sellingPrice: 45999, finalPrice: 45999, stock: 3, isActive: true, thumbnail: "/women-cats/women-cat3.png" },
      { _id: "v-3-2", spec: "L", weight: "L", unit: "", mrp: 59999, sellingPrice: 45999, finalPrice: 45999, stock: 2, isActive: true, thumbnail: "/women-cats/women-cat3.png" },
    ],
    createdAt: "2025-01-25T14:30:00.000Z",
  },
  {
    _id: "prod-4",
    name: "Chanderi Cotton Embroidered Kurta Set",
    title: "Chanderi Cotton Embroidered Kurta Set",
    brand: { _id: "brand-3", title: "FabIndia", name: "FabIndia" },
    category: { _id: "cat-11", title: "Kurta", name: "Kurta" },
    subCategory: { _id: "sub-5", name: "Festive Kurtas" },
    price: 3499,
    mrp: 4999,
    actualPrice: 2500,
    gst: 12,
    bp: 50,
    hsnCode: "6203",
    description: "Breathable Chanderi cotton kurta with subtle threadwork detailing on neckline.",
    rating: 4.6,
    reviewCount: 41,
    isActive: true,
    isBestSeller: false,
    featured: false,
    colors: [{ name: "Sage Green", hex: "#9DC183" }, { name: "Beige", hex: "#F5F5DC" }],
    sizes: ["S", "M", "L", "XL", "XXL"],
    details: ["Chanderi Cotton Blend", "Thread Work Embroidery", "Includes Pyjama"],
    images: [
      { imageUrl: "/kurta.jpg", imageId: "img-4-1" },
    ],
    thumbnail: "/kurta.jpg",
    variants: [
      { _id: "v-4-1", spec: "S", weight: "S", unit: "", mrp: 4999, sellingPrice: 3499, finalPrice: 3499, stock: 15, isActive: true, thumbnail: "/kurta.jpg" },
      { _id: "v-4-2", spec: "M", weight: "M", unit: "", mrp: 4999, sellingPrice: 3499, finalPrice: 3499, stock: 20, isActive: true, thumbnail: "/kurta.jpg" },
      { _id: "v-4-3", spec: "L", weight: "L", unit: "", mrp: 4999, sellingPrice: 3499, finalPrice: 3499, stock: 12, isActive: true, thumbnail: "/kurta.jpg" },
    ],
    createdAt: "2025-02-01T09:00:00.000Z",
  },
  {
    _id: "prod-5",
    name: "Raw Silk Nehru Jacket with Brass Buttons",
    title: "Raw Silk Nehru Jacket with Brass Buttons",
    brand: { _id: "brand-1", title: "Manyavar", name: "Manyavar" },
    category: { _id: "cat-13", title: "Nehru Jacket", name: "Nehru Jacket" },
    subCategory: { _id: "sub-7", name: "Silk Nehru Jackets" },
    price: 4999,
    mrp: 6999,
    actualPrice: 3800,
    gst: 12,
    bp: 60,
    hsnCode: "6203",
    description: "Sleek textured raw silk sleeveless jacket with antique metallic buttons.",
    rating: 4.7,
    reviewCount: 38,
    isActive: true,
    isBestSeller: true,
    featured: false,
    colors: [{ name: "Navy Blue", hex: "#000080" }, { name: "Maroon", hex: "#800000" }],
    sizes: ["38", "40", "42", "44"],
    details: ["Raw Silk Fabric", "Mandarin Collar", "Welt Pockets"],
    images: [
      { imageUrl: "/nehru.jpg", imageId: "img-5-1" },
    ],
    thumbnail: "/nehru.jpg",
    variants: [
      { _id: "v-5-1", spec: "38", weight: "38", unit: "", mrp: 6999, sellingPrice: 4999, finalPrice: 4999, stock: 8, isActive: true, thumbnail: "/nehru.jpg" },
      { _id: "v-5-2", spec: "40", weight: "40", unit: "", mrp: 6999, sellingPrice: 4999, finalPrice: 4999, stock: 14, isActive: true, thumbnail: "/nehru.jpg" },
    ],
    createdAt: "2025-02-05T11:15:00.000Z",
  },
  {
    _id: "prod-6",
    name: "Embroidered Royal Blue Bandhgala Suit",
    title: "Embroidered Royal Blue Bandhgala Suit",
    brand: { _id: "brand-6", title: "Tarun Tahiliani", name: "Tarun Tahiliani" },
    category: { _id: "cat-14", title: "Bandhgala", name: "Bandhgala" },
    subCategory: { _id: "sub-8", name: "Embroidered Bandhgalas" },
    price: 22999,
    mrp: 29999,
    actualPrice: 18000,
    gst: 12,
    bp: 250,
    hsnCode: "6203",
    description: "Structured wool-blend Bandhgala jacket with delicate crest embroidery.",
    rating: 4.9,
    reviewCount: 23,
    isActive: true,
    isBestSeller: false,
    featured: true,
    colors: [{ name: "Royal Blue", hex: "#4169E1" }],
    sizes: ["M", "L", "XL"],
    details: ["Fine Wool Blend", "Satin Lining", "Custom Crest Hardware"],
    images: [
      { imageUrl: "/bandhgalas.jpg", imageId: "img-6-1" },
    ],
    thumbnail: "/bandhgalas.jpg",
    variants: [
      { _id: "v-6-1", spec: "M", weight: "M", unit: "", mrp: 29999, sellingPrice: 22999, finalPrice: 22999, stock: 4, isActive: true, thumbnail: "/bandhgalas.jpg" },
      { _id: "v-6-2", spec: "L", weight: "L", unit: "", mrp: 29999, sellingPrice: 22999, finalPrice: 22999, stock: 6, isActive: true, thumbnail: "/bandhgalas.jpg" },
    ],
    createdAt: "2025-02-10T15:20:00.000Z",
  },
  {
    _id: "prod-7",
    name: "Floral Printed Georgette Anarkali Suit",
    title: "Floral Printed Georgette Anarkali Suit",
    brand: { _id: "brand-5", title: "Anita Dongre", name: "Anita Dongre" },
    category: { _id: "cat-5", title: "Anarkali", name: "Anarkali" },
    subCategory: { _id: "sub-4", name: "Partywear Lehengas" },
    price: 8999,
    mrp: 11999,
    actualPrice: 7000,
    gst: 12,
    bp: 100,
    hsnCode: "6204",
    description: "Flowy pure georgette Anarkali gown with botanical prints and Sequins lace.",
    rating: 4.7,
    reviewCount: 30,
    isActive: true,
    isBestSeller: false,
    featured: true,
    colors: [{ name: "Blush Pink", hex: "#FFB6C1" }],
    sizes: ["S", "M", "L"],
    details: ["Viscose Georgette", "Attached Dupatta", "Padding Included"],
    images: [
      { imageUrl: "/women-cats/women-cat5.png", imageId: "img-7-1" },
    ],
    thumbnail: "/women-cats/women-cat5.png",
    variants: [
      { _id: "v-7-1", spec: "S", weight: "S", unit: "", mrp: 11999, sellingPrice: 8999, finalPrice: 8999, stock: 7, isActive: true, thumbnail: "/women-cats/women-cat5.png" },
      { _id: "v-7-2", spec: "M", weight: "M", unit: "", mrp: 11999, sellingPrice: 8999, finalPrice: 8999, stock: 11, isActive: true, thumbnail: "/women-cats/women-cat5.png" },
    ],
    createdAt: "2025-02-12T10:00:00.000Z",
  },
  {
    _id: "prod-8",
    name: "Contemporary Fusion Indo-Western Co-ord",
    title: "Contemporary Fusion Indo-Western Co-ord",
    brand: { _id: "brand-5", title: "Anita Dongre", name: "Anita Dongre" },
    category: { _id: "cat-7", title: "Indo-Western", name: "Indo-Western" },
    subCategory: { _id: "sub-4", name: "Partywear Lehengas" },
    price: 11499,
    mrp: 14999,
    actualPrice: 9000,
    gst: 12,
    bp: 120,
    hsnCode: "6204",
    description: "Crop top with asymmetrical cape jacket and flared palazzo pants.",
    rating: 4.5,
    reviewCount: 16,
    isActive: true,
    isBestSeller: false,
    featured: false,
    colors: [{ name: "Teal", hex: "#008080" }],
    sizes: ["M", "L"],
    details: ["Crepe Silk", "Hand-sequined Accents", "Dry Clean"],
    images: [
      { imageUrl: "/women-cats/women-cat7.png", imageId: "img-8-1" },
    ],
    thumbnail: "/women-cats/women-cat7.png",
    variants: [
      { _id: "v-8-1", spec: "M", weight: "M", unit: "", mrp: 14999, sellingPrice: 11499, finalPrice: 11499, stock: 6, isActive: true, thumbnail: "/women-cats/women-cat7.png" },
    ],
    createdAt: "2025-02-15T14:10:00.000Z",
  },
  {
    _id: "prod-9",
    name: "Classic Silk Dhoti Pants with Angrakha",
    title: "Classic Silk Dhoti Pants with Angrakha",
    brand: { _id: "brand-3", title: "FabIndia", name: "FabIndia" },
    category: { _id: "cat-8", title: "Dhoti", name: "Dhoti" },
    subCategory: { _id: "sub-5", name: "Festive Kurtas" },
    price: 4299,
    mrp: 5999,
    actualPrice: 3200,
    gst: 12,
    bp: 45,
    hsnCode: "6203",
    description: "Pre-stitched pleated silk dhoti paired with short printed Angrakha kurta.",
    rating: 4.6,
    reviewCount: 22,
    isActive: true,
    isBestSeller: false,
    featured: false,
    colors: [{ name: "Off-White", hex: "#FAF0E6" }],
    sizes: ["S", "M", "L"],
    details: ["Art Silk Dhoti", "Cotton Silk Top", "Elasticated Waistband"],
    images: [
      { imageUrl: "/women-cats/women-cat8.png", imageId: "img-9-1" },
    ],
    thumbnail: "/women-cats/women-cat8.png",
    variants: [
      { _id: "v-9-1", spec: "M", weight: "M", unit: "", mrp: 5999, sellingPrice: 4299, finalPrice: 4299, stock: 9, isActive: true, thumbnail: "/women-cats/women-cat8.png" },
    ],
    createdAt: "2025-02-18T16:00:00.000Z",
  },
  {
    _id: "prod-10",
    name: "Sequined Georgette Partywear Lehenga",
    title: "Sequined Georgette Partywear Lehenga",
    brand: { _id: "brand-2", title: "Sabyasachi", name: "Sabyasachi" },
    category: { _id: "cat-4", title: "Georgette Lehenga", name: "Georgette Lehenga" },
    subCategory: { _id: "sub-4", name: "Partywear Lehengas" },
    price: 28999,
    mrp: 35999,
    actualPrice: 22000,
    gst: 12,
    bp: 300,
    hsnCode: "6204",
    description: "Lightweight tiered georgette lehenga with all-over chikankari and mirror embellishments.",
    rating: 4.9,
    reviewCount: 44,
    isActive: true,
    isBestSeller: true,
    featured: true,
    colors: [{ name: "Lavender", hex: "#E6E6FA" }],
    sizes: ["M", "L"],
    details: ["Faux Georgette", "Mirror & Thread Work", "Matching Choli"],
    images: [
      { imageUrl: "/women-cats/women-cat4.png", imageId: "img-10-1" },
    ],
    thumbnail: "/women-cats/women-cat4.png",
    variants: [
      { _id: "v-10-1", spec: "M", weight: "M", unit: "", mrp: 35999, sellingPrice: 28999, finalPrice: 28999, stock: 5, isActive: true, thumbnail: "/women-cats/women-cat4.png" },
    ],
    createdAt: "2025-02-20T12:00:00.000Z",
  },
  {
    _id: "prod-11",
    name: "Handblocked Cotton Straight Suit Set",
    title: "Handblocked Cotton Straight Suit Set",
    brand: { _id: "brand-3", title: "FabIndia", name: "FabIndia" },
    category: { _id: "cat-6", title: "Suit", name: "Suit" },
    subCategory: { _id: "sub-2", name: "Cotton Sarees" },
    price: 2999,
    mrp: 3999,
    actualPrice: 2100,
    gst: 12,
    bp: 35,
    hsnCode: "6204",
    description: "Jaipuri Sanganeri hand-block print cotton suit set with Kota Doria dupatta.",
    rating: 4.4,
    reviewCount: 29,
    isActive: true,
    isBestSeller: false,
    featured: false,
    colors: [{ name: "Indigo Blue", hex: "#4B0082" }],
    sizes: ["S", "M", "L", "XL"],
    details: ["100% Pure Cotton", "Natural Vegetable Dyes", "Machine Washable"],
    images: [
      { imageUrl: "/women-cats/women-cat6.png", imageId: "img-11-1" },
    ],
    thumbnail: "/women-cats/women-cat6.png",
    variants: [
      { _id: "v-11-1", spec: "M", weight: "M", unit: "", mrp: 3999, sellingPrice: 2999, finalPrice: 2999, stock: 18, isActive: true, thumbnail: "/women-cats/women-cat6.png" },
    ],
    createdAt: "2025-02-22T08:30:00.000Z",
  },
  {
    _id: "prod-12",
    name: "Lightweight Chiffon Printed Saree",
    title: "Lightweight Chiffon Printed Saree",
    brand: { _id: "brand-4", title: "Raw Mango", name: "Raw Mango" },
    category: { _id: "cat-10", title: "Chiffon", name: "Chiffon" },
    subCategory: { _id: "sub-1", name: "Silk Sarees" },
    price: 3899,
    mrp: 4999,
    actualPrice: 2800,
    gst: 12,
    bp: 40,
    hsnCode: "5007",
    description: "Breezy ombre chiffon saree featuring delicate scalloped embroidery borders.",
    rating: 4.6,
    reviewCount: 35,
    isActive: true,
    isBestSeller: false,
    featured: false,
    colors: [{ name: "Coral Sunset", hex: "#FF7F50" }],
    sizes: ["Free Size"],
    details: ["Pure Pure Chiffon", "Thread Borders", "Unstitched Blouse"],
    images: [
      { imageUrl: "/women-cats/women-cat10.png", imageId: "img-12-1" },
    ],
    thumbnail: "/women-cats/women-cat10.png",
    variants: [
      { _id: "v-12-1", spec: "Free Size", weight: "Free Size", unit: "", mrp: 4999, sellingPrice: 3899, finalPrice: 3899, stock: 10, isActive: true, thumbnail: "/women-cats/women-cat10.png" },
    ],
    createdAt: "2025-02-25T11:00:00.000Z",
  },
  {
    _id: "prod-13",
    name: "Casual Cotton Linen Short Kurta",
    title: "Casual Cotton Linen Short Kurta",
    brand: { _id: "brand-3", title: "FabIndia", name: "FabIndia" },
    category: { _id: "cat-15", title: "Denim", name: "Denim" },
    subCategory: { _id: "sub-5", name: "Festive Kurtas" },
    price: 1999,
    mrp: 2999,
    actualPrice: 1400,
    gst: 12,
    bp: 25,
    hsnCode: "6203",
    description: "Modern relaxed short kurta crafted from pre-washed linen cotton.",
    rating: 4.3,
    reviewCount: 18,
    isActive: true,
    isBestSeller: false,
    featured: false,
    colors: [{ name: "Sky Blue", hex: "#87CEEB" }],
    sizes: ["M", "L", "XL"],
    details: ["Linen Cotton Blend", "Roll-up Sleeves", "Coconut Shell Buttons"],
    images: [
      { imageUrl: "/casual.jpg", imageId: "img-13-1" },
    ],
    thumbnail: "/casual.jpg",
    variants: [
      { _id: "v-13-1", spec: "M", weight: "M", unit: "", mrp: 2999, sellingPrice: 1999, finalPrice: 1999, stock: 25, isActive: true, thumbnail: "/casual.jpg" },
    ],
    createdAt: "2025-03-01T09:00:00.000Z",
  },
  {
    _id: "prod-14",
    name: "Handloom Organic Linen Saree",
    title: "Handloom Organic Linen Saree",
    brand: { _id: "brand-4", title: "Raw Mango", name: "Raw Mango" },
    category: { _id: "cat-16", title: "Linen", name: "Linen" },
    subCategory: { _id: "sub-2", name: "Cotton Sarees" },
    price: 5499,
    mrp: 6999,
    actualPrice: 4000,
    gst: 12,
    bp: 60,
    hsnCode: "5309",
    description: "Minimalist 100-count organic linen saree with silver zari pallu stripes.",
    rating: 4.5,
    reviewCount: 12,
    isActive: false,
    isBestSeller: false,
    featured: false,
    colors: [{ name: "Natural Flax", hex: "#EEDC82" }],
    sizes: ["Free Size"],
    details: ["100 Count Organic Linen", "Handloom Certified", "Breathable Fabric"],
    images: [
      { imageUrl: "/items/item1.png", imageId: "img-14-1" },
    ],
    thumbnail: "/items/item1.png",
    variants: [
      { _id: "v-14-1", spec: "Free Size", weight: "Free Size", unit: "", mrp: 6999, sellingPrice: 5499, finalPrice: 5499, stock: 0, isActive: false, thumbnail: "/items/item1.png" },
    ],
    createdAt: "2025-03-02T10:00:00.000Z",
  }
];

// Generate remaining products (up to 32 products total)
for (let i = 15; i <= 32; i++) {
  const baseCat = SEED_CATEGORIES[(i - 1) % SEED_CATEGORIES.length];
  const baseBrand = SEED_BRANDS[(i - 1) % SEED_BRANDS.length];
  SEED_PRODUCTS.push({
    _id: `prod-${i}`,
    name: `${baseBrand.title} Atelier ${baseCat.name} Edition ${i}`,
    title: `${baseBrand.title} Atelier ${baseCat.name} Edition ${i}`,
    brand: { _id: baseBrand._id, title: baseBrand.title, name: baseBrand.title },
    category: { _id: baseCat._id, title: baseCat.name, name: baseCat.name },
    subCategory: { _id: "sub-1", name: `${baseCat.name} Special` },
    price: 2499 + (i * 450),
    mrp: 3999 + (i * 500),
    actualPrice: 1800 + (i * 300),
    gst: 12,
    bp: 50,
    hsnCode: "6204",
    description: `Exquisite Indian ethnic fashion item from Whiold Atelier's curated ${baseCat.name} collection.`,
    rating: Number((4.1 + (i % 9) * 0.1).toFixed(1)),
    reviewCount: 10 + i * 2,
    isActive: true,
    isBestSeller: i % 4 === 0,
    featured: i % 5 === 0,
    colors: [{ name: "Gold", hex: "#D4AF37" }, { name: "Maroon", hex: "#800000" }],
    sizes: ["S", "M", "L", "XL"],
    details: ["Handcrafted in India", "Premium Quality", "Dry Clean Recommended"],
    images: [{ imageUrl: baseCat.image, imageId: `img-${i}-1` }],
    thumbnail: baseCat.image,
    variants: [
      { _id: `v-${i}-1`, spec: "M", weight: "M", unit: "", mrp: 3999 + (i * 500), sellingPrice: 2499 + (i * 450), finalPrice: 2499 + (i * 450), stock: i % 3 === 0 ? 0 : 12, isActive: true, thumbnail: baseCat.image },
      { _id: `v-${i}-2`, spec: "L", weight: "L", unit: "", mrp: 3999 + (i * 500), sellingPrice: 2499 + (i * 450), finalPrice: 2499 + (i * 450), stock: 8, isActive: true, thumbnail: baseCat.image },
    ],
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  });
}

const SEED_ORDERS = [
  {
    _id: "ord-101",
    invoiceNumber: "WHD-24851",
    createdAt: "2026-07-04T10:12:00.000Z",
    orderStatus: "DISPATCH",
    totalAmount: 22498,
    deliveryCharges: 0,
    totalGst: 2410,
    paymentMode: "Wallet",
    user: { _id: "user-demo-1", name: "Sakshi Verma", email: "user@whiold.com", mobile: "+91 98765 43210" },
    address: { name: "Sakshi Verma", house: "204, Sundar Nagar", area: "Vijay Nagar Square", city: "Indore", state: "Madhya Pradesh", pincode: "452010", mobile: "+91 98765 43210" },
    items: [
      { productId: SEED_PRODUCTS[0], quantity: 1, price: 18999, variant: "M" },
      { productId: SEED_PRODUCTS[3], quantity: 1, price: 3499, variant: "M" },
    ],
    deliveryDetails: { courierName: "BlueDart", trackingId: "BD129837465", trackingUrl: "https://bluedart.com" },
  },
  {
    _id: "ord-102",
    invoiceNumber: "WHD-24852",
    createdAt: "2026-07-01T14:30:00.000Z",
    orderStatus: "DELIVERED",
    totalAmount: 12499,
    deliveryCharges: 0,
    totalGst: 1339,
    paymentMode: "Online",
    user: { _id: "user-demo-1", name: "Sakshi Verma", email: "user@whiold.com", mobile: "+91 98765 43210" },
    address: { name: "Sakshi Verma", house: "204, Sundar Nagar", area: "Vijay Nagar Square", city: "Indore", state: "Madhya Pradesh", pincode: "452010", mobile: "+91 98765 43210" },
    items: [
      { productId: SEED_PRODUCTS[1], quantity: 1, price: 12499, variant: "Free Size" },
    ],
    deliveryDetails: { courierName: "Delhivery", trackingId: "DEL8827163", trackingUrl: "https://delhivery.com" },
  },
  {
    _id: "ord-103",
    invoiceNumber: "WHD-24853",
    createdAt: "2026-06-25T11:20:00.000Z",
    orderStatus: "CANCELLED",
    totalAmount: 4999,
    deliveryCharges: 100,
    totalGst: 535,
    paymentMode: "Wallet",
    user: { _id: "user-demo-2", name: "Aarav Sharma", email: "aarav.sharma@example.com", mobile: "+91 98234 56789" },
    address: { name: "Aarav Sharma", house: "12B", area: "Jubilee Hills", city: "Hyderabad", state: "Telangana", pincode: "500033", mobile: "+91 98234 56789" },
    items: [
      { productId: SEED_PRODUCTS[4], quantity: 1, price: 4999, variant: "40" },
    ],
    deliveryDetails: null,
  },
  {
    _id: "ord-104",
    invoiceNumber: "WHD-24854",
    createdAt: "2026-07-03T16:45:00.000Z",
    orderStatus: "PENDING",
    totalAmount: 28999,
    deliveryCharges: 0,
    totalGst: 3107,
    paymentMode: "Wallet",
    user: { _id: "user-demo-3", name: "Ananya Mehta", email: "ananya.m@example.com", mobile: "+91 97112 33445" },
    address: { name: "Ananya Mehta", house: "Flat 402", area: "Bandra West", city: "Mumbai", state: "Maharashtra", pincode: "400050", mobile: "+91 97112 33445" },
    items: [
      { productId: SEED_PRODUCTS[9], quantity: 1, price: 28999, variant: "M" },
    ],
    deliveryDetails: null,
  },
  {
    _id: "ord-105",
    invoiceNumber: "WHD-24855",
    createdAt: "2026-07-02T09:10:00.000Z",
    orderStatus: "CONFIRMED",
    totalAmount: 22999,
    deliveryCharges: 0,
    totalGst: 2464,
    paymentMode: "Online",
    user: { _id: "user-demo-5", name: "Priya Sundaram", email: "priya.s@example.com", mobile: "+91 94441 22334" },
    address: { name: "Priya Sundaram", house: "15", area: "T. Nagar", city: "Chennai", state: "Tamil Nadu", pincode: "600017", mobile: "+91 94441 22334" },
    items: [
      { productId: SEED_PRODUCTS[5], quantity: 1, price: 22999, variant: "L" },
    ],
    deliveryDetails: null,
  }
];

// Add 15 more seed orders to reach 20 total
for (let i = 6; i <= 20; i++) {
  const u = SEED_USERS[i % SEED_USERS.length];
  const prod = SEED_PRODUCTS[i % SEED_PRODUCTS.length];
  const statuses = ["PENDING", "CONFIRMED", "DISPATCH", "DELIVERED", "CANCELLED"];
  const st = statuses[i % statuses.length];

  SEED_ORDERS.push({
    _id: `ord-1${i < 10 ? '0' + i : i}`,
    invoiceNumber: `WHD-248${50 + i}`,
    createdAt: new Date(Date.now() - i * 172800000).toISOString(),
    orderStatus: st,
    totalAmount: prod.price,
    deliveryCharges: prod.price > 5000 ? 0 : 150,
    totalGst: Math.round(prod.price * 0.12),
    paymentMode: i % 2 === 0 ? "Wallet" : "Online",
    user: { _id: u._id, name: u.name, email: u.email, mobile: u.mobile },
    address: { ...u.address, name: u.name },
    items: [{ productId: prod, quantity: 1, price: prod.price, variant: "M" }],
    deliveryDetails: st === "DELIVERED" || st === "DISPATCH" ? { courierName: "BlueDart", trackingId: `BD9980${i}`, trackingUrl: "https://bluedart.com" } : null,
  });
}

const SEED_TICKETS = [
  {
    _id: "t-101",
    ticketId: "TCK-881",
    user: { _id: "user-demo-1", name: "Sakshi Verma", email: "user@whiold.com" },
    category: "Order Query",
    subject: "Delivery delay for Order WHD-24851",
    priority: "High",
    status: "pending",
    message: "My order was supposed to arrive yesterday. Can you check with BlueDart?",
    createdAt: "2026-07-04T12:00:00.000Z",
    replies: [
      { sender: "admin", text: "We have raised a priority trace with BlueDart. Will update shortly.", createdAt: "2026-07-04T14:10:00.000Z" }
    ],
  },
  {
    _id: "t-102",
    ticketId: "TCK-882",
    user: { _id: "user-demo-3", name: "Ananya Mehta", email: "ananya.m@example.com" },
    category: "Size Exchange",
    subject: "Size exchange request for Lehenga",
    priority: "Standard",
    status: "resolved",
    message: "I need size L instead of size M for WHD-24854.",
    createdAt: "2026-07-03T18:00:00.000Z",
    replies: [
      { sender: "admin", text: "Exchange initiated. Courier will pick up tomorrow.", createdAt: "2026-07-04T09:00:00.000Z" }
    ],
  },
];

// Helper Functions
const getItem = (key, seedData) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(seedData));
      return seedData;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`mockDb error reading ${key}:`, err);
    return seedData;
  }
};

const setItem = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`mockDb error writing ${key}:`, err);
  }
};

export const mockDb = {
  resetToSeed() {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.SUBCATEGORIES, JSON.stringify(SEED_SUBCATEGORIES));
    localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(SEED_BRANDS));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(SEED_TICKETS));
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
  },

  // Categories
  getCategories() {
    return getItem(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
  },
  saveCategories(data) {
    setItem(STORAGE_KEYS.CATEGORIES, data);
  },
  addCategory(payload) {
    const list = this.getCategories();
    const newCat = {
      _id: `cat-${Date.now()}`,
      name: payload.name,
      title: payload.name,
      slug: payload.slug || payload.name.toLowerCase().trim().replace(/\s+/g, "-"),
      image: typeof payload.image === "object" ? payload.image?.imageUrl || "" : payload.image || "/women-cats/women-cat1.png",
      isActive: payload.isActive !== false,
    };
    list.unshift(newCat);
    this.saveCategories(list);
    return newCat;
  },
  updateCategory(payload) {
    const list = this.getCategories();
    const idx = list.findIndex(c => c._id === payload.id || c._id === payload._id);
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        name: payload.name || list[idx].name,
        title: payload.name || list[idx].title,
        slug: payload.slug || list[idx].slug,
        image: typeof payload.image === "object" ? payload.image?.imageUrl || list[idx].image : payload.image || list[idx].image,
        isActive: payload.isActive !== undefined ? payload.isActive : list[idx].isActive,
      };
      this.saveCategories(list);
      return list[idx];
    }
    return null;
  },
  toggleCategory(id) {
    const list = this.getCategories();
    const item = list.find(c => c._id === id);
    if (item) {
      item.isActive = !item.isActive;
      this.saveCategories(list);
    }
    return item;
  },

  // SubCategories
  getSubCategories() {
    return getItem(STORAGE_KEYS.SUBCATEGORIES, SEED_SUBCATEGORIES);
  },
  saveSubCategories(data) {
    setItem(STORAGE_KEYS.SUBCATEGORIES, data);
  },
  addSubCategory(payload) {
    const list = this.getSubCategories();
    const newSub = {
      _id: `sub-${Date.now()}`,
      name: payload.name,
      category: payload.category || payload.categoryId,
      slug: payload.slug || payload.name.toLowerCase().trim().replace(/\s+/g, "-"),
      image: typeof payload.image === "object" ? payload.image?.imageUrl || "" : payload.image || "/kurta.jpg",
      isActive: payload.isActive !== false,
    };
    list.unshift(newSub);
    this.saveSubCategories(list);
    return newSub;
  },
  updateSubCategory(payload) {
    const list = this.getSubCategories();
    const idx = list.findIndex(s => s._id === payload.id || s._id === payload._id);
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        name: payload.name || list[idx].name,
        category: payload.category || payload.categoryId || list[idx].category,
        image: typeof payload.image === "object" ? payload.image?.imageUrl || list[idx].image : payload.image || list[idx].image,
        isActive: payload.isActive !== undefined ? payload.isActive : list[idx].isActive,
      };
      this.saveSubCategories(list);
      return list[idx];
    }
    return null;
  },

  // Brands
  getBrands() {
    return getItem(STORAGE_KEYS.BRANDS, SEED_BRANDS);
  },
  saveBrands(data) {
    setItem(STORAGE_KEYS.BRANDS, data);
  },
  addBrand(payload) {
    const list = this.getBrands();
    const imgObj = typeof payload.image === "object" ? payload.image : { imageUrl: payload.image || "/shervani/shervani1.jpg", imageId: `img-${Date.now()}` };
    const newBrand = {
      _id: `brand-${Date.now()}`,
      title: payload.title || payload.name,
      tagline: payload.tagline || "Indian Heritage Brand",
      image: imgObj,
      website: payload.website || "whiold.com",
      isActive: true,
      featured: true,
    };
    list.unshift(newBrand);
    this.saveBrands(list);
    return newBrand;
  },
  deleteBrand(id) {
    let list = this.getBrands();
    list = list.filter(b => b._id !== id);
    this.saveBrands(list);
  },
  toggleBrand(id, isActive) {
    const list = this.getBrands();
    const item = list.find(b => b._id === id);
    if (item) {
      item.isActive = isActive !== undefined ? isActive : !item.isActive;
      this.saveBrands(list);
    }
    return item;
  },

  // Products
  getProducts() {
    return getItem(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
  },
  saveProducts(data) {
    setItem(STORAGE_KEYS.PRODUCTS, data);
  },
  addProduct(payload) {
    const list = this.getProducts();
    const categories = this.getCategories();
    const catObj = categories.find(c => c._id === payload.category) || { _id: payload.category, name: "Fashion", title: "Fashion" };
    
    const newProd = {
      _id: `prod-${Date.now()}`,
      name: payload.name,
      title: payload.name,
      brand: typeof payload.brand === "object" ? payload.brand : { _id: "b-custom", title: payload.brand || "Whiold", name: payload.brand || "Whiold" },
      category: catObj,
      subCategory: typeof payload.subCategory === "object" ? payload.subCategory : { _id: payload.subCategory || "sub-1", name: "Custom" },
      price: Number(payload.price || 0),
      mrp: Number(payload.mrp || payload.price || 0),
      actualPrice: Number(payload.actualPrice || payload.price || 0),
      gst: Number(payload.gst || 12),
      bp: Number(payload.bp || 50),
      hsnCode: payload.hsnCode || "6204",
      description: payload.description || "",
      rating: 4.8,
      reviewCount: 1,
      isActive: true,
      isBestSeller: false,
      featured: true,
      colors: [{ name: "Standard", hex: "#000000" }],
      sizes: (payload.variants || []).map(v => v.spec).filter(Boolean),
      details: ["Made in India", "Dry Clean Only"],
      images: (payload.images || []).map((img, i) => typeof img === "object" ? img : { imageUrl: img, imageId: `img-${Date.now()}-${i}` }),
      thumbnail: (payload.images && payload.images[0]) ? (typeof payload.images[0] === "object" ? payload.images[0].imageUrl : payload.images[0]) : "/kurta.jpg",
      variants: (payload.variants || []).map((v, i) => ({
        _id: `v-${Date.now()}-${i}`,
        spec: v.spec || "M",
        weight: v.spec || "M",
        unit: "",
        mrp: Number(payload.mrp || payload.price || 0),
        sellingPrice: Number(payload.price || 0),
        finalPrice: Number(payload.price || 0),
        stock: Number(v.stock || 10),
        isActive: true,
        thumbnail: (payload.images && payload.images[0]) ? (typeof payload.images[0] === "object" ? payload.images[0].imageUrl : payload.images[0]) : "/kurta.jpg",
      })),
      createdAt: new Date().toISOString(),
    };
    list.unshift(newProd);
    this.saveProducts(list);
    return newProd;
  },
  updateProduct(payload) {
    const list = this.getProducts();
    const id = payload.productId || payload.id || payload._id;
    const idx = list.findIndex(p => p._id === id);
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        name: payload.name || list[idx].name,
        title: payload.name || list[idx].title,
        price: payload.price ? Number(payload.price) : list[idx].price,
        mrp: payload.mrp ? Number(payload.mrp) : list[idx].mrp,
        description: payload.description || list[idx].description,
        variants: payload.variants ? payload.variants.map((v, i) => ({
          _id: v._id || `v-up-${i}`,
          spec: v.spec || "M",
          weight: v.spec || "M",
          unit: "",
          mrp: Number(payload.mrp || list[idx].mrp),
          sellingPrice: Number(payload.price || list[idx].price),
          finalPrice: Number(payload.price || list[idx].price),
          stock: Number(v.stock || 10),
          isActive: true,
        })) : list[idx].variants,
      };
      this.saveProducts(list);
      return list[idx];
    }
    return null;
  },
  toggleProduct(id, isActive) {
    const list = this.getProducts();
    const item = list.find(p => p._id === id);
    if (item) {
      item.isActive = isActive !== undefined ? isActive : !item.isActive;
      this.saveProducts(list);
    }
    return item;
  },
  toggleBestSeller(id, isBestSeller) {
    const list = this.getProducts();
    const item = list.find(p => p._id === id);
    if (item) {
      item.isBestSeller = isBestSeller !== undefined ? isBestSeller : !item.isBestSeller;
      this.saveProducts(list);
    }
    return item;
  },

  // Users
  getUsers() {
    return getItem(STORAGE_KEYS.USERS, SEED_USERS);
  },
  saveUsers(data) {
    setItem(STORAGE_KEYS.USERS, data);
  },
  toggleUserBlock(id) {
    const list = this.getUsers();
    const user = list.find(u => u._id === id);
    if (user) {
      user.blocked = !user.blocked;
      this.saveUsers(list);
    }
    return user;
  },
  findUserByEmail(email) {
    const list = this.getUsers();
    return list.find(u => u.email?.toLowerCase() === email?.toLowerCase());
  },
  addUser(userData) {
    const list = this.getUsers();
    const newUser = {
      _id: `user-${Date.now()}`,
      userId: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: userData.name,
      email: userData.email,
      mobile: userData.mobile || userData.phone || "",
      password: userData.password || "123456",
      role: "user",
      blocked: false,
      address: {
        name: userData.name,
        house: "Atelier Suite 101",
        area: "Central Square",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        mobile: userData.mobile || userData.phone || "",
      },
      wallets: { fundWallet: 10000 },
      createdAt: new Date().toISOString(),
    };
    list.push(newUser);
    this.saveUsers(list);
    return newUser;
  },
  updateUserProfile(payload) {
    const list = this.getUsers();
    // find current user
    const currentToken = sessionStorage.getItem("token") || localStorage.getItem("token");
    let user = list.find(u => u.email === "user@whiold.com");
    if (!user) user = list[0];
    
    if (user) {
      user.name = payload.name || user.name;
      user.email = payload.email || user.email;
      user.mobile = payload.mobile || user.mobile;
      if (payload.address) {
        user.address = { ...user.address, ...payload.address };
      }
      if (payload.image) {
        user.image = payload.image;
      }
      this.saveUsers(list);
    }
    return user;
  },

  // Orders
  getOrders() {
    return getItem(STORAGE_KEYS.ORDERS, SEED_ORDERS);
  },
  saveOrders(data) {
    setItem(STORAGE_KEYS.ORDERS, data);
  },
  createOrder(payload) {
    const list = this.getOrders();
    const user = this.findUserByEmail("user@whiold.com") || SEED_USERS[0];
    const newOrder = {
      _id: `ord-${Date.now()}`,
      invoiceNumber: `WHD-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      orderStatus: "PENDING",
      totalAmount: Number(payload.totalAmount || 0),
      deliveryCharges: payload.deliveryFee || 0,
      totalGst: Math.round((payload.totalAmount || 0) * 0.12),
      paymentMode: payload.paymentMode || "Wallet",
      user: {
        _id: user._id,
        name: payload.contactInfo?.name || user.name,
        email: payload.contactInfo?.email || user.email,
        mobile: payload.contactInfo?.phone || user.mobile,
      },
      address: payload.address || user.address,
      items: (payload.items || []).map(item => ({
        productId: {
          _id: item.id || item.productId,
          name: item.name,
          price: item.price,
          gst: 12,
          hsnCode: "6204",
        },
        quantity: item.quantity,
        price: item.price,
        variant: item.variant || item.size || "M",
      })),
      deliveryDetails: null,
    };
    list.unshift(newOrder);
    this.saveOrders(list);
    return newOrder;
  },
  updateOrderStatus(id, status) {
    const list = this.getOrders();
    const order = list.find(o => o._id === id || o.invoiceNumber === id);
    if (order) {
      order.orderStatus = status;
      this.saveOrders(list);
    }
    return order;
  },
  postDeliveryDetails(id, deliveryData) {
    const list = this.getOrders();
    const order = list.find(o => o._id === id || o.invoiceNumber === id);
    if (order) {
      order.deliveryDetails = { ...deliveryData };
      this.saveOrders(list);
    }
    return order;
  },

  // Support Tickets
  getTickets() {
    return getItem(STORAGE_KEYS.TICKETS, SEED_TICKETS);
  },
  saveTickets(data) {
    setItem(STORAGE_KEYS.TICKETS, data);
  },
  createTicket(payload) {
    const list = this.getTickets();
    const user = this.findUserByEmail("user@whiold.com") || SEED_USERS[0];
    const newTicket = {
      _id: `t-${Date.now()}`,
      ticketId: `TCK-${Math.floor(100 + Math.random() * 900)}`,
      user: { _id: user._id, name: payload.name || user.name, email: payload.email || user.email },
      category: payload.category || payload.issueType || "General Query",
      subject: payload.subject || "Support Inquiry",
      priority: payload.priority || "Standard",
      status: "pending",
      message: payload.message || "",
      createdAt: new Date().toISOString(),
      replies: [],
    };
    list.unshift(newTicket);
    this.saveTickets(list);
    return newTicket;
  },
  replyTicket(ticketId, replyText) {
    const list = this.getTickets();
    const ticket = list.find(t => t._id === ticketId || t.ticketId === ticketId);
    if (ticket) {
      ticket.replies = ticket.replies || [];
      ticket.replies.push({
        sender: "admin",
        text: replyText,
        createdAt: new Date().toISOString(),
      });
      this.saveTickets(list);
    }
    return ticket;
  },
  updateTicketStatus(ticketId, status, message) {
    const list = this.getTickets();
    const ticket = list.find(t => t._id === ticketId || t.ticketId === ticketId);
    if (ticket) {
      ticket.status = status;
      if (message) {
        ticket.replies = ticket.replies || [];
        ticket.replies.push({
          sender: "admin",
          text: message,
          createdAt: new Date().toISOString(),
        });
      }
      this.saveTickets(list);
    }
    return ticket;
  },

  // Cart
  getCart() {
    return getItem(STORAGE_KEYS.CART, []);
  },
  saveCart(data) {
    setItem(STORAGE_KEYS.CART, data);
  },
  addToCart(payload) {
    const cart = this.getCart();
    const products = this.getProducts();
    const prod = products.find(p => p._id === payload.productId) || {
      _id: payload.productId,
      name: "Ethnic Designer Outfit",
      category: { name: "Fashion" },
      price: 2999,
      images: ["/kurta.jpg"],
      thumbnail: "/kurta.jpg",
      variants: [{ weight: payload.variant, unit: "", stock: 20, sellingPrice: 2999 }]
    };

    const existingIndex = cart.findIndex(c => (c.productId?._id || c.productId) === payload.productId && c.variant === payload.variant);
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += (payload.quantity || 1);
    } else {
      cart.push({
        productId: prod,
        variant: payload.variant,
        quantity: payload.quantity || 1,
      });
    }
    this.saveCart(cart);
    return cart;
  },
  updateCartQuantity(payload) {
    const cart = this.getCart();
    const item = cart.find(c => (c.productId?._id || c.productId) === payload.productId && c.variant === payload.variant);
    if (item) {
      item.quantity = payload.quantity;
      this.saveCart(cart);
    }
    return cart;
  },
  deleteCartProduct(payload) {
    let cart = this.getCart();
    cart = cart.filter(c => !((c.productId?._id || c.productId) === payload.productId && c.variant === payload.variant));
    this.saveCart(cart);
    return cart;
  }
};
