import SIDEBAR_MENU from "../../../../constants/SidebarMenu";

export const getVisibleSections = (role) =>
  SIDEBAR_MENU.map((section) => ({
    ...section,
    items: section.items
      .filter((item) => item.roles.length === 0 || item.roles.includes(role))
      .map((item) => ({
        ...item,
        children: item.children?.filter(
          (child) =>
            child.roles.length === 0 || child.roles.includes(role)
        ),
      })),
  })).filter((section) => section.items.length > 0);

export const isPathActive = (activePath, path) =>
  activePath === path ||
  (path !== "/login" && activePath.startsWith(path));