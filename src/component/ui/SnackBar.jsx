import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertTriangle, Info, ShoppingBag } from "lucide-react";

const SEVERITY_STYLES = {
  success: {
    icon: Check,
    iconWrap: "bg-[#10b981] text-white shadow-sm shadow-emerald-500/20",
    bar: "bg-[#10b981]",
  },
  error: {
    icon: X,
    iconWrap: "bg-[#f43f5e] text-white shadow-sm shadow-rose-500/20",
    bar: "bg-[#f43f5e]",
  },
  warning: {
    icon: AlertTriangle,
    iconWrap: "bg-[#f59e0b] text-white shadow-sm shadow-amber-500/20",
    bar: "bg-[#f59e0b]",
  },
  info: {
    icon: Info,
    iconWrap: "bg-[#0ea5e9] text-white shadow-sm shadow-sky-500/20",
    bar: "bg-[#0ea5e9]",
  },
};

const SnackBar = ({
  open,
  onClose,
  message,
  title,
  severity = "success",
  autoHideDuration = 3000,
  position = "top-right",
  triggerId,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);
  const remainingTimeRef = useRef(autoHideDuration);
  const startTimeRef = useRef(null);

  // Initialize and reset timers when triggerId changes
  useEffect(() => {
    if (open) {
      remainingTimeRef.current = autoHideDuration;
      setIsHovered(false); // Reset hover state on new trigger to ensure progress bar restarts smoothly
    }
  }, [open, triggerId, autoHideDuration]);

  useEffect(() => {
    if (!open) return;

    if (!isHovered) {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        onClose();
      }, remainingTimeRef.current);

      return () => {
        clearTimeout(timerRef.current);
        const elapsed = Date.now() - startTimeRef.current;
        remainingTimeRef.current -= elapsed;
      };
    } else {
      clearTimeout(timerRef.current);
    }
  }, [open, isHovered, triggerId, onClose]);

  const config = SEVERITY_STYLES[severity] || SEVERITY_STYLES.success;
  const Icon = config.icon;

  // IMPORTANT: on mobile we anchor BOTH left and right (auto width, capped by
  // max-w on the element itself) instead of only one side + w-full.
  // Only setting `right` + `w-full` made the box overflow past the left edge
  // on narrow-viewport phones (e.g. ~360px CSS width devices like Realme 7),
  // which is what was causing it to look "cut off". Setting both sides lets
  // the browser compute a safe width that always fits inside the viewport,
  // with a fixed width kicking in only from `sm:` up.
  const positionClasses = {
    "top-right":
      "top-4 left-4 right-4 sm:top-6 sm:left-auto sm:right-6",
    "top-left":
      "top-4 left-4 right-4 sm:top-6 sm:right-auto sm:left-6",
    "bottom-right":
      "bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6",
    "bottom-left":
      "bottom-4 left-4 right-4 sm:bottom-6 sm:right-auto sm:left-6",
  }[position] || "top-4 left-4 right-4 sm:top-6 sm:left-auto sm:right-6";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: position.includes("top") ? -30 : 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: position.includes("top") ? -20 : 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 450, damping: 30 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`fixed z-[9999] mx-auto flex w-auto max-w-[360px] flex-col overflow-hidden rounded-[20px] bg-white/80 border border-white/60 p-4 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl sm:w-[360px] ${positionClasses}`}
          style={{
            WebkitBackdropFilter: "blur(20px)",
            // Respect notches / rounded-corner safe areas on mobile
            marginTop: position.includes("top") ? "env(safe-area-inset-top)" : undefined,
            marginBottom: position.includes("bottom") ? "env(safe-area-inset-bottom)" : undefined,
          }}
        >
          {/* Progress Bar Container */}
          <div className="absolute bottom-0 left-0 h-[3px] w-full bg-slate-100/50">
            <div
              key={triggerId} // forces restart of the CSS animation when a new notification is triggered
              className={`h-full ${config.bar}`}
              style={{
                width: "100%",
                animation: `snackbar-shrink ${autoHideDuration}ms linear forwards`,
                animationPlayState: isHovered ? "paused" : "running",
              }}
            />
          </div>

          <style>
            {`
              @keyframes snackbar-shrink {
                0% { width: 100%; }
                100% { width: 0%; }
              }
            `}
          </style>

          <div className="flex items-start gap-3 sm:gap-4">
            {/* Icon Circle */}
            <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 ${config.iconWrap}`}>
              <Icon size={17} strokeWidth={2.5} className="sm:hidden" />
              <Icon size={18} strokeWidth={2.5} className="hidden sm:block" />
            </div>

            {/* Text Content */}
            <div className="min-w-0 flex-1 pt-0.5 pb-1">
              <h3 className="truncate text-[14px] font-semibold text-slate-900 tracking-tight sm:text-[15px]">
                {title || (severity === "success" ? "Success" : "Notification")}
              </h3>
              <p className="mt-1 text-[13px] leading-[1.4] text-slate-500 font-medium sm:text-[13.5px]">
                {message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="mt-0.5 flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-slate-100/60 text-slate-400 transition-all hover:bg-slate-200 hover:text-slate-700 active:scale-95 sm:h-7 sm:w-7"
            >
              <X size={14} strokeWidth={2.5} className="sm:hidden" />
              <X size={15} strokeWidth={2.5} className="hidden sm:block" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SnackBar;