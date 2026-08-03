export interface Bracket {
  id: string;
  label: string;
  guidance: string;
  todos: string[];
}

export function getBracket(totalMinutes: number): Bracket {
  if (totalMinutes < 60) {
    return {
      id: "tight",
      label: "Tight connection",
      guidance: "Head straight to your next gate — there's not much time to spare.",
      todos: [
        "Check the monitors for your new gate as soon as you land",
        "Skip food or shopping — go straight toward your gate",
        "Ask a staff member if you're unsure which way to go",
      ],
    };
  }
  if (totalMinutes < 180) {
    return {
      id: "comfortable",
      label: "Comfortable layover",
      guidance: "You have time for a quick stop, but it's still worth staying close to your gate area.",
      todos: [
        "Use the restroom and grab food or a drink",
        "Recheck your gate 30–45 minutes before boarding",
        "Keep your boarding pass and ID handy",
      ],
    };
  }
  return {
    id: "long",
    label: "Long layover",
    guidance: "You have real time here — you can relax, eat properly, or explore a bit of the terminal.",
    todos: [
      "Set a phone alarm for about an hour before boarding",
      "Check whether there's anything worth seeing near your gate area",
      "Recheck the monitors periodically in case your gate changes",
    ],
  };
}
