import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTrips } from "../lib/useTrips";
import { useAuth } from "../lib/useAuth";
import { useProfile } from "../lib/useProfile";
import { PhotoPlaceholder } from "../components/PhotoPlaceholder";
import suitcasePhoto from "../assets/suitcase.jpg";
import { TemplatePicker } from "../components/checklist/TemplatePicker";
import { ChecklistProgress } from "../components/checklist/ChecklistProgress";
import { CategorySection } from "../components/checklist/CategorySection";
import { AddItemForm } from "../components/checklist/AddItemForm";
import { TripSwitcher } from "../components/checklist/TripSwitcher";
import { TripNameField } from "../components/checklist/TripNameField";
import { TripDetailsFields } from "../components/checklist/TripDetailsFields";
import { UpgradeCard } from "../components/monetization/UpgradeCard";
import { AuthCard } from "../components/auth/AuthCard";
import { MigrationPrompt } from "../components/checklist/MigrationPrompt";
import { Reveal } from "../components/Reveal";
import { FlightPathDivider } from "../components/FlightPathDivider";

const FREE_TRIP_LIMIT = 1;

const CHECKOUT_POLL_ATTEMPTS = 5;
const CHECKOUT_POLL_INTERVAL_MS = 1500;

export function BeforeYouGo() {
  const { user } = useAuth();
  const { isPremium, refresh, startCheckout } = useProfile(user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [confirmingUpgrade, setConfirmingUpgrade] = useState(false);
  const {
    trips,
    activeTrip,
    template,
    loading,
    localTripsToMigrate,
    migrateLocalTrips,
    dismissMigration,
    createTrip,
    selectTrip,
    renameTrip,
    updateTripDetails,
    deleteTrip,
    toggleItem,
    addItem,
    removeItem,
    progress,
    toggleDocumentItem,
    addDocumentItem,
    removeDocumentItem,
    documentProgress,
    toggleResearchItem,
    addResearchItem,
    removeResearchItem,
    researchProgress,
  } = useTrips(user);
  const [creatingNew, setCreatingNew] = useState(false);

  const checkoutStatus = searchParams.get("checkout");

  useEffect(() => {
    if (checkoutStatus !== "success") return;

    setSearchParams(
      (params) => {
        params.delete("checkout");
        return params;
      },
      { replace: true },
    );

    if (isPremium) return;

    setConfirmingUpgrade(true);
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts += 1;
      await refresh();
      if (attempts >= CHECKOUT_POLL_ATTEMPTS) {
        clearInterval(interval);
        setConfirmingUpgrade(false);
      }
    }, CHECKOUT_POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [checkoutStatus]);

  useEffect(() => {
    if (isPremium) setConfirmingUpgrade(false);
  }, [isPremium]);

  const showMigration = !loading && localTripsToMigrate.length > 0;
  const atFreeLimit = !isPremium && trips.length >= FREE_TRIP_LIMIT;
  const showUpgrade = creatingNew && atFreeLimit;
  const showPicker = !showMigration && (trips.length === 0 || creatingNew) && !showUpgrade;

  function handleSelectTemplate(templateId: string) {
    createTrip(templateId);
    setCreatingNew(false);
  }

  return (
    <>
      <section className="relative overflow-hidden print:hidden">
        <PhotoPlaceholder label="Photo: open suitcase being packed, soft daylight" src={suitcasePhoto} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/30 to-navy-950/0" />
        <div className="relative mx-auto flex min-h-[340px] max-w-6xl flex-col justify-end px-6 py-14 lg:px-10">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sand-200">Stage 1</span>
          <h1 className="mt-3 font-serif text-4xl text-white sm:text-5xl">Before You Go</h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-sand-100">
            Packing, documents, and what's worth looking into before you leave the house.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-14 lg:px-10">
        <div className="print:hidden">
          <h2 className="font-serif text-2xl text-navy-900">Your checklists</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Save separate packing, document, and research checklists for each trip — everything's saved
            automatically.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-3 print:hidden">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.06em] ${
              isPremium ? "bg-forest-600 text-cream" : "bg-sand-100 text-ink-soft"
            }`}
          >
            {isPremium ? "Premium" : "Free plan"}
          </span>
          {confirmingUpgrade && (
            <span className="text-xs font-medium text-ink-soft">Finishing up your upgrade…</span>
          )}
        </div>

        {trips.length > 0 && (
          <div className="mt-6 print:hidden">
            <TripSwitcher
              trips={trips}
              activeTripId={activeTrip?.id ?? null}
              onSelect={(id) => {
                selectTrip(id);
                setCreatingNew(false);
              }}
              onNew={() => setCreatingNew(true)}
            />
          </div>
        )}

        <div className="mt-8">
          {loading ? (
            <p className="text-sm text-ink-soft">Loading your trips…</p>
          ) : showMigration ? (
            <Reveal>
              <MigrationPrompt
                trips={localTripsToMigrate}
                onMigrate={migrateLocalTrips}
                onDismiss={dismissMigration}
              />
            </Reveal>
          ) : showUpgrade ? (
            <Reveal>
              {!user ? (
                <AuthCard />
              ) : (
                <UpgradeCard
                  onUpgrade={() => {
                    startCheckout();
                  }}
                  onCancel={() => setCreatingNew(false)}
                />
              )}
            </Reveal>
          ) : showPicker ? (
            <Reveal>
              <>
                {trips.length > 0 && (
                  <button
                    onClick={() => setCreatingNew(false)}
                    className="mb-6 text-sm font-medium text-ink-soft underline decoration-sand-300 underline-offset-4 hover:text-ink"
                  >
                    ← Back to {activeTrip?.name}
                  </button>
                )}
                <TemplatePicker
                  onSelect={handleSelectTemplate}
                  heading={trips.length > 0 ? "Add another trip" : "Start your packing list"}
                />
              </>
            </Reveal>
          ) : activeTrip && template ? (
            <div className="flex flex-col gap-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <TripNameField value={activeTrip.name} onChange={(name) => renameTrip(activeTrip.id, name)} />
                <div className="flex items-center gap-4 print:hidden">
                  {isPremium && (
                    <button
                      onClick={() => window.print()}
                      className="text-sm font-medium text-clay-700 underline decoration-clay-400/50 underline-offset-4 hover:text-clay-600"
                    >
                      Print / Save as PDF
                    </button>
                  )}
                  {trips.length > 1 && (
                    <button
                      onClick={() => deleteTrip(activeTrip.id)}
                      className="text-sm font-medium text-ink-soft underline decoration-sand-300 underline-offset-4 hover:text-ink"
                    >
                      Delete this trip
                    </button>
                  )}
                </div>
              </div>

              <TripDetailsFields
                trip={activeTrip}
                onUpdate={(patch) => updateTripDetails(activeTrip.id, patch)}
              />

              <div className="flex flex-col gap-6">
                <h3 className="font-serif text-xl text-navy-900">Packing</h3>
                <div className="print:hidden">
                  <ChecklistProgress packed={progress.packed} total={progress.total} />
                </div>

                {template.categories.map((category, i) => (
                  <Reveal key={category} delay={i * 70}>
                    <CategorySection
                      category={category}
                      items={activeTrip.items.filter((item) => item.category === category)}
                      onToggle={toggleItem}
                      onRemove={removeItem}
                    />
                  </Reveal>
                ))}

                <div className="print:hidden">
                  <AddItemForm categories={template.categories} onAdd={addItem} />
                </div>
              </div>

              <div className="print:hidden">
                <FlightPathDivider />
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="font-serif text-xl text-navy-900">Travel documents</h3>
                  <p className="mt-1 text-sm text-ink-soft print:hidden">
                    Handle these separately from packing — most are worth sorting out well before the day you leave.
                  </p>
                </div>
                <div className="print:hidden">
                  <ChecklistProgress packed={documentProgress.packed} total={documentProgress.total} />
                </div>

                <Reveal>
                  <CategorySection
                    category="Documents"
                    items={activeTrip.documentItems}
                    onToggle={toggleDocumentItem}
                    onRemove={removeDocumentItem}
                  />
                </Reveal>

                <div className="print:hidden">
                  <AddItemForm categories={["Documents"]} onAdd={addDocumentItem} />
                </div>
              </div>

              <div className="print:hidden">
                <FlightPathDivider />
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="font-serif text-xl text-navy-900">What to research ahead of time</h3>
                  <p className="mt-1 text-sm text-ink-soft print:hidden">
                    Things worth looking up before you leave — we'll point you to what to check and why it matters,
                    since exact answers depend on your specific destination and nationality.
                  </p>
                </div>
                <div className="print:hidden">
                  <ChecklistProgress packed={researchProgress.packed} total={researchProgress.total} />
                </div>

                <Reveal>
                  <CategorySection
                    category="Research"
                    items={activeTrip.researchItems}
                    onToggle={toggleResearchItem}
                    onRemove={removeResearchItem}
                  />
                </Reveal>

                <div className="print:hidden">
                  <AddItemForm categories={["Research"]} onAdd={addResearchItem} />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
