import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  //   Instagram,
  CheckCircle2,
} from "lucide-react";

import ButtonComponent from "../../../ui/ButtonComponent";
import InputComponent from "../../../ui/InputComponent";
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';

const WHATSAPP_NUMBER = "9630265692";
const STORE_EMAIL = "sakshikacher846@gmail.com";
const STORE_PHONE = "+91 98765 43210";

const SUBJECTS = [
  "Order Enquiry",
  "Custom Stitching / Alterations",
  "Bulk / Wholesale",
  "Return or Exchange",
  "Something Else",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: SUBJECTS[0],
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name";
    if (!form.email.trim()) {
      next.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address";
    }
    if (form.phone && !/^[0-9+\-\s()]{7,15}$/.test(form.phone)) {
      next.phone = "Enter a valid phone number";
    }
    if (!form.message.trim())
      next.message = "Tell us a little about your query";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("sending");
    try {
      // TODO: wire this up to your actual API endpoint
      // await axios.post("/api/contact", form);
      await new Promise((res) => setTimeout(res, 900));
      setStatus("sent");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: SUBJECTS[0],
        message: "",
      });
    } catch {
      setStatus("idle");
    }
  };

  return (
    <div
      style={{
        background: "var(--whiold-bg)",
        fontFamily: "'Poppins', sans-serif",
      }}
      className="min-h-screen w-full relative"
    >
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap");
        .whiold-contact-serif { font-family: 'Cormorant Garamond', serif; }
      `}</style>

      {/* ---------------- Hero ---------------- */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--whiold-gradient-panel)" }}
      >
        <div
          className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full opacity-40 pointer-events-none"
          style={{
            background: "var(--whiold-gradient-brand)",
            filter: "blur(90px)",
          }}
        />
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-20 pb-16 relative">
          <p
            className="uppercase tracking-[0.25em] text-xs font-semibold mb-4"
            style={{ color: "var(--whiold-primary)" }}
          >
            Whiold
          </p>
          <h1
            className="whiold-contact-serif text-4xl md:text-6xl leading-tight mb-5"
            style={{ color: "var(--whiold-text-heading)" }}
          >
            Let's talk threads,
            <br />
            fits &amp; everything ethnic.
          </h1>
          <p
            className="max-w-xl text-base md:text-lg"
            style={{ color: "var(--whiold-text-body)" }}
          >
            Order query ho, custom stitching chahiye, ya bas kuch poochna ho —
            hum ek message ya call dur hain. Reach out however feels easiest.
          </p>
        </div>
      </section>

      {/* ---------------- Main content ---------------- */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 -mt-10 relative pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* -------- Left: info cards -------- */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <InfoCard
              icon={<Phone size={20} />}
              title="Call Us"
              lines={[STORE_PHONE, "Mon – Sat, 10am – 7pm IST"]}
              action={{
                label: "Call now",
                href: `tel:${STORE_PHONE.replace(/\s/g, "")}`,
              }}
            />
            <InfoCard
              icon={<MessageCircle size={20} />}
              title="WhatsApp"
              lines={[
                "Fastest way to reach us",
                "Order tracking, sizing help & more",
              ]}
              action={{
                label: "Chat on WhatsApp",
                href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  "Hi Whiold Atelier! I had a question about...",
                )}`,
              }}
            />
            <InfoCard
              icon={<Mail size={20} />}
              title="Email"
              lines={[STORE_EMAIL, "We reply within 24 hours"]}
              action={{ label: "Send an email", href: `mailto:${STORE_EMAIL}` }}
            />
            <InfoCard
              icon={<MapPin size={20} />}
              title="Visit the Atelier"
              lines={[
                "Whiold Studio, Indore, Madhya Pradesh",
                "By appointment for fittings",
              ]}
            />

            <div
              className="rounded-2xl p-5 flex items-center gap-3"
              style={{
                background: "var(--whiold-bg-soft)",
                border: "1px solid var(--whiold-border)",
              }}
            >
              <Clock size={18} style={{ color: "var(--whiold-primary)" }} />
              <p
                className="text-sm"
                style={{ color: "var(--whiold-text-body)" }}
              >
                <span
                  style={{
                    color: "var(--whiold-text-heading)",
                    fontWeight: 600,
                  }}
                >
                  Store hours:
                </span>{" "}
                Mon – Sat, 10:00 AM – 7:00 PM · Closed on Sundays
              </p>
            </div>

            <div className="flex items-center gap-3 mt-1">
              <SocialIcon href="#" label="Instagram">
                <InstagramIcon size={18} />
              </SocialIcon>
              <SocialIcon href="#" label="Facebook">
                <FacebookIcon size={18} />
              </SocialIcon>
            </div>
          </div>

          {/* -------- Right: form card (foil border signature) -------- */}
          <div className="lg:col-span-3">
            <div className="whiold-foil-border relative">
              <div
                className="rounded-[24px] p-7 md:p-10 relative"
                style={{
                  background: "var(--whiold-bg)",
                  boxShadow: "var(--whiold-shadow-card)",
                  border: "1px solid var(--whiold-border)",
                }}
              >
                {status === "sent" ? (
                  <SuccessState onReset={() => setStatus("idle")} />
                ) : (
                  <>
                    <h2
                      className="whiold-contact-serif text-2xl md:text-3xl mb-1"
                      style={{ color: "var(--whiold-text-heading)" }}
                    >
                      Send us a message
                    </h2>
                    <p
                      className="text-sm mb-7"
                      style={{ color: "var(--whiold-text-muted)" }}
                    >
                      Fill this in and our team will get back to you personally.
                    </p>

                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-5"
                      noValidate
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputComponent
                          label="Full Name"
                          value={form.name}
                          placeholder="Your name"
                          onChange={(e) =>
                            handleChange({
                              target: {
                                name: "name",
                                value: e.target.value,
                              },
                            })
                          }
                          error={!!errors.name}
                          helperText={errors.name}
                        />
                        <InputComponent
                          label="Phone (optional)"
                          value={form.phone}
                          placeholder="+91 00000 00000"
                          onChange={(e) =>
                            handleChange({
                                target: {
                                  name: "phone",
                                  value: e.target.value,
                                },
                              })
                          }
                          error={!!errors.phone}
                          helperText={errors.phone}
                        />
                      </div>

                      <InputComponent
                        label="Email Address"
                        value={form.email}
                        placeholder="you@example.com"
                        onChange={(e) =>    
                          handleChange({
                            target: {
                              name: "email",
                              value: e.target.value,
                            },
                          })
                        }
                        error={!!errors.email}
                        helperText={errors.email}
                      />

                      <div>
                        <label
                          className="block text-xs font-medium mb-2 tracking-wide"
                          style={{ color: "var(--whiold-input-label-color)" }}
                        >
                          What's this about?
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {SUBJECTS.map((s) => {
                            const active = form.subject === s;
                            return (
                              <button
                                type="button"
                                key={s}
                                onClick={() =>
                                  setForm((p) => ({ ...p, subject: s }))
                                }
                                className="px-4 py-2 rounded-full text-sm transition-all"
                                style={{
                                  background: active
                                    ? "var(--whiold-gradient-brand)"
                                    : "var(--whiold-bg-input)",
                                  color: active
                                    ? "var(--whiold-text-on-primary)"
                                    : "var(--whiold-text-body)",
                                  border: `1px solid ${active ? "transparent" : "var(--whiold-border)"}`,
                                  fontWeight: active ? 600 : 500,
                                }}
                              >
                                {s}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label
                          className="block text-xs font-medium mb-2 tracking-wide"
                          style={{ color: "var(--whiold-input-label-color)" }}
                        >
                          Message
                        </label>
                        <textarea
                          name="message"
                          rows={5}
                          value={form.message}
                          onChange={handleChange}
                          placeholder="Tell us a little more..."
                          className="w-full px-4 py-3 outline-none resize-none text-sm"
                          style={{
                            background: "var(--whiold-input-bg)",
                            border: `1px solid ${errors.message ? "var(--whiold-input-error-border)" : "var(--whiold-input-border)"}`,
                            borderRadius: "var(--whiold-input-radius)",
                            color: "var(--whiold-input-text-color)",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor =
                              "var(--whiold-input-border-focus)";
                            e.target.style.boxShadow =
                              "var(--whiold-input-focus-ring)";
                            e.target.style.background =
                              "var(--whiold-input-bg-focus)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = errors.message
                              ? "var(--whiold-input-error-border)"
                              : "var(--whiold-input-border)";
                            e.target.style.boxShadow = "none";
                            e.target.style.background =
                              "var(--whiold-input-bg)";
                          }}
                        />
                        {errors.message && (
                          <p
                            className="text-xs mt-1.5"
                            style={{ color: "var(--whiold-input-error-text)" }}
                          >
                            {errors.message}
                          </p>
                        )}
                      </div>

                      <ButtonComponent
                        type="submit"
                        disabled={status === "sending"}
                        className="mt-2 flex items-center justify-center gap-2 w-full md:w-auto self-start px-8"
                        style={{
                          height: "var(--whiold-button-height-lg)",
                          borderRadius: "var(--whiold-button-radius)",
                          background:
                            status === "sending"
                              ? "var(--whiold-button-disabled-bg)"
                              : "var(--whiold-button-bg)",
                          color:
                            status === "sending"
                              ? "var(--whiold-button-disabled-text)"
                              : "var(--whiold-button-text)",
                          fontWeight: "var(--whiold-button-font-weight)",
                          fontSize: "var(--whiold-button-font-size)",
                          boxShadow:
                            status === "sending"
                              ? "none"
                              : "var(--whiold-button-shadow)",
                          cursor:
                            status === "sending" ? "not-allowed" : "pointer",
                          border: "none",
                        }}
                        onMouseEnter={(e) => {
                          if (status !== "sending")
                            e.currentTarget.style.background =
                              "var(--whiold-button-bg-hover)";
                        }}
                        onMouseLeave={(e) => {
                          if (status !== "sending")
                            e.currentTarget.style.background =
                              "var(--whiold-button-bg)";
                        }}
                      >
                        {status === "sending" ? (
                          "Sending..."
                        ) : (
                          <>
                            Send Message <Send size={16} />
                          </>
                        )}
                      </ButtonComponent>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Floating WhatsApp button ---------------- */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Whiold Atelier!")}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full"
        style={{
          width: 58,
          height: 58,
          background: "var(--whiold-gradient-brand)",
          boxShadow: "var(--whiold-shadow-btn)",
          color: "var(--whiold-text-on-primary)",
        }}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={26} />
      </a>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Sub-components
------------------------------------------------------------------------- */

function Field({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label
        className="block text-xs font-medium mb-2 tracking-wide"
        style={{ color: "var(--whiold-input-label-color)" }}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 outline-none text-sm"
        style={{
          height: "var(--whiold-input-height)",
          background: "var(--whiold-input-bg)",
          border: `1px solid ${error ? "var(--whiold-input-error-border)" : "var(--whiold-input-border)"}`,
          borderRadius: "var(--whiold-input-radius)",
          color: "var(--whiold-input-text-color)",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--whiold-input-border-focus)";
          e.target.style.boxShadow = "var(--whiold-input-focus-ring)";
          e.target.style.background = "var(--whiold-input-bg-focus)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error
            ? "var(--whiold-input-error-border)"
            : "var(--whiold-input-border)";
          e.target.style.boxShadow = "none";
          e.target.style.background = "var(--whiold-input-bg)";
        }}
      />
      {error && (
        <p
          className="text-xs mt-1.5"
          style={{ color: "var(--whiold-input-error-text)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

function InfoCard({ icon, title, lines, action }) {
  return (
    <div
      className="rounded-2xl p-5 flex items-start gap-4 transition-transform"
      style={{
        background: "var(--whiold-bg)",
        border: "1px solid var(--whiold-border)",
        boxShadow: "var(--whiold-shadow-card)",
      }}
    >
      <div
        className="flex items-center justify-center rounded-xl shrink-0"
        style={{
          width: 44,
          height: 44,
          background: "var(--whiold-primary-soft)",
          color: "var(--whiold-primary)",
        }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <h3
          className="text-sm font-semibold mb-1"
          style={{ color: "var(--whiold-text-heading)" }}
        >
          {title}
        </h3>
        {lines.map((l, i) => (
          <p
            key={i}
            className="text-sm"
            style={{ color: "var(--whiold-text-body)" }}
          >
            {l}
          </p>
        ))}
        {action && (
          <a
            href={action.href}
            target={action.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="inline-block text-sm font-semibold mt-2"
            style={{ color: "var(--whiold-primary)" }}
          >
            {action.label} →
          </a>
        )}
      </div>
    </div>
  );
}

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex items-center justify-center rounded-full transition-colors"
      style={{
        width: 40,
        height: 40,
        background: "var(--whiold-bg-soft)",
        color: "var(--whiold-text-body)",
        border: "1px solid var(--whiold-border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--whiold-primary)";
        e.currentTarget.style.color = "var(--whiold-text-on-primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--whiold-bg-soft)";
        e.currentTarget.style.color = "var(--whiold-text-body)";
      }}
    >
      {children}
    </a>
  );
}

function SuccessState({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10">
      <div
        className="flex items-center justify-center rounded-full mb-5"
        style={{
          width: 64,
          height: 64,
          background: "var(--whiold-primary-soft)",
          color: "var(--whiold-primary)",
        }}
      >
        <CheckCircle2 size={32} />
      </div>
      <h3
        className="whiold-contact-serif text-2xl mb-2"
        style={{ color: "var(--whiold-text-heading)" }}
      >
        Message sent!
      </h3>
      <p
        className="text-sm max-w-sm mb-6"
        style={{ color: "var(--whiold-text-body)" }}
      >
        Thank you for reaching out. Our team will get back to you within 24
        hours.
      </p>
      <ButtonComponent
        onClick={onReset}
        className="px-6 text-sm font-semibold"
        style={{
          height: "var(--whiold-button-height-md)",
          borderRadius: "var(--whiold-button-radius)",
          background: "var(--whiold-bg-soft)",
          color: "var(--whiold-primary)",
          border: "1px solid var(--whiold-border)",
        }}
      >
        Send another message
      </ButtonComponent>
    </div>
  );
}
