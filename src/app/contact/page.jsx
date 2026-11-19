"use client";
import { useEffect, useRef, useState } from "react";
import { Mail, MapPin, Clock, Send, Check, Info } from "lucide-react";

const CARD = "transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl";

const SUPPORT_EMAIL = "support@matchyourskills.com";
const MAX_MESSAGE = 500;

const SUBJECTS = ["General question", "Report a problem", "Feedback", "Other"];

const contactInfo = [
  { icon: Mail, label: "Email", value: SUPPORT_EMAIL, href: `mailto:${SUPPORT_EMAIL}`, tone: "bg-primary-fixed/60 text-primary" },
  { icon: MapPin, label: "Location", value: "Kathmandu, Nepal", tone: "bg-secondary-fixed/50 text-secondary" },
  { icon: Clock, label: "Support hours", value: "Mon to Fri, 9:00 AM to 6:00 PM", tone: "bg-tertiary-fixed text-tertiary" },
];

// ---------- backend hook ----------
// TODO: when Django is ready, set NEXT_PUBLIC_API_URL in .env.local (e.g. http://localhost:8000)
// and create a POST /api/contact/ endpoint. Until then the request is simulated so the UI can be tested.
async function sendMessage(data) {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return;
  }
  const res = await fetch(`${base}/api/contact/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Request failed");
}

function validate(v) {
  const errors = {};
  if (!v.name.trim()) errors.name = "Enter your full name.";
  if (!v.email.trim()) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = "Enter a valid email address.";
  if (!v.subject) errors.subject = "Choose a subject.";
  if (v.message.trim().length < 10) errors.message = "Write at least 10 characters.";
  return errors;
}

// ---------- small reusable pieces ----------
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${shown ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function Field({ id, label, error, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-title-md text-on-surface">{label}</label>
        {hint}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-body-sm text-error">{error}</p>
      )}
    </div>
  );
}

// ---------- page sections ----------
function PageHeader() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[350px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary-fixed/50 via-surface-container-highest/20 to-transparent blur-3xl" />
      <div className="container-page pb-12 pt-12 md:pb-16 md:pt-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-fixed/70 px-3 py-1 text-label-sm uppercase tracking-wider text-on-primary-fixed-variant">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            Contact us
          </span>
          <h1 className="text-headline-lg lg:text-display-hero">
            Get in <span className="text-primary">touch</span>
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            Have a question, found a problem, or want to share feedback? Send us a message.
          </p>
        </div>
      </div>
    </section>
  );
}

function ContactInfo() {
  return (
    <div className="flex flex-col gap-5">
      {contactInfo.map(({ icon: Icon, label, value, href, tone }, i) => (
        <Reveal key={label} delay={i * 80}>
          <div className={`group flex items-start gap-4 rounded-2xl bg-surface-container-lowest p-6 shadow-sm ${CARD}`}>
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${tone}`}>
              <Icon size={22} />
            </span>
            <div className="min-w-0">
              <p className="text-label-sm uppercase tracking-wider text-outline">{label}</p>
              {href ? (
                <a href={href} className="block break-words text-title-md text-on-surface transition-colors hover:text-primary">
                  {value}
                </a>
              ) : (
                <p className="text-title-md text-on-surface">{value}</p>
              )}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function ContactForm() {
  const empty = { name: "", email: "", subject: "", message: "" };
  const [values, setValues] = useState(empty);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const errors = validate(values);
  const showError = (field) => (touched[field] ? errors[field] : undefined);

  const handleChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.keys(errors).length > 0) return;

    setStatus("loading");
    try {
      await sendMessage(values);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setValues(empty);
    setTouched({});
    setStatus("idle");
  };

  const inputClass = (field) =>
    `w-full rounded-lg bg-surface px-4 py-3 text-body-md text-on-surface outline-none ring-1 transition-all placeholder:text-outline focus:bg-surface-container-lowest focus:ring-2 ${
      showError(field) ? "ring-error focus:ring-error" : "ring-outline-variant/60 focus:ring-primary-container"
    }`;

  const ariaFor = (field) => ({
    "aria-invalid": showError(field) ? true : undefined,
    "aria-describedby": showError(field) ? `${field}-error` : undefined,
  });

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary-fixed/50 text-secondary">
          <Check size={28} strokeWidth={3} />
        </span>
        <h3 className="text-headline-md">Message sent</h3>
        <p className="max-w-sm text-body-md text-on-surface-variant">
          Thanks for reaching out. We will reply to the email address you provided.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-2 rounded-xl bg-surface-container px-5 py-2.5 text-label-md text-on-surface transition-colors hover:bg-surface-container-high"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div>
        <h2 className="text-headline-md">Send us a message</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">All fields are required.</p>
      </div>

      {status === "error" && (
        <div role="alert" className="flex items-start gap-3 rounded-lg bg-error-container p-4 text-body-sm text-error">
          <Info size={18} className="mt-0.5 shrink-0" />
          <p>Your message could not be sent. Please check your connection and try again.</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Full name" error={showError("name")}>
          <input
            id="name" name="name" type="text" autoComplete="name" placeholder="Your full name"
            value={values.name} onChange={handleChange} onBlur={handleBlur}
            className={inputClass("name")} {...ariaFor("name")}
          />
        </Field>
        <Field id="email" label="Email" error={showError("email")}>
          <input
            id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com"
            value={values.email} onChange={handleChange} onBlur={handleBlur}
            className={inputClass("email")} {...ariaFor("email")}
          />
        </Field>
      </div>

      <Field id="subject" label="Subject" error={showError("subject")}>
        <select
          id="subject" name="subject" value={values.subject} onChange={handleChange} onBlur={handleBlur}
          className={`${inputClass("subject")} cursor-pointer`} {...ariaFor("subject")}
        >
          <option value="" disabled>Choose a subject</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Field>

      <Field
        id="message" label="Message" error={showError("message")}
        hint={
          <span className={`text-body-sm ${values.message.length >= MAX_MESSAGE - 20 ? "text-error" : "text-outline"}`}>
            {values.message.length} / {MAX_MESSAGE}
          </span>
        }
      >
        <textarea
          id="message" name="message" rows={5} maxLength={MAX_MESSAGE} placeholder="How can we help?"
          value={values.message} onChange={handleChange} onBlur={handleBlur}
          className={`${inputClass("message")} resize-none`} {...ariaFor("message")}
        />
      </Field>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-container px-7 py-3.5 text-label-md text-on-primary shadow-[0_6px_20px_rgba(79,70,229,0.3)] transition-all duration-200 hover:bg-primary hover:shadow-[0_8px_24px_rgba(79,70,229,0.4)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 sm:w-fit"
      >
        {status === "loading" ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Sending...
          </>
        ) : (
          <>
            Send Message <Send size={16} />
          </>
        )}
      </button>
    </form>
  );
}

// ---------- page ----------
export default function ContactPage() {
  return (
    <>
      <PageHeader />
      <section className="container-page grid items-start gap-10 pb-20 md:pb-28 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ContactInfo />
        </div>
        <Reveal delay={120} className="lg:col-span-7">
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm md:p-10">
            <ContactForm />
          </div>
        </Reveal>
      </section>
    </>
  );
}