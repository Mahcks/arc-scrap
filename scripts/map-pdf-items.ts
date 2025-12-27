/**
 * PDF Item Mapping Script
 * Searches the API for all items mentioned in the PDF and builds a complete mapping
 */

import { fetchAllItems } from '../lib/api';
import { writeFileSync } from 'fs';
import { join } from 'path';

// All items from the PDF, organized by category
const PDF_ITEMS = {
  safe: [
    'Ion Sputter', 'Alarm Clock', 'Broken Guidance System', 'Broken Handheld Radio',
    'Coolant', 'Moss', 'Polluted Air Filter', 'Headphones', 'Industrial Charger',
    'Radio', 'Sample Cleaner', 'Radio Relay', 'Remote Control', 'Rope',
    'Thermostat', 'Unusable Weapon', 'Burned ARC Circuitry', 'Camera Lens',
    'Barricade Kit', 'Zipline', 'Crumpled Plastic Bottle', 'Damaged Arc Powercell',
    'Degraded ARC Rubber', 'Deflated Football', 'Flame Spray', 'Household Cleaner',
    'Number Plate', 'Oil', 'Ruined baton', 'Spotter Relay', 'Rusty ARC Steel',
    'Rusted Bolts', 'Ruined Handcuffs', 'Binoculars', 'Damaged Rocketeer Driver',
    'Damaged Tick Pod', 'Diving Goggles', 'Expired Respirator'
  ],
  quests: [
    'Magnetron', 'Fertilizer', 'Water Pump', 'Power Rod', 'Snitch Scanner',
    'Wasp Driver', 'Hornet Driver', 'Surveyor Vault', 'Leaper Pulse Unit',
    'Rocketeer Driver', 'Syringe', 'Antiseptic', 'Durable Cloth', 'Great Mullein',
    'ARC Alloy', 'Wires', 'Battery'
  ],
  expedition: [
    'Metal Parts', 'Rubber Parts', 'Durable Cloth', 'Wires', 'Light Bulb',
    'Battery', 'Humidifier', 'Advanced Electrical Components', 'Leaper Pulse Unit',
    'Arc Alloy', 'Steel Spring', 'Electrical Components', 'Cooling Fan',
    'Sensors', 'Exodus Modules', 'Magnetic Accelerator'
  ]
};

function normalizeString(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function main() {
  console.log('🔄 Fetching all items from API...');
  const allItems = await fetchAllItems();
  console.log(`✅ Fetched ${allItems.length} items`);

  console.log('\n🔍 Mapping PDF items to API IDs...\n');

  const categories: Record<string, string> = {};
  const notFound: string[] = [];
  let totalMatched = 0;

  for (const [category, items] of Object.entries(PDF_ITEMS)) {
    console.log(`\n📋 Processing ${category} items (${items.length}):`);

    for (const pdfItemName of items) {
      const normalizedPdfName = normalizeString(pdfItemName);

      // Try exact match first
      let match = allItems.find(apiItem =>
        normalizeString(apiItem.name) === normalizedPdfName
      );

      // Try fuzzy match if exact fails
      if (!match) {
        match = allItems.find(apiItem => {
          const normalizedApiName = normalizeString(apiItem.name);
          return normalizedApiName.includes(normalizedPdfName) ||
                 normalizedPdfName.includes(normalizedApiName);
        });
      }

      if (match) {
        categories[match.id] = category;
        console.log(`  ✅ "${pdfItemName}" → "${match.name}" (${match.id})`);
        totalMatched++;
      } else {
        notFound.push(pdfItemName);
        console.log(`  ❌ "${pdfItemName}" - NOT FOUND`);
      }
    }
  }

  console.log(`\n📊 Results:`);
  console.log(`  Total PDF items: ${PDF_ITEMS.safe.length + PDF_ITEMS.quests.length + PDF_ITEMS.expedition.length}`);
  console.log(`  Matched: ${totalMatched}`);
  console.log(`  Not found: ${notFound.length}`);

  if (notFound.length > 0) {
    console.log(`\n⚠️  Items not found in API:`);
    notFound.forEach(item => console.log(`    - ${item}`));
  }

  // Write the mapping
  const output = {
    categories,
    notes: 'This file contains manual categorizations from the PDF that cannot be automatically determined from the API'
  };

  const outputPath = join(process.cwd(), 'data', 'manual-categories.json');
  writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`\n✅ Wrote ${totalMatched} mappings to ${outputPath}`);
}

main().catch(console.error);
