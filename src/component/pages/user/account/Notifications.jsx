import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCheck, Info, CheckCircle2, AlertTriangle, BellOff } from "lucide-react";

const typeConfig = {
  success: { icon: CheckCircle2, color: "#2E9B5F", bg: "rgba(46, 155, 95, 0.1)" },
  info: { icon: Info, color: "var(--whiold-primary)", bg: "var(--whiold-primary-soft)" },
  warning: { icon: AlertTriangle, color: "#B8860B", bg: "rgba(184, 134, 11, 0.1)" },
};

const PANEL_WIDTH = 380;
const GUTTER = 12;

const Notifications = ({ anchorRef, open, notifications = [], onClose, onMarkRead, onMarkAllRead }) => {
  const panelRef = useRef(null);
  const [coords, setCoords] = useState(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ---- position calculation, re-runs on open/resize/scroll ----
  const updatePosition = () => {
    if (!anchorRef?.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const mobile = window.innerWidth < 640;
    setIsMobile(mobile);

    if (mobile) {
      setCoords({
        top: rect.bottom + 10,
        left: GUTTER,
        width: window.innerWidth - GUTTER * 2,
      });
    } else {
      const idealLeft = rect.right - PANEL_WIDTH;
      const left = Math.max(GUTTER, Math.min(idealLeft, window.innerWidth - PANEL_WIDTH - GUTTER));
      setCoords({
        top: rect.bottom + 10,
        left,
        width: PANEL_WIDTH,
      });
    }
  };

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();

    const handleReflow = () => updatePosition();
    window.addEventListener("resize", handleReflow);
    window.addEventListener("scroll", handleReflow, true); // capture: catches scroll in any scrollable ancestor
    return () => {
      window.removeEventListener("resize", handleReflow);
      window.removeEventListener("scroll", handleReflow, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, anchorRef, onClose]);

  if (!open || !coords) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* mobile backdrop only — desktop click-outside handled via listener above */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 sm:hidden"
            style={{ zIndex: 9998, background: "rgba(0,0,0,0.2)" }}
          />

          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed overflow-hidden rounded-[var(--whiold-radius-lg)]"
            style={{
              zIndex: 9999,
              top: coords.top,
              left: coords.left,
              width: coords.width,
              maxWidth: isMobile ? "none" : PANEL_WIDTH,
              background: "var(--whiold-bg)",
              border: "1px solid var(--whiold-border)",
              boxShadow: "var(--whiold-shadow-card)",
            }}
          >
            {/* header */}
            <div
              className="flex items-center justify-between px-4 py-3.5"
              style={{ borderBottom: "1px solid var(--whiold-border)" }}
            >
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold" style={{ color: "var(--whiold-text-heading)" }}>
                  Notifications
                </h4>
                {unreadCount > 0 && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{ background: "var(--whiold-primary-soft)", color: "var(--whiold-primary)" }}
                  >
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="flex items-center gap-1 text-xs font-medium transition-colors"
                  style={{ color: "var(--whiold-primary)" }}
                >
                  <CheckCheck size={13} />
                  Mark all read
                </button>
              )}
            </div>

            {/* list */}
            <div className="max-h-[360px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                    style={{ background: "var(--whiold-primary-soft)", color: "var(--whiold-primary)" }}
                  >
                    <BellOff size={18} />
                  </span>
                  <p className="text-sm font-medium" style={{ color: "var(--whiold-text-heading)" }}>
                    You're all caught up
                  </p>
                  <p className="text-xs" style={{ color: "var(--whiold-text-muted)" }}>
                    New notifications will show up here
                  </p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: "var(--whiold-border)" }}>
                  {notifications.map((n, i) => {
                    const cfg = typeConfig[n.type] || typeConfig.info;
                    const Icon = cfg.icon;
                    return (
                      <motion.button
                        key={n.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.03 }}
                        onClick={() => onMarkRead(n.id)}
                        className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors"
                        style={{ background: n.read ? "transparent" : "var(--whiold-bg-soft)" }}
                      >
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                          style={{ background: cfg.bg }}
                        >
                          <Icon size={14} style={{ color: cfg.color }} />
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate text-[13px] font-semibold" style={{ color: "var(--whiold-text-heading)" }}>
                              {n.title}
                            </p>
                            {!n.read && (
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--whiold-primary)" }} />
                            )}
                          </div>
                          <p className="mt-0.5 text-xs leading-snug" style={{ color: "var(--whiold-text-body)" }}>
                            {n.message}
                          </p>
                          <p className="mt-1 text-[11px]" style={{ color: "var(--whiold-text-muted)" }}>
                            {n.time}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Notifications;