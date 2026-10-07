import React from "react";
import { motion } from "framer-motion";

/**
 * StatCard
 * Small gradient-bordered summary tile.
 *
 * @param {{ title: string, value: string|number, icon: React.ElementType, gradient: string }} item
 *   gradient — tailwind gradient stop classes, e.g. "from-cyan-500 via-sky-500 to-blue-600"
 */
const StatCard = ({ item }) => {
  if (!item) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "StatCard: missing `item` prop. Usage is <StatCard item={{ title, value, icon, gradient }} />."
      );
    }
    return null;
  }

  const Icon = item.icon;

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${item.gradient} p-[1px]`}
    >
      <div className={`absolute z-10 text-white flex items-center justify-center -right-12 -top-12 h-28 w-28 rounded-full bg-gradient-to-br ${item?.gradient} transition-transform duration-500 ease-out`}>
            <Icon size={24} className="relative top-5 right-5 transition-transform duration-500" />
      </div>
      <div className="h-full rounded-3xl bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              {item.title}
            </p>
            <h2 className="mt-3 text-2xl font-bold text-gray-800">{item.value}</h2>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;