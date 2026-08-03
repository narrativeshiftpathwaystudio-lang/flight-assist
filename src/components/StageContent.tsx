import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { FlightPathDivider } from "./FlightPathDivider";

interface StageContentProps {
  intro: string;
  sections: ReactNode[];
  callout: ReactNode;
}

export function StageContent({ intro, sections, callout }: StageContentProps) {
  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-14 lg:px-10">
      <p className="drop-cap max-w-2xl text-sm leading-relaxed text-ink-soft">{intro}</p>

      {sections.map((section, i) => (
        <div key={i} className="flex flex-col gap-8">
          {i > 0 && <FlightPathDivider />}
          <Reveal delay={i * 60}>{section}</Reveal>
        </div>
      ))}

      <FlightPathDivider />
      <Reveal>{callout}</Reveal>
    </section>
  );
}
