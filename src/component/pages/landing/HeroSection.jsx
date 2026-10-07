import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { Scissors, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { Router } from "../../../constants/router";
// NOTE: adjust this relative path to wherever you actually place the file
// import HeroCategoryRail from "./Herocategoryrail";

const STITCH_PATH =
  "M 40,46 C 120,10 220,10 300,46 C 340,64 300,92 340,96 C 420,104 480,60 560,74";


const IMAGES = [
  {
    src: "/home_banner/banner.jpg",
    label: "Waxed Linen",
    objectPosition: "center 30%",
  },
  {
    src: "/home_banner/banner2.jpg",
    label: "Hand-thrown Clay",
    objectPosition: "center center",
  },
  {
    src: "/home_banner/banner3.jpg",
    label: "Indigo Dye Vat",
    objectPosition: "center center",
  },
  {
    src: "/home_banner/banner4.jpg",
    label: "Raw Silk",
    objectPosition: "center 40%",
  },
  {
    src: "/home_banner/banner5.jpg",
    label: "Woven Rattan",
    objectPosition: "center center",
  },
];

const SLIDE_DURATION = 2800; // ms per slide before auto-advancing
const KEN_BURNS_SCALE = 1.06;

const HeroSection = () => {
  const eyebrowRef = useRef(null);
  const headlineRef = useRef(null);
  const threadRef = useRef(null);
  const bodyRef = useRef(null);
  const ctaRef = useRef(null);
  const imgRefs = useRef([]);

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Fraunces font — agar app-wide load nahi hai to inject kar do ──
  useLayoutEffect(() => {
    if (document.getElementById("whiold-fraunces-font")) return;
    const link = document.createElement("link");
    link.id = "whiold-fraunces-font";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,500&display=swap";
    document.head.appendChild(link);
  }, []);

  // ── Text entrance ──
  useLayoutEffect(() => {
    const path = threadRef.current;

    if (reduceMotion) {
      gsap.set([eyebrowRef.current, headlineRef.current, bodyRef.current, ctaRef.current], {
        opacity: 1,
        y: 0,
      });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set([eyebrowRef.current, headlineRef.current, bodyRef.current, ctaRef.current], {
        opacity: 0,
        y: 22,
      });

      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.15 });
      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5 })
        .to(headlineRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.25")
        .to(path, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" }, "-=0.5")
        .to(bodyRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.55")
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
    });
    return () => ctx.revert();
  }, []);

  // ── Auto-advance slides ──
  useEffect(() => {
    if (reduceMotion || paused) return;
    const id = setInterval(() => {
      setCurrent((p) => (p + 1) % IMAGES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [paused, reduceMotion]);

  // ── Crossfade + slow Ken Burns zoom on the active slide ──
  useEffect(() => {
    IMAGES.forEach((_, i) => {
      const el = imgRefs.current[i];
      if (!el) return;
      gsap.killTweensOf(el);

      if (i === current) {
        gsap.set(el, { zIndex: 2, scale: 1 });
        gsap.to(el, { opacity: 1, duration: 1, ease: "power2.out" });
        if (!reduceMotion) {
          gsap.to(el, {
            scale: KEN_BURNS_SCALE,
            duration: SLIDE_DURATION / 1000 + 1.2,
            ease: "none",
          });
        }
      } else {
        gsap.to(el, { opacity: 0, duration: 1, ease: "power2.out", zIndex: 1 });
      }
    });
  }, [current, reduceMotion]);

  return (
    <>
      <section
        className="whiold-hero relative w-full overflow-hidden"
        style={{ height: "clamp(560px, 88dvh, 900px)" }}
      >
        {/* ══ Full-bleed image deck ══ */}
        {IMAGES.map((image, i) => (
          <div
            key={image.label}
            ref={(el) => (imgRefs.current[i] = el)}
            className="absolute inset-0"
            style={{ opacity: 0, willChange: "transform, opacity" }}
          >
            <img
              src={image.src}
              alt={image.label}
              className="h-full w-full object-cover"
              style={{ objectPosition: image.objectPosition || "center center" }}
              draggable={false}
              loading={i === 0 ? "eager" : "lazy"}
              fetchpriority={i === 0 ? "high" : "auto"}
              decoding="async"
            />
          </div>
        ))}

        {/* ── Scrim for text legibility — warm dark tone, not flat black ── */}
        <div
          className="pointer-events-none absolute inset-0 z-[3]"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,14,10,0) 35%, rgba(20,14,10,0.72) 100%), linear-gradient(90deg, rgba(20,14,10,0.55) 0%, rgba(20,14,10,0.18) 42%, rgba(20,14,10,0) 68%)",
          }}
          aria-hidden="true"
        />

        {/* ══ Story-style progress bar ══ */}
        <div
          className="absolute left-0 right-0 top-0 z-20 flex gap-1.5 px-4 pt-5 sm:px-8 lg:px-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {IMAGES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setCurrent(i)}
              className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25"
            >
              {i < current && <div className="h-full w-full bg-white" />}
              {i === current && (
                <div
                  key={current}
                  className="whiold-story-fill h-full bg-white"
                  style={{
                    animationDuration: `${SLIDE_DURATION}ms`,
                    animationPlayState: paused ? "paused" : "running",
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* ══ Text overlay — bottom-left, minimal ══ */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-12 sm:px-8 sm:pb-16 lg:px-16 lg:pb-20">
          <div className="max-w-[560px]">
            <div ref={eyebrowRef} className="mb-4 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
                <Scissors size={13} className="text-white" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                Hand-finished, in small batches
              </span>
            </div>

            <div className="relative">
             <h1
  ref={headlineRef}
  className="relative z-10 text-[42px] leading-[1.06] text-white sm:text-[58px] lg:text-[72px]"
  style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
>
  Discover What
  <br />
  <em
    className="italic text-[#E8B98F]"
    style={{ fontWeight: 500 }}
  >
    Feels Like You.
  </em>
</h1>

              {/* Stitch line — same signature motif, underlining "slow" */}
              <svg
                viewBox="0 0 600 110"
                className="pointer-events-none absolute -bottom-2 left-0 z-0 h-[60px] w-[100%] max-w-[380px] sm:h-[78px] lg:h-[86px]"
                aria-hidden="true"
              >
                <path
                  ref={threadRef}
                  d={STITCH_PATH}
                  fill="none"
                  stroke="#E8B98F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="6 5"
                />
              </svg>
            </div>

            <p
              ref={bodyRef}
              className="mt-5 max-w-[420px] text-[15px] leading-relaxed text-white/75"
            >
              Every piece on Whiold passes through a person's hands before it reaches yours —
              woven, thrown, dyed, or stitched. No shortcuts, no assembly line.
            </p>

            <div ref={ctaRef} className="mt-8">
              <Link
                to={Router.SHOPPING}
                className="group inline-flex items-center gap-2 rounded-[var(--whiold-radius-md)] bg-white px-6 py-3.5 text-[13px] font-semibold uppercase tracking-wide shadow-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ color: "var(--whiold-primary)" }}
              >
                Explore the Collection
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Slide counter, bottom-right ── */}
        <div className="absolute bottom-6 right-4 z-10 flex items-center gap-2 sm:right-8 lg:right-16">
          <span className="text-[11px] font-semibold text-white">
            {String(current + 1).padStart(2, "0")}
          </span>
          <span className="h-3 w-px bg-white/40" aria-hidden="true" />
          <span className="text-[11px] font-medium text-white/60">
            {String(IMAGES.length).padStart(2, "0")}
          </span>
        </div>

        <style>{`
          @keyframes whiold-story-fill {
            from { width: 0%; }
            to { width: 100%; }
          }
          .whiold-story-fill {
            width: 0%;
            animation-name: whiold-story-fill;
            animation-timing-function: linear;
            animation-fill-mode: forwards;
          }
          @media (prefers-reduced-motion: reduce) {
            .whiold-story-fill { animation: none; width: 100%; }
          }
          @media (max-height: 560px) {
            .whiold-hero { height: 100dvh; min-height: 420px; }
          }
        `}</style>
      </section>

      {/* ══ Category rail — ab yeh hero ke saath hi render hoga ══ */}
      {/* <div className="relative z-10 mx-auto mt-8 max-w-[1180px] px-4 sm:px-8 lg:mt-10 lg:px-16">
        <div
          className="mb-6 border-t"
          style={{ borderColor: "var(--whiold-border)", borderStyle: "dashed" }}
        />
        <span className="block text-center text-[18px] font-semibold uppercase tracking-[0.18em] text-[var(--whiold-text-muted)] sm:text-[20px]">
          Shop by category
        </span>
        <HeroCategoryRail />
      </div> */}
    </>
  );
};

export default HeroSection;