"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, ExternalLink, Check, X, FileSearch, PencilLine, Compass, Gauge, TrendingUp, Info,
} from "lucide-react";

const AUTH_LINKS = { login: "/auth/login", signup: "/auth/signup" };

const CARD = "transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl";

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

function Button({ href, variant = "primary", className = "", children }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-label-md transition-all duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container";
  const variants = {
    primary:
      "bg-primary-container text-on-primary shadow-[0_6px_20px_rgba(79,70,229,0.3)] hover:bg-primary hover:shadow-[0_8px_24px_rgba(79,70,229,0.4)]",
    light: "bg-white text-primary shadow-lg hover:bg-surface-container-low",
    glass: "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20",
  };
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

function SectionHeading({ eyebrow, title, text }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      {eyebrow && <span className="text-label-sm uppercase tracking-wider text-primary">{eyebrow}</span>}
      <h2 className="text-headline-md md:text-headline-lg text-on-surface">{title}</h2>
      {text && <p className="max-w-2xl text-body-lg text-on-surface-variant">{text}</p>}
    </div>
  );
}

// ---------- page data ----------
const services = [
  {
    icon: FileSearch, title: "CV upload and analysis", tone: "bg-primary-fixed/60 text-primary",
    text: "Upload a PDF CV and we extract your skills, education, projects and experience.",
    note: "Text-based PDFs only",
  },
  {
    icon: PencilLine, title: "Editable profile review", tone: "bg-secondary-fixed/50 text-secondary",
    text: "Correct anything the system missed or got wrong before any matching happens.",
  },
  {
    icon: Compass, title: "Interest-based matching", tone: "bg-tertiary-fixed text-tertiary",
    text: "Pick a career interest and get matched with jobs in that category.",
    note: "UI/UX, Frontend, Backend",
  },
  {
    icon: Gauge, title: "Explainable recommendations", tone: "bg-primary-fixed/60 text-primary",
    text: "Ranked jobs with a match score, matched skills, and education and experience comparison.",
  },
  {
    icon: TrendingUp, title: "Skill gap insights", tone: "bg-secondary-fixed/50 text-secondary",
    text: "See which required skills are not found in your profile, so you know what to learn next.",
  },
  {
    icon: ExternalLink, title: "Direct application links", tone: "bg-tertiary-fixed text-tertiary",
    text: "Open the original job page, or see the application email when the listing provides one.",
  },
];

const included = [
  "Text-based PDF CV analysis",
  "Editable profile review",
  "UI/UX, Frontend and Backend interests",
  "Explainable match score and skill gaps",
  "Links to original job pages",
];

const notIncluded = [
  "Employer accounts and job posting",
  "Interview management",
  "Automatic job applications",
  "OCR for scanned CVs (coming later)",
];

const matchedSkills = ["React", "JavaScript", "Git", "HTML/CSS"];
const missingSkills = ["TypeScript", "Docker"];

