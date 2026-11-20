import { Hammer } from "lucide-react";

// Temporary page body. Replace it with the real page when you build that feature.
export default function PagePlaceholder({ title, text }) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <div>
        <h1 className="text-headline-md">{title}</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">{text}</p>
      </div>
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface-container-lowest p-12 text-center shadow-sm">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed/60 text-primary">
          <Hammer size={26} />
        </span>
        <h2 className="text-headline-sm">Coming soon</h2>
        <p className="max-w-sm text-body-md text-on-surface-variant">This page is not built yet.</p>
      </div>
    </div>
  );
}