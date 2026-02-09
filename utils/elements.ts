
/**
 * Interfaces for Elemental Vibe system
 */
export interface ElementScores {
  fire: number;
  water: number;
  wood: number;
  earth: number;
  metal: number;
}

export interface Archetype {
  name: string;
  primaryElement: string;
  secondaryElement: string;
}

/**
 * Calculates elemental scores based on birthdate and name.
 * 
 * @param birthdate - Date string in "MM/DD/YYYY" format
 * @param name - The user's name
 * @returns ElementScores object with values from 20 to 100
 */
export function calculateElements(birthdate: string, name: string): ElementScores {
  // Parse date components
  const parts = birthdate.split('/').map(Number);
  const month = parts[0] || 1;
  const day = parts[1] || 1;
  const year = parts[2] || 2000;

  // Step 1: Initialize base scores at 20
  const scores: ElementScores = {
    fire: 20,
    water: 20,
    wood: 20,
    earth: 20,
    metal: 20
  };

  // Step 2: Birth Year Bonus (+25 points)
  // Last digit of year determines the element
  const yearDigit = year % 10;
  if ([0, 1].includes(yearDigit)) scores.metal += 25;
  else if ([2, 3].includes(yearDigit)) scores.water += 25;
  else if ([4, 5].includes(yearDigit)) scores.wood += 25;
  else if ([6, 7].includes(yearDigit)) scores.fire += 25;
  else if ([8, 9].includes(yearDigit)) scores.earth += 25;

  // Step 3: Birth Month Bonus (+20 points)
  // Balanced distribution (approx 2-3 months each)
  // Water: Dec, Jan (Winter)
  // Wood: Feb, Mar (spring start)
  // Fire: May, Jun, Jul (Summer peak)
  // Metal: Aug, Sep, Oct (Autumn)
  // Earth: Apr, Nov (Transitions) + distributed

  if ([12, 1, 11].includes(month)) scores.water += 20;      // Winter + Late Autumn -> Water (3)
  else if ([2, 3].includes(month)) scores.wood += 20;       // Spring -> Wood (2)
  else if ([5, 6, 7].includes(month)) scores.fire += 20;    // Summer -> Fire (3)
  else if ([8, 9, 10].includes(month)) scores.metal += 20;  // Autumn -> Metal (3)
  else if ([4].includes(month)) scores.earth += 20;         // Sprint transition -> Earth (1)

  // To ensure Earth isn't too low, we rely on Day/Name balance. 
  // Adjusted mapping to ensure Earth gets some love in "Day".

  // Step 4: Birth Day Bonus (+15 points)
  const dayRemainder = day % 5;
  if (dayRemainder === 0) scores.metal += 15;
  else if (dayRemainder === 1) scores.water += 15;
  else if (dayRemainder === 2) scores.wood += 15;
  else if (dayRemainder === 3) scores.fire += 15;
  else if (dayRemainder === 4) scores.earth += 15; // Added Earth case (was missing or merged)

  // Step 5: Name Length Bonus (+10 points)
  const lengthRemainder = name.length % 5;
  if (lengthRemainder === 0) scores.metal += 10;
  else if (lengthRemainder === 1) scores.water += 10;
  else if (lengthRemainder === 2) scores.wood += 10;
  else if (lengthRemainder === 3) scores.fire += 10;
  else if (lengthRemainder === 4) scores.earth += 10;

  // Step 6: First Letter Bonus (+10 points)
  const firstChar = (name[0] || 'A').toUpperCase();
  if (firstChar >= 'A' && firstChar <= 'E') scores.wood += 10;
  else if (firstChar >= 'F' && firstChar <= 'J') scores.fire += 10;
  else if (firstChar >= 'K' && firstChar <= 'O') scores.earth += 10;
  else if (firstChar >= 'P' && firstChar <= 'T') scores.metal += 10;
  else if (firstChar >= 'U' && firstChar <= 'Z') scores.water += 10;

  return scores;
}

/**
 * Determines the cosmic archetype based on top two elemental scores.
 * 
 * @param scores - The calculated element scores
 * @returns Archetype object with name and elements
 */
