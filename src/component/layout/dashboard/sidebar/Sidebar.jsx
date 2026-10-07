import React, { useLayoutEffect, useRef, useState } from "react";
import { Drawer, Box, IconButton } from "@mui/material";
import {
  ChevronLeft,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";

import SidebarContent from "./SidebarContent";
import {
  EXPANDED_WIDTH,
  COLLAPSED_WIDTH,
  LOGO_BOX_WIDTH,
} from "./sidebarConstants";

import mainContant from "../../../../constants/mainContent";
import { Router } from "../../../../constants/router";

const Sidebar = ({
  role: roleProp,
  mobileOpen: mobileOpenProp,
  onMobileClose,
  setInternalMobileOpen,
  internalMobileOpen
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const rawRole = (
    roleProp ||
    sessionStorage.getItem("role") ||
    "user"
  ).toLowerCase();

  const role = ["admin", "subadmin", "user"].includes(rawRole)
    ? rawRole
    : "user";

  const [collapsed, setCollapsed] = useState(false);

  const isControlled = mobileOpenProp !== undefined;

  const mobileOpen = isControlled
    ? mobileOpenProp
    : internalMobileOpen;

  const closeMobile = () => {
    if (isControlled) {
      onMobileClose?.();
    } else {
      setInternalMobileOpen(false);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    closeMobile();
  };

  // GSAP Refs
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const iconRef = useRef(null);
  const isFirstRun = useRef(true);

  useLayoutEffect(() => {
    if (!containerRef.current || !logoRef.current) return;

    if (isFirstRun.current) {
      gsap.set(containerRef.current, {
        width: collapsed
          ? COLLAPSED_WIDTH
          : EXPANDED_WIDTH,
      });

      gsap.set(logoRef.current, {
        width: collapsed ? 0 : LOGO_BOX_WIDTH,
        opacity: collapsed ? 0 : 1,
      });

      isFirstRun.current = false;
      return;
    }

    const tl = gsap.timeline({
      defaults: {
        duration: 0.35,
        ease: "power3.inOut",
      },
    });

    tl.to(
      containerRef.current,
      {
        width: collapsed
          ? COLLAPSED_WIDTH
          : EXPANDED_WIDTH,
      },
      0
    );

    tl.to(
      logoRef.current,
      {
        width: collapsed ? 0 : LOGO_BOX_WIDTH,
        opacity: collapsed ? 0 : 1,
      },
      collapsed ? 0 : 0.05
    );

    return () => tl.kill();
  }, [collapsed]);

  const handleToggleCollapse = () => {
    gsap.to(iconRef.current, {
      rotate: collapsed ? 0 : 180,
      duration: 0.35,
      ease: "back.out(1.7)",
    });

    setCollapsed((prev) => !prev);
  };

  const paperClass =
    "!border-r !border-[var(--whiold-border)] !bg-[var(--whiold-sidebar-bg,rgba(255,255,255,0.92))] !shadow-[var(--whiold-shadow-card)] backdrop-blur-md";

  return (
    <>
      {/* {!isControlled && (
        <IconButton
          onClick={() => setInternalMobileOpen(true)}
          className="!fixed !left-3 !top-3 !z-40 !rounded-[10px] !border !border-[var(--whiold-border)] !bg-white !text-[var(--whiold-primary)] shadow-[var(--whiold-shadow-card)] transition-transform duration-200 hover:!scale-105 md:!hidden"
        >
          <MenuIcon size={18} />
        </IconButton>
      )} */}

            {/* ───────────── Mobile Drawer ───────────── */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={closeMobile}
        ModalProps={{
          keepMounted: true,
          slotProps: {
            backdrop: { className: "!bg-black/40 backdrop-blur-sm" },
          },
        }}
        className="md:!hidden"
        classes={{ paper: `!w-[264px] ${paperClass}` }}
      >
        <Box 
         
        className="relative flex items-center justify-center border-b border-[var(--whiold-border)] px-4 py-3.5 w-full">
          <img
            src={mainContant.logo}
            alt={mainContant.appName}
            className="h-21 w-auto object-contain"
            onClick={() => navigate(Router.HOME)}
          />

          <IconButton
            onClick={closeMobile}
            size="small"
            sx={{background: "#68676730"}}
            className="!absolute !top-2 !right-2 !rounded-full !text-[var(--whiold-text-muted)] transition-colors duration-200 hover:!bg-[var(--whiold-bg-soft)] hover:!text-[var(--whiold-primary)]"
          >
            <X size={16} />
          </IconButton>
        </Box>

        <SidebarContent
          role={role}
          collapsed={false}
          onNavigate={handleNavigate}
          activePath={location.pathname}
        />
      </Drawer>

      {/* ───────────── Desktop Sidebar ───────────── */}
      <Box
        ref={containerRef}
        className="!hidden h-screen flex-shrink-0 overflow-hidden md:!block"
        style={{ width: EXPANDED_WIDTH }}
      >
        <Drawer
          variant="permanent"
          className="!h-full !w-full"
          sx={{
            width: "100%",
            height: "100%",
            "& .MuiDrawer-paper": {
              position: "static",
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
            },
          }}
          classes={{ paper: `${paperClass} !overflow-hidden` }}
        >
          <Box
            className={`flex h-[107px] items-center border-b border-[var(--whiold-border)] px-3 ${
              collapsed
                ? "justify-center"
                : "justify-between"
            }`}
          >
            <Box
              ref={logoRef}
              className="overflow-hidden"
               onClick={() => navigate("/")}
            >
              <img
                src={mainContant.logo}
                alt={mainContant.appName}
                className="h-23 w-auto items-center object-contain"
              />
            </Box>

            <IconButton
              onClick={handleToggleCollapse}
              size="small"
              className="!h-8 !w-8 !flex-shrink-0 !rounded-full !border !border-[var(--whiold-border)] !bg-[var(--whiold-bg-soft)] !text-[var(--whiold-primary)] transition-colors duration-200 hover:!border-[var(--whiold-primary)] hover:!bg-[var(--whiold-primary)] hover:!text-white"
            >
              <Box
                ref={iconRef}
                className="flex items-center justify-center"
              >
                <ChevronLeft size={15} />
              </Box>
            </IconButton>
          </Box>
                    <SidebarContent
            role={role}
            collapsed={collapsed}
            onNavigate={handleNavigate}
            activePath={location.pathname}
          />
        </Drawer>
      </Box>
    </>
  );
};

export default Sidebar;