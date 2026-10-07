import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";


const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1610189844343-9c4f79952c53?q=80&w=1000&auto=format&fit=crop",
    caption: "The Wedding Edit",
    tag: "New Arrival",
  },
  {
    src: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop",
    caption: "Festive Luxe",
    tag: "Trending",
  },
  {
    src: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1000&auto=format&fit=crop",
    caption: "Contemporary Fusion",
    tag: "Best Seller",
  },
  {
    src: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop",
    caption: "Minimal Essentials",
    tag: "Everyday",
  },
];

const STRIPS = 6; // vertical pleat count — even number keeps the wave symmetric
const SLIDE_DURATION = 4500; // ms per slide before auto-advancing
const FLIP_DURATION = 0.6; // seconds, per-strip flip
const STRIP_STAGGER = 0.05; // seconds between each strip's flip start

// Frayed bottom edge — copied from the existing photoMain clip-path so the
// carousel reads as the same signature shape, not a new/different one.
const FRAYED_CLIP =
  "polygon(0% 0%, 100% 0%, 100% 92%, 96% 94%, 92% 91%, 88% 95%, 84% 92%, 80% 96%, 76% 91%, 72% 95%, 68% 92%, 64% 96%, 60% 91%, 56% 95%, 52% 92%, 48% 96%, 44% 91%, 40% 95%, 36% 92%, 32% 96%, 28% 91%, 24% 95%, 20% 92%, 16% 96%, 12% 91%, 8% 95%, 4% 92%, 0% 96%)";

export default function HeroImageCarousel() {
  const [displayIndex, setDisplayIndex] = useState(0); // slide currently at rest
  const [flipping, setFlipping] = useState(false);
  const [targetIndex, setTargetIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const flipTimeoutRef = useRef(null);

  const totalFlipTime = (FLIP_DURATION + STRIP_STAGGER * (STRIPS - 1)) * 1000;

  const goTo = (nextIdx) => {
    if (nextIdx === displayIndex || flipping) return;
    setTargetIndex(nextIdx);
    setFlipping(true);
    clearTimeout(flipTimeoutRef.current);
    flipTimeoutRef.current = setTimeout(() => {
      setDisplayIndex(nextIdx);
      setFlipping(false);
    }, totalFlipTime);
  };

  // Autoplay
  useEffect(() => {
    if (paused || flipping) return;
    const t = setTimeout(() => {
      goTo((displayIndex + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayIndex, paused, flipping]);

  useEffect(() => () => clearTimeout(flipTimeoutRef.current), []);

  const frontSlide = SLIDES[displayIndex];
  const backSlide = SLIDES[targetIndex];

  return (
    <div
      className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--whiold-radius-lg)] border border-[var(--whiold-border)] shadow-[var(--whiold-shadow-card)]"
      style={{ clipPath: FRAYED_CLIP }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ---------- Pleat strips ---------- */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: STRIPS }).map((_, i) => {
          const bgSize = `${STRIPS * 100}% 100%`;
          const bgPosX = `${(i / (STRIPS - 1)) * 100}%`;
          return (
            <div
              key={i}
              className="whiold-pleat-strip relative h-full"
              style={{ width: `${100 / STRIPS}%` }}
            >
              <motion.div
                className="whiold-pleat-flipper absolute inset-0"
                animate={{ rotateY: flipping ? -180 : 0 }}
                transition={{
                  duration: FLIP_DURATION,
                  delay: flipping ? i * STRIP_STAGGER : 0,
                  ease: [0.65, 0, 0.35, 1],
                }}
              >
                {/* front face — outgoing image */}
                <div
                  className="whiold-pleat-face"
                  style={{
                    backgroundImage: `url(${frontSlide.src})`,
                    backgroundSize: bgSize,
                    backgroundPositionX: bgPosX,
                    backgroundPositionY: "center",
                  }}
                />
                {/* back face — incoming image, pre-rotated so it lands un-mirrored */}
                <div
                  className="whiold-pleat-face whiold-pleat-face--back"
                  style={{
                    backgroundImage: `url(${backSlide.src})`,
                    backgroundSize: bgSize,
                    backgroundPositionX: bgPosX,
                    backgroundPositionY: "center",
                  }}
                />
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* ---------- Story-style progress segments ---------- */}
      <div className="whiold-progress-track absolute top-0 left-0 right-0 z-20">
        {SLIDES.map((_, i) => (
          <div key={i} className="whiold-progress-seg" onClick={() => goTo(i)}>
            <div
              className={
                "whiold-progress-fill" +
                (i === displayIndex && !flipping ? " is-active" : "") +
                (i < displayIndex || (flipping && i === displayIndex) ? " is-done" : "")
              }
              style={
                i === displayIndex && !flipping && !paused
                  ? { animationDuration: `${SLIDE_DURATION}ms` }
                  : undefined
              }
            />
          </div>
        ))}
      </div>

      {/* ---------- Caption + tag, cross-fades independently of the pleat flip ---------- */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 p-5"
        style={{ background: "linear-gradient(180deg, transparent 0%, rgba(43,33,25,0.75) 100%)" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={displayIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <span
              className="inline-block mb-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide"
              style={{ background: "var(--whiold-gradient-brand)", color: "var(--whiold-text-on-primary)" }}
            >
              {frontSlide.tag}
            </span>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{frontSlide.caption}</h3>
              <ArrowUpRight size={18} className="text-white" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}