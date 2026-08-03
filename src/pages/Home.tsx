import { Link } from "react-router-dom";
import { stages } from "../data/stages";
import { StageCard } from "../components/StageCard";
import { PhotoPlaceholder } from "../components/PhotoPlaceholder";
import gatePhoto from "../assets/gate.jpg";
import { Reveal } from "../components/Reveal";
import { FlightPathDivider } from "../components/FlightPathDivider";
import { TripReminderBanner } from "../components/TripReminderBanner";
import { SpeechIcon, CompassIcon, ShieldIcon } from "../components/icons";

const features = [
  {
    icon: SpeechIcon,
    title: "Plain language, always",
    body: "If we use a term like \"layover\" or \"boarding group,\" we explain what it actually means for you — never assumed knowledge.",
  },
  {
    icon: CompassIcon,
    title: "Organized by what's happening",
    body: "Content is grouped by where you are in your trip, not buried in a long feature list.",
  },
  {
    icon: ShieldIcon,
    title: "Built to lower the stakes",
    body: "Checklists and simple explanations so you can prepare ahead of time, instead of guessing in the moment.",
  },
];

export function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <PhotoPlaceholder
          label="Photo: traveler at a gate, calm, natural light"
          src={gatePhoto}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/40 to-navy-950/10" />
        <div className="relative mx-auto flex min-h-[560px] max-w-6xl flex-col justify-end px-6 py-16 lg:px-10 lg:py-24">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sand-200">
            For first-time and nervous travelers
          </span>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            Travel, explained one step at a time.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-sand-100 sm:text-lg">
            No jargon, no assumptions. Just clear, reassuring guidance for every stage of your trip — from packing
            your bag to walking out of the arrivals hall.
          </p>
          <div className="mt-8">
            <Link
              to="/before-you-go"
              className="inline-flex items-center gap-2 rounded-full bg-clay-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-clay-600"
            >
              Start with your packing list
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <TripReminderBanner />

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-clay-700">
              How this works
            </span>
            <h2 className="mt-3 font-serif text-3xl text-navy-900 sm:text-4xl">
              Every trip moves through four stages. We'll walk you through each one.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              You don't need to know the vocabulary or the unwritten rules. Pick a stage below and we'll explain what's
              actually happening, in plain language.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage, i) => (
            <Reveal key={stage.id} delay={i * 90}>
              <StageCard stage={stage} />
            </Reveal>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <FlightPathDivider />
      </div>

      <section className="bg-cream-dark">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 lg:grid-cols-3 lg:px-10 lg:py-20">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 90}>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sand-100">
                <feature.icon className="h-4 w-4 text-clay-600" />
              </div>
              <h3 className="mt-4 font-serif text-xl text-navy-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{feature.body}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
