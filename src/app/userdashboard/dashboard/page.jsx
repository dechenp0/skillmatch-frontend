"use client";
import { useUser } from "@/components/dashboardcomponents/UserContext";

// Same lift + shadow on every card so hover feels consistent across pages
const CARD = "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg";

const steps = [
  { title: "Upload your PDF CV", text: "Add a text-based PDF so we can read your skills.", done: false },
  { title: "Review your profile", text: "Correct anything the system missed.", done: false },
  { title: "Choose a career interest", text: "UI/UX, Frontend or Backend.", done: false },
  { title: "Run Match My Skills", text: "See ranked jobs and what to improve.", done: false },
];

const stats = [
  { label: "Latest match score", value: "--", hint: "Run your first match to see it here" },
  { label: "Matches run", value: "0", hint: "Your match history will appear here" },
  { label: "Skills in profile", value: "0", hint: "Skills are detected from your CV" },
];

export default function DashboardPage() {
  const user = useUser();
  const firstName = user.name.split(" ")[0];
  const doneCount = steps.filter((s) => s.done).length;
  const progress = (doneCount / steps.length) * 100;
  const nextIndex = steps.findIndex((s) => !s.done);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <div>
        <h1 className="text-headline-md">Welcome back, {firstName}</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          This is where your job matches will appear. First, let&rsquo;s get your profile ready.
        </p>
      </div>

      <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm md:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-headline-sm">Get started</h2>
            <p className="mt-1 text-body-sm text-on-surface-variant">Complete these steps to see your first matches.</p>
          </div>
          <div className="w-full sm:w-56">
            <div className="mb-1.5 flex items-center justify-between text-label-md">
              <span>{doneCount} of {steps.length} done</span>
              <span className="text-primary">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-container">
              <div className="h-2 rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <ol className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((s, i) => {
            const isNext = i === nextIndex;
            return (
              <li
                key={s.title}
                className={`flex flex-col gap-3 rounded-xl p-4 ${CARD} ${
                  isNext ? "bg-primary-fixed/40" : "bg-surface-container-low"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-label-md ${
                      isNext ? "bg-primary text-on-primary" : "bg-surface-container-high text-outline"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {isNext && (
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-label-sm text-on-primary">Next</span>
                  )}
                </div>
                <div>
                  <h3 className={`text-title-md ${isNext ? "text-primary" : "text-on-surface"}`}>{s.title}</h3>
                  <p className="mt-1 text-body-sm text-on-surface-variant">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-6 text-body-sm text-outline">CV upload and matching are coming in the next updates.</p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className={`flex flex-col gap-2 rounded-2xl bg-surface-container-lowest p-6 shadow-sm ${CARD}`}>
            <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">{s.label}</span>
            <span className="text-stat-counter text-on-surface">{s.value}</span>
            <span className="text-body-sm text-outline">{s.hint}</span>
          </div>
        ))}
      </section>
    </div>
  );
}