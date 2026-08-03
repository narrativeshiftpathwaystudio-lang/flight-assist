export interface ResearchItemSeed {
  label: string;
  note?: string;
}

export const researchTemplates: Record<string, ResearchItemSeed[]> = {
  international: [
    {
      label: "Entry requirements for your destination",
      note: "Passport validity, visa rules, and any required vaccinations depend on your nationality and destination — check your destination's official government or embassy site rather than a general search.",
    },
    {
      label: "Plug type & voltage",
      note: "Outlet shapes and electrical voltage vary by country, so look up your specific destination to know whether you need an adapter, a converter, or both.",
    },
    {
      label: "Typical weather for your travel dates",
      note: "Check seasonal averages for your destination so you pack the right layers — what's normal changes a lot by region and time of year.",
    },
    {
      label: "Local currency & payment norms",
      note: "Find out the currency used, roughly how far it goes, and whether cards are widely accepted or you'll want more cash on hand.",
    },
    {
      label: "Emergency numbers",
      note: "Look up the local equivalent of 911 for your destination before you go, not after you need it.",
    },
    {
      label: "Local customs & etiquette basics",
      note: "A quick look at tipping norms, dress expectations, or greetings can take the edge off feeling unsure once you arrive.",
    },
  ],
  "domestic-short": [
    {
      label: "Weather for your travel dates",
      note: "Even within your own country, conditions can be very different from home — worth a quick check before you pack.",
    },
    {
      label: "Local emergency numbers",
      note: "Worth knowing if you're heading somewhere unfamiliar, even within your own country.",
    },
    {
      label: "Check-in details for where you're staying",
      note: "Arrival time windows, parking, and building access are easy to double-check now and awkward to figure out on arrival.",
    },
  ],
};
