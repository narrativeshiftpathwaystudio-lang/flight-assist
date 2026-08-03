import { useEffect, useRef, useState } from "react";

type Phase = "inhale" | "hold1" | "exhale" | "hold2";

const PHASE_MS = 4000;

const phaseLabel: Record<Phase, string> = {
  inhale: "Breathe in",
  hold1: "Hold",
  exhale: "Breathe out",
  hold2: "Hold",
};

const nextPhase: Record<Phase, Phase> = {
  inhale: "hold1",
  hold1: "exhale",
  exhale: "hold2",
  hold2: "inhale",
};

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function BreathingExercise() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("inhale");
  const [cycles, setCycles] = useState(0);
  const [reduced] = useState(prefersReducedMotion);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setPhase((prev) => {
        const next = nextPhase[prev];
        if (next === "inhale") setCycles((c) => c + 1);
        return next;
      });
    }, PHASE_MS);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running]);

  function start() {
    setPhase("inhale");
    setCycles(0);
    setRunning(true);
  }

  function stop() {
    setRunning(false);
  }

  const expanded = phase === "inhale" || phase === "hold1";
  const scale = !running ? 0.8 : expanded ? 1 : reduced ? 0.88 : 0.6;

  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-clay-700">Try it</span>
      <h2 className="mt-2 font-serif text-2xl text-navy-900">A minute to breathe</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
        Box breathing is a simple technique for steadying your nervous system in a stressful moment — inhale, hold,
        exhale, hold, four seconds each. It's simple enough to do anywhere, including a departure lounge.
      </p>

      <div className="mt-8 flex flex-col items-center gap-6">
        <div className="flex h-56 w-56 shrink-0 items-center justify-center">
          <div
            className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-forest-500 to-forest-700 text-center ease-in-out"
            style={{
              transform: `scale(${scale})`,
              transitionProperty: "transform",
              transitionDuration: running ? `${PHASE_MS}ms` : "500ms",
            }}
          >
            <span aria-live="polite" className="px-4 text-sm font-medium text-cream">
              {running ? phaseLabel[phase] : "Tap start when you're ready"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {running ? (
            <button
              onClick={stop}
              className="rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-navy-800"
            >
              Stop
            </button>
          ) : (
            <button
              onClick={start}
              className="rounded-full bg-forest-600 px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-forest-700"
            >
              Start breathing
            </button>
          )}
          {running && (
            <span className="text-sm text-ink-soft">
              Cycle {cycles + 1}
            </span>
          )}
          {!running && cycles > 0 && (
            <span className="text-sm text-ink-soft">
              {cycles} {cycles === 1 ? "cycle" : "cycles"} that time
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
