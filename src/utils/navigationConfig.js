/**
 * Navigation visibility configuration helper.
 * Determines whether the Mobile Bottom Navigation Bar should be rendered
 * based on current route pattern.
 */

// Routes where Mobile Bottom Navigation should explicitly be VISIBLE
export const PRIMARY_NAV_ROUTES = [
  "/",
  "/shopping",
  "/collections",
  "/wishlist",
  "/cart",
  "/about",
  "/contact",
  "/dashboard",
  "/profile",
];

// Patterns where Mobile Bottom Navigation MUST BE HIDDEN
// (e.g. Product Details Page, Checkout, Auth screens)
export const HIDDEN_NAV_PATTERNS = [
  /^\/product\//,     // Product Details Page (/product/:id)
  /^\/checkout/,      // Checkout page
  /^\/login/,         // Login page
  /^\/register/,      // Register page
  /^\/admin/,         // Admin portal routes
  /^\/invoice\//,     // Invoice details
];

/**
 * Checks if the Mobile Bottom Navigation Bar should be visible for a given route pathname.
 * @param {string} pathname - Current location pathname
 * @returns {boolean} True if bottom navigation should be visible on mobile
 */
export const isBottomNavVisible = (pathname) => {
  if (!pathname) return false;

  // 1. Explicitly check if route matches a hidden pattern (PDP, Checkout, etc.)
  const isHidden = HIDDEN_NAV_PATTERNS.some((pattern) => pattern.test(pathname));
  if (isHidden) return false;

  // 2. Check if route is one of the primary browsing routes or category pages
  const isPrimary = PRIMARY_NAV_ROUTES.some(
    (route) => pathname === route || pathname.startsWith("/category/")
  );

  return isPrimary;
};
