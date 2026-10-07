import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * OrderHighlightCard
 * Large single spotlighted tile — currently used for "Orders" but works for
 * any single-CTA highlight block (e.g. "Support", "Downloads", etc.)
 *
 * @param {{
 *   title: string,
 *   desc: string,
 *   icon: React.ElementType,
 *   gradient?: string,   // tailwind gradient classes for the icon badge
 *   path?: string,
 *   onClick?: () => void
 * }} props
 */
const OrderHighlightCard = ({
  title,
  desc,
  icon: Icon,
  gradient = "from-orange-500 to-yellow-500",
  path,
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) return onClick();
    if (path) navigate(path);
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
      className="relative cursor-pointer overflow-hidden rounded-3xl border border-gray-200 bg-white p-7"
    >
      <motion.div 
        variants={{ initial: { scale: 1 }, hover: { scale: 1.25 } }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[var(--whiold-primary-soft)]" 
      />

      <div className="relative flex items-center justify-between">
        <div>
          <motion.div
            variants={{ initial: { scale: 1 }, hover: { scale: 1.1 } }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
          >
            <motion.div
               variants={{ initial: { rotate: 0 }, hover: { rotate: -12 } }}
               transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Icon size={28} />
            </motion.div>
          </motion.div>

          <h3 className="mt-6 text-2xl font-bold text-gray-800">{title}</h3>

          <p className="mt-2 text-sm leading-6 text-gray-500">{desc}</p>
        </div>

        <motion.div
           variants={{ initial: { color: "#d1d5db", x: 0 }, hover: { color: "var(--whiold-primary)", x: 8 } }}
           transition={{ duration: 0.3 }}
        >
          <ArrowRight size={26} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrderHighlightCard;