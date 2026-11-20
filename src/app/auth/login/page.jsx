"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Target, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Check, Info } from "lucide-react";
import { loginUser } from "@/services/auth";

function validate(v) {
  const errors = {};
  if (!v.email.trim()) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = "Enter a valid email address.";
  if (!v.password) errors.password = "Enter your password.";
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
function BrandPanel() {
  const matched = ["Python", "SQL"];
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary-container to-inverse-surface p-12 text-white lg:flex">
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-secondary/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-primary-fixed/20 blur-3xl" />

      <div className="relative">
        <Logo dark />
      </div>

      <div className="relative flex flex-col gap-8">
        <Reveal>
          <h1 className="text-headline-lg">Welcome back</h1>
          <p className="mt-3 max-w-sm text-body-lg text-primary-fixed">
            Log in to see your recommendations and pick up where you left off.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div className="max-w-sm rounded-2xl bg-white/10 p-5 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-label-sm uppercase tracking-wider text-primary-fixed-dim">Sample</p>
                <p className="text-title-md">Junior Backend Developer</p>
              </div>
              <span className="rounded-full bg-secondary-fixed/90 px-2.5 py-1 text-label-md font-bold text-on-secondary-fixed-variant">
                82% match
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {matched.map((s) => (
                <span key={s} className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-label-md">
                  <Check size={14} className="text-secondary-fixed" /> {s}
                </span>
              ))}
              <span className="flex items-center gap-1 rounded-full bg-tertiary-fixed/90 px-3 py-1 text-label-md text-on-tertiary-fixed-variant">
                <Info size={14} /> Docker
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      <p className="relative text-body-sm text-primary-fixed-dim">
        You review your profile. You apply on the original job page.
      </p>
    </div>
  );
}

// ---------- login form ----------
function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "", remember: false });
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [formError, setFormError] = useState("");

  const errors = validate(values);
  const showError = (field) => (touched[field] ? errors[field] : undefined);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
  };
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (Object.keys(errors).length > 0) return;

    setStatus("loading");
    setFormError("");
    try {
      await loginUser(values);
      router.push("/userdashboard/dashboard");
    } catch (err) {
      setStatus("error");
      setFormError(
        err.status === 400 || err.status === 401
          ? "Invalid email or password."
          : "Something went wrong. Please try again."
      );
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

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {status === "error" && (
        <div role="alert" className="flex items-start gap-3 rounded-xl bg-error-container p-4 text-body-sm text-error">
          <Info size={18} className="mt-0.5 shrink-0" />
          <p>{formError}</p>
        </div>
      )}

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
        {showError("email") && <p id="email-error" role="alert" className="text-body-sm text-error">{showError("email")}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-label-md text-on-surface">Password</label>
        <div className="relative">
          <Lock size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
          <input
            id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password"
            placeholder="Your password"
            value={values.password} onChange={handleChange} onBlur={handleBlur}
            className={inputClass("password", "pl-11 pr-12")} {...ariaFor("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline transition-colors hover:text-on-surface"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {showError("password") && <p id="password-error" role="alert" className="text-body-sm text-error">{showError("password")}</p>}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer select-none items-center gap-2 text-body-md text-on-surface-variant">
          <input
            type="checkbox" name="remember" checked={values.remember} onChange={handleChange}
            className="h-4 w-4 cursor-pointer rounded accent-primary-container"
          />
          Remember me
        </label>
        {/* TODO: point this to the password reset page once it exists */}
        <a href="#" className="text-label-md text-primary hover:underline">Forgot password?</a>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-container text-label-md text-on-primary shadow-[0_6px_20px_rgba(79,70,229,0.3)] transition-all duration-200 hover:bg-primary hover:shadow-[0_8px_24px_rgba(79,70,229,0.4)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Logging in...
          </>
        ) : (
          <>
            Log In <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}

// ---------- page ----------
export default function LoginPage() {
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
          <Reveal>
            <h2 className="text-headline-md md:text-headline-lg">Log in to your account</h2>
            <p className="mt-2 text-body-md text-on-surface-variant">Enter your email and password to continue.</p>
          </Reveal>

          <Reveal delay={100}>
            <LoginForm />
          </Reveal>

          <p className="text-center text-body-md text-on-surface-variant">
            Don&rsquo;t have an account?{" "}
            <Link href="/auth/signup" className="text-label-md text-primary hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}