"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, ChevronDown, Check, Info, Lock, ShieldCheck, Eye,
  Palette, Code, Server, FileSearch, PencilLine, Gauge, ListChecks, Search,
  GraduationCap, BookOpen, Award, Shuffle, EyeOff, SlidersHorizontal, ExternalLink,
} from "lucide-react";

const AUTH_LINKS = {
  login: "/auth/login",
  signup: "/auth/signup",
};

const FAQS = [
  {
    q: "Do I need a text-based PDF?",
    a: "Yes. The first version reads text-based PDF CVs. If your PDF is a scan or an image, you will get a clear message that the text could not be extracted, and you can upload a text-based version instead.",
  },
  {
    q: "Does MatchYourSkills post jobs?",
    a: "No. MatchYourSkills is a recommendation platform, not a recruitment platform. There are no employer accounts. Recommendations link to the original job page, where you complete your application.",
  },
  {
    q: "How are match scores calculated?",
    a: "The score combines four parts: skill coverage, text similarity (TF-IDF and cosine similarity), education fit and experience fit. Skills carry the most weight. Every part is shown in your results so you can see why a job ranked where it did.",
  },
  {
    q: "Is my CV public?",
    a: "No. Your CV and profile are private to your account. Uploaded files are not available through public links.",
  },
  {
    q: "How do I apply?",
    a: "Open a recommended job and follow its original application link. If a listing publishes an application email, we show it. We never apply on your behalf.",
  },
];


// ---------- small reusable pieces ----------
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

// Fades children up once when they scroll into view. Respects reduced motion via globals.css.
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

function SectionHeading({ eyebrow, title, text, center = true, tone = "primary" }) {
  const eyebrowColor = tone === "secondary" ? "text-secondary" : "text-primary";
  return (
    <div className={`flex flex-col gap-3 ${center ? "items-center text-center" : "items-start"}`}>
      {eyebrow && (
        <span className={`text-label-sm uppercase tracking-wider ${eyebrowColor}`}>{eyebrow}</span>
      )}
      <h2 className="text-headline-md md:text-headline-lg text-on-surface">{title}</h2>
      {text && <p className="max-w-2xl text-body-lg text-on-surface-variant">{text}</p>}
    </div>
  );
}

