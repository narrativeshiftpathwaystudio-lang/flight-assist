import type { ReactNode } from "react";

interface TopicSectionProps {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}

export function TopicSection({ eyebrow, title, intro, children }: TopicSectionProps) {
  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-clay-700">{eyebrow}</span>
      <h2 className="mt-2 font-serif text-2xl text-navy-900">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">{intro}</p>
      <div className="mt-6 flex flex-col gap-5">{children}</div>
    </div>
  );
}

export function StepList({ steps }: { steps: Array<{ title: string; body: string }> }) {
  return (
    <ol className="flex flex-col gap-4">
      {steps.map((step, i) => (
        <li key={step.title} className="flex gap-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sand-100 font-serif text-sm text-navy-900">
            {i + 1}
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">{step.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function PointList({ points }: { points: Array<{ title: string; body: string }> }) {
  return (
    <ul className="flex flex-col gap-4">
      {points.map((point) => (
        <li key={point.title} className="border-l-2 border-sand-200 pl-4">
          <p className="text-sm font-semibold text-ink">{point.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{point.body}</p>
        </li>
      ))}
    </ul>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-forest-900 p-6 sm:p-8">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-2 select-none font-serif text-7xl leading-none text-clay-400/40 sm:text-8xl"
      >
        &ldquo;
      </span>
      <p className="relative mt-6 font-serif text-lg leading-relaxed text-sand-50 sm:mt-8 sm:text-xl">{children}</p>
    </div>
  );
}
