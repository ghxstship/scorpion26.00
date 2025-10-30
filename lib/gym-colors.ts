/**
 * Gym Performance Zone Color Palettes
 * 7 distinct zones with cinematic luxury aesthetic
 * Foundation: 85% dark base (blacks, deep greys) + 10-15% strategic accent colors
 */

export interface ColorPalette {
  name: string;
  hex: string;
  role: string;
}

export interface ZoneColors {
  name: string;
  dominantColor: string;
  atmosphere: string;
  colors: {
    primary: string;
    accent: string;
    base: string;
    secondary: string;
    metallic: string;
  };
  palette: ColorPalette[];
  materials: string;
  lighting: string;
}

export const gymZones = {
  // Main Brand / Training Floor - RED
  mainBrand: {
    name: "Main Brand / Training Floor",
    dominantColor: "Red",
    atmosphere: "Powerful, intense, commanding—the heart of transformation",
    colors: {
      primary: "#8B0000",    // Crimson Core
      accent: "#A01010",     // Blood Red
      base: "#0D0D0D",       // Obsidian
      secondary: "#2A2A2A",  // Charcoal
      metallic: "#C0C0C0",   // Platinum
    },
    palette: [
      { name: "Crimson Core", hex: "#8B0000", role: "Primary brand" },
      { name: "Blood Red", hex: "#A01010", role: "Accent walls" },
      { name: "Obsidian", hex: "#0D0D0D", role: "Base" },
      { name: "Charcoal", hex: "#2A2A2A", role: "Equipment" },
      { name: "Platinum", hex: "#C0C0C0", role: "Metallics" },
    ],
    materials: "High-gloss black epoxy with metallic flake, backlit red frosted glass panels, gunmetal steel beams, leather grip wraps with red stitching",
    lighting: "Deep red LED underglow on platforms, warm white spots (3000K) on equipment, red neon accent strips",
  },

  // Cardio/Core Zone - YELLOW (Basic/Foundation Training)
  coreTraining: {
    name: "Cardio/Core Zone",
    dominantColor: "Yellow",
    atmosphere: "Velocity, momentum, kinetic energy—foundation for growth",
    colors: {
      primary: "#8B7500",    // Gold Ember
      accent: "#9A7B4F",     // Burnished Gold
      base: "#000000",       // Void Black
      secondary: "#5A5A5A",  // Steel Grey
      metallic: "#D4D4D4",   // Chrome
    },
    palette: [
      { name: "Gold Ember", hex: "#8B7500", role: "Primary accent" },
      { name: "Burnished Gold", hex: "#9A7B4F", role: "Warm metallics" },
      { name: "Void Black", hex: "#000000", role: "Base" },
      { name: "Steel Grey", hex: "#5A5A5A", role: "Equipment" },
      { name: "Chrome", hex: "#D4D4D4", role: "Reflective surfaces" },
    ],
    materials: "Black resin floor with gold fiber optics, brushed brass accents, mirror walls with gold frames, illuminated acrylic platforms",
    lighting: "Dynamic warm white (3500K), gold LED strips in ceiling channels, programmable amber accent zones",
  },

  // Performance Brand / VIP Training - ORANGE
  vipPerformance: {
    name: "Performance Brand / VIP Training",
    dominantColor: "Orange",
    atmosphere: "Elite energy, explosive power, exclusive fire",
    colors: {
      primary: "#A0522D",    // Burnt Sienna
      accent: "#B87333",     // Copper Glow
      base: "#0A0A0A",       // Deep Black
      secondary: "#424242",  // Graphite
      metallic: "#BEBEBE",   // Warm Silver
    },
    palette: [
      { name: "Burnt Sienna", hex: "#A0522D", role: "Primary accent" },
      { name: "Copper Glow", hex: "#B87333", role: "Metallic finishes" },
      { name: "Deep Black", hex: "#0A0A0A", role: "Base" },
      { name: "Graphite", hex: "#424242", role: "Secondary" },
      { name: "Warm Silver", hex: "#BEBEBE", role: "Details" },
    ],
    materials: "Ebony herringbone flooring with copper inlay, oxidized copper fixtures, black leather with orange stitching, smoked glass with amber edge lighting",
    lighting: "Amber mood lighting (2700K), copper pendant fixtures, orange fiber optic ceiling details",
  },

  // Nutrition Center - GREEN
  nutrition: {
    name: "Nutrition Center",
    dominantColor: "Green",
    atmosphere: "Vital, organic luxury—nature refined to its purest form",
    colors: {
      primary: "#2F4538",    // Hunter Green
      accent: "#1C3026",     // Forest Depth
      base: "#101010",       // Carbon Black
      secondary: "#4A5D4F",  // Slate
      metallic: "#E8E8E8",   // Pearl
    },
    palette: [
      { name: "Hunter Green", hex: "#2F4538", role: "Primary accent" },
      { name: "Forest Depth", hex: "#1C3026", role: "Deep tones" },
      { name: "Carbon Black", hex: "#101010", role: "Base" },
      { name: "Slate", hex: "#4A5D4F", role: "Secondary" },
      { name: "Pearl", hex: "#E8E8E8", role: "Clean surfaces" },
    ],
    materials: "Black marble with green veining, live edge walnut counters, brass fixtures, living plant walls behind glass, matte ceramic",
    lighting: "Natural white (4000K) for food prep, green accent lighting behind botanical displays, brass pendant lights",
  },

  // Intelligence / Performance Lab - BLUE
  intelligence: {
    name: "Intelligence / Performance Lab",
    dominantColor: "Blue",
    atmosphere: "Precision, data-driven, cutting-edge science meets noir",
    colors: {
      primary: "#1C2841",    // Midnight Blue
      accent: "#4A5F7F",     // Steel Blue
      base: "#0C0C0C",       // Deep Black
      secondary: "#3D3D3D",  // Gunmetal
      metallic: "#AFAFAF",   // Titanium
    },
    palette: [
      { name: "Midnight Blue", hex: "#1C2841", role: "Primary accent" },
      { name: "Steel Blue", hex: "#4A5F7F", role: "Technology accents" },
      { name: "Deep Black", hex: "#0C0C0C", role: "Base" },
      { name: "Gunmetal", hex: "#3D3D3D", role: "Equipment" },
      { name: "Titanium", hex: "#AFAFAF", role: "Tech finishes" },
    ],
    materials: "Matte black walls with blue LED channel lighting, brushed aluminum surfaces, glass screens with blue UI, carbon fiber accents",
    lighting: "Cool white (5000K) task lighting, blue LED strips on testing equipment, holographic display zones",
  },

  // Recovery Sanctuary - PURPLE
  recovery: {
    name: "Recovery Sanctuary",
    dominantColor: "Purple",
    atmosphere: "Transcendent restoration, luxury meditation, ethereal healing",
    colors: {
      primary: "#3E2347",    // Aubergine
      accent: "#5C3A5E",     // Plum Shadow
      base: "#0F0F0F",       // Obsidian
      secondary: "#333333",  // Charcoal
      metallic: "#B76E79",   // Rose Gold
    },
    palette: [
      { name: "Aubergine", hex: "#3E2347", role: "Primary accent" },
      { name: "Plum Shadow", hex: "#5C3A5E", role: "Soft accents" },
      { name: "Obsidian", hex: "#0F0F0F", role: "Base" },
      { name: "Charcoal", hex: "#333333", role: "Secondary" },
      { name: "Rose Gold", hex: "#B76E79", role: "Warm metallics" },
    ],
    materials: "Heated stone floors, velvet upholstery in deep purple, rose gold fixtures, backlit amethyst panels, silk curtain dividers",
    lighting: "Dim warm (2200K) with purple accent lighting, Himalayan salt lamps, adjustable chromotherapy systems",
  },

  // Team Sports / Group Training - PINK
  community: {
    name: "Team Sports / Group Training",
    dominantColor: "Pink",
    atmosphere: "Electric camaraderie, fierce unity, unapologetic power",
    colors: {
      primary: "#8B2252",    // Magenta Edge
      accent: "#6B2D42",     // Rose Noir
      base: "#0A0A0A",       // Jet Black
      secondary: "#383838",  // Dark Slate
      metallic: "#B8B8B8",   // Brushed Nickel
    },
    palette: [
      { name: "Magenta Edge", hex: "#8B2252", role: "Primary accent" },
      { name: "Rose Noir", hex: "#6B2D42", role: "Deep tones" },
      { name: "Jet Black", hex: "#0A0A0A", role: "Base" },
      { name: "Dark Slate", hex: "#383838", role: "Equipment" },
      { name: "Brushed Nickel", hex: "#B8B8B8", role: "Industrial metals" },
    ],
    materials: "Black rubber flooring with pink zone striping, industrial steel rig with pink rope wraps, leather battle rope handles, neon pink signage",
    lighting: "Bright white (4500K) for visibility, magenta LED accent strips, pink neon motivation quotes",
  },
} as const;

// Helper function to get zone colors
export const getZoneColors = (zone: keyof typeof gymZones) => gymZones[zone];

// Export individual zones for easier imports
export const {
  mainBrand,
  coreTraining,
  vipPerformance,
  nutrition,
  intelligence,
  recovery,
  community,
} = gymZones;
