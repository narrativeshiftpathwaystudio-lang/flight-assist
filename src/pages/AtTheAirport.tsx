import { StageHero } from "../components/StageHero";
import { StageContent } from "../components/StageContent";
import { TopicSection, StepList, PointList, Callout } from "../components/TopicSection";
import { QuickChecklistTool } from "../components/tools/QuickChecklistTool";
import departurePhoto from "../assets/departure.jpg";

export function AtTheAirport() {
  return (
    <>
      <StageHero
        step="Stage 2"
        name="At the Airport"
        tagline="Check-in, baggage rules, and getting through security"
        photoLabel="Photo: departures hall, wide and bright"
        photoSrc={departurePhoto}
      />

      <StageContent
        intro="The airport has its own unwritten rhythm — but every part of it is just a process, and every process can be explained. Here's what actually happens between walking in the doors and reaching your gate."
        sections={[
          <TopicSection
            eyebrow="First step"
            title="Checking in"
            intro="Checking in confirms you're on the flight and gets you a boarding pass — the document (paper or digital) that lets you through security and onto the plane."
          >
            <StepList
              steps={[
                {
                  title: "Check in online first, if you can",
                  body: "Most airlines open online check-in 24–48 hours before departure. It lets you pick a seat and get your boarding pass before you leave home, so you can skip the counter entirely.",
                },
                {
                  title: "Know when to arrive",
                  body: "As a general guide: arrive about 2 hours early for a domestic flight, and about 3 hours early for an international one. That's a buffer, not a deadline — it accounts for lines you can't predict.",
                },
                {
                  title: "If you didn't check in online",
                  body: "Go to your airline's check-in counter. Have your ID and confirmation number (or the name on the booking) ready. Staff there can check you in and print a boarding pass on the spot.",
                },
              ]}
            />
          </TopicSection>,

          <TopicSection
            eyebrow="What goes where"
            title="Baggage rules"
            intro="A carry-on is the bag you keep with you in the cabin. A checked bag is handed over before security and travels separately in the plane's cargo hold. The rules for each are different."
          >
            <PointList
              points={[
                {
                  title: "Carry-on size and weight",
                  body: "Limits vary by airline, so check yours before you pack — but a common guideline is around 22 x 14 x 9 inches (56 x 36 x 23 cm), plus one smaller personal item like a bag or backpack.",
                },
                {
                  title: "The liquids rule",
                  body: "Liquids, gels, and pastes in a carry-on need to be in containers of 3.4oz (100ml) or smaller, all fitting in a single quart-sized bag. Anything larger has to go in a checked bag instead.",
                },
                {
                  title: "Checked bag limits",
                  body: "Airlines set their own weight limits (commonly around 50lbs / 23kg) and may charge a fee for checked bags, especially on budget carriers. Worth checking before you get to the counter, not after.",
                },
              ]}
            />
          </TopicSection>,

          <TopicSection
            eyebrow="Last step before your gate"
            title="Getting through security"
            intro="Security exists to check that nothing dangerous makes it onto the plane. The process is the same for almost everyone — it just feels unfamiliar the first time."
          >
            <StepList
              steps={[
                {
                  title: "ID and boarding pass check",
                  body: "An officer checks your ID against your boarding pass before you enter the screening area.",
                },
                {
                  title: "Bins",
                  body: "You'll place your bag, your liquids bag, and usually your laptop and jacket into separate bins on the belt. Most checkpoints now let you keep your shoes on — signage or a staff member will tell you if yours is different, or if you're asked to remove them for extra screening.",
                },
                {
                  title: "The scanner",
                  body: "You'll walk through a body scanner while your things go through the X-ray. It's normal to occasionally get pulled aside for a quick extra check — it doesn't mean anything is wrong.",
                },
                {
                  title: "Collect your things and go",
                  body: "Grab your bins' contents, repack at the nearby tables if you need to, and you're through — head to your gate.",
                },
              ]}
            />
          </TopicSection>,

          <QuickChecklistTool
            eyebrow="Try it"
            title="Security prep check"
            intro="Run through this right before you get in line — it covers the handful of things that actually slow people down at the belt."
            storageKey="traveler.securityPrep"
            items={[
              "Liquids bag is packed and easy to reach",
              "Laptop isn't buried under other things",
              "Shoes you can slip off quickly, just in case you're asked to",
              "Belt, jewelry, and other metal kept to a minimum",
              "Boarding pass and ID somewhere you can grab quickly",
            ]}
          />,
        ]}
        callout={
          <Callout>
            Millions of people go through this exact process every day. If you're not sure what to do at any step,
            it's completely normal to ask a staff member — that's what they're there for.
          </Callout>
        }
      />
    </>
  );
}
