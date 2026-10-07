import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../component/pages/landing/navbar/Navbar";
import Footer from "../pages/landing/Footer";
import MobileBottomNavigation from "../navigation/MobileBottomNavigation";
import { getAllCategories } from "../../api/user/category.api";
import { useAuth } from "../../context/AuthContext";
import { isBottomNavVisible } from "../../utils/navigationConfig";

const MainLayout = () => {
  const { showLoader, hideLoader } = useAuth();
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  const showBottomNav = isBottomNavVisible(location.pathname);
  const bottomPaddingClass = showBottomNav
    ? "pb-[calc(84px+env(safe-area-inset-bottom))] md:pb-0"
    : "pb-0";

  const fetchData = async () => {
    showLoader();
    try {
      const res = await getAllCategories();
      if (res?.success) {
        setCategories(res.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar categories={categories} />
      <div className={`flex-1 ${bottomPaddingClass}`}>
        <Outlet />
      </div>
      <div className={bottomPaddingClass}>
        <Footer />
      </div>
      <MobileBottomNavigation />
    </div>
  );
};

export default MainLayout;