export interface DocumentItemSeed {
  label: string;
  note?: string;
}

export const documentTemplates: Record<string, DocumentItemSeed[]> = {
  international: [
    {
      label: "Passport",
      note: "Check it doesn't expire within 6 months of your return date — some countries require this.",
    },
    {
      label: "Visa or entry permit (if required)",
      note: "Look up your destination's rules ahead of time; not every country needs one.",
    },
    { label: "Travel insurance details" },
    { label: "Printed and digital copies of your itinerary" },
    { label: "Copy of passport (photo, stored separately from the original)" },
    { label: "Driver's license or ID card" },
  ],
  "domestic-short": [
    {
      label: "Government-issued photo ID",
      note: "A driver's license or state ID is enough for domestic flights.",
    },
    { label: "Boarding pass (printed or on your phone)" },
    { label: "Confirmation for hotel or place you're staying" },
  ],
};
