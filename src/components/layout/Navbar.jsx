"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Target, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Contact Us", href: "/contact" },
];

const AUTH_LINKS = {
  login: "/auth/login",
  signup: "/auth/signup",
};


function Logo({ dark = false }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="MatchYourSkills home">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-container to-secondary text-white">
        <Target size={20} strokeWidth={2.2} />
      </span>
      <span
        className={`text-headline-sm tracking-tight ${dark ? "text-inverse-on-surface" : "text-on-surface"}`}
      >
        MatchYourSkills
      </span>
    </Link>
  );
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl text-label-md transition-all duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container";

const variants = {
  primary:
    "bg-primary-container text-on-primary shadow-[0_6px_20px_rgba(79,70,229,0.3)] hover:bg-primary hover:shadow-[0_8px_24px_rgba(79,70,229,0.4)]",
  secondary:
    "bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container-low hover:shadow-md",
  ghost: "text-on-surface-variant hover:text-primary",
  light: "bg-white text-primary shadow-lg hover:bg-surface-container-low",
  glass: "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20",
};

const sizes = { md: "px-5 py-2.5", lg: "px-7 py-3.5" };

function Button({ href, variant = "primary", size = "md", className = "", children, ...props }) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href) =>
    href === "/" ? pathname === "/" || pathname === "/home" : pathname.startsWith(href);

  if ((pathname.startsWith("/auth") || pathname.startsWith("/userdashboard"))) return null; // login/signup have their own layout

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? "shadow-[0_2px_16px_rgba(15,23,42,0.08)]" : "shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
      }`}
    >
      <div className="container-page flex h-20 items-center justify-between gap-6">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`text-title-md transition-colors hover:text-primary ${
                isActive(link.href) ? "font-bold text-primary" : "text-on-surface-variant"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button href={AUTH_LINKS.login} variant="ghost">Log In</Button>
          <Button href={AUTH_LINKS.signup}>Sign Up</Button>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-on-surface md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-outline-variant/40 bg-surface-container-lowest md:hidden">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-3 text-title-md ${
                  isActive(link.href) ? "bg-primary-fixed/60 text-primary" : "text-on-surface-variant"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex gap-3">
              <Button href={AUTH_LINKS.login} variant="secondary" className="flex-1" onClick={() => setOpen(false)}>
                Log In
              </Button>
              <Button href={AUTH_LINKS.signup} className="flex-1" onClick={() => setOpen(false)}>
                Sign Up
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
    <div className="h-20" /> {/* spacer for the fixed header */}
    </>
  );
}