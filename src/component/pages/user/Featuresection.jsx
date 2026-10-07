import React from "react";
import SectionHeader from "./Sectionheader";
import FeatureCard from "./FeatureCard";

/**
 * FeatureSection
 * A titled grid of FeatureCards. This single component replaces the repeated
 * "Products" / "Team" / "Earnings" blocks — only the data + column count changes.
 *
 * @param {{
 *   title: string,
 *   description: string,
 *   chipLabel: string,
 *   items: Array,
 *   gridClassName?: string   // override default responsive columns if needed
 *   className?: string       // override the top margin between sections
 * }} props
 */
const FeatureSection = ({
  title,
  description,
  chipLabel,
  items,
  gridClassName = "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
  className = "mt-7",
}) => {
  return (
    <div className={className}>
      <SectionHeader title={title} description={description} chipLabel={chipLabel} />

      <div className={`grid gap-6 ${gridClassName}`}>
        {items.map((item) => (
          <FeatureCard key={item.title} item={item} />
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;