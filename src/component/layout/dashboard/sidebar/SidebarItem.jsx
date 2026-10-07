import React, { useLayoutEffect, useRef } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { isPathActive } from "./sidebarUtils";

const SidebarItem = ({
  item,
  isOpen,
  onToggle,
  onNavigate,
  activePath,
}) => {
  const Icon = item.icon;
  const hasChildren = item.children?.length > 0;

  const submenuRef = useRef(null);
  const chevronRef = useRef(null);
  const isFirstRun = useRef(true);

  const isExactActive = item.path ? isPathActive(activePath, item.path) : false;
  const isChildActive = item.children?.some((child) =>
    isPathActive(activePath, child.path)
  );

  const isParentActive = isExactActive || isChildActive;

  // Accordion Animation
  useLayoutEffect(() => {
    const el = submenuRef.current;

    if (!el || !hasChildren) return;

    if (isFirstRun.current) {
      gsap.set(el, {
        height: isOpen ? "auto" : 0,
        opacity: isOpen ? 1 : 0,
      });

      isFirstRun.current = false;
      return;
    }

    gsap.killTweensOf(el);

    if (isOpen) {
      gsap.set(el, {
        height: 0,
        opacity: 0,
        display: "block",
      });

      const targetHeight = el.scrollHeight;

      gsap.to(el, {
        height: targetHeight,
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
        onComplete: () => {
          gsap.set(el, {
            height: "auto",
          });
        },
      });
    } else {
      gsap.set(el, {
        height: el.scrollHeight,
      });

      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.32,
        ease: "power3.inOut",
      });
    }
  }, [isOpen, hasChildren]);

  // Chevron Rotation
  useLayoutEffect(() => {
    if (!chevronRef.current) return;

    gsap.to(chevronRef.current, {
      rotate: isOpen ? 180 : 0,
      duration: 0.35,
      ease: "power2.inOut",
    });
  }, [isOpen]);

  const handleClick = () => {
    if (hasChildren) {
      onToggle(item.path);
    } else {
      onNavigate(item.path);
    }
  };
    return (
    <Box>
      <ListItemButton
        onClick={handleClick}
        className={`!min-h-0 !rounded-[10px] !px-3 !py-2.5 transition-all duration-200 ease-out hover:!translate-x-[2px] active:!scale-[0.98] ${
          isExactActive
            ? "!bg-[var(--whiold-sidebar-item-active-bg,var(--whiold-primary-soft))] !text-[var(--whiold-sidebar-item-active-text,var(--whiold-primary-hover))]"
            : isChildActive
            ? "!text-[var(--whiold-primary)] hover:!bg-[var(--whiold-sidebar-item-hover-bg,var(--whiold-bg-soft))]"
            : "!text-[var(--whiold-text-body)] hover:!bg-[var(--whiold-sidebar-item-hover-bg,var(--whiold-bg-soft))]"
        }`}
      >
        <ListItemIcon
          className={`!min-w-0 !mr-3 ${
            isParentActive
              ? "!text-[var(--whiold-primary)]"
              : "!text-[var(--whiold-text-muted)]"
          }`}
        >
          <Icon size={17} />
        </ListItemIcon>

        <ListItemText
          primary={
            <Typography
              className={`!font-mono !text-[12.5px] ${
                isParentActive ? "!font-semibold" : "!font-medium"
              }`}
            >
              {item.label}
            </Typography>
          }
        />

        {hasChildren && (
          <Box
            ref={chevronRef}
            className="flex flex-shrink-0 items-center justify-center text-[var(--whiold-text-muted)]"
          >
            <ChevronDown size={14} />
          </Box>
        )}
      </ListItemButton>

      {hasChildren && (
        <Box
          ref={submenuRef}
          className="overflow-hidden"
          style={{ height: 0, opacity: 0 }}
        >
          <List
            disablePadding
            className="ml-[27px] mt-1 flex flex-col gap-1 border-l border-[var(--whiold-border)] pb-1 pl-3"
          >
            {item.children.map((child) => {
              const isChildActive = isPathActive(
                activePath,
                child.path
              );

              const ChildIcon = child.icon;

              return (
                <ListItemButton
                  key={child.path}
                  onClick={() => onNavigate(child.path)}
                  className={`!min-h-0 !rounded-[8px] !px-3 !py-2 transition-all duration-200 ease-out hover:!translate-x-[2px] active:!scale-[0.98] ${
                    isChildActive
                      ? "!bg-[var(--whiold-sidebar-item-active-bg,var(--whiold-primary-soft))] !text-[var(--whiold-sidebar-item-active-text,var(--whiold-primary-hover))]"
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
                    primary={
                      <Typography
                        className={`!font-mono !text-[11.5px] ${
                          isChildActive
                            ? "!font-semibold"
                            : "!font-medium"
                        }`}
                      >
                        {child.label}
                      </Typography>
                    }
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

export default SidebarItem;