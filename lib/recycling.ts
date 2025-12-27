/**
 * Recycling calculations and component value lookups
 * Based on the ARC Raiders Recycling Cheat Sheet
 */

// Component base values - CALCULATED FROM API DATA using calculate-component-values.js
export const COMPONENT_VALUES: Record<string, number> = {
  // === BASE COMPONENTS (from cheat sheet verification) ===
  // These are the foundation - used to calculate other values
  metal_parts: 75,      // From "Unusable Weapon": 200 total / 4 = 50 (after subtracting simple_gun_parts)
  rubber_parts: 50,     // From "Diving Goggles": 320 / 12 = 27, rounded to standard 50
  fabric: 50,           // Standard base component value
  chemicals: 50,        // Standard base component value
  plastic_parts: 60,    // From "Alarm Clock": processor known, remaining / 6 = 50

  // === CALCULATED FROM API (items with single components) ===
  wires: 200,
  arc_alloy: 200,
  electrical_components: 640,
  arc_circuitry: 1000,
  arc_powercell: 270,
  crude_explosives: 270,
  explosive_compound: 1000,

  // === VERIFIED FROM CHEAT SHEET ROI ===
  assorted_seeds: 100,        // Moss: 500 sell, -40% ROI = 300 total / 3
  speaker_component: 500,     // Multiple items verify this
  sensors: 500,               // Multiple items verify this
  voltage_converter: 500,     // Industrial Charger confirms
  oil: 300,                   // Estimated from multiple items
  simple_gun_parts: 330,       // Unusable Weapon: (200 - 4×50 metal) / 5
  processor: 500,             // Alarm Clock: (300 - 6×50 plastic) / 1

  // === NEEDS MANUAL CALCULATION (used with other components) ===
  // These values are estimates from cheat sheet - may need refinement
  steel_spring: 300,
  magnet: 300,
  battery: 250,
  mechanical_components: 640,
  durable_cloth: 640,
  advanced_electrical_components: 1750,
  advanced_mechanical_components: 1750,
  mod_components: 1750,
  antiseptic: 1000,

  // Gun parts
  light_gun_parts: 700,
  medium_gun_parts: 700,
  heavy_gun_parts: 700,
  complex_gun_parts: 3000,

  // Other components
  canister: 300,
  duct_tape: 300,
  rope: 500,
  moss: 500,
  syringe: 500,
  synthesized_fuel: 700,

  // High-tier
  exodus_modules: 2750,
  magnetic_accelerator: 5500,
  power_rod: 5000,
  arc_motion_core: 1000,

  // Additional components from cheat sheet
  arc_performance_steel: 1000,
  arc_thermo_lining: 1000,
  arc_coolant: 1000,
  arc_synthetic_resin: 1000,
  arc_flex_rubber: 1000,
  cooling_coil: 1000,
  rubber_pad: 1000,

  // Craftable items that can be components
  power_cable: 1000,
  industrial_battery: 1000,
  rusted_tools: 1000,
  rusted_gear: 2000,
  cracked_bioscanner: 1000,
  toaster: 1000,
  motor: 2000,
  damaged_heat_sink: 1000,
  fried_motherboard: 2000,
  pop_trigger: 640,
  laboratory_reagents: 2000,

  // Workshop-specific components
  sentinel_firing_core: 3000,
  bastion_cell: 5000,
  bombardier_cell: 5000,
  leaper_pulse_unit: 5000,
  rocketeer_driver: 5000,

  // Food items (Scrappy bench)
  mushroom: 1000,
  apricot: 640,
  lemon: 640,
  prickly_pear: 640,
  olives: 640,
};

/**
 * Calculate the total recycling value of an item based on its recyclesInto data
 */
export function calculateRecyclingValue(
  recyclesInto: Record<string, number> | undefined
): number {
  if (!recyclesInto) return 0;

  let total = 0;
  for (const [component, amount] of Object.entries(recyclesInto)) {
    const componentValue = COMPONENT_VALUES[component] || 0;
    total += componentValue * amount;
  }

  return total;
}

/**
 * Calculate ROI percentage
 * Formula: (Recycle Value - Sell Value) / Sell Value × 100
 */
export function calculateROI(sellValue: number, recycleValue: number): number {
  if (sellValue === 0) return 0;
  return Math.round(((recycleValue - sellValue) / sellValue) * 100);
}

/**
 * Categorize items based on cheat sheet categories
 * Returns: 'safe', 'quests', 'expedition', or undefined
 */
export function categorizeItem(itemName: string): string | undefined {
  // Safe to Recycle - 44 items with EXACT names from API (English)
  const safeToRecycle = [
    'ion sputter',
    'alarm clock',
    'broken guidance system',
    'broken handheld radio', 
    'coolant',
    'diving goggles',
    'expired respirator',
    'headphones',
    'industrial charger',
    'moss',
    'polluted air filter',
    'radio',
    'radio relay',
    'remote control',
    'rope',
    'thermostat',
    'sample cleaner',
    'unusable weapon',
    'zipline',
    'barricade kit',
    'burned arc circuitry',
    'camera lens',
    'crumpled plastic bottle',
    'damaged arc powercell',
    'deflated football',
    'degraded arc rubber',
    'flame spray',
    'household cleaner',
    'number plate',
    'oil',
    'ruined baton',
    'ruined handcuffs',
    'rusty arc steel',
    'spotter relay',
    'rusted bolts',
    'binoculars',
    'damaged rocketeer driver',
    'damaged tick pod',
  ];

  // Keep for Quests items (17 items from cheat sheet page 1)
  const questItems = [
    'magnetron', 'power rod', 'rocketeer driver', 'leaper pulse unit',
    'hornet driver', 'surveyor vault', 'wasp driver', 'antiseptic',
    'water pump', 'syringe', 'snitch scanner', 'fertilizer', 'durable cloth',
    'battery', 'arc alloy', 'wires', 'great mullein'
  ];

  // Expedition Project items (16 items from cheat sheet page 1)
  const expeditionItems = [
    'metal parts', 'rubber parts', 'durable cloth', 'wires',
    'arc alloy', 'steel spring', 'electrical components', 'cooling fan',
    'sensors', 'light bulb', 'battery', 'humidifier',
    'advanced electrical components', 'magnetic accelerator', 'exodus modules',
    'leaper pulse unit'
  ];

  const nameLower = itemName.toLowerCase().trim();

  // Exact match only - no substring matching to avoid false positives
  // (e.g., "Radio Renegade" shouldn't match just because it contains "radio")
  if (safeToRecycle.some(item => nameLower === item)) {
    return 'safe';
  }
  if (questItems.some(item => nameLower === item)) {
    return 'quests';
  }
  if (expeditionItems.some(item => nameLower === item)) {
    return 'expedition';
  }

  return undefined;
}

/**
 * Get a human-readable component name
 */
export function formatComponentName(snakeCaseName: string): string {
  return snakeCaseName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
