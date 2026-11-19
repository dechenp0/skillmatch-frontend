"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Target } from "lucide-react";

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

const SUPPORT_EMAIL = "support@matchyourskills.com";


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

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/auth")) return null;

  const linkClass = "text-body-sm text-outline-variant transition-colors hover:text-white";

  return (
    <footer className="bg-inverse-surface py-14 text-inverse-on-surface">
      <div className="container-page">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo dark />
            <p className="mt-4 max-w-sm text-body-sm text-outline-variant">
              CV-based and interest-based job and internship recommendations for students and recent graduates.
            </p>
          </div>

          <div>
            <h3 className="text-title-md">Explore</h3>
            <ul className="mt-4 flex flex-col gap-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-title-md">Account</h3>
            <ul className="mt-4 flex flex-col gap-2">
              <li><Link href={AUTH_LINKS.login} className={linkClass}>Log In</Link></li>
              <li><Link href={AUTH_LINKS.signup} className={linkClass}>Sign Up</Link></li>
              <li><a href={`mailto:${SUPPORT_EMAIL}`} className={linkClass}>{SUPPORT_EMAIL}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-body-sm text-outline-variant md:flex-row md:items-center md:justify-between">
          <p>MatchYourSkills is a recommendation platform. Applications are completed on external job pages.</p>
          <p>&copy; {new Date().getFullYear()} MatchYourSkills</p>
        </div>
      </div>
    </footer>
  );
}