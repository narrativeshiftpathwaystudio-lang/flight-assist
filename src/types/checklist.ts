export interface ChecklistItem {
  id: string;
  label: string;
  category: string;
  checked: boolean;
  custom?: boolean;
  note?: string;
  affiliateUrl?: string;
}

export interface PackingTemplate {
  id: string;
  name: string;
  description: string;
  categories: string[];
  items: Array<{ label: string; category: string; note?: string; affiliateUrl?: string }>;
}

export interface Trip {
  id: string;
  name: string;
  templateId: string;
  destination?: string;
  departureAirport?: string;
  arrivalAirport?: string;
  startDate?: string;
  endDate?: string;
  items: ChecklistItem[];
  documentItems: ChecklistItem[];
  researchItems: ChecklistItem[];
  createdAt: number;
}

export type TripDetails = Pick<
  Trip,
  "destination" | "departureAirport" | "arrivalAirport" | "startDate" | "endDate"
>;