function Accordion({ items }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="rounded-xl bg-surface-container-lowest p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 text-left text-title-md text-on-surface"
            >
              <span>{item.q}</span>
              <ChevronDown
                size={20}
                className={`shrink-0 text-outline transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              id={`faq-panel-${i}`}
              className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] pt-3" : "grid-rows-[0fr]"}`}
            >
              <p className="overflow-hidden text-body-md text-on-surface-variant">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- page sections ----------
const matched = ["Python", "SQL", "REST APIs", "Git", "Data Structures"];
const missing = ["Docker", "AWS", "CI/CD"];

function ScoreCard() {
  return (
    <div className="relative w-full">
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-secondary-fixed/30 via-primary-fixed/30 to-tertiary-fixed/30 blur-2xl" />
      <div className="flex flex-col gap-6 rounded-2xl bg-surface-container-lowest p-6 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.1)] md:p-8">
        <div className="-mx-6 -mt-6 flex items-start justify-between gap-4 rounded-t-2xl bg-surface-container-low/60 p-6 md:-mx-8 md:-mt-8 md:p-8 md:pb-6">
          <div>
            <h3 className="text-headline-sm text-on-surface">Junior Backend Developer</h3>
            <p className="text-body-sm text-outline">Backend Development &bull; Entry level</p>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-surface-container px-2.5 py-1 text-label-sm text-on-surface-variant">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" /> Sample
          </span>
        </div>

        <div className="flex flex-col items-center gap-6 rounded-xl bg-surface-container-low/70 p-5 sm:flex-row">
          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="40" fill="none" strokeWidth="8" className="stroke-surface-container-high" />
              <circle
                cx="50" cy="50" r="40" fill="none" strokeWidth="8" strokeLinecap="round"
                strokeDasharray="251.2" strokeDashoffset="45.2"
                className="gauge-ring stroke-secondary"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-stat-counter leading-none">82<span className="text-headline-sm text-secondary">%</span></span>
              <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-outline">Match</span>
            </div>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-title-md font-bold text-secondary">Strong profile match</p>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              Profile-to-job match score based on skills, text similarity, education and experience.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="flex items-center gap-1.5 text-title-md">
            <Check size={18} className="text-secondary" /> Matched skills ({matched.length})
          </span>
          <div className="flex flex-wrap gap-2">
            {matched.map((s) => (
              <span key={s} className="rounded-full bg-secondary-fixed/40 px-3 py-1 text-label-md text-on-secondary-fixed-variant">{s}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="flex items-center gap-1.5 text-title-md">
            <Info size={18} className="text-tertiary" /> Not found in your profile ({missing.length})
          </span>
          <div className="flex flex-wrap gap-2">
            {missing.map((s) => (
              <span key={s} className="rounded-full bg-tertiary-fixed px-3 py-1 text-label-md text-on-tertiary-fixed-variant">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[480px] w-[980px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary-fixed/60 via-secondary-container/20 to-transparent blur-3xl" />
      <div className="container-page grid items-center gap-12 pb-20 pt-12 md:pb-28 md:pt-16 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col items-start gap-6 lg:col-span-7">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-fixed/70 px-3 py-1 text-label-sm uppercase tracking-wider text-on-primary-fixed-variant">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            For students and fresh graduates
          </span>

          <h1 className="max-w-2xl text-headline-lg lg:text-display-hero">
            Match your skills to the <span className="text-primary">right internship</span> or first job.
          </h1>

          <p className="max-w-xl text-body-lg text-on-surface-variant">
            Upload your CV, choose your career interest, and get explainable job recommendations that show what you match and what to improve.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button href={AUTH_LINKS.signup} size="lg">
              Get Started &ndash; Sign Up <ArrowRight size={18} />
            </Button>
            <Button href="#how-it-works" variant="secondary" size="lg">
              See How It Works <ChevronDown size={18} className="text-on-surface-variant" />
            </Button>
          </div>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-body-sm text-outline">
            <li className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-secondary" /> Free for students</li>
            <li className="flex items-center gap-1.5"><Lock size={16} className="text-secondary" /> Private CV storage</li>
            <li className="flex items-center gap-1.5"><Eye size={16} className="text-secondary" /> Explainable scoring</li>
          </ul>
        </div>

        <div className="lg:col-span-5">
          <ScoreCard />
        </div>
      </div>
    </section>
  );
}

const tracks = [
  { icon: Palette, title: "UI/UX Design", text: "User research, interaction flows, wireframing and design systems.", tags: ["Figma", "Wireframes", "Prototyping"], tone: "bg-primary-fixed text-primary" },
  { icon: Code, title: "Frontend Development", text: "HTML, CSS, JavaScript, React and responsive web interfaces.", tags: ["React", "JavaScript", "Tailwind CSS"], tone: "bg-secondary-fixed/50 text-secondary" },
  { icon: Server, title: "Backend Development", text: "APIs, databases, server logic and authentication.", tags: ["Python", "PostgreSQL", "REST"], tone: "bg-tertiary-fixed text-tertiary" },
];

function CareerTracks() {
  return (
    <section className="bg-surface-container-low/60 py-16 md:py-20">
      <div className="container-page flex flex-col gap-10">
        <Reveal>
          <SectionHeading
            eyebrow="Career interests"
            title="Choose your focus area"
            text="Pick the direction you want, and your profile is compared only with internships and entry-level roles in that category."
          />
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {tracks.map(({ icon: Icon, title, text, tags, tone }, i) => (
            <Reveal key={title} delay={i * 80}>
              <div className="group flex h-full flex-col justify-between gap-6 rounded-2xl bg-surface-container-lowest p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                <div className="flex flex-col gap-4">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${tone}`}>
                    <Icon size={26} />
                  </span>
                  <div>
                    <h3 className="text-headline-sm">{title}</h3>
                    <p className="mt-2 text-body-md text-on-surface-variant">{text}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span key={t} className="rounded-md bg-surface-container px-2.5 py-0.5 text-label-sm text-on-surface-variant">{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="text-center text-body-sm text-outline">More categories coming soon.</p>
      </div>
    </section>
  );
}

const steps = [
  { title: "Create your account", text: "Sign up and complete your basic profile." },
  { title: "Upload your PDF CV", text: "We read the text and detect skills, education, projects and experience." },
  { title: "Review and correct", text: "Edit anything the system missed or got wrong before matching." },
  { title: "Choose your interest", text: "Select a career category and click \u201CMatch My Skills\u201D." },
  { title: "Apply on the original page", text: "See ranked jobs with score details, then apply on the job's own page." },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="container-page py-20 md:py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Five simple steps"
          title="How MatchYourSkills works"
          text="You stay in control of your profile at every step."
        />
      </Reveal>

      <div className="relative mt-16">
        <div className="absolute left-12 right-12 top-7 hidden h-0.5 bg-surface-container-highest lg:block" />
        <ol className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 100}>
              <li className="group flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-headline-sm font-extrabold transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110 ${
                    i === 0
                      ? "bg-primary text-on-primary shadow-[0_4px_14px_rgba(79,70,229,0.35)]"
                      : i === steps.length - 1
                      ? "bg-secondary text-white shadow-[0_4px_14px_rgba(0,107,95,0.3)]"
                      : "bg-surface-container-highest text-primary"
                  }`}
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-headline-sm">{s.title}</h3>
                  <p className="mt-2 text-body-sm text-on-surface-variant">{s.text}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

const features = [
  { icon: FileSearch, title: "CV skill extraction", text: "Skills, education, projects and experience are detected from your text-based PDF CV.", tone: "bg-primary-fixed/60 text-primary" },
  { icon: PencilLine, title: "Editable profile", text: "Add, remove or correct extracted items before any recommendation is generated.", tone: "bg-secondary-fixed/50 text-secondary" },
  { icon: Gauge, title: "Match score with explanation", text: "Every percentage comes with the reasons behind it, not just a number.", tone: "bg-tertiary-fixed text-tertiary" },
  { icon: ListChecks, title: "Matched skills", text: "See which required skills from the job are already in your profile.", tone: "bg-secondary-fixed/50 text-secondary" },
  { icon: Search, title: "Skills not found in your profile", text: "Spot required skills worth adding or learning. A skill may simply be missing from your CV, so you can add it.", tone: "bg-tertiary-fixed text-tertiary" },
  { icon: GraduationCap, title: "Education and experience", text: "Compare your education and experience with what the job asks for, when it says.", tone: "bg-primary-fixed/60 text-primary" },
];

function Features() {
  return (
    <section className="bg-surface-container-low/40 py-20 md:py-28">
      <div className="container-page flex flex-col gap-14">
        <Reveal>
          <SectionHeading
            eyebrow="What you get"
            title="Everything you need to find a first role"
            text="Recommendations you can understand, check and act on."
          />
        </Reveal>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text, tone }, i) => (
            <Reveal key={title} delay={(i % 3) * 80}>
              <div className="flex h-full flex-col gap-4 rounded-2xl bg-surface-container-lowest p-8 group shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${tone}`}>
                  <Icon size={24} />
                </span>
                <h3 className="text-headline-sm">{title}</h3>
                <p className="text-body-md text-on-surface-variant">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const factors = [
  { title: "Skill coverage", tag: "Highest importance", tone: "bg-primary-fixed text-primary", text: "How many of the job's required skills appear in your profile." },
  { title: "Text similarity", tag: "TF-IDF + cosine", tone: "bg-secondary-fixed/50 text-secondary", text: "How much the wording of your CV overlaps with the job description. It measures overlap, not meaning." },
  { title: "Education fit", tag: "When specified", tone: "bg-surface-container-high text-on-surface", text: "Your education compared with the job's requirement, if the job states one." },
  { title: "Experience fit", tag: "When specified", tone: "bg-tertiary-fixed text-tertiary", text: "Internships and work experience compared with the job's requirement. Fresher-friendly jobs do not penalize you." },
];

function ScoreExplainer() {
  return (
    <section className="container-page py-20 md:py-28">
      <Reveal>
        <SectionHeading
          tone="secondary"
          eyebrow="Transparent scoring"
          title="How the match score works"
          text="The score combines four parts. Parts a job does not specify are left out instead of counted against you."
        />
      </Reveal>

      <div className="mb-12 mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {factors.map((f, i) => (
          <Reveal key={f.title} delay={i * 80}>
            <div className="group flex h-full flex-col gap-3 rounded-2xl bg-surface-container-lowest p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-title-md font-bold transition-transform duration-300 group-hover:scale-110 ${f.tone}`}>{i + 1}</span>
                <span className="text-label-sm text-outline">{f.tag}</span>
              </div>
              <h3 className="mt-1 text-headline-sm">{f.title}</h3>
              <p className="text-body-sm text-on-surface-variant">{f.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="flex items-start gap-4 rounded-2xl bg-surface-container-low p-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-fixed/50 text-secondary">
            <Info size={20} />
          </span>
          <div>
            <p className="text-title-md">Not a hiring prediction</p>
            <p className="text-body-sm text-on-surface-variant">
              The score shows how well your profile matches a job. It does not predict whether you will be hired.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

const groups = [
  { icon: BookOpen, title: "Undergraduate students", text: "Build your profile from coursework, projects and internships. No years of experience required.", tone: "bg-primary-fixed/50 text-primary" },
  { icon: Award, title: "Recent graduates", text: "See how your degree and final-year projects line up with entry-level openings.", tone: "bg-secondary-fixed/50 text-secondary" },
  { icon: Shuffle, title: "Career switchers into tech", text: "Find out which of your skills already fit, and which ones to build next.", tone: "bg-tertiary-fixed text-tertiary" },
];

function Audience() {
  return (
    <section className="bg-surface-container-low/60 py-20 md:py-28">
      <div className="container-page flex flex-col gap-12">
        <Reveal>
          <SectionHeading eyebrow="Who it's for" title="Built for people at the start of their career" />
        </Reveal>
        <div className="grid gap-8 md:grid-cols-3">
          {groups.map(({ icon: Icon, title, text, tone }, i) => (
            <Reveal key={title} delay={i * 80}>
              <div className="group flex h-full flex-col gap-4 rounded-2xl bg-surface-container-lowest p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${tone}`}>
                  <Icon size={28} />
                </span>
                <h3 className="text-headline-sm">{title}</h3>
                <p className="text-body-md text-on-surface-variant">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const pillars = [
  { icon: EyeOff, title: "Your CV stays private", text: "Your CV and profile are only accessible from your own account. Uploaded files are not shared through public links." },
  { icon: SlidersHorizontal, title: "You can correct extracted data", text: "Extraction is not perfect. Review your profile and fix it before you generate recommendations." },
  { icon: ExternalLink, title: "We never apply for you", text: "You apply yourself on the original job page. We do not send applications or emails on your behalf." },
];

function Privacy() {
  return (
    <section className="container-page py-20 md:py-28">
      <Reveal>
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-fixed/40 text-secondary">
            <ShieldCheck size={26} />
          </span>
          <h2 className="text-headline-md md:text-headline-lg">Privacy and trust</h2>
          <p className="max-w-xl text-body-lg text-on-surface-variant">You decide what your profile says.</p>
        </div>
      </Reveal>
      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {pillars.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 80}>
            <div className="group flex h-full flex-col gap-4 rounded-2xl bg-surface-container-lowest p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-high text-primary transition-transform duration-300 group-hover:scale-110">
                <Icon size={22} />
              </span>
              <h3 className="text-headline-sm">{title}</h3>
              <p className="text-body-md text-on-surface-variant">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="bg-surface-container-low/40 py-20 md:py-28">
      <div className="mx-auto flex max-w-[960px] flex-col gap-10 px-4 md:px-8">
        <Reveal>
          <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        </Reveal>
        <Reveal>
          <Accordion items={FAQS} />
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
              Create your account, upload your CV, and see how your skills line up with real internships and entry-level jobs.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Button href={AUTH_LINKS.signup} variant="light" size="lg">
                Sign Up <ArrowRight size={18} />
              </Button>
              <Button href="#how-it-works" variant="glass" size="lg">See How It Works</Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ---------- page ----------
export default function HomePage() {
  return (
    <>
      <Hero />
      <CareerTracks />
      <HowItWorks />
      <Features />
      <ScoreExplainer />
      <Audience />
      <Privacy />
      <FAQ />
      <CTA />
    </>
  );
}