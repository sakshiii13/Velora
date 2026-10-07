import {
  Wallet,
  ShoppingBag,
  Users,
  Package,
  DollarSign,
  ShoppingCart,
  Heart,
  Boxes,
  Gift,
  Link2,
  UserPlus,
  Layers,
  Trophy,
} from "lucide-react";
import { Router } from "../../../constants/router";

export const statsData = [
  {
    title: "Wallet",
    value: "₹400000.00",
    icon: Wallet,
    gradient: "from-cyan-500 via-sky-500 to-blue-600",
  },
  {
    title: "Income",
    value: "₹980.00",
    icon: DollarSign,
    gradient: "from-emerald-500 via-green-500 to-teal-600",
  },
  {
    title: "Orders",
    value: "18",
    icon: ShoppingBag,
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
  },
  {
    title: "Team",
    value: "56",
    icon: Users,
    gradient: "from-violet-500 via-fuchsia-500 to-pink-500",
  },
];

export const productCards = [
  {
    title: "Products",
    desc: "Explore all available products",
    icon: Package,
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    title: "View Products",
    desc: "Browse complete catalog",
    icon: Boxes,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    title: "Buy Product",
    desc: "Purchase premium products",
    icon: ShoppingCart,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Bulk Order",
    desc: "Place wholesale orders",
    icon: Package,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Cart",
    desc: "Review selected products",
    icon: ShoppingCart,
    color: "bg-pink-100 text-pink-600",
    path: Router?.CART,
  },
  {
    title: "Wishlist",
    desc: "Save favorite products",
    icon: Heart,
    color: "bg-rose-100 text-rose-600",
    path: Router?.WISHLIST,
  },
];

export const teamCards = [
  {
    title: "Team List",
    desc: "View your network",
    icon: UserPlus,
    color: "bg-violet-100 text-violet-600",
  },
  {
    title: "Level 1",
    desc: "Direct referrals",
    icon: Layers,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Level 2",
    desc: "Second level members",
    icon: Layers,
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "Level 3",
    desc: "Third level members",
    icon: Layers,
    color: "bg-rose-100 text-rose-600",
  },
];

export const earningCards = [
  {
    title: "Direct Income",
    desc: "Income from referrals",
    icon: DollarSign,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Team Income",
    desc: "Network earnings",
    icon: Users,
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    title: "Reward Income",
    desc: "Bonus rewards",
    icon: Gift,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Total Income",
    desc: "Overall earnings",
    icon: Trophy,
    color: "bg-yellow-100 text-yellow-600",
  },
];