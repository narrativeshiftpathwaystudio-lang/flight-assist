import { Link } from "react-router-dom";
import type { Stage } from "../data/stages";
import { PhotoPlaceholder } from "./PhotoPlaceholder";

export function StageCard({ stage }: { stage: Stage }) {
  return (
    <Link
      to={stage.path}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]"
    >
      <PhotoPlaceholder label={stage.photoLabel} src={stage.cardPhotoSrc} className="aspect-[4/3] w-full" />
      <div className="flex flex-1 flex-col gap-2 p-6">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-clay-700">{stage.step}</span>
        <h3 className="font-serif text-xl text-navy-900">{stage.name}</h3>
        <p className="text-sm leading-relaxed text-ink-soft">{stage.description}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-navy-800 transition-transform group-hover:translate-x-0.5">
          Explore
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
