import React from "react";
import { Chip } from "@mui/material";

/**
 * SectionHeader
 * Title + description on the left, an optional Chip badge on the right.
 * Used at the top of every dashboard section (Products, Team, Earnings, Orders...).
 */
const SectionHeader = ({ title, description, chipLabel }) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-[var(--whiold-text-heading)]">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-[var(--whiold-text-body)]">{description}</p>
        )}
      </div>

      {chipLabel && (
        <Chip
          label={chipLabel}
          className="!bg-[var(--whiold-primary-soft)] !text-[var(--whiold-primary)]"
        />
      )}
    </div>
  );
};

export default SectionHeader;