import { useState, useEffect } from "react";
import { getBrandsApi } from "../../../../api/user/brands.api";

const ACCENTS = [
  "var(--whiold-500)",
  "var(--whiold-600)",
  "var(--whiold-700)",
  "var(--whiold-400)",
  "var(--whiold-600)",
  "var(--whiold-500)",
  "var(--whiold-700)",
  "var(--whiold-400)",
  "var(--whiold-600)",
];

// slight, fixed tilt per card so the row reads like a scattered stamp collection
const TILTS = [-3, 2, -2, 3, -1, 2, -3, 1, -2];

const StampMark = ({ id, accent }) => (
  <svg
    viewBox="0 0 100 100"
    className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 -rotate-12 opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100"
  >
    <defs>
      <path id={`stamp-arc-${id}`} d="M 50,50 m -34,0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" fill="none" />
    </defs>
    <circle cx="50" cy="50" r="42" fill="none" stroke={accent} strokeWidth="1.4" opacity="0.9" />
    <circle cx="50" cy="50" r="34" fill="none" stroke={accent} strokeWidth="1" strokeDasharray="2 3" opacity="0.9" />
    <text fontSize="7.2" letterSpacing="1.5" fill={accent}>
      <textPath href={`#stamp-arc-${id}`} startOffset="0%">
        GENUINE • INDIAN LABEL •
      </textPath>
    </text>
    <text
      x="50"
      y="53"
      textAnchor="middle"
      fontSize="11"
      fontWeight="700"
      fill={accent}
    >
      IND
    </text>
  </svg>
);

const BrandSection = () => {
  const [hovered, setHovered] = useState(null);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getBrandsApi();
      if (res?.success || Array.isArray(res?.data) || Array.isArray(res)) {
        let list = [];
        if (Array.isArray(res?.data)) list = res.data;
        else if (Array.isArray(res?.data?.data)) list = res.data.data;
        else if (Array.isArray(res)) list = res;

        setBrands(list.map(b => ({
          id: b._id,
          name: b.title,
          image: b.image?.imageUrl || b.image,
          tagline: b.tagline || ""
        })));
      }
    })();
  }, []);

  if (brands.length === 0) return null;

  return (
    <section className="w-full overflow-hidden py-20" style={{ background: "var(--whiold-bg)" }}>
      {/* airmail stripe frame, top */}
      <div
        className="mx-auto mb-14 h-2 max-w-7xl"
        style={{
          background:
            "repeating-linear-gradient(-45deg, var(--whiold-500) 0px, var(--whiold-500) 10px, transparent 10px, transparent 20px, var(--whiold-700) 20px, var(--whiold-700) 30px, transparent 30px, transparent 40px)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* header, styled like a passport stamp panel */}
        <div className="mb-14 flex flex-col items-center text-center">
          <div
            className="mb-4 flex h-10 w-10 items-center justify-center rounded-full text-[10px] font-bold tracking-wider"
            style={{ border: "1.5px solid var(--whiold-500)", color: "var(--whiold-500)" }}
          >
            IN
          </div>
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-10" style={{ background: "var(--whiold-300)" }} />
            <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--whiold-500)" }}>
              Proudly Indian
            </p>
            <span className="h-px w-10" style={{ background: "var(--whiold-300)" }} />
          </div>
          <h2 className="text-3xl font-semibold uppercase md:text-4xl" style={{ color: "var(--whiold-text-heading)" }}>
            Our Brands
          </h2>
          {/* <p className="mt-2 max-w-md text-sm" style={{ color: "var(--whiold-text-body)" }}>
            A growing family of homegrown labels, each with its own identity — all built and loved in India.
          </p> */}
        </div>

        {/* giant scrolling wordmark marquee */}
        <div className="group relative mb-16 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[var(--whiold-bg)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[var(--whiold-bg)] to-transparent" />
          <div className="flex w-max whitespace-nowrap [animation:brand-marquee_28s_linear_infinite] group-hover:[animation-play-state:paused]">
            {[...brands, ...brands].map((brand, i) => (
              <span key={`${brand.id}-m-${i}`} className="mx-6 flex items-center gap-6">
                <span
                  className="text-4xl font-semibold uppercase tracking-tight md:text-6xl"
                  style={{ color: "var(--whiold-text-heading)", opacity: 0.9 }}
                >
                  {brand.name}
                </span>
                <span className="h-2 w-2 rounded-full" style={{ background: "var(--whiold-500)" }} />
              </span>
            ))}
          </div>
        </div>

        {/* stamp card grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-5">
          {brands.map((brand, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            const tilt = TILTS[i % TILTS.length];
            const isHovered = hovered === brand.id;
            return (
              <div
                key={brand.id}
                className="group relative flex justify-center"
                style={{ transform: `rotate(${tilt}deg)` }}
                onMouseEnter={() => setHovered(brand.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <div
                  className="relative flex w-full max-w-[170px] flex-col items-center gap-3 px-4 py-6 transition-all duration-300"
                  style={{
                    background: "var(--whiold-bg-soft)",
                    border: `1.5px dashed ${isHovered ? accent : "var(--whiold-border)"}`,
                    transform: isHovered ? "rotate(0deg) translateY(-6px)" : "rotate(0deg)",
                    boxShadow: isHovered ? "0 12px 24px -12px rgba(0,0,0,0.25)" : "none",
                  }}
                >
                  {/* corner ticks, like a certificate / stamp perforation cue */}
                  {["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((pos) => (
                    <span
                      key={pos}
                      className={`absolute ${pos} h-2 w-2`}
                      style={{
                        borderTop: pos.includes("top") ? `1.5px solid ${accent}` : "none",
                        borderBottom: pos.includes("bottom") ? `1.5px solid ${accent}` : "none",
                        borderLeft: pos.includes("left") ? `1.5px solid ${accent}` : "none",
                        borderRight: pos.includes("right") ? `1.5px solid ${accent}` : "none",
                      }}
                    />
                  ))}

                  <StampMark id={brand.id} accent={accent} />

                  <div
                    className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white p-2"
                    style={{ border: `2px solid ${accent}` }}
                  >
                    <img src={brand.image} alt={brand.name} className="h-full w-full object-contain" />
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-semibold" style={{ color: "var(--whiold-text-heading)" }}>
                      {brand.name}
                    </p>
                    <p className="mt-0.5 text-xs" style={{ color: "var(--whiold-text-muted)" }}>
                      {brand.tagline}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* airmail stripe frame, bottom */}
      <div
        className="mx-auto mt-14 h-2 max-w-7xl"
        style={{
          background:
            "repeating-linear-gradient(-45deg, var(--whiold-500) 0px, var(--whiold-500) 10px, transparent 10px, transparent 20px, var(--whiold-700) 20px, var(--whiold-700) 30px, transparent 30px, transparent 40px)",
        }}
      />

      <style>{`
        @keyframes brand-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default BrandSection;