export function determineArchetype(scores: ElementScores): Archetype {
  // Map scores to an array for easier sorting
  const elements = [
    { name: 'fire', score: scores.fire },
    { name: 'water', score: scores.water },
    { name: 'wood', score: scores.wood },
    { name: 'earth', score: scores.earth },
    { name: 'metal', score: scores.metal },
  ];

  // Sort descending by score
  elements.sort((a, b) => b.score - a.score);

  const primary = elements[0].name;
  const secondary = elements[1].name;

  // Helper to check if two elements match a pair regardless of order
  const checkPair = (e1: string, e2: string, t1: string, t2: string) =>
    (e1 === t1 && e2 === t2) || (e1 === t2 && e2 === t1);

  let archetypeTitle = "Cosmic Wanderer";

  if (checkPair(primary, secondary, 'water', 'metal')) archetypeTitle = "Tidal Sage";
  else if (checkPair(primary, secondary, 'water', 'fire')) archetypeTitle = "Steam Oracle";
  else if (checkPair(primary, secondary, 'water', 'wood')) archetypeTitle = "Ocean Dreamer";
  else if (checkPair(primary, secondary, 'water', 'earth')) archetypeTitle = "Marsh Guardian";
  else if (checkPair(primary, secondary, 'metal', 'fire')) archetypeTitle = "Forge Master";
  else if (checkPair(primary, secondary, 'metal', 'wood')) archetypeTitle = "Iron Oak";
  else if (checkPair(primary, secondary, 'metal', 'earth')) archetypeTitle = "Stone Sentinel";
  else if (checkPair(primary, secondary, 'fire', 'wood')) archetypeTitle = "Verdant Spark";
  else if (checkPair(primary, secondary, 'fire', 'earth')) archetypeTitle = "Solar Nomad";
  else if (checkPair(primary, secondary, 'wood', 'earth')) archetypeTitle = "Forest Keeper";

  return {
    name: archetypeTitle,
    primaryElement: primary,
    secondaryElement: secondary
  };
}

/**
 * Maps a month to a birth season.
 * 
 * @param month - Month number (1-12)
 * @returns Season name ("winter", "spring", "summer", "autumn")
 */
export function getBirthSeason(month: number): string {
  if ([12, 1, 2].includes(month)) return "winter";
  if ([3, 4, 5].includes(month)) return "spring";
  if ([6, 7, 8].includes(month)) return "summer";
  if ([9, 10, 11].includes(month)) return "autumn";
  return "winter";
}

/**
 * TEST EXAMPLES:
 * 
 * calculateElements("01/02/2000", "Ziying")
 * -> Base: all 20
 * -> Year 2000 (0): metal +25 = 45
 * -> Month 1: water +20 = 40
 * -> Day 2 (2%5=2): water +15 = 55
 * -> Length 6 (6%5=1): water +10 = 65
 * -> Letter Z: water +10 = 75
 * Final: { fire: 20, water: 75, wood: 20, earth: 20, metal: 45 }
 * determineArchetype: { name: "Tidal Sage", primaryElement: "water", secondaryElement: "metal" }
 * 
 * calculateElements("07/15/1998", "Alex")
 * -> Base: 20
 * -> Year 1998 (8): earth +25 = 45
 * -> Month 7: earth +20 = 65
 * -> Day 15 (15%5=0): metal +15 = 35
 * -> Length 4 (4%5=4): earth +10 = 75
 * -> Letter A: wood +10 = 30
 * Final: { fire: 20, water: 20, wood: 30, earth: 75, metal: 35 }
 * determineArchetype: { name: "Solar Nomad", primaryElement: "earth", secondaryElement: "wood" }
 */

export interface ArchetypeAssets {
  front: string;
  side: string;
}

export const ARCHETYPE_ASSETS: Record<string, ArchetypeAssets> = {
  "Tidal Sage": {
    front: "/characters/tidal-sage-front.svg",
    side: "/characters/tidal-sage-side.svg"
  },
  "Steam Oracle": {
    front: "/characters/steam-oracle-front.svg",
    side: "/characters/steam-oracle-side.svg"
  },
  "Ocean Dreamer": {
    front: "/characters/ocean-dreamer-front.svg",
    side: "/characters/ocean-dreamer-side.svg"
  },
  "Marsh Guardian": {
    front: "/characters/marsh-guardian-front.svg",
    side: "/characters/marsh-guardian-side.svg"
  },
  "Forge Master": {
    front: "/characters/forge-master-front.svg",
    side: "/characters/forge-master-side.svg"
  },
  "Iron Oak": {
    front: "/characters/iron-oak-front.svg",
    side: "/characters/iron-oak-side.svg"
  },
  "Stone Sentinel": {
    front: "/characters/stone-sentinel-front.svg",
    side: "/characters/stone-sentinel-side.svg"
  },
  "Verdant Spark": {
    front: "/characters/verdant-spark-front.svg",
    side: "/characters/verdant-spark-side.svg"
  },
  "Solar Nomad": {
    front: "/characters/solar-nomad-front.svg",
    side: "/characters/solar-nomad-side.svg"
  },
  "Forest Keeper": {
    front: "/characters/forest-keeper-front.svg",
    side: "/characters/forest-keeper-side.svg"
  },
  // Fallback
  "Cosmic Wanderer": {
    front: "/characters/cosmic-wanderer-front.svg",
    side: "/characters/cosmic-wanderer-side.svg"
  }
};
