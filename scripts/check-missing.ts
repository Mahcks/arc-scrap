/**
 * Check which PDF items are missing from the generated items.json
 */

import { fetchAllItems } from '../lib/api';
import manualCategories from '../data/manual-categories.json';
import generatedItems from '../data/items.json';

async function main() {
  const allItems = await fetchAllItems();
  const generatedNames = new Set(generatedItems.map(item => item.name));

  console.log('🔍 Checking for missing items...\n');

  const categoryIds = Object.keys(manualCategories.categories);
  console.log(`Total PDF items in manual-categories.json: ${categoryIds.length}`);
  console.log(`Total items in generated items.json: ${generatedItems.length}`);
  console.log(`Missing: ${categoryIds.length - generatedItems.length}\n`);

  const missing: { name: string; reason: string }[] = [];

  for (const itemId of categoryIds) {
    const apiItem = allItems.find(item => item.id === itemId);

    if (!apiItem) {
      missing.push({ name: itemId, reason: 'Not found in API' });
      continue;
    }

    if (!generatedNames.has(apiItem.name)) {
      if (apiItem.value === 0) {
        missing.push({ name: apiItem.name, reason: 'Value is 0 (not sellable)' });
      } else {
        missing.push({ name: apiItem.name, reason: 'Unknown' });
      }
    }
  }

  if (missing.length > 0) {
    console.log('❌ Missing items:');
    missing.forEach(({ name, reason }) => {
      console.log(`  - ${name}: ${reason}`);
    });
  } else {
    console.log('✅ All PDF items are present!');
  }
}

main().catch(console.error);
