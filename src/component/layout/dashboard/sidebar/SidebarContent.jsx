import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, List } from "@mui/material";

import SidebarItem from "./SidebarItem";
import CollapsedItem from "./CollapsedItem";
import { getVisibleSections } from "./sidebarUtils";

const SidebarContent = ({
  role,
  collapsed,
  onNavigate,
  activePath,
}) => {
  console.log(role, "role")
  const sections = useMemo(
    () => getVisibleSections(role),
    [role]
  );
  const [openKey, setOpenKey] = useState(null);

  useEffect(() => {
    if (activePath) {
      for (const section of sections) {
        for (const item of section.items) {
          if (item.children && item.children.some(c => activePath.startsWith(c.path) || c.path === activePath)) {
            setOpenKey(item.path);
            return;
          }
        }
      }
    }
  }, [activePath, sections]);

  const handleToggle = useCallback((path) => {
    setOpenKey((prev) => (prev === path ? null : path));
  }, []);

  // Sidebar collapse hote hi open accordion close ho jaye
  useEffect(() => {
    if (collapsed) {
      setOpenKey(null);
    }
  }, [collapsed]);

  return (
    <Box className="flex h-full flex-col gap-1 overflow-y-auto overflow-x-hidden px-2.5 py-4">
      {sections.map((section) => (
        <Box key={section.section} className="mb-2">
          {!collapsed && (
            <p className="mb-1.5 px-3 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--whiold-sidebar-section-label,var(--whiold-text-muted))]">
              {section.section}
            </p>
          )}

          <List disablePadding className="flex flex-col gap-1">
            {section.items.map((item, idx) =>
              collapsed ? (
                <CollapsedItem
                  key={item.path || idx}
                  item={item}
                  onNavigate={onNavigate}
                  activePath={activePath}
                />
              ) : (
                <SidebarItem
                  key={item.path || idx}
                  item={item}
                  isOpen={openKey === item.path}
                  onToggle={handleToggle}
                  onNavigate={onNavigate}
                  activePath={activePath}
                />
              )
            )}
          </List>
        </Box>
      ))}
    </Box>
  );
};

export default SidebarContent;