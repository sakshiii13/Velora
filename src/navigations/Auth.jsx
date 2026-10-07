import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../component/layout/MainLayout'
import { Router } from '../constants/router'
import Home from '../component/pages/landing/Home'
import ProductDetail from '../component/pages/landing/Productdetail'
import Cart from '../component/pages/landing/Cart'
import WishlistPage from '../component/pages/landing/WishlistPage'
import Shopping from '../component/pages/landing/navbar/Shopping'
import Collections from '../component/pages/landing/navbar/Collections'
import Shop from '../component/pages/landing/Shop'
import TheEditSection from '../component/pages/landing/Theeditsection'
import PolaroidProductCard from '../component/pages/landing/Polaroidproductcard'
import BrandSection from '../component/pages/landing/brands/BrandSection'
import Login from '../component/pages/landing/auth/Login'
import AdminLogin from '../component/pages/landing/auth/AdminLogin'
import Register from '../component/pages/landing/auth/Register'
import DataTable from '../component/ui/DataTable'
import { useAuth } from '../context/AuthContext'
import { getToken } from '../utils/authStorage'
import CategoryPage from '../component/pages/landing/navbar/categories/CategoryPage'
import AboutPage from '../component/pages/landing/navbar/AboutPage'
import { ContactMailTwoTone } from '@mui/icons-material'
import ContactPage from '../component/pages/landing/navbar/Contact'
import Checkout from '../component/pages/landing/Checkout'

const Auth = () => {
    const {isAuthenticated} = useAuth();
    const token = getToken();

    if(token && isAuthenticated)  {
        return <Navigate to="/dashboard" replace />
    }

  return (
    <Routes>
        <Route element={<MainLayout />}>
        <Route path={Router.HOME} element={<Home />} />
        <Route path={Router.PRODUCT_DETAIL} element={<ProductDetail />} />
        <Route path={Router.CART} element={<Cart />} />
        <Route path={Router.WISHLIST} element={<WishlistPage />} />
        <Route path={Router.SHOPPING} element={<Shopping />} />
        <Route path={Router.COLLECTION} element={<Collections />} />
        <Route path={Router.CATEGORY} element={<CategoryPage />} />
        <Route path={Router.ABOUT} element={<AboutPage />} />
        <Route path={Router.CONTACT} element={<ContactPage />} />
        <Route path={Router.CHECKOUT} element={<Checkout />} />
      </Route>
      <Route path={Router.SHOP} element={<Shop />} />
      <Route path={Router.THEEDIT} element={<TheEditSection />} />
      <Route path={Router.POLAROID} element={<PolaroidProductCard />} />
      <Route path={Router.BRAND_SECTION} element={<BrandSection />} />
      <Route path={Router.LOGIN} element={<Login />} />
      <Route path={Router.ADMIN_LOGIN} element={<AdminLogin />} />
      <Route path={Router.REGISTER} element={<Register />} />
      <Route path={Router.TABLE} element={<DataTable />} />
      <Route path="*" element={<Navigate to={Router.LOGIN} replace />} />
    </Routes>
  )
}

export default Auth