import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CATEGORIES } from "./navbar/CategoryData";

export default function HeroCategoryRail() {
  return (
    <div className="whiold-rail-track mt-6 md:mt-8 md:justify-center md:overflow-visible md:flex-wrap md:gap-x-14 md:gap-y-6">
      {CATEGORIES.map((cat, i) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: 0.08 * i,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Link
            to={`/category/${cat.slug}`}
            className="whiold-rail-tile block w-[100px] md:w-[124px]"
          >
            <div className="whiold-rail-avatar mx-auto h-[100px] w-[100px] md:h-[124px] md:w-[124px]">
              <img src={cat.image} alt={cat.name} />
            </div>
            <p
              className="mt-2.5 text-sm font-medium"
              style={{ color: "var(--whiold-text-heading)" }}
            >
              {cat.name}
            </p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
