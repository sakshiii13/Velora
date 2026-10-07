import React from "react";
import { motion } from "framer-motion";
import {
  Handshake,
  Users,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Target,
  Eye,
  Heart,
  Zap,
  CheckCircle2,
  Package,
  Wallet,
  BarChart3,
  Bell,
  ClipboardCheck,
  Store,
  ArrowRight,
  Info,
} from "lucide-react";

/* ------------------------------------------------------------------ *
 *  WHIOLD — About page
 *  Content: platform mission / how-it-works / values copy.
 *  Design: same visual language as the rest of the site — woven-strand
 *  rule, glassmorphic frosted cards, ambient terracotta/cream blobs,
 *  Fraunces + Poppins, existing --whiold-* tokens. No fabric imagery
 *  this time (content isn't product-specific), so the "hand-made,
 *  connected, in-motion" feeling comes from the woven rule + the
 *  step-thread section instead.
 * ------------------------------------------------------------------ */

function WovenRule({ className = "" }) {
  const strands = Array.from({ length: 9 });
  return (
    <div className={`relative h-[3px] w-full overflow-hidden ${className}`}>
      <div className="absolute inset-0 flex">
        {strands.map((_, i) => (
          <motion.span
            key={i}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            style={{
              transformOrigin: i % 2 === 0 ? "left" : "right",
              background: "var(--whiold-300)",
              opacity: i % 2 === 0 ? 1 : 0.5,
            }}
            className="h-full flex-1 mx-[2px]"
          />
        ))}
      </div>
    </div>
  );
}

const challenges = [
  "Finding reliable products",
  "Connecting with trusted brands",
  "Managing orders efficiently",
  "Accessing digital business tools",
  "Growing in an organised way",
];

const whatWeDo = [
  { icon: Store, label: "Brands & Manufacturers" },
  { icon: Users, label: "Distributors" },
  { icon: ClipboardCheck, label: "Business Operations" },
];

const platformFeatures = [
  { icon: Package, label: "Discover products" },
  { icon: ShieldCheck, label: "Purchase eligible products" },
  { icon: ClipboardCheck, label: "Manage orders" },
  { icon: BarChart3, label: "Access business dashboards" },
  { icon: TrendingUp, label: "Track business activity" },
  { icon: Wallet, label: "Use digital wallet features" },
  { icon: BarChart3, label: "View reports and analytics" },
  { icon: Bell, label: "Receive platform updates" },
];

const values = [
  {
    icon: Handshake,
    title: "Trust",
    body: "Earned through honest communication, reliable service, and responsible business practices.",
  },
  {
    icon: Eye,
    title: "Transparency",
    body: "We keep our processes, policies, and communication clear and easy to understand.",
  },
  {
    icon: Sparkles,
    title: "Innovation",
    body: "Technology should simplify business. We keep improving the platform and the experience.",
  },
  {
    icon: Heart,
    title: "Customer First",
    body: "Every feature we build is designed around the needs of the people who use it.",
  },
  {
    icon: Zap,
    title: "Growth",
    body: "Long-term success comes from continuous learning, disciplined execution, and sustainable practice.",
  },
];

const steps = [
  { tag: "Step 1", title: "Register", body: "Register on the WHIOLD platform." },
  { tag: "Step 2", title: "Verify", body: "Complete verification and activate your account as per platform process." },
  { tag: "Step 3", title: "Explore", body: "Explore available products from participating brands." },
  { tag: "Step 4", title: "Purchase", body: "Purchase products based on your business needs." },
  { tag: "Step 5", title: "Manage", body: "Manage your business using WHIOLD's dashboards and operational tools." },
  { tag: "Step 6", title: "Build", body: "Build long-term relationships through quality products and service." },
];

const whyChoose = [
  "Technology-driven platform",
  "User-friendly mobile experience",
  "Organised product distribution",
  "Business management dashboard",
  "Secure digital wallet",
  "Transparent order tracking",
  "Performance reports",
  "Customer support",
  "Scalable business infrastructure",
  "Continuous platform improvements",
];