// ---------- page sections ----------
function PageHeader() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[350px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary-fixed/50 via-surface-container-highest/20 to-transparent blur-3xl" />
      <div className="container-page pb-16 pt-12 md:pb-20 md:pt-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-fixed/70 px-3 py-1 text-label-sm uppercase tracking-wider text-on-primary-fixed-variant">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            Our services
          </span>
          <h1 className="text-headline-lg lg:text-display-hero">
            What MatchYourSkills <span className="text-primary">offers</span>
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            Everything you need to go from a CV to a shortlist of internships and entry-level jobs that fit.
          </p>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="bg-surface-container-low/60 py-16 md:py-20">
      <div className="container-page grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {services.map(({ icon: Icon, title, text, tone, note }, i) => (
          <Reveal key={title} delay={(i % 3) * 80}>
            <div className={`group flex h-full flex-col gap-4 rounded-2xl bg-surface-container-lowest p-8 shadow-sm ${CARD}`}>
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${tone}`}>
                <Icon size={24} />
              </span>
              <h3 className="text-headline-sm">{title}</h3>
              <p className="text-body-md text-on-surface-variant">{text}</p>
              {note && (
                <span className="mt-auto w-fit rounded-full bg-surface-container px-2.5 py-1 text-label-sm text-on-surface-variant">
                  {note}
                </span>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function IncludedVsNot() {
  const columns = [
    { title: "What's included", items: included, icon: Check, iconTone: "bg-secondary-fixed/50 text-secondary", bg: "bg-surface-container-lowest" },
    { title: "Not included", items: notIncluded, icon: X, iconTone: "bg-surface-container-highest text-on-surface-variant", bg: "bg-surface-container-low" },
  ];
  return (
    <section className="container-page py-20 md:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Scope"
          title="What's included, and what's not"
          text="This first version is focused on doing a few things well."
        />
      </Reveal>
      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {columns.map((c, i) => (
          <Reveal key={c.title} delay={i * 100}>
            <div className={`h-full rounded-2xl p-8 shadow-sm md:p-10 ${c.bg} ${CARD}`}>
              <h3 className="text-headline-sm">{c.title}</h3>
              <ul className="mt-6 flex flex-col gap-4">
                {c.items.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-body-md text-on-surface">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${c.iconTone}`}>
                      <c.icon size={14} strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ResultsPreview() {
  return (
    <section className="bg-surface-container-low/60 py-20 md:py-28">
      <div className="container-page flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="Preview"
            title="What a recommendation looks like"
            text="Sample data only. Real results appear after you upload your CV and choose an interest."
          />
        </Reveal>

        <Reveal>
          <div className={`mx-auto flex max-w-3xl flex-col gap-6 rounded-2xl bg-surface-container-lowest p-6 shadow-md md:p-8 ${CARD}`}>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div className="flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-container text-headline-sm text-on-primary">
                  SC
                </span>
                <div>
                  <p className="text-body-sm text-on-surface-variant">Sample Company</p>
                  <h3 className="text-headline-sm">Junior Frontend Developer</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-md bg-surface-container px-2 py-0.5 text-label-sm text-primary">Frontend Development</span>
                    <span className="rounded-md bg-surface-container px-2 py-0.5 text-label-sm text-primary">Internship</span>
                  </div>
                </div>
              </div>
              <span className="w-fit shrink-0 rounded-xl bg-secondary-container/30 px-4 py-2 text-label-md font-bold text-secondary">
                82% match
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2 rounded-xl bg-surface-container-low p-4">
                <span className="flex items-center gap-1.5 text-label-md text-secondary">
                  <Check size={16} /> Matched required skills
                </span>
                <div className="flex flex-wrap gap-2">
                  {matchedSkills.map((s) => (
                    <span key={s} className="rounded-full bg-secondary-fixed/40 px-3 py-1 text-label-md text-on-secondary-fixed-variant">{s}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 rounded-xl bg-surface-container-low p-4">
                <span className="flex items-center gap-1.5 text-label-md text-tertiary">
                  <Info size={16} /> Not found in your profile
                </span>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((s) => (
                    <span key={s} className="rounded-full bg-tertiary-fixed px-3 py-1 text-label-md text-on-tertiary-fixed-variant">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-outline-variant/40 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-body-sm text-on-surface-variant">
                Education: requirement met &bull; Experience: no experience required
              </p>
              <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary-container px-5 py-2.5 text-label-md text-on-primary">
                Apply on original page <ExternalLink size={16} />
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="container-page py-16 md:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-container to-inverse-surface p-8 text-center text-white shadow-2xl md:p-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-secondary/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-primary-fixed/20 blur-3xl" />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
            <h2 className="text-headline-lg md:text-display-hero">Ready to find your match?</h2>
            <p className="max-w-xl text-body-lg text-primary-fixed">
              Create your account, upload your CV, and see how your skills line up with internships and entry-level jobs.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Button href={AUTH_LINKS.signup} variant="light">
                Sign Up <ArrowRight size={18} />
              </Button>
              <Button href="/#how-it-works" variant="glass">See How It Works</Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ---------- page ----------
export default function ServicesPage() {
  return (
    <>
      <PageHeader />
      <Services />
      <IncludedVsNot />
      <ResultsPreview />
      <CTA />
    </>
  );
}