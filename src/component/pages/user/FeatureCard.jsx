import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * FeatureCard
 * Generic clickable module tile — used for Products, Team, and Earnings grids.
 *
 * @param {{
 *   title: string,
 *   desc: string,
 *   icon: React.ElementType,
 *   color: string,      // tailwind bg + text classes, e.g. "bg-cyan-100 text-cyan-600"
 *   path?: string,       // route to navigate to (optional)
 *   onClick?: () => void // custom click handler, takes priority over `path`
 * }} item
 */
const FeatureCard = ({ item }) => {
  const navigate = useNavigate();

  if (!item) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "FeatureCard: missing `item` prop. Usage is <FeatureCard item={{ title, desc, icon, color }} /> — check the array you're mapping over."
      );
    }
    return null;
  }

  const Icon = item.icon;

  const handleClick = () => {
    if (item.onClick) return item.onClick();
    if (item.path) navigate(item.path);
  };

  return (
    <motion.div
      onClick={handleClick}
      initial="initial"
      whileHover="hover"
      variants={{
        initial: { y: 0, borderColor: "var(--whiold-border-color, #e5e7eb)", boxShadow: "0 0px 0px rgba(0,0,0,0)" },
        hover: { y: -2, borderColor: "var(--whiold-primary)", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative cursor-pointer overflow-hidden rounded-3xl border border-gray-200 bg-white p-6"
    >
      <motion.div 
        variants={{ initial: { scale: 1 }, hover: { scale: 1.25 } }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[var(--whiold-primary-soft)]" 
      />

      <motion.div
        variants={{ initial: { scale: 1 }, hover: { scale: 1.1 } }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}
      >
        <motion.div
           variants={{ initial: { rotate: 0 }, hover: { rotate: -12 } }}
           transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Icon size={24} />
        </motion.div>
      </motion.div>

      <h3 className="relative mt-6 text-lg font-bold text-gray-800">{item.title}</h3>

      <p className="relative mt-2 text-sm leading-6 text-gray-500">{item.desc}</p>

      <motion.button 
        variants={{ initial: { gap: "8px" }, hover: { gap: "12px" } }}
        transition={{ duration: 0.3 }}
        className="relative mt-6 flex items-center text-sm font-semibold text-[var(--whiold-primary)]"
      >
        Open
        <ChevronRight size={18} />
      </motion.button>
    </motion.div>
  );
};

export default FeatureCard;