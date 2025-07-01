
export interface MemberCardDetails {
  name: string;
  css: string;
}

const colors = [
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  "linear-gradient(135deg, #E3FDF5 0%, #FFE6FA 100%)",
  "linear-gradient(135deg, #ed6fbb 0%, #ff9378 100%)",
  "linear-gradient(135deg, #b3e5fc 0%, #4fc3f7 100%)",
  "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
  "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  "linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)",
  "linear-gradient(135deg, #FFB5A7 0%, #FCD5CE 100%)",
  "linear-gradient(135deg, #FDCB92 0%, #D1FDFF 100%)",
];

export type Team = "amw" | "core" | "dmw" | "fmw" | "apc";
type TeamDetails = {
  name: string;
  members: string[];
};

export const teams: Record<Team, TeamDetails> = {
  amw: {
    name: "Asset Management Workstream",
    members: ["Adriana", "Alin", "Andreea", "Andrei", "Ciprian", "Cristian", "Vignesh"],
  },
  core: {
    name: "Core",
    members: ["Jan", "Mihai", "Noey", "Oo", "Pin"],
  },
  dmw: {
    name: "Data Management Workstream",
    members: ["Andreea", "Costel", "Cristian", "Mihai A"],
  },
  fmw: {
    name: "Financial Management Workstream",
    members: ["Andreea", "Mihai A", "Mihai D", "Mihai G", "Raluca"],
  },
  apc: {
    name: "Asset Platform Capabilities Squad",
    members: ["Andriana", "Ciprian", "Costel", "Iulian", "Noey", "Oo", "Razvan"],
  },
};

export const memberCardDetails = (members: string[]): MemberCardDetails[] => {
  // Create a copy of colors array and shuffle it using Fisher-Yates algorithm
  const randomizedColors = [...colors];
  for (let i = randomizedColors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [randomizedColors[i], randomizedColors[j]] = [randomizedColors[j], randomizedColors[i]];
  }

  return members.map((member, index) => ({
    name: member,
    css: randomizedColors[index],
  }));
};
