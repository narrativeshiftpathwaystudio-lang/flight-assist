import { Link } from "react-router-dom";
import { useAuth } from "../lib/useAuth";
import { useTrips } from "../lib/useTrips";
import { getUpcomingTrip } from "../lib/upcomingTrip";
import { combinedProgress } from "../lib/tripProgress";
import { daysUntil } from "../lib/daysUntil";

function countdownText(days: number) {
  if (days === 0) return "today";
  if (days === 1) return "in 1 day";
  return `in ${days} days`;
}

export function TripReminderBanner() {
  const { user } = useAuth();
  const { trips } = useTrips(user);
  const trip = getUpcomingTrip(trips);

  if (!trip) return null;

  const days = daysUntil(trip.startDate)!;
  const { packed, total } = combinedProgress(trip);
  const remaining = total - packed;

  return (
    <section className="mx-auto max-w-6xl px-6 pt-10 lg:px-10">
      <div className="rounded-2xl border border-clay-400/30 bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-clay-700">
          Coming up {countdownText(days)}
        </span>
        <h2 className="mt-2 font-serif text-2xl text-navy-900">
          {trip.destination ? `${trip.name} — ${trip.destination}` : trip.name}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {total === 0
            ? "No checklist items yet — take a look before you go."
            : remaining === 0
              ? "Everything on your checklists is checked off."
              : `${remaining} of ${total} checklist items still need attention.`}
        </p>
        <Link
          to="/before-you-go"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 hover:text-navy-900"
        >
          Review your checklists
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