export default function AboutPage() {
  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }} className="bg-[var(--whiold-bg)]">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Poppins:wght@300;400;500;600;700&display=swap");
        .whiold-display { font-family: "Fraunces", serif; }
      `}</style>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[var(--whiold-50)] py-24 md:py-0 md:min-h-[80vh] flex items-center">
        {/* ambient blobs */}
        <div
          className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{ background: "var(--whiold-300)" }}
        />
        <div
          className="absolute -bottom-32 -left-24 w-[380px] h-[380px] rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: "var(--whiold-200)" }}
        />

        <div className="max-w-4xl mx-auto px-6 w-full text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="uppercase tracking-[0.3em] text-[12px] text-[var(--whiold-500)] mb-6"
          >
            Welcome to WHIOLD
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="whiold-display text-[var(--whiold-900)] text-[36px] sm:text-[48px] md:text-[56px] leading-[1.1] font-medium"
          >
            A technology-enabled platform connecting brands with motivated distributors.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="mt-6 text-[var(--whiold-700)] text-[16px] md:text-[17px] max-w-2xl mx-auto leading-relaxed"
          >
            We believe starting a business should be organised, transparent, and
            technology-driven. WHIOLD simplifies discovering products, managing
            orders, tracking activity, and building long-term relationships with
            trusted brands — all on one platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <motion.a
              href="/register"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 justify-center px-8 rounded-[var(--whiold-button-radius)] font-semibold text-[15px] bg-[var(--whiold-700)] text-[var(--whiold-text-on-primary)] shadow-[var(--whiold-shadow-btn)]"
              style={{ height: "var(--whiold-button-height-lg)" }}
            >
              Get Started
              <ArrowRight size={16} />
            </motion.a>
          </motion.div>
        </div>
      </section>

      <WovenRule />

      {/* ================= WHY WHIOLD WAS CREATED ================= */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
        <div>
          <span className="uppercase tracking-[0.3em] text-[11px] text-[var(--whiold-400)]">
            Why WHIOLD was created
          </span>
          <h2 className="whiold-display text-[var(--whiold-text-heading)] text-[30px] md:text-[36px] mt-4 leading-snug">
            Across India, starting a business still means solving the same problems alone.
          </h2>
          <p className="text-[var(--whiold-text-body)] mt-6 text-[15px] leading-relaxed">
            WHIOLD was created to bring products, technology, and business
            management together in one place — helping brands expand their
            reach while giving distributors the tools to manage and grow
            effectively.
          </p>
        </div>

        <div className="rounded-[var(--whiold-radius-lg)] bg-white/60 backdrop-blur-xl border border-white/70 shadow-[var(--whiold-shadow-card)] p-8">
          <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--whiold-500)] font-semibold mb-5">
            Common challenges
          </p>
          <ul className="space-y-4">
            {challenges.map((c, i) => (
              <motion.li
                key={c}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span
                  className="mt-1 w-[7px] h-[7px] rounded-full flex-shrink-0"
                  style={{ background: "var(--whiold-500)" }}
                />
                <span className="text-[14px] text-[var(--whiold-text-body)]">{c}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= WHAT WE DO ================= */}
      <section className="bg-[var(--whiold-bg-soft)] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14 max-w-lg mx-auto text-center">
            <span className="uppercase tracking-[0.3em] text-[11px] text-[var(--whiold-400)]">
              What we do
            </span>
            <h2 className="whiold-display text-[var(--whiold-text-heading)] text-[30px] md:text-[36px] mt-4 leading-snug">
              One platform connecting three sides of the same ecosystem.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            {whatWeDo.map((w, i) => (
              <motion.div
                key={w.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-[var(--whiold-radius-lg)] bg-[var(--whiold-bg)] border border-[var(--whiold-border)] shadow-[var(--whiold-shadow-card)] p-8 text-center"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "var(--whiold-100)" }}
                >
                  <w.icon size={22} color="var(--whiold-700)" />
                </div>
                <p className="text-[15px] font-semibold text-[var(--whiold-text-heading)]">
                  {w.label}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {platformFeatures.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-[var(--whiold-radius-lg)] bg-[var(--whiold-bg)] border border-[var(--whiold-border)] px-4 py-4"
              >
                <f.icon size={18} color="var(--whiold-600)" className="flex-shrink-0" />
                <span className="text-[13px] text-[var(--whiold-text-body)]">{f.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WovenRule />

      {/* ================= MISSION & VISION ================= */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="rounded-[var(--whiold-radius-lg)] p-9 bg-white/60 backdrop-blur-xl border border-white/70 shadow-[var(--whiold-shadow-card)]"
        >
          <Target size={24} color="var(--whiold-600)" />
          <h3 className="whiold-display text-[22px] text-[var(--whiold-text-heading)] mt-4">
            Our Mission
          </h3>
          <p className="text-[14px] text-[var(--whiold-text-body)] mt-3 leading-relaxed">
            To build one of India's most trusted technology-enabled
            distribution platforms — empowering businesses through
            transparency, innovation, and operational excellence.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-[var(--whiold-radius-lg)] p-9 bg-white/60 backdrop-blur-xl border border-white/70 shadow-[var(--whiold-shadow-card)]"
        >
          <Eye size={24} color="var(--whiold-600)" />
          <h3 className="whiold-display text-[22px] text-[var(--whiold-text-heading)] mt-4">
            Our Vision
          </h3>
          <p className="text-[14px] text-[var(--whiold-text-body)] mt-3 leading-relaxed">
            A nationwide digital ecosystem where brands expand confidently and
            distributors grow their businesses through reliable technology,
            quality products, and efficient processes.
          </p>
        </motion.div>
      </section>

      {/* ================= CORE VALUES ================= */}
      <section className="bg-[var(--whiold-bg-soft)] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14 max-w-lg">
            <span className="uppercase tracking-[0.3em] text-[11px] text-[var(--whiold-400)]">
              Our core values
            </span>
            <h2 className="whiold-display text-[var(--whiold-text-heading)] text-[30px] md:text-[36px] mt-4 leading-snug">
              What we won't compromise on.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-[var(--whiold-radius-lg)] bg-[var(--whiold-bg)] border border-[var(--whiold-border)] shadow-[var(--whiold-shadow-card)] p-6"
              >
                <v.icon size={20} color="var(--whiold-600)" />
                <h4 className="text-[15px] font-semibold text-[var(--whiold-text-heading)] mt-4">
                  {v.title}
                </h4>
                <p className="text-[13px] text-[var(--whiold-text-muted)] mt-2 leading-relaxed">
                  {v.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW WHIOLD WORKS — continuous thread, 6 steps ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-14 max-w-lg">
          <span className="uppercase tracking-[0.3em] text-[11px] text-[var(--whiold-400)]">
            How WHIOLD works
          </span>
          <h2 className="whiold-display text-[var(--whiold-text-heading)] text-[30px] md:text-[36px] mt-4 leading-snug">
            Six steps, start to finish.
          </h2>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-[26px] left-0 right-0 h-[2px] bg-[var(--whiold-border)]" />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "left" }}
            className="hidden md:block absolute top-[26px] left-0 right-0 h-[2px] bg-[var(--whiold-500)]"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-10 md:gap-4 relative">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
              >
                <span className="hidden md:inline-block w-[13px] h-[13px] rounded-full bg-[var(--whiold-500)] ring-4 ring-[var(--whiold-bg)] relative -top-[6px]" />
                <p className="text-[11px] tracking-[0.15em] uppercase text-[var(--whiold-500)] mt-6 md:mt-4 font-semibold">
                  {s.tag}
                </p>
                <h3 className="whiold-display text-[17px] text-[var(--whiold-text-heading)] mt-2 leading-snug">
                  {s.title}
                </h3>
                <p className="text-[var(--whiold-text-body)] text-[13px] mt-2 leading-relaxed">
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-[12px] text-[var(--whiold-text-muted)] mt-12 max-w-2xl">
          Where applicable, eligible incentives and rewards are governed by the
          platform's published policies and compensation plan.
        </p>
      </section>

      <WovenRule />

      {/* ================= WHY CHOOSE WHIOLD ================= */}
      <section
        className="py-24"
        style={{ background: "var(--whiold-gradient-panel)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14 max-w-lg">
            <span className="uppercase tracking-[0.3em] text-[11px] text-[var(--whiold-400)]">
              Why choose WHIOLD
            </span>
            <h2 className="whiold-display text-[var(--whiold-text-heading)] text-[30px] md:text-[36px] mt-4 leading-snug">
              Built to be an ecosystem, not just a checkout.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {whyChoose.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-[var(--whiold-radius-lg)] bg-white/60 backdrop-blur-xl border border-white/70 px-5 py-4"
              >
                <CheckCircle2 size={18} color="var(--whiold-600)" className="flex-shrink-0" />
                <span className="text-[14px] text-[var(--whiold-text-body)]">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= COMMITMENT ================= */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <span className="uppercase tracking-[0.3em] text-[11px] text-[var(--whiold-400)]">
          Our commitment
        </span>
        <h2 className="whiold-display text-[var(--whiold-text-heading)] text-[26px] md:text-[32px] mt-4 leading-snug">
          Built on quality, responsibility, and long-term trust.
        </h2>
        <p className="text-[var(--whiold-text-body)] mt-6 text-[15px] leading-relaxed">
          We continuously work to improve our technology, strengthen our
          operations, and provide a better experience for every brand,
          distributor, and customer who becomes part of our ecosystem. Our
          success will always depend on creating real value for the people
          who use our platform.
        </p>
      </section>

      {/* ================= IMPORTANT INFORMATION ================= */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="rounded-[var(--whiold-radius-lg)] border border-[var(--whiold-border)] bg-[var(--whiold-bg-soft)] px-7 py-6 flex gap-4">
          <Info size={20} color="var(--whiold-500)" className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-semibold text-[var(--whiold-text-heading)] mb-2">
              Important information
            </p>
            <p className="text-[13px] text-[var(--whiold-text-muted)] leading-relaxed">
              Participation in WHIOLD does not guarantee income or business
              success. Individual results depend on factors such as product
              demand, customer relationships, business effort, market
              conditions, and compliance with platform policies. Users are
              encouraged to understand the platform, review all applicable
              policies, and make informed business decisions.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: "var(--whiold-gradient-brand)" }}
      >
        <h2 className="whiold-display text-[var(--whiold-text-on-primary)] text-[26px] md:text-[32px] leading-snug max-w-xl mx-auto">
          WHIOLD is more than a platform — it's an ecosystem built on technology, trust, and collaboration.
        </h2>
        <p className="text-[var(--whiold-text-on-primary)] opacity-80 mt-4 text-[14px] max-w-lg mx-auto">
          Whether you're a brand looking to expand, or a distributor looking
          to build a business — let's grow together.
        </p>
        <motion.a
          href="/register"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 mt-8 px-8 rounded-[var(--whiold-button-radius)] font-semibold text-[15px] bg-[var(--whiold-bg)] text-[var(--whiold-700)] shadow-[var(--whiold-shadow-btn)]"
          style={{ height: "var(--whiold-button-height-lg)" }}
        >
          Join Our Journey
          <ArrowRight size={16} />
        </motion.a>
      </section>
    </div>
  );
}