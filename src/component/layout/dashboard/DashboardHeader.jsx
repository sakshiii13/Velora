import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { LogOut, Shield, Maximize2, Minimize2, Sun, Moon, CloudSun, MenuIcon, Bell } from "lucide-react";
import { AppBar, Toolbar, Box, IconButton, Tooltip, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Notifications from "../../pages/user/account/Notifications";
import { useAuth } from "../../../context/AuthContext";
import { getRole } from "../../../utils/authStorage";
import HomeIcon from '@mui/icons-material/Home';

const ROLE_CONFIG = {
  admin: {
    badge: "Admin",
    profileLabel: "Admin",
    profilePath: "/admin/profile",
    canOpenProfile: false,
    fallbackTitle: "Admin Dashboard",
  },
  subadmin: {
    badge: "Sub Admin",
    profileLabel: "Sub Admin",
    profilePath: "/subadmin/profile",
    canOpenProfile: true,
    fallbackTitle: "Sub Admin Dashboard",
  },
  user: {
    badge: "User",
    profileLabel: "Profile",
    profilePath: "/profile",
    canOpenProfile: true,
    fallbackTitle: "User Dashboard",
  },
};

const getRoleConfig = (role) => ROLE_CONFIG[role] || ROLE_CONFIG.user;

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good morning", Icon: Sun };
  if (hour < 17) return { text: "Good afternoon", Icon: CloudSun };
  return { text: "Good evening", Icon: Moon };
};

// ---- demo notifications — replace with real feed from API/socket ----
const demoNotifications = [
  {
    id: "n1",
    type: "success",
    title: "Withdrawal approved",
    message: "Your withdrawal of ₹5,000 has been approved and sent to HDFC •• 4821.",
    time: "5m ago",
    read: false,
  },
  {
    id: "n2",
    type: "info",
    title: "New order received",
    message: "Order #WD1042 was placed and is awaiting confirmation.",
    time: "1h ago",
    read: false,
  },
  {
    id: "n3",
    type: "warning",
    title: "Action needed",
    message: "Bank details for withdrawal #w3 could not be verified.",
    time: "3h ago",
    read: false,
  },
  {
    id: "n4",
    type: "info",
    title: "Payout processed",
    message: "₹8,120 has been credited to your wallet.",
    time: "Yesterday",
    read: true,
  },
];

