import {
  LayoutDashboard,
  Users,
  UserCog,
  Wallet,
  BarChart3,
  ClipboardList,
  Bell,
  Settings,
  LifeBuoy,
  Package,
  ShoppingCart,
  FolderTree,
  PlusCircle,
  ListChecks,
  Tags,
  PackageSearch,
  ClipboardCheck,
} from "lucide-react";
import { LuPackageOpen,LuPackageCheck } from "react-icons/lu";
import { adminRoutes, userRoutes, vendorRoutes } from "./router";

const SIDEBAR_MENU = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: adminRoutes.ADMIN_DASHBOARD, roles: ["admin"] },
      { label: "Dashboard", icon: LayoutDashboard, path: "/subadmin", roles: ["subadmin"] },
      { label: "Dashboard", icon: LayoutDashboard, path: userRoutes.DASHBOARD, roles: ["user"] },
      {label: "Welcome Letter", icon: ClipboardCheck, path: userRoutes.WELCOME, roles: ["user"]},
      {label: "Vendors Dashboard", icon: UserCog, path: vendorRoutes.DASHBOARD, roles: ["vendor"]},
      {label: "Profile", icon: UserCog, path: vendorRoutes.PROFILE, roles: ["vendor"]},
    ],
  },
  {
    section: "Orders",
    items: [
      { label: "All Orders", icon: ShoppingCart, path: adminRoutes.ORDERS, roles: ["admin", "subadmin"] },
      { label: "All Orders", icon: LuPackageOpen, path: userRoutes.ALL_ORDERS, roles: ["user"] },
      { label: "Track Orders", icon: LuPackageCheck, path: userRoutes.TRACK_ORDERS, roles: ["user"] },
    ]
  },
  {
    section: "Rewards",
    items: [
      { label: "Reward History", icon: BarChart3, path: userRoutes.REWARDS, roles: ["user"] },
  
    ]
  },
  {
    section: "Catalog",
    items: [
      {
        label: "Products",
        icon: Package,
        path: adminRoutes.ADMIN_PRODUCTS,
        roles: ["admin"],
        children: [
          { label: "Add Product", icon: PlusCircle, path: adminRoutes?.ADD_PRODUCT, roles: ["admin"] },
          { label: "Manage Products", icon: PackageSearch, path: adminRoutes?.MANAGE_PRODUCTS, roles: ["admin"] },
        ],
      },
      {
        label: "Category Management",
        icon: FolderTree,
        path: adminRoutes.ADMIN_CATEGORIES,
        roles: ["admin"],
        children: [
          { label: "Categories", icon: FolderTree, path: adminRoutes?.CATEGORIES, roles: ["admin"] },
          { label: "Sub Categories", icon: ListChecks, path: adminRoutes?.SUB_CATEGORY, roles: ["admin"] },
          { label: "Brands", icon: Tags, path: adminRoutes?.BRANDS, roles: ["admin"] },
      { label: "Bonus", icon: Wallet, path: "/admin/bonus", roles: ["admin", "subadmin"] },

        ],
      },
      {
        label: "Orders",
        icon: ShoppingCart,
         path: null,  
        roles: ["admin", "subadmin"],
        children: [
          { label: "Manage Orders", icon: ClipboardCheck, path: adminRoutes?.ORDERS, roles: ["admin", "subadmin"] },
        ],
      },
    
    ],
  },
  {
    
    section: "Management",
    items: [
      { label: "Users", icon: Users, path: adminRoutes.USERS, roles: ["admin"] },
      { label: "Vendors", icon: UserCog, path: adminRoutes.VENDORS, roles: ["admin"] },
      { label: "Sub Admins", icon: UserCog, path: "/admin/subadmins", roles: ["admin"] },
      { label: "My Users", icon: Users, path: "/subadmin/users", roles: ["subadmin"] },
    ],
  },
  {
    section: "Fund Management",
    items: [
      { label: "Add Money", icon: BarChart3, path: userRoutes.ADD_MONEY, roles: ["user"] },
      { label: "Withdraw", icon: ClipboardList, path: userRoutes.WITHDRAW, roles: ["user"] },
      { label: "Wallet History", icon: ClipboardList, path: userRoutes.WALLET_HISTORY, roles: ["user"] },
    ],
  },
  {
    section: "Account",
    items: [
      { label: "Profile", icon: UserCog, path: userRoutes.PROFILE, roles: ["user"] },
      // { label: "Notifications", icon: Bell, path: userRoutes.NOTIFICATION, roles: ["user"] },
      // { label: "Settings", icon: Settings, path: "/settings", roles: [] },
      { label: "Support", icon: LifeBuoy, path: adminRoutes?.SUPPORT, roles: [] },
    ],
  },
];

export default SIDEBAR_MENU;