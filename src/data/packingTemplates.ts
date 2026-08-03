import type { PackingTemplate } from "../types/checklist";

export const packingTemplates: PackingTemplate[] = [
  {
    id: "international",
    name: "International Trip",
    description:
      "Crossing a border. Covers documents, currency, and the extras that don't come up on a trip within your own country.",
    categories: ["Money & Cards", "Clothing", "Toiletries", "Electronics", "Health & Comfort"],
    items: [
      { label: "Local currency for your destination", category: "Money & Cards", note: "A small amount in cash covers you before you find an ATM or card reader." },
      { label: "Credit or debit card with no foreign transaction fee", category: "Money & Cards" },
      { label: "Notify your bank of travel dates", category: "Money & Cards", note: "Prevents your card from being flagged and frozen for 'suspicious activity.'" },
      { label: "Weather-appropriate outfits for each day", category: "Clothing" },
      { label: "One dressier outfit", category: "Clothing" },
      { label: "Comfortable walking shoes", category: "Clothing" },
      { label: "Light jacket or layer", category: "Clothing" },
      { label: "Toothbrush & toothpaste", category: "Toiletries" },
      { label: "Toiletries in travel-sized (3.4oz/100ml) containers", category: "Toiletries", note: "Airport security requires liquids in containers this size or smaller for carry-on bags." },
      { label: "Any prescription medication, in original packaging", category: "Health & Comfort", note: "Original labels help explain the medication if it's ever questioned at security or customs." },
      { label: "Basic first-aid items (pain reliever, bandages)", category: "Health & Comfort" },
      { label: "Phone charger", category: "Electronics" },
      {
        label: "Power adapter for your destination",
        category: "Electronics",
        note: "Outlet shapes and voltage vary by country — check before you go, not at the airport.",
        affiliateUrl: "https://example.com/affiliate/travel-adapter",
      },
      {
        label: "Portable charger / power bank",
        category: "Electronics",
        affiliateUrl: "https://example.com/affiliate/power-bank",
      },
      { label: "Headphones", category: "Electronics" },
    ],
  },
  {
    id: "domestic-short",
    name: "Short Domestic Trip",
    description:
      "A quick trip within your own country — a few days, no border to cross, no passport needed.",
    categories: ["Clothing", "Toiletries", "Electronics", "Health & Comfort"],
    items: [
      { label: "Outfits for each day, plus one extra", category: "Clothing" },
      { label: "Comfortable shoes", category: "Clothing" },
      { label: "Pajamas", category: "Clothing" },
      { label: "Toothbrush & toothpaste", category: "Toiletries" },
      { label: "Toiletries in travel-sized (3.4oz/100ml) containers", category: "Toiletries", note: "Only matters if you're carrying on — checked bags don't have this limit." },
      { label: "Any regular medication", category: "Health & Comfort" },
      { label: "Phone charger", category: "Electronics" },
      { label: "Headphones", category: "Electronics" },
    ],
  },
];
