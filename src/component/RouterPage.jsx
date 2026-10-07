import React from "react";
import { Route, Routes } from "react-router-dom";

import DataTable from "./ui/DataTable";
import { Router, userRoutes, adminRoutes } from "../constants/router";

import Login from "./pages/landing/auth/Login";
import Register from "./pages/landing/auth/Register";
import UserDashboard from "./pages/user/UserDashboard";
import DashboardLayout from "./layout/DashboardLayout";
import Home from "./pages/landing/Home";
import Shop from "./pages/landing/Shop";
import MainLayout from "./layout/MainLayout";
import ProductDetail from "./pages/landing/Productdetail";
import TheEditSection from "./pages/landing/Theeditsection";
import AdminLogin from "./pages/landing/auth/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddProduct from "./pages/admin/products/AddProduct";
import ManageProduct from "./pages/admin/products/ManageProducts";
import SubCategory from "./pages/admin/category/SubCategory";
import Category from "./pages/admin/category/Category";
import Brands from "./pages/admin/category/Brands";
import ManageOrder from "./pages/admin/orders/ManageOrder";
import ManageAllUsers from "./pages/admin/users/ManageAllUsers";
import PolaroidProductCard from "./pages/landing/Polaroidproductcard";
import Shopping from "./pages/landing/navbar/Shopping";
import Invoice from "./pages/shared/Invoice";
import BrandSection from "./pages/landing/brands/BrandSection";
import WishlistPage from "./pages/landing/WishlistPage";
import Cart from "./pages/landing/Cart";
import TrackOrder from "./pages/user/orders/TrackOrder";
import AllOrders from "./pages/user/orders/AllOrders";
import RewardHistory from "./pages/user/rewards/RewardHistory";
import Collections from "./pages/landing/navbar/Collections";
import WelcomeLetterPage from "./pages/user/WelcomeLetterPage";

export const RouterPage = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path={Router.HOME} element={<Home />} />
        <Route path={Router.PRODUCT_DETAIL} element={<ProductDetail />} />
        <Route path={Router.CART} element={<Cart />} />
        <Route path={Router.WISHLIST} element={<WishlistPage />} />
        <Route path={Router.SHOPPING} element={<Shopping />} />
        <Route path={Router.COLLECTION} element={<Collections />} />
      </Route>
      <Route path={Router.SHOP} element={<Shop />} />
      <Route path={Router.THEEDIT} element={<TheEditSection />} />
      <Route path={Router.POLAROID} element={<PolaroidProductCard />} />
      <Route path={Router.BRAND_SECTION} element={<BrandSection />} />
      <Route path={Router.LOGIN} element={<Login />} />
      <Route path={adminRoutes.ADMIN_LOGIN} element={<AdminLogin />} />
      <Route path={Router.REGISTER} element={<Register />} />
      <Route path={Router.TABLE} element={<DataTable />} />

      {/* Dashboard Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/invoice/:id" element={<Invoice />} />
        
        <Route path={userRoutes.DASHBOARD} element={<UserDashboard />} />
        <Route path={userRoutes.WELCOME} element={<WelcomeLetterPage />} />
        <Route path={userRoutes.ALL_ORDERS} element={<AllOrders />} />
        <Route path={userRoutes.TRACK_ORDERS} element={<TrackOrder />} />
        <Route path={userRoutes.REWARDS} element={<RewardHistory />} />

        <Route
          path={adminRoutes.ADMIN_DASHBOARD}
          element={<AdminDashboard />}
        />

        <Route path={adminRoutes.ADD_PRODUCT} element={<AddProduct />} />
        <Route path={adminRoutes.MANAGE_PRODUCTS} element={<ManageProduct />} />
        <Route path={adminRoutes.CATEGORIES} element={<Category />} />
        <Route path={adminRoutes.SUB_CATEGORY} element={<SubCategory />} />
        <Route path={adminRoutes.BRANDS} element={<Brands />} />
        <Route path={adminRoutes.ORDERS} element={<ManageOrder />} />
        <Route path={adminRoutes.USERS} element={<ManageAllUsers />} />
        {/* <Route path={adminRoutes.ADMIN_ORDERS} element={<OrdersManagement />} />
        <Route path={adminRoutes.ADMIN_CATEGORIES} element={<CategoriesManagement />} />
        <Route path={adminRoutes.ADMIN_REVIEWS} element={<ReviewsManagement />} /> 
     */}
      </Route>
    </Routes>
  );
};
