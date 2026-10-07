import React, { useState } from "react";
import Sidebar from "./dashboard/sidebar/Sidebar";
import DashboardHeader from "../../component/layout/dashboard/DashboardHeader";
import { Outlet, useLocation } from "react-router-dom";
import { getRole } from "../../utils/authStorage";
// import DashboardFooter from "./dashboard/DashboardFooter";

const DashboardLayout = () => {
  const location = useLocation();
  const role = getRole();
  const [internalMobileOpen, setInternalMobileOpen] =
      useState(false);

  return (
    <div className="flex bg-[var(--whiold-bg-soft)] overflow-hidden h-screen">
      <div className="">
        <Sidebar role={role} setInternalMobileOpen={setInternalMobileOpen} internalMobileOpen={internalMobileOpen} />
      </div>

      <div className="flex flex-col flex-1 min-w-0 p-4">
        <div className="sticky top-0 z-10">
          <DashboardHeader setInternalMobileOpen={setInternalMobileOpen} />
        </div>
        <div className="flex-1 overflow-y-auto pt-4 overflow-x-hidden">
          <Outlet />
        </div>
        {/* <DashboardFooter/> */}
      </div>
    </div>
  );
};

export default DashboardLayout;