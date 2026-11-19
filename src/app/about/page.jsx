"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Flag, Route, Search, Scale, ClipboardCheck, Eye, Lock, GraduationCap, Zap,
  Briefcase, Building2, Send, Check, X, User, Landmark, Layers,
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
const problemPoints = [
  { title: "No feedback", text: "Rejections rarely say whether the gap was a skill, experience or something else." },
  { title: "Unclear requirements", text: "Some entry-level listings ask for experience a beginner cannot have yet." },
  { title: "Scattered effort", text: "Without a clear picture, it is hard to choose which roles are worth your time." },
];

const solutionPoints = [
  { title: "Side-by-side comparison", text: "Your profile is compared with a job's required skills, education and experience." },
  { title: "Fair to beginners", text: "Academic projects, internships and work experience are kept separate." },
  { title: "Clarity before you apply", text: "See matched skills and skills not found in your profile first." },
];

const approach = [
  {
    icon: Search, title: "Explainable", tone: "bg-primary-fixed text-primary",
    text: "Matched skills and skills not found in your profile are shown for every job, so you can see why it ranked where it did.",
    tags: [["Matched: Python", "bg-secondary-fixed/40 text-on-secondary-fixed-variant"], ["Not found: Redis", "bg-tertiary-fixed text-on-tertiary-fixed-variant"]],
  },
  {
    icon: Scale, title: "Fair to beginners", tone: "bg-secondary-fixed/50 text-secondary",
    text: "Academic projects, internships and professional experience are treated separately. Jobs that need no experience do not penalize freshers.",
    tags: [["Projects counted separately", "bg-surface-container text-on-surface-variant"], ["Fresher-friendly roles", "bg-surface-container text-on-surface-variant"]],
  },
  {
    icon: ClipboardCheck, title: "Honest", tone: "bg-tertiary-fixed text-tertiary",
    text: "The percentage is a profile-to-job match score, not a hiring probability. It shows overlap, not whether you are qualified.",
    tags: [["Not a hiring prediction", "bg-surface-container text-on-surface-variant"]],
  },
];

const values = [
  { icon: Eye, title: "Transparency", text: "Every score comes with the reasons behind it.", tone: "text-primary" },
  { icon: Lock, title: "Privacy", text: "Your CV and profile are only accessible from your own account.", tone: "text-secondary" },
  { icon: GraduationCap, title: "Student-first", text: "Built for students and graduates with limited experience.", tone: "text-primary" },
  { icon: Zap, title: "Simplicity", text: "A short, clear path from CV upload to recommendations.", tone: "text-tertiary" },
];

const notList = [
  { icon: Briefcase, title: "Not a recruitment platform", text: "We do not hire, place or broker candidates." },
  { icon: Building2, title: "No employer accounts", text: "Employers cannot register, post jobs or pay for better rankings." },
  { icon: Send, title: "No automatic applications", text: "You apply yourself on the original job page. We never apply for you." },
];

const projectInfo = [
  { icon: User, label: "Developer", value: "[Developer name]" },
  { icon: GraduationCap, label: "Program", value: "Bachelor of Computer Applications (BCA)" },
  { icon: Landmark, label: "Institution", value: "[College name]" },
  { icon: Layers, label: "Technology", value: "Next.js, Django REST Framework, TF-IDF" },
];

// ---------- page sections ----------
function PageHeader() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[350px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary-fixed/50 via-surface-container-highest/20 to-transparent blur-3xl" />
      <div className="container-page pb-16 pt-12 md:pb-20 md:pt-16">
        <div className="flex max-w-3xl flex-col items-start gap-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-fixed/70 px-3 py-1 text-label-sm uppercase tracking-wider text-on-primary-fixed-variant">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            About the platform
          </span>
          <h1 className="text-headline-lg lg:text-display-hero">
            About <span className="text-primary">MatchYourSkills</span>
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            A recommendation platform that helps students and recent graduates see how their CV matches internships and entry-level jobs, and what to improve next.
          </p>
        </div>
      </div>
    </section>
  );
}

function SampleCard() {
  const rows = [
    { dot: "bg-secondary", label: "Matched required skills", value: "6 of 7" },
    { dot: "bg-tertiary", label: "Not found in your profile", value: "1 skill" },
    { dot: "bg-primary-container", label: "Education", value: "Requirement met" },
  ];
  return (
    <div className={`flex flex-col gap-5 rounded-2xl bg-surface-container-lowest p-6 shadow-sm ${CARD}`}>
      <div className="flex items-center justify-between">
        <span className="text-title-md">How a result is explained</span>
        <span className="rounded-full bg-secondary-fixed/50 px-2.5 py-0.5 text-label-sm text-secondary">Sample</span>
      </div>

      <div className="flex items-center justify-center rounded-xl bg-surface-container p-5">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="40" fill="none" strokeWidth="8" className="stroke-surface-container-high" />
            <circle
              cx="50" cy="50" r="40" fill="none" strokeWidth="8" strokeLinecap="round"
              strokeDasharray="251.2" strokeDashoffset="45.2" className="gauge-ring stroke-primary-container"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-stat-counter leading-none">82<span className="text-headline-sm text-primary-container">%</span></span>
            <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-outline">Match</span>
          </div>
        </div>
      </div>

      <ul className="flex flex-col gap-2 text-body-sm">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center justify-between rounded bg-surface-container-low px-3 py-2">
            <span className="flex items-center gap-2 text-on-surface-variant">
              <span className={`h-2 w-2 rounded-full ${r.dot}`} /> {r.label}
            </span>
            <span className="font-semibold text-on-surface">{r.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Mission() {
  const mini = [
    { icon: Search, title: "See requirements clearly", text: "Job requirements become a simple checklist you can compare with your profile.", tone: "text-primary" },
    { icon: Route, title: "Know what to learn next", text: "Skills not found in your profile show where to focus your learning.", tone: "text-secondary" },
  ];
  return (
    <section className="bg-surface-container-low py-16 md:py-20">
      <div className="container-page grid items-center gap-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <div className={`group flex flex-col gap-6 rounded-2xl bg-surface-container-lowest p-8 shadow-sm md:p-10 ${CARD}`}>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-fixed text-primary transition-transform duration-300 group-hover:scale-110">
              <Flag size={24} />
            </span>
            <div className="flex flex-col gap-3">
              <h2 className="text-headline-md">Our mission</h2>
              <p className="text-headline-sm text-primary">
                Help students with limited experience understand how their qualifications match opportunities and which skills to improve.
              </p>
            </div>
            <p className="text-body-md text-on-surface-variant">
              Job listings can be hard to read when you are just starting out. MatchYourSkills compares your CV with internships and entry-level jobs, and shows what you already match and what you could build next.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {mini.map(({ icon: Icon, title, text, tone }) => (
                <div key={title} className="flex flex-col gap-1 rounded-lg bg-surface-container-low p-4">
                  <div className={`flex items-center gap-2 text-title-md ${tone}`}>
                    <Icon size={18} /> {title}
                  </div>
                  <p className="text-body-sm text-on-surface-variant">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-5">
          <SampleCard />
        </Reveal>
      </div>
    </section>
  );
}

function ProblemSolution() {
  const cards = [
    { badge: "The problem", badgeTone: "bg-error-container text-error", icon: X, iconTone: "bg-error-container text-error", title: "Applying without knowing where you stand", points: problemPoints },
    { badge: "The solution", badgeTone: "bg-secondary-fixed text-secondary", icon: Check, iconTone: "bg-secondary-fixed/50 text-secondary", title: "Transparent, explainable matching", points: solutionPoints },
  ];
  return (
    <section className="container-page py-20 md:py-28">
      <Reveal>
        <SectionHeading eyebrow="Why we built it" title="Why finding a first job is hard" />
      </Reveal>
      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {cards.map((c, i) => (
          <Reveal key={c.badge} delay={i * 100}>
            <div className={`flex h-full flex-col gap-5 rounded-2xl bg-surface-container-lowest p-8 shadow-sm md:p-10 ${CARD}`}>
              <span className={`w-fit rounded-md px-2.5 py-1 text-label-md ${c.badgeTone}`}>{c.badge}</span>
              <h3 className="text-headline-md">{c.title}</h3>
              <ul className="flex flex-col gap-3">
                {c.points.map((p) => (
                  <li key={p.title} className="flex items-start gap-3 rounded-lg bg-surface-container-low p-4">
                    <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${c.iconTone}`}>
                      <c.icon size={14} strokeWidth={3} />
                    </span>
                    <p className="text-body-sm text-on-surface-variant">
                      <strong className="text-on-surface">{p.title}.</strong> {p.text}
                    </p>
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

function Approach() {
  return (
    <section className="bg-surface-container-low/60 py-20 md:py-28">
      <div className="container-page flex flex-col gap-14">
        <Reveal>
          <SectionHeading eyebrow="Our approach" title="How we think about matching" text="Three principles shape every recommendation." />
        </Reveal>
        <div className="grid gap-8 md:grid-cols-3">
          {approach.map(({ icon: Icon, title, text, tone, tags }, i) => (
            <Reveal key={title} delay={i * 100}>
              <div className={`group flex h-full flex-col gap-4 rounded-2xl bg-surface-container-lowest p-8 shadow-sm ${CARD}`}>
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${tone}`}>
                  <Icon size={24} />
                </span>
                <h3 className="text-headline-sm">{title}</h3>
                <p className="text-body-md text-on-surface-variant">{text}</p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                  {tags.map(([label, cls]) => (
                    <span key={label} className={`rounded-full px-2.5 py-1 text-label-sm ${cls}`}>{label}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Values() {
  return (
    <section className="container-page py-20 md:py-28">
      <Reveal>
        <SectionHeading eyebrow="Our values" title="What we care about" />
      </Reveal>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {values.map(({ icon: Icon, title, text, tone }, i) => (
          <Reveal key={title} delay={i * 80}>
            <div className={`group flex h-full flex-col gap-3 rounded-2xl bg-surface-container-lowest p-6 shadow-sm ${CARD}`}>
              <span className={`flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high transition-transform duration-300 group-hover:scale-110 ${tone}`}>
                <Icon size={22} />
              </span>
              <h3 className="text-headline-sm">{title}</h3>
              <p className="text-body-sm text-on-surface-variant">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function WhatWeAreNot() {
  return (
    <section className="container-page pb-20 md:pb-28">
      <Reveal>
        <div className="rounded-2xl bg-surface-container-high p-8 md:p-10">
          <h3 className="text-headline-md">What MatchYourSkills is not</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {notList.map(({ icon: Icon, title, text }) => (
              <div key={title} className={`group flex flex-col gap-2 rounded-xl bg-surface-container-lowest p-5 ${CARD}`}>
                <div className="flex items-center gap-2 text-title-md">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary transition-transform duration-300 group-hover:scale-110">
                    <Icon size={18} />
                  </span>
                  {title}
                </div>
                <p className="text-body-sm text-on-surface-variant">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
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
              <Button href="/" variant="glass">Back to Home</Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ---------- page ----------
export default function AboutPage() {
  return (
    <>
      <PageHeader />
      <Mission />
      <ProblemSolution />
      <Approach />
      <Values />
      <WhatWeAreNot />
      <CTA />
    </>
  );
}