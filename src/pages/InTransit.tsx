import { StageHero } from "../components/StageHero";
import { StageContent } from "../components/StageContent";
import { TopicSection, StepList, PointList, Callout } from "../components/TopicSection";
import { LayoverPlanner } from "../components/tools/LayoverPlanner";
import { BreathingExercise } from "../components/tools/BreathingExercise";
import seatPhoto from "../assets/seat.jpg";

export function InTransit() {
  return (
    <>
      <StageHero
        step="Stage 3"
        name="In Transit"
        tagline="Layovers, delays, and what to do if plans change"
        photoLabel="Photo: airplane window seat, clouds below"
        photoSrc={seatPhoto}
      />

      <StageContent
        intro="Being &quot;in transit&quot; just means you're between flights or between the air and your final destination. Most of it is waiting — the useful part is knowing what you're waiting for."
        sections={[
          <TopicSection
            eyebrow="A common source of anxiety"
            title="What a layover actually is"
            intro="A layover is a scheduled stop between two flights on the same trip. You get off one plane, wait at that airport, then board a different plane to continue your journey."
          >
            <PointList
              points={[
                {
                  title: "Short vs. long layovers",
                  body: "Every itinerary has a minimum connection time — the shortest gap the airline considers workable at that airport. If your layover is close to that minimum, move toward your next gate as soon as you land instead of lingering.",
                },
                {
                  title: "Same terminal vs. changing terminals",
                  body: "Sometimes your next flight leaves from the same area you land in; sometimes you need to walk, take a train, or go through a separate security check to reach it. Your boarding pass or the airport's monitors will show the gate area.",
                },
                {
                  title: "International connections can require a passport check",
                  body: "On some international routes, you'll need to clear immigration at your connecting airport even though it isn't your final stop — sometimes collecting and re-checking your bag in the process. If your layover involves changing countries, it's worth reading your airline's guidance for that specific airport.",
                },
              ]}
            />
          </TopicSection>,

          <LayoverPlanner />,

          <TopicSection
            eyebrow="When plans change"
            title="If your flight is delayed or cancelled"
            intro="This is the part that tends to cause the most stress — mostly because it's unclear what to do first. Here's a simple order of operations."
          >
            <StepList
              steps={[
                {
                  title: "Check the airport screens or the airline's app",
                  body: "This is usually the fastest way to see your new status before an announcement is even made.",
                },
                {
                  title: "Go to the gate agent or the airline's help desk",
                  body: "They can rebook you on the next available flight. If the line is long, many airlines let you do the same thing through their app or by phone at the same time.",
                },
                {
                  title: "Ask what the airline offers for the disruption",
                  body: "Depending on the airline, the length of delay, and local regulations, you may be entitled to things like a meal voucher, hotel stay, or rebooking at no extra cost. Policies vary — it's worth directly asking rather than assuming.",
                },
              ]}
            />
          </TopicSection>,

          <TopicSection
            eyebrow="Making the wait easier"
            title="Staying comfortable and calm"
            intro="Small, practical things that make a real difference on a long travel day."
          >
            <PointList
              points={[
                {
                  title: "Drink water and move around",
                  body: "Air travel is dehydrating, and sitting for long stretches is uncomfortable. A short walk through the terminal helps more than it sounds like it would.",
                },
                {
                  title: "Download entertainment before you board",
                  body: "Wifi in the air isn't guaranteed. Downloading a show, playlist, or podcast ahead of time means you're not stuck without options.",
                },
                {
                  title: "Have a simple plan if you feel anxious",
                  body: "Something as small as a few slow breaths, a playlist you like, or reminding yourself of the next concrete step can take the edge off a stressful moment.",
                },
              ]}
            />
          </TopicSection>,

          <BreathingExercise />,
        ]}
        callout={
          <Callout>
            Delays and layovers can feel like something is going wrong. Usually, it's just the ordinary friction of
            travel — and it's rarely as complicated to sort out as it feels in the moment.
          </Callout>
        }
      />
    </>
  );
}
