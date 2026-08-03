import smallSuitcase from "../assets/smallsuitcase.jpg";
import smallDeparture from "../assets/smalldeparture.jpg";
import smallSeat from "../assets/smallseat.jpg";
import smallArrival from "../assets/smallarrival.jpg";

export interface Stage {
  id: string;
  path: string;
  step: string;
  name: string;
  tagline: string;
  description: string;
  photoLabel: string;
  cardPhotoSrc?: string;
}

export const stages: Stage[] = [
  {
    id: "before-you-go",
    path: "/before-you-go",
    step: "Stage 1",
    name: "Before You Go",
    tagline: "Packing, documents, and what to look into ahead of time",
    description:
      "Build your packing list, make sure your documents are in order, and know what to research before you leave the house.",
    photoLabel: "Photo: suitcase packed on a bed, soft morning light",
    cardPhotoSrc: smallSuitcase,
  },
  {
    id: "at-the-airport",
    path: "/at-the-airport",
    step: "Stage 2",
    name: "At the Airport",
    tagline: "Check-in, baggage rules, and getting through security",
    description:
      "A plain-language walkthrough of what happens from curb to gate — check-in, bag drop, and security — so nothing catches you off guard.",
    photoLabel: "Photo: departures hall, wide and bright",
    cardPhotoSrc: smallDeparture,
  },
  {
    id: "in-transit",
    path: "/in-transit",
    step: "Stage 3",
    name: "In Transit",
    tagline: "Layovers, delays, and what to do if plans change",
    description:
      "What a layover actually is, how to handle a delay or cancellation, and how to stay calm when something doesn't go as planned.",
    photoLabel: "Photo: airplane window seat, clouds below",
    cardPhotoSrc: smallSeat,
  },
  {
    id: "arrival",
    path: "/arrival",
    step: "Stage 4",
    name: "Arrival",
    tagline: "Customs, baggage claim, and your first steps",
    description:
      "What to expect when you land — customs, collecting your bags, and getting from the airport to where you're actually staying.",
    photoLabel: "Photo: taxi rank or arrivals curb, early evening",
    cardPhotoSrc: smallArrival,
  },
];
