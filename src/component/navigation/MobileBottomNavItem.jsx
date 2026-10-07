import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MobileBottomNavItem = ({
  label,
  to,
  icon: Icon,
  isActive,
  badgeCount = 0,
  onClick,
}) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
      className="relative flex-1 flex flex-col items-center justify-center min-h-[52px] min-w-[48px] py-1 px-1 rounded-2xl select-none outline-none focus-visible:ring-2 focus-visible:ring-(--whiold-primary)"
    >
      {/* Sliding Active Pill Background Indicator */}
      {isActive && (
        <motion.div
          layoutId="mobileActiveTabPill"
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(186, 112, 79, 0.14) 0%, rgba(242, 225, 217, 0.5) 100%)",
            border: "1px solid rgba(186, 112, 79, 0.2)",
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 32,
          }}
        />
      )}

      {/* Icon with Lift & Scale Animation */}
      <div className="relative z-10 flex items-center justify-center">
        <motion.div
          animate={{
            y: isActive ? -2 : 0,
            scale: isActive ? 1.15 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 24,
          }}
        >
          <Icon
            size={21}
            style={{
              color: isActive ? "var(--whiold-primary)" : "var(--whiold-text-muted)",
              strokeWidth: isActive ? 2.3 : 1.8,
              transition: "color 0.2s ease, stroke-width 0.2s ease",
            }}
          />
        </motion.div>

        {/* Notification Badge */}
        {badgeCount > 0 && (
          <motion.span
            key={badgeCount}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="absolute -top-1.5 -right-2.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full text-white shadow-xs border-2 border-white pointer-events-none"
            style={{
              backgroundColor: "var(--whiold-primary)",
            }}
          >
            {badgeCount > 99 ? "99+" : badgeCount}
          </motion.span>
        )}
      </div>

      {/* Label Text */}
      <motion.span
        animate={{
          scale: isActive ? 1.05 : 1,
          opacity: isActive ? 1 : 0.8,
        }}
        transition={{ duration: 0.2 }}
        className={`relative z-10 text-[10.5px] mt-0.5 tracking-tight transition-colors duration-200 ${
          isActive
            ? "font-semibold text-(--whiold-primary)"
            : "font-medium text-(--whiold-text-body)"
        }`}
      >
        {label}
      </motion.span>
    </Link>
  );
};

export default MobileBottomNavItem;
