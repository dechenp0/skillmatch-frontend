"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Target, Mail, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, Check, Info } from "lucide-react";

// ---------- backend hook ----------
// TODO: when Django is ready, set NEXT_PUBLIC_API_URL in .env.local (e.g. http://localhost:8000)
// and create POST /api/auth/register/. Session auth also needs the CSRF token header on POST
// requests, which we will add when the backend exists.
// Until then the request is simulated and always succeeds so the success screen can be tested.
async function registerUser({ name, email, password }) {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return;
  }
  const res = await fetch(`${base}/api/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const error = new Error("Registration failed");
    error.status = res.status; // 409 or 400 is treated as "email already registered"
    throw error;
  }
}

// ---------- validation and password strength ----------
function validate(v) {
  const errors = {};
  if (!v.name.trim()) errors.name = "Enter your full name.";
  if (!v.email.trim()) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = "Enter a valid email address.";
  if (!v.password) errors.password = "Create a password.";
  else if (v.password.length < 8) errors.password = "Use at least 8 characters.";
  if (!v.confirm) errors.confirm = "Confirm your password.";
  else if (v.confirm !== v.password) errors.confirm = "Passwords do not match.";
  if (!v.agree) errors.agree = "You need to agree to continue.";
  return errors;
}

const STRENGTH = [
  { label: "Too short", bar: "bg-error", text: "text-error" },
  { label: "Weak", bar: "bg-error", text: "text-error" },
  { label: "Fair", bar: "bg-tertiary", text: "text-tertiary" },
  { label: "Good", bar: "bg-primary-container", text: "text-primary" },
  { label: "Strong", bar: "bg-secondary", text: "text-secondary" },
];

function getStrength(password) {
  if (!password) return 0;
  if (password.length < 8) return 0;
  let score = 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
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

function Logo({ dark = false }) {
  return (
    <Link href="/" className="flex w-fit items-center gap-2.5" aria-label="MatchYourSkills home">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-container to-secondary text-white">
        <Target size={20} strokeWidth={2.2} />
      </span>
      <span className={`text-headline-sm tracking-tight ${dark ? "text-white" : "text-on-surface"}`}>
        MatchYourSkills
      </span>
    </Link>
  );
}

// ---------- left brand panel ----------
const nextSteps = [
  { title: "Upload your CV", text: "Add a text-based PDF and we read your skills." },
  { title: "Review your profile", text: "Correct anything the system missed." },
  { title: "Get your matches", text: "See ranked jobs and what to improve." },
];

function BrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary-container to-inverse-surface p-12 text-white lg:flex">
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-secondary/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-primary-fixed/20 blur-3xl" />

      <div className="relative">
        <Logo dark />
      </div>

      <div className="relative flex flex-col gap-8">
        <Reveal>
          <h1 className="text-headline-lg">Start matching your skills</h1>
          <p className="mt-3 max-w-sm text-body-lg text-primary-fixed">
            Create your account and see what happens next.
          </p>
        </Reveal>

        <ol className="flex max-w-sm flex-col gap-3">
          {nextSteps.map((s, i) => (
            <Reveal key={s.title} delay={150 + i * 100}>
              <li className="flex items-start gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-fixed/90 text-on-secondary-fixed-variant">
                  <Check size={16} strokeWidth={3} />
                </span>
                <div>
                  <p className="text-title-md">{s.title}</p>
                  <p className="text-body-sm text-primary-fixed-dim">{s.text}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>

      <p className="relative text-body-sm text-primary-fixed-dim">
        You apply yourself on the original job page. We never apply for you.
      </p>
    </div>
  );
}

// ---------- success screen ----------
function SuccessScreen() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary-fixed/50 text-secondary">
        <Check size={28} strokeWidth={3} />
      </span>
      <h2 className="text-headline-md">Account created</h2>
      <p className="max-w-sm text-body-md text-on-surface-variant">
        Continue to complete your profile.
      </p>
      {/* TODO: point this to the profile setup page once it exists */}
      <Link
        href="/auth/login"
        className="group mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-container px-8 text-label-md text-on-primary shadow-[0_6px_20px_rgba(79,70,229,0.3)] transition-all duration-200 hover:bg-primary active:scale-[0.98]"
      >
        Continue <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

// ---------- signup form ----------
function SignupForm({ onSuccess }) {
  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "", agree: false });
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [formError, setFormError] = useState("");
  const [serverErrors, setServerErrors] = useState({});

  const errors = { ...validate(values), ...serverErrors };
  const showError = (field) => (touched[field] ? errors[field] : undefined);
  const strength = getStrength(values.password);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
    if (name === "email" && serverErrors.email) setServerErrors({});
  };
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true, agree: true });
    if (Object.keys(errors).length > 0) return;

    setStatus("loading");
    setFormError("");
    try {
      await registerUser(values);
      onSuccess();
    } catch (err) {
      setStatus("error");
      if (err.status === 409 || err.status === 400) {
        setServerErrors({ email: "An account with this email already exists." });
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    }
  };

  const inputClass = (field, extra = "") =>
    `h-12 w-full rounded-xl bg-surface-container-low text-body-md text-on-surface outline-none ring-1 transition-all placeholder:text-outline focus:bg-surface-container-lowest focus:ring-2 ${extra} ${
      showError(field) ? "ring-error focus:ring-error" : "ring-outline-variant/60 focus:ring-primary-container"
    }`;

  const ariaFor = (field) => ({
    "aria-invalid": showError(field) ? true : undefined,
    "aria-describedby": showError(field) ? `${field}-error` : undefined,
  });

  const fieldError = (field) =>
    showError(field) && (
      <p id={`${field}-error`} role="alert" className="text-body-sm text-error">{showError(field)}</p>
    );

  const eyeButton = (
    <button
      type="button"
      onClick={() => setShowPassword((s) => !s)}
      aria-label={showPassword ? "Hide passwords" : "Show passwords"}
      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline transition-colors hover:text-on-surface"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {status === "error" && formError && (
        <div role="alert" className="flex items-start gap-3 rounded-xl bg-error-container p-4 text-body-sm text-error">
          <Info size={18} className="mt-0.5 shrink-0" />
          <p>{formError}</p>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-label-md text-on-surface">Full name</label>
        <div className="relative">
          <User size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
          <input
            id="name" name="name" type="text" autoComplete="name" placeholder="Your full name"
            value={values.name} onChange={handleChange} onBlur={handleBlur}
            className={inputClass("name", "pl-11 pr-4")} {...ariaFor("name")}
          />
        </div>
        {fieldError("name")}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-label-md text-on-surface">Email</label>
        <div className="relative">
          <Mail size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
          <input
            id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com"
            value={values.email} onChange={handleChange} onBlur={handleBlur}
            className={inputClass("email", "pl-11 pr-4")} {...ariaFor("email")}
          />
        </div>
        {fieldError("email")}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-label-md text-on-surface">Password</label>
        <div className="relative">
          <Lock size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
          <input
            id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password"
            placeholder="At least 8 characters"
            value={values.password} onChange={handleChange} onBlur={handleBlur}
            className={inputClass("password", "pl-11 pr-12")} {...ariaFor("password")}
          />
          {eyeButton}
        </div>
        {values.password && (
          <div className="flex items-center gap-3" aria-live="polite">
            <div className="flex flex-1 gap-1.5">
              {[1, 2, 3, 4].map((n) => (
                <span
                  key={n}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                    strength >= n ? STRENGTH[strength].bar : "bg-surface-container-highest"
                  }`}
                />
              ))}
            </div>
            <span className={`text-label-sm ${STRENGTH[strength].text}`}>{STRENGTH[strength].label}</span>
          </div>
        )}
        {fieldError("password")}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirm" className="text-label-md text-on-surface">Confirm password</label>
        <div className="relative">
          <Lock size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
          <input
            id="confirm" name="confirm" type={showPassword ? "text" : "password"} autoComplete="new-password"
            placeholder="Re-enter your password"
            value={values.confirm} onChange={handleChange} onBlur={handleBlur}
            className={inputClass("confirm", "pl-11 pr-4")} {...ariaFor("confirm")}
          />
        </div>
        {fieldError("confirm")}
      </div>

      <div className="flex flex-col gap-1.5">
        {/* TODO: link "Terms" and "Privacy Policy" once those pages exist */}
        <label className="flex cursor-pointer select-none items-start gap-2 text-body-md text-on-surface-variant">
          <input
            type="checkbox" name="agree" checked={values.agree} onChange={handleChange} onBlur={handleBlur}
            className="mt-1 h-4 w-4 cursor-pointer rounded accent-primary-container" {...ariaFor("agree")}
          />
          <span>I agree to the Terms and Privacy Policy</span>
        </label>
        {fieldError("agree")}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-container text-label-md text-on-primary shadow-[0_6px_20px_rgba(79,70,229,0.3)] transition-all duration-200 hover:bg-primary hover:shadow-[0_8px_24px_rgba(79,70,229,0.4)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Creating account...
          </>
        ) : (
          <>
            Create Account <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}

// ---------- page ----------
export default function SignupPage() {
  const [done, setDone] = useState(false);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <BrandPanel />

      <div className="flex flex-col bg-surface-container-lowest px-6 py-8 sm:px-12 lg:px-16">
        <div className="flex items-center justify-between">
          <Link href="/" className="group inline-flex items-center gap-2 text-label-md text-on-surface-variant transition-colors hover:text-primary">
            <ArrowLeft size={18} className="transition-transform duration-200 group-hover:-translate-x-1" />
            Back to home
          </Link>
          <div className="lg:hidden"><Logo /></div>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 py-10">
          {done ? (
            <SuccessScreen />
          ) : (
            <>
              <Reveal>
                <h2 className="text-headline-md md:text-headline-lg">Create your student account</h2>
                <p className="mt-2 text-body-md text-on-surface-variant">It takes less than a minute.</p>
              </Reveal>

              <Reveal delay={100}>
                <SignupForm onSuccess={() => setDone(true)} />
              </Reveal>

              <p className="text-center text-body-md text-on-surface-variant">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-label-md text-primary hover:underline">Log in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}