const DashboardHeader = ({ user: userProp, role: roleProp, onLogout, setInternalMobileOpen }) => {
  const navigate = useNavigate();
  const bellRef = useRef(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [user, setUser] = useState(userProp || null);
  const [notifications, setNotifications] = useState(demoNotifications);
  const [notifOpen, setNotifOpen] = useState(false);
  const {logout} = useAuth();

  useEffect(() => {
    if (userProp) {
      setUser(userProp);
      return;
    }
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch (err) {
      console.error("Dashboard header: user parse failed", err);
    }
  }, [userProp]);

  const role = getRole();
  const { profileLabel, profilePath, canOpenProfile, fallbackTitle } = getRoleConfig(role);
  const isManagement = role === "admin" || role === "subadmin";
  const greeting = useMemo(() => getGreeting(), []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFSChange);
    return () => document.removeEventListener("fullscreenchange", onFSChange);
  }, []);

  // close notification panel on outside click
  useEffect(() => {
    if (!notifOpen) return;
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  const handleFullscreenToggle = useCallback(async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else if (document.exitFullscreen) await document.exitFullscreen();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleMarkRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const displayName = user?.name || fallbackTitle;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <Box className="">
      <AppBar
        position="static"
        elevation={0}
        component="div"
        className="!bg-transparent !text-inherit relative overflow-visible rounded-[26px] border border-[var(--whiold-border)] shadow-[var(--whiold-shadow-card)]"
        style={{ backgroundImage: "var(--whiold-gradient-panel)" }}
      >
        <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[var(--whiold-primary)] opacity-[0.08] blur-2xl" />
        <div className="pointer-events-none absolute -left-6 -bottom-10 h-20 w-20 rounded-full bg-[var(--whiold-400)] opacity-[0.10] blur-2xl" />

        <Toolbar disableGutters className="!min-h-0 flex items-center justify-between gap-3 px-3 py-3.5 sm:px-4">
          {/* ── LEFT: avatar + greeting ── */}
          <Box className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <IconButton
              onClick={() => setInternalMobileOpen(true)}
              className="!rounded-[10px] !border !border-[var(--whiold-border)] !bg-white !text-[var(--whiold-primary)] shadow-[var(--whiold-shadow-card)] transition-transform duration-200 hover:!scale-105 md:!hidden"
            >
              <MenuIcon size={18} />
            </IconButton>

            <Box className="flex-shrink-0 rounded-full p-[2.5px]" style={{ backgroundImage: "var(--whiold-gradient-brand)" }}>
              {user?.profilePhoto ? (
                <Avatar
                  src={user.profilePhoto}
                  className="!h-9 !w-9 !border-2 !border-white sm:!h-10 sm:!w-10"
                />
              ) : (
                <Avatar className="!h-9 !w-9 !border-2 !border-white !bg-[var(--whiold-bg)] font-serif !text-sm !font-bold !text-[var(--whiold-primary)] sm:!h-10 sm:!w-10">
                  {initial}
                </Avatar>
              )}
            </Box>

            <Box className="min-w-0">
              <Box className="flex items-center gap-1 text-[10px] font-medium text-[var(--whiold-text-muted)] sm:text-[11px]">
                <greeting.Icon size={11} className="text-[var(--whiold-primary)]" />
                <span>{greeting.text}</span>
              </Box>
              <h2 className="m-0 max-w-[120px] truncate font-serif text-[13px] font-bold leading-tight text-[var(--whiold-text-heading)] sm:max-w-[220px] sm:text-[15px] md:max-w-none">
                {displayName}
              </h2>
            </Box>
          </Box>

          {/* ── RIGHT: role pill + actions ── */}
          <Box className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2">

            {/*HomePage*/}
            <Tooltip title="Home" arrow>
              <IconButton
                onClick={() => navigate("/")}
                size="small"
                className=" !h-9 !w-9 !rounded-full !border !border-[var(--whiold-border)] !bg-white/70 !text-[var(--whiold-primary)] transition-all duration-200 hover:!scale-105 hover:!bg-[var(--whiold-primary)] hover:!text-white "
              >
                <HomeIcon size={14} />
              </IconButton>
            </Tooltip>
            {/* Fullscreen */}
            <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} arrow>
              <IconButton
                onClick={handleFullscreenToggle}
                size="small"
                className="!hidden !h-9 !w-9 !rounded-full !border !border-[var(--whiold-border)] !bg-white/70 !text-[var(--whiold-primary)] transition-all duration-200 hover:!scale-105 hover:!bg-[var(--whiold-primary)] hover:!text-white sm:!flex"
              >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </IconButton>
            </Tooltip>

{/* Notification bell */}
{role === "user" && <Box className="relative">
  <Tooltip title="Notifications" arrow>
    <IconButton
      ref={bellRef}
      onClick={() => setNotifOpen((p) => !p)}
      size="small"
      className={`!h-9 !w-9 !rounded-full !border !border-[var(--whiold-border)] !bg-white/70 !text-[var(--whiold-primary)] transition-all duration-200 hover:!scale-105 hover:!bg-[var(--whiold-primary)] hover:!text-white ${
        notifOpen ? "!bg-[var(--whiold-primary)] !text-white" : ""
      }`}
    >
      <Bell size={14} />
    </IconButton>
  </Tooltip>

  {unreadCount > 0 && (
    <span
      className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
      style={{ background: "#C0392B", boxShadow: "0 0 0 2px var(--whiold-bg)" }}
    >
      {unreadCount > 9 ? "9+" : unreadCount}
    </span>
  )}

  <Notifications
    anchorRef={bellRef}
    open={notifOpen}
    notifications={notifications}
    onClose={() => setNotifOpen(false)}
    onMarkRead={handleMarkRead}
    onMarkAllRead={handleMarkAllRead}
  />
</Box>}

            {/* Profile chip */}
            {isManagement && (
              <Box
                onClick={canOpenProfile ? () => navigate(profilePath) : undefined}
                className={`hidden items-center gap-1.5 rounded-full border border-[var(--whiold-border)] bg-white/70 px-3 py-1.5 md:flex ${
                  canOpenProfile ? "cursor-pointer transition-colors duration-200 hover:border-[var(--whiold-primary)]" : "cursor-default"
                }`}
              >
                <Shield size={11} className="text-[var(--whiold-primary)]" />
                <span className="font-mono text-[10px] font-semibold text-[var(--whiold-text-body)]">{profileLabel}</span>
              </Box>
            )}

            {/* Logout */}
            <Tooltip title="Logout" arrow>
              <IconButton
                onClick={logout}
                size="small"
                className="!h-9 !w-9 !rounded-full !border !border-rose-200 !bg-rose-50 !text-rose-400 transition-all duration-200 hover:!scale-105 hover:!bg-rose-400 hover:!text-white"
              >
                <LogOut size={14} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default DashboardHeader;