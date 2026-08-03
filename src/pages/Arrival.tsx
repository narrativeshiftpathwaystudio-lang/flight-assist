import { StageHero } from "../components/StageHero";
import { StageContent } from "../components/StageContent";
import { TopicSection, StepList, PointList, Callout } from "../components/TopicSection";
import { QuickChecklistTool } from "../components/tools/QuickChecklistTool";
import arrivalPhoto from "../assets/arrival.jpg";

export function Arrival() {
  return (
    <>
      <StageHero
        step="Stage 4"
        name="Arrival"
        tagline="Customs, getting to your destination, and your first steps"
        photoLabel="Photo: taxi rank or arrivals curb, early evening"
        photoSrc={arrivalPhoto}
      />

      <StageContent
        intro="Landing is the moment a lot of the nervousness lifts — but there are still a few steps between the plane and actually being at your destination. Here's what to expect."
        sections={[
          <TopicSection
            eyebrow="International arrivals only"
            title="Going through customs"
            intro="Customs is where a country checks what travelers are bringing across its border. If your trip stayed within your own country, you can skip this step entirely."
          >
            <PointList
              points={[
                {
                  title: "The declaration form",
                  body: "Some countries ask you to fill out a form (often digital now) listing things like what you're bringing in, whether you're carrying certain foods or plants, and how much cash you have if it's above a set amount.",
                },
                {
                  title: "Common questions from an officer",
                  body: "Usually just the basics: the purpose of your visit, how long you're staying, and where. Simple, direct answers are all that's expected.",
                },
                {
                  title: "It's routine",
                  body: "The overwhelming majority of travelers walk through customs in a couple of minutes with no issues at all. The process is built for volume, not scrutiny.",
                },
              ]}
            />
          </TopicSection>,

          <TopicSection
            eyebrow="Getting your things"
            title="Baggage claim"
            intro="If you checked a bag, this is where you pick it up — the one part of arrival that happens before you're fully out of the airport."
          >
            <StepList
              steps={[
                {
                  title: "Find your carousel",
                  body: "Screens near baggage claim list which carousel corresponds to your flight number. It's usually assigned shortly before or after you land.",
                },
                {
                  title: "Watch for your bag",
                  body: "Bags don't come out in any guaranteed order, so it's worth staying near the carousel rather than stepping away.",
                },
                {
                  title: "If your bag doesn't show up",
                  body: "Head to the baggage service desk in the same area, usually clearly signed. Staff there can track it and arrange to have it delivered to you once it's found — this is a routine process for them.",
                },
              ]}
            />
          </TopicSection>,

          <TopicSection
            eyebrow="The last leg"
            title="Getting to where you're staying"
            intro="Worth deciding before you land, so you're not making the choice while tired and jet-lagged."
          >
            <PointList
              points={[
                {
                  title: "Taxi",
                  body: "Usually available right outside arrivals at a marked taxi rank — look for signage or ask a staff member to point you to it.",
                },
                {
                  title: "Rideshare (Uber, Lyft, etc.)",
                  body: "Many airports have a separate rideshare pickup zone, distinct from the taxi rank. Your app will usually tell you exactly where to go once you land.",
                },
                {
                  title: "Public transit or a shuttle",
                  body: "Often the cheapest option, and sometimes the fastest depending on traffic. Worth checking whether your destination has a direct train or bus link from the airport.",
                },
              ]}
            />
          </TopicSection>,

          <QuickChecklistTool
            eyebrow="Try it"
            title="First steps after landing"
            intro="A simple order to work through once you're off the plane, so you're not deciding what's next while tired and jet-lagged."
            storageKey="traveler.firstSteps"
            items={[
              "Follow signs to baggage claim",
              "Clear customs, if this was an international flight",
              "Collect checked bags",
              "Decide on transport — taxi, rideshare, or transit",
              "Let someone know you've landed",
            ]}
          />,
        ]}
        callout={
          <Callout>
            Once you're through these last few steps, the traveling part is done — the rest is just being where you
            set out to be.
          </Callout>
        }
      />
    </>
  );
}
