import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, RotateCcw, ShieldCheck, Sparkles, Tag } from "lucide-react";

const slides = [
  {
    id: 1,
    icon: <Sparkles size={34} strokeWidth={2} />,
    title: "New Arrivals",
    desc: "Fresh drops every single week",
    tag: "Just In",
  },
  {
    id: 2,
    icon: <Truck size={34} strokeWidth={2} />,
    title: "Free Shipping",
    desc: "On all orders above ₹999",
    tag: "Pan India",
  },
  {
    id: 3,
    icon: <RotateCcw size={34} strokeWidth={2} />,
    title: "Easy 7-Day Returns",
    desc: "No questions asked, ever",
    tag: "Hassle Free",
  },
  {
    id: 4,
    icon: <ShieldCheck size={34} strokeWidth={2} />,
    title: "Secure Checkout",
    desc: "100% safe & encrypted payments",
    tag: "Trusted",
  },
  {
    id: 5,
    icon: <Tag size={34} strokeWidth={2} />,
    title: "Member Rewards",
    desc: "Earn points on every purchase",
    tag: "Loyalty",
  },
];

// A few floating accent dots for the ambient "alive" feel behind the card
const floaters = [
  { left: "8%", size: 10, delay: 0 },
  { left: "28%", size: 6, delay: 1.4 },
  { left: "52%", size: 8, delay: 0.6 },
  { left: "74%", size: 5, delay: 2.1 },
  { left: "90%", size: 9, delay: 1.1 },
];

const CraftImpact = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const current = slides[active];

  return (
    <section
      className="relative overflow-hidden py-24 md:py-32"
      style={{
        // Real fixed background — an ecommerce/apparel shelf shot, glued in
        // place behind the content while the page scrolls.
        backgroundImage:
          "url('https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1920&auto=format&fit=crop')",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Fallback tokens + Fraunces import so this renders standalone.
          Safe to delete inside your app — already defined globally. */}
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600&display=swap");
        :root {
          --whiold-50:#FAF3F0; --whiold-100:#F2E1D9; --whiold-200:#E5C2B3; --whiold-300:#D59E86;
          --whiold-400:#C57A58; --whiold-500:#BA704F; --whiold-600:#9F5737; --whiold-700:#79422A;
          --whiold-800:#5B321F; --whiold-900:#3D2115;
          --whiold-primary:var(--whiold-500); --whiold-primary-soft:var(--whiold-100);
          --whiold-text-heading:#2B2119; --whiold-text-body:#6B5B4F; --whiold-text-muted:#A5978C;
          --whiold-border:#ECE0D8; --whiold-radius-lg:24px;
          --whiold-gradient-brand: linear-gradient(90deg, var(--whiold-400) 0%, var(--whiold-500) 50%, var(--whiold-600) 100%);
          --whiold-shadow-card: 0 16px 40px -12px rgba(59,33,21,0.14);
          --whiold-shadow-btn: 0 10px 24px -8px rgba(186,112,79,0.45);
        }
        @keyframes whiold-float {
          0%   { transform: translateY(0px);   opacity: 0; }
          15%  { opacity: 0.6; }
          85%  { opacity: 0.6; }
          100% { transform: translateY(-140px); opacity: 0; }
        }
      `}</style>

      {/* Warm scrim so the fixed photo stays atmospheric but text is legible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(61,33,21,0.90) 0%, rgba(61,33,21,0.72) 45%, rgba(43,33,25,0.85) 100%)",
        }}
      />
      {/* Ambient terracotta blobs */}
      <div
        className="pointer-events-none absolute -left-24 top-10 h-[420px] w-[420px] rounded-full blur-[110px]"
        style={{ background: "rgba(197,122,88,0.35)" }}
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-[380px] w-[380px] rounded-full blur-[100px]"
        style={{ background: "rgba(186,112,79,0.28)" }}
      />
      {/* Floating accent dots, echoing the reference video's ambient particles */}
      {floaters.map((f, i) => (
        <span
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: f.left,
            bottom: "-20px",
            width: f.size,
            height: f.size,
            background: "var(--whiold-300)",
            animation: `whiold-float 6s ease-in-out ${f.delay}s infinite`,
          }}
        />
      ))}

      <div className="relative z-10 mx-auto max-w-[1380px] px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[0.95fr_1.05fr]">
          {/* LEFT CONTENT — unchanged */}
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.3em]"
              style={{
                borderColor: "rgba(242,225,217,0.25)",
                background: "rgba(242,225,217,0.08)",
                color: "var(--whiold-300)",
              }}
            >
              The Whiold Promise
            </div>

            <h2
              className="mt-6 text-[40px] leading-[1.05] tracking-[-0.01em] text-white md:text-[58px] lg:text-[54px]"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
            >
              Crafted by hand,
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(90deg, var(--whiold-300) 0%, var(--whiold-100) 50%, var(--whiold-300) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                made to last.
              </span>
            </h2>

            <p className="mt-8 max-w-[600px] text-[17px] leading-[1.8] text-[rgba(242,225,217,0.75)] md:text-[18px]">
              Every Whiold piece passes through an artisan's hands before it
              reaches yours — woven, dyed, and finished the slow way, so your
              home carries something a machine never could.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                className="inline-flex h-[58px] items-center rounded-full px-8 text-[14px] font-bold tracking-[0.08em] text-white transition duration-300 hover:scale-[1.02]"
                style={{
                  background: "var(--whiold-gradient-brand)",
                  boxShadow: "var(--whiold-shadow-btn)",
                }}
              >
                EXPLORE COLLECTIONS
              </button>
              <button
                className="inline-flex h-[58px] items-center justify-center rounded-full border px-8 text-[14px] font-semibold text-white transition duration-300 hover:bg-white/10"
                style={{ borderColor: "rgba(242,225,217,0.3)" }}
              >
                MEET OUR ARTISANS
              </button>
            </div>
          </div>

          {/* RIGHT CONTENT — auto-sliding card carousel (Framer Motion),
              cycling through the highlights that matter most on an
              ecommerce landing page: new arrivals, shipping, returns,
              secure checkout, rewards. */}
          <div className="relative">
            <div
              className="relative overflow-hidden rounded-[40px] border px-4 py-8 backdrop-blur-3xl"
              style={{
                borderColor: "rgba(242,225,217,0.16)",
                background: "rgba(255,255,255,0.06)",
                boxShadow: "var(--whiold-shadow-card)",
                minHeight: "360px",
              }}
            >
              <div
                className="absolute inset-0 rounded-[40px]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(197,122,88,0.14), rgba(159,87,55,0.08), rgba(229,194,179,0.06))",
                }}
              />

              <div className="relative z-10 flex h-full flex-col justify-center px-4 py-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="rounded-[30px] border p-8 backdrop-blur-xl"
                    style={{
                      borderColor: "rgba(242,225,217,0.16)",
                      background: "rgba(43,33,25,0.45)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div
                        className="flex h-[70px] w-[70px] items-center justify-center rounded-[24px]"
                        style={{
                          background: "var(--whiold-gradient-brand)",
                          color: "white",
                          boxShadow: "0 0 20px rgba(186,112,79,0.35)",
                        }}
                      >
                        {current.icon}
                      </div>
                      <span
                        className="rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em]"
                        style={{
                          borderColor: "rgba(242,225,217,0.2)",
                          background: "rgba(242,225,217,0.08)",
                          color: "var(--whiold-200)",
                        }}
                      >
                        {current.tag}
                      </span>
                    </div>

                    <p className="mt-8 text-[28px] font-black text-white">
                      {current.title}
                    </p>
                    <p
                      className="mt-2 text-[15px]"
                      style={{ color: "rgba(242,225,217,0.7)" }}
                    >
                      {current.desc}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Progress dots */}
                <div className="mt-8 flex items-center justify-center gap-2">
                  {slides.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => setActive(i)}
                      aria-label={`Show ${s.title}`}
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: i === active ? 26 : 8,
                        background:
                          i === active
                            ? "var(--whiold-300)"
                            : "rgba(242,225,217,0.25)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CraftImpact;