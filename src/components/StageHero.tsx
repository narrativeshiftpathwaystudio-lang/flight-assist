import { PhotoPlaceholder } from "./PhotoPlaceholder";

interface StageHeroProps {
  step: string;
  name: string;
  tagline: string;
  photoLabel: string;
  photoSrc?: string;
}

export function StageHero({ step, name, tagline, photoLabel, photoSrc }: StageHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <PhotoPlaceholder
        label={photoLabel}
        src={photoSrc}
        className="absolute inset-0 object-[center_75%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/30 to-navy-950/0" />
      <div className="relative mx-auto flex min-h-[420px] max-w-6xl flex-col justify-end px-6 py-14 lg:px-10">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sand-200">{step}</span>
        <h1 className="mt-3 font-serif text-4xl text-white sm:text-5xl">{name}</h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-sand-100">{tagline}</p>
      </div>
    </section>
  );
}
