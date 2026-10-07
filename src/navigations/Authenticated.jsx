import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { adminRoutes, Router, userRoutes, vendorRoutes } from "../constants/router";
import UserDashboard from "../component/pages/user/UserDashboard";
import AllOrders from "../component/pages/user/orders/AllOrders";
import TrackOrder from "../component/pages/user/orders/TrackOrder";
import RewardHistory from "../component/pages/user/rewards/RewardHistory";
import DashboardLayout from "../component/layout/DashboardLayout";
import AdminDashboard from "../component/pages/admin/AdminDashboard";
import { getRole } from "../utils/authStorage";
import AddProduct from "../component/pages/admin/products/AddProduct";
import EditProduct from "../component/pages/admin/products/EditProduct";
import ManageProduct from "../component/pages/admin/products/ManageProducts";
import Category from "../component/pages/admin/category/Category";
import Subcategory from "../component/pages/admin/category/SubCategory";
import Brands from "../component/pages/admin/category/Brands";
import ManageOrder from "../component/pages/admin/orders/ManageOrder";
import MainLayout from "../component/layout/MainLayout";
import Home from "../component/pages/landing/Home";
import ProductDetail from "../component/pages/landing/Productdetail";
import Shopping from "../component/pages/landing/navbar/Shopping";
import Collections from "../component/pages/landing/navbar/Collections";
import CategoryPage from "../component/pages/landing/navbar/categories/CategoryPage";
import WelcomeLetterPage from "../component/pages/user/WelcomeLetterPage";
import AddMoney from "../component/pages/user/fund-management/AddMoney";
import Withdraw from "../component/pages/user/fund-management/Withdraw";
import WalletHistory from "../component/pages/user/fund-management/WalletHistory";
import Notifications from "../component/pages/user/account/Notifications";
import ProfilePage from "../component/pages/user/account/ProfilePage";
import UserSupport from "../component/pages/user/UserSupport";
import ManageSupport from "../component/pages/admin/ManageSupport";
import ManageAllUsers from "../component/pages/admin/users/ManageAllUsers";
import Invoice from "../component/pages/shared/Invoice";
import VendorDashboard from "../component/pages/vendor/VendorDashboard";
import AboutPage from '../component/pages/landing/navbar/AboutPage';
import ContactPage from '../component/pages/landing/navbar/Contact';
import Cart from '../component/pages/landing/Cart';
import WishlistPage from '../component/pages/landing/WishlistPage';
import Shop from '../component/pages/landing/Shop';
import TheEditSection from '../component/pages/landing/Theeditsection';
import PolaroidProductCard from '../component/pages/landing/Polaroidproductcard';
import BrandSection from '../component/pages/landing/brands/BrandSection';
import DataTable from '../component/ui/DataTable';
import Checkout from '../component/pages/landing/Checkout';

const Authenticated = () => {
  const role = getRole();
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={Router.HOME} element={<Home />} />
        <Route path={Router.PRODUCT_DETAIL} element={<ProductDetail />} />
        <Route path={Router.SHOPPING} element={<Shopping />} />
        <Route path={Router.COLLECTION} element={<Collections />} />
        <Route path={Router.CATEGORY} element={<CategoryPage />} />
        <Route path={Router.ABOUT} element={<AboutPage />} />
        <Route path={Router.CONTACT} element={<ContactPage />} />
        <Route path={Router.CART} element={<Cart />} />
        <Route path={Router.WISHLIST} element={<WishlistPage />} />
        <Route path={Router.CHECKOUT} element={<Checkout />} />
      </Route>
      <Route path={Router.SHOP} element={<Shop />} />
      <Route path={Router.THEEDIT} element={<TheEditSection />} />
      <Route path={Router.POLAROID} element={<PolaroidProductCard />} />
      <Route path={Router.BRAND_SECTION} element={<BrandSection />} />
      <Route path={Router.TABLE} element={<DataTable />} />
      {/* Dashboard Layout */}
      <Route element={<DashboardLayout />}>
        {role === "user" && (
          <>
            <Route path={userRoutes.DASHBOARD} element={<UserDashboard />} />
            <Route path={userRoutes.PROFILE} element={<ProfilePage />} />
            <Route path={userRoutes.ALL_ORDERS} element={<AllOrders />} />
            <Route path={userRoutes.TRACK_ORDERS} element={<TrackOrder />} />
            <Route path={userRoutes.REWARDS} element={<RewardHistory />} />
            <Route path={userRoutes.WELCOME} element={<WelcomeLetterPage />} />
            <Route path={userRoutes.ADD_MONEY} element={<AddMoney />} />
            <Route path={userRoutes.WITHDRAW} element={<Withdraw />} />
            <Route path={userRoutes.WALLET_HISTORY} element={<WalletHistory />} />
            <Route path={userRoutes.NOTIFICATION} element={<Notifications />} />
            <Route path={userRoutes.SUPPORT} element={<UserSupport />} />
            {/* <Route path="/invoice/:id" element={<Invoice />} /> */}

          </>
        )}

        {role === "admin" && (
          <>
            <Route
              path={adminRoutes.ADMIN_DASHBOARD}
              element={<AdminDashboard />}
            />
            <Route path={adminRoutes.ADD_PRODUCT} element={<AddProduct />} />
            <Route path="/admin/product/edit/:id" element={<EditProduct />} />
            {/* <Route path="/invoice/:id" element={<Invoice />} /> */}
            <Route
              path={adminRoutes.MANAGE_PRODUCTS}
              element={<ManageProduct />}
            />
            <Route path={adminRoutes.CATEGORIES} element={<Category />} />
            <Route path={adminRoutes.SUB_CATEGORY} element={<Subcategory />} />
            <Route path={adminRoutes.BRANDS} element={<Brands />} />
            <Route path={adminRoutes.USERS} element={<ManageAllUsers />} />
            <Route path={adminRoutes.ORDERS} element={<ManageOrder />} />
            <Route path={adminRoutes.SUPPORT} element={<ManageSupport />} />
            {/* <Route path={adminRoutes.ADMIN_ORDERS} element={<OrdersManagement />} />
        <Route path={adminRoutes.ADMIN_CATEGORIES} element={<CategoriesManagement />} />
        <Route path={adminRoutes.ADMIN_REVIEWS} element={<ReviewsManagement />} /> 
     */}
          </>
        )}
        {role === "vendor" && (
          <>
            <Route path={vendorRoutes.DASHBOARD} element={<VendorDashboard />} />
            <Route path={vendorRoutes.PROFILE} element={<ProfilePage />} />
          </>
        )}

        {/* Common */}
        <Route path="/invoice/:id" element={<Invoice />} />

        {/* Default Redirect */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                role === "user"
                  ? userRoutes.DASHBOARD
                  : role === "admin"
                    ? adminRoutes.ADMIN_DASHBOARD
                    : role === "vendor"
                      ? vendorRoutes.DASHBOARD
                      : Router.HOME
              }
              replace
            />
          }
        />
      </Route>
    </Routes>
  );
};

export default Authenticated;
