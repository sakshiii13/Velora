import React, { useEffect, useRef } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import gsap from "gsap";
import { isPathActive } from "./sidebarUtils";

const CollapsedItem = ({ item, onNavigate, activePath }) => {
  const Icon = item.icon;

  const hasChildren = item.children?.length > 0;

  const flyoutRef = useRef(null);
  const closeTimer = useRef(null);

  const isParentActive =
    isPathActive(activePath, item.path) ||
    item.children?.some((child) => isPathActive(activePath, child.path));

  const openFlyout = () => {
    if (!hasChildren) return;

    clearTimeout(closeTimer.current);

    const el = flyoutRef.current;

    if (!el) return;

    gsap.killTweensOf(el);

    gsap.set(el, {
      display: "block",
    });

    gsap.fromTo(
      el,
      {
        opacity: 0,
        x: -8,
        scale: 0.96,
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.22,
        ease: "power2.out",
      },
    );
  };

  const closeFlyout = () => {
    if (!hasChildren) return;

    closeTimer.current = setTimeout(() => {
      const el = flyoutRef.current;

      if (!el) return;

      gsap.killTweensOf(el);

      gsap.to(el, {
        opacity: 0,
        x: -8,
        scale: 0.96,
        duration: 0.18,
        ease: "power2.in",
        onComplete: () =>
          gsap.set(el, {
            display: "none",
          }),
      });
    }, 150);
  };

  useEffect(() => {
    return () => clearTimeout(closeTimer.current);
  }, []);

  const button = (
    <ListItemButton
      onClick={() => !hasChildren && onNavigate(item.path)}
      className={`!min-h-0 !justify-center !rounded-[10px] !px-3 !py-2.5 transition-all duration-200 ease-out active:!scale-[0.98] ${
        isParentActive
          ? "!bg-[var(--whiold-primary-soft)] !text-[var(--whiold-primary)]"
          : "!text-[var(--whiold-text-body)] hover:!bg-[var(--whiold-sidebar-item-hover-bg,var(--whiold-bg-soft))]"
      }`}
    >
      <ListItemIcon
        className={`!min-w-0 ${
          isParentActive
            ? "!text-[var(--whiold-primary)]"
            : "!text-[var(--whiold-text-muted)]"
        }`}
      >
        <Icon size={17} />
      </ListItemIcon>
    </ListItemButton>
  );

  return (
    <Box
      className="relative"
      onMouseEnter={openFlyout}
      onMouseLeave={closeFlyout}
    >
      {hasChildren ? (
        <Box>{button}</Box>
      ) : (
        <Tooltip title={item.label} placement="right" arrow>
          <Box>{button}</Box>
        </Tooltip>
      )}

      {hasChildren && (
        <Box
          ref={flyoutRef}
          className="absolute left-[calc(100%+10px)] top-0 z-50 min-w-[196px] rounded-[12px] border border-[var(--whiold-border)] bg-[var(--whiold-sidebar-bg,rgba(255,255,255,0.98))] p-2 shadow-[var(--whiold-shadow-card)] backdrop-blur-md"
          style={{
            display: "none",
            transformOrigin: "left center",
          }}
        >
          <p className="mb-1 px-2 pt-0.5 font-mono text-[10.5px] font-bold uppercase tracking-wider text-[var(--whiold-text-muted)]">
            {item.label}
          </p>

          <List disablePadding className="flex flex-col gap-1">
            {item.children.map((child) => {
              const isChildActive = isPathActive(activePath, child.path);

              const ChildIcon = child.icon;

              return (
                <ListItemButton
                  key={child.path}
                  onClick={() => onNavigate(child.path)}
                  className={`!min-h-0 !rounded-[8px] !px-3 !py-2 transition-all duration-200 ease-out hover:!translate-x-[2px] ${
                    isChildActive
                      ? "!bg-[rgba(37,99,235,0.12)] !border !border-[rgba(37,99,235,0.25)] !text-[var(--whiold-primary)] shadow-sm"
                      : "!text-[var(--whiold-text-muted)] hover:!bg-[var(--whiold-sidebar-item-hover-bg,var(--whiold-bg-soft))] hover:!text-[var(--whiold-text-body)]"
                  }`}
                >
                  {ChildIcon && (
                    <ListItemIcon
                      className={`!min-w-0 !mr-2.5 ${
                        isChildActive
                          ? "!text-[var(--whiold-primary)]"
                          : "!text-[var(--whiold-text-muted)]"
                      }`}
                    >
                      <ChildIcon size={14} />
                    </ListItemIcon>
                  )}

                  <ListItemText
                    primary={child.label}
                    primaryTypographyProps={{
                      className: "!font-mono !text-[12px] !font-medium",
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default CollapsedItem;
