import React from "react";
import { ImageOff, X } from "lucide-react";

const ProductPreviewCard = ({ data, categories = [], subCategories = [], onClose }) => {
  const primaryImage = data.images?.find((img) => img.imageUrl || img.image)?.imageUrl || data.images?.find((img) => img.imageUrl || img.image)?.image;

  // Handle category name whether it's an ID (from form) or populated object (from API)
  const getCategoryName = () => {
    if (!data.category) return null;
    if (typeof data.category === 'object' && data.category.name) return data.category.name;
    const found = categories.find((c) => c._id === data.category);
    return found ? found.name : data.category;
  };

  return (
    <div className="relative rounded-[var(--whiold-radius-lg)] border border-[var(--whiold-border)] bg-[var(--whiold-bg)] p-5 shadow-[var(--whiold-shadow-card)] w-full">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1.5 text-[var(--whiold-text-muted)] transition-colors hover:bg-[var(--whiold-bg-soft)] hover:text-[var(--whiold-text-heading)]"
        >
          <X size={18} />
        </button>
      )}

      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-[var(--whiold-text-muted)]">
          Live preview
        </p>
      </div>

      <div className="mb-4 flex h-44 w-full items-center justify-center overflow-hidden rounded-[var(--whiold-radius-md)] bg-[var(--whiold-bg-soft)]">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={data.name || "Product preview"}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className={`h-full w-full flex-col items-center justify-center gap-2 text-[var(--whiold-text-muted)] ${
            primaryImage ? "hidden" : "flex"
          }`}
        >
          <ImageOff size={26} strokeWidth={1.5} />
          <span className="font-mono text-[11px]">No image yet</span>
        </div>
      </div>

      {data.category && (
        <p className="mb-1 font-mono text-[10.5px] font-semibold uppercase tracking-wider text-[var(--whiold-primary)]">
          {getCategoryName()}
        </p>
      )}

      <h3 className="mb-1 text-[16px] font-semibold leading-snug text-[var(--whiold-text-heading)]">
        {data.name || "Your product name will appear here"}
      </h3>

      <p className="mb-3 line-clamp-2 text-[12.5px] leading-relaxed text-[var(--whiold-text-body)]">
        {data.description || "A short description will show here once you write it."}
      </p>

      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-[19px] font-bold text-[var(--whiold-text-heading)]">
          ₹{data.price ? Number(data.price).toLocaleString("en-IN") : "0"}
        </span>
        {data.mrp && Number(data.mrp) > Number(data.price || 0) && (
          <span className="text-[13px] text-[var(--whiold-text-muted)] line-through">
            ₹{Number(data.mrp).toLocaleString("en-IN")}
          </span>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {data.brand && (
          <span className="rounded-full border border-[var(--whiold-border)] px-2.5 py-1 text-[10.5px] font-medium text-[var(--whiold-text-body)]">
            Brand: {data.brand}
          </span>
        )}
      </div>

      {data.variants?.some((v) => v.spec) && (
        <div className="flex flex-wrap gap-1.5 border-t border-[var(--whiold-border)] pt-3">
          {data.variants
            .filter((v) => v.spec)
            .map((v) => (
              <span
                key={v.id || v._id}
                className="rounded-[8px] bg-[var(--whiold-bg-soft)] px-2 py-1 text-[10.5px] font-medium text-[var(--whiold-text-body)]"
              >
                {v.spec} (Stock: {v.stock || 0})
              </span>
            ))}
        </div>
      )}
    </div>
  );
};

export default ProductPreviewCard;
