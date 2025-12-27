/**
 * Verify that all "Safe to Recycle" items match cheat sheet ROI percentages
 */

const fetch = globalThis.fetch || require('node-fetch');

// Component values from lib/recycling.ts (your updated values)
const COMPONENT_VALUES = {
  metal_parts: 75,
  rubber_parts: 50,
  fabric: 50,
  chemicals: 50,
  plastic_parts: 60,
  wires: 200,
  arc_alloy: 200,
  electrical_components: 640,
  arc_circuitry: 1000,
  arc_powercell: 270,
  crude_explosives: 270,
  explosive_compound: 1000,
  assorted_seeds: 100,
  speaker_component: 500,
  sensors: 500,
  voltage_converter: 500,
  oil: 300,
  simple_gun_parts: 330,
  processor: 500,
  steel_spring: 300,
  magnet: 300,
  battery: 250,
  mechanical_components: 640,
  durable_cloth: 640,
  advanced_electrical_components: 1750,
  advanced_mechanical_components: 1750,
  mod_components: 1750,
  antiseptic: 1000,
  light_gun_parts: 700,
  medium_gun_parts: 700,
  heavy_gun_parts: 700,
  complex_gun_parts: 3000,
  canister: 300,
  duct_tape: 300,
  rope: 500,
  moss: 500,
  syringe: 500,
  synthesized_fuel: 700,
  exodus_modules: 2750,
  magnetic_accelerator: 5500,
  power_rod: 5000,
  arc_motion_core: 1000,
};

// Known ROI from cheat sheet for "Safe to Recycle" items (Page 1)
const SAFE_TO_RECYCLE_ROI = {
  'moss': -40,
  'radio': -50,
  'unusable weapon': -90,
  'alarm clock': -70,
  'coolant': -70,
  'diving goggles': -50,
  'expired respirator': -50,
  'headphones': -50,
  'industrial charger': -50,
  'polluted air filter': -50,
  'radio relay': -50,
  'remote control': -50,
  'rope': -50,
  'thermostat': -50,
  'zipline': -50,
  'ion sputter': -33,
  'broken guidance system': -50,
  'broken handheld radio': -50,
  'sample cleaner': -50,
  'barricade kit': -50,
};

function calculateRecyclingValue(recyclesInto) {
  if (!recyclesInto) return 0;
  let total = 0;
  for (const [component, amount] of Object.entries(recyclesInto)) {
    const componentValue = COMPONENT_VALUES[component] || 0;
    total += componentValue * amount;
  }
  return total;
}

function calculateROI(sellValue, recycleValue) {
  if (sellValue === 0) return 0;
  return Math.round(((recycleValue - sellValue) / sellValue) * 100);
}

async function verifyROI() {
  console.log('Fetching all items from API...\n');

  // Fetch list of all item IDs
  const listResponse = await fetch('https://arcdata.mahcks.com/v1/items');
  const listData = await listResponse.json();

  // Fetch all items in batches
  const batchSize = 50;
  const allItems = [];

  for (let i = 0; i < listData.items.length; i += batchSize) {
    const batch = listData.items.slice(i, i + batchSize);
    const batchPromises = batch.map(item =>
      fetch(`https://arcdata.mahcks.com/v1/items/${item.id}`)
        .then(res => res.json())
        .catch(() => null)
    );
    const batchResults = await Promise.all(batchPromises);
    allItems.push(...batchResults.filter(item => item !== null));
  }

  console.log('=== Safe to Recycle ROI Verification ===\n');

  const mismatches = [];
  const matches = [];

  for (const [itemName, expectedROI] of Object.entries(SAFE_TO_RECYCLE_ROI)) {
    const item = allItems.find(item =>
      item.name?.en?.toLowerCase() === itemName.toLowerCase()
    );

    if (!item) {
      console.log(`❌ "${itemName}" - NOT FOUND IN API\n`);
      continue;
    }

    const sellValue = item.value || 0;
    const recycleValue = calculateRecyclingValue(item.recyclesInto);
    const calculatedROI = calculateROI(sellValue, recycleValue);

    const match = calculatedROI === expectedROI;
    const status = match ? '✓' : '✗';

    const result = {
      name: itemName,
      expectedROI,
      calculatedROI,
      sellValue,
      recycleValue,
      recyclesInto: item.recyclesInto,
      match
    };

    if (match) {
      matches.push(result);
    } else {
      mismatches.push(result);
    }

    if (!match) {
      console.log(`${status} ${itemName}`);
      console.log(`   Expected: ${expectedROI}%, Got: ${calculatedROI}%`);
      console.log(`   Sell: ${sellValue}, Recycle: ${recycleValue}`);

      if (item.recyclesInto) {
        console.log(`   Components:`);
        for (const [component, amount] of Object.entries(item.recyclesInto)) {
          const value = COMPONENT_VALUES[component] || 0;
          console.log(`      ${amount}x ${component} @ ${value} = ${amount * value}`);
        }
      }
      console.log();
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`✓ Matching: ${matches.length}`);
  console.log(`✗ Mismatched: ${mismatches.length}`);

  if (mismatches.length > 0) {
    console.log(`\n=== Items Needing Component Value Adjustment ===\n`);
    for (const item of mismatches) {
      console.log(`${item.name}:`);
      console.log(`  Current ROI: ${item.calculatedROI}%, Expected: ${item.expectedROI}%`);
      console.log(`  Difference: ${item.calculatedROI - item.expectedROI}%`);
    }
  }
}

verifyROI().catch(console.error);
