/**
 * Verify ROI calculations against cheat sheet values
 * This helps identify which component values need adjustment
 */

// Use global fetch available in Node 18+
const fetch = globalThis.fetch || require('node-fetch');

// Known ROI values from cheat sheet (Page 1 - Safe to Recycle)
const CHEAT_SHEET_ROI = {
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
};

async function verifyROI() {
  console.log('Fetching all items from API...');

  // Fetch list of all item IDs
  const listResponse = await fetch('https://arcdata.mahcks.com/v1/items');
  const listData = await listResponse.json();

  console.log(`Found ${listData.items.length} items, fetching details...\n`);

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

  console.log('Verifying ROI values...\n');

  const results = [];

  for (const [itemName, expectedROI] of Object.entries(CHEAT_SHEET_ROI)) {
    const item = allItems.find(item =>
      item.name?.en?.toLowerCase() === itemName.toLowerCase()
    );

    if (!item) {
      console.log(`❌ "${itemName}" - NOT FOUND IN API`);
      continue;
    }

    const sellValue = item.value || 0;
    const recyclesInto = item.recyclesInto || {};

    // Calculate what the recycle value SHOULD be for this ROI
    const targetRecycleValue = Math.round(sellValue * (1 + expectedROI / 100));

    results.push({
      name: itemName,
      sellValue,
      expectedROI,
      targetRecycleValue,
      recyclesInto,
    });
  }

  console.log('=== ROI Verification Results ===\n');

  for (const result of results) {
    console.log(`📦 ${result.name}`);
    console.log(`   Sell: ${result.sellValue} coins`);
    console.log(`   Expected ROI: ${result.expectedROI}%`);
    console.log(`   Target Recycle Value: ${result.targetRecycleValue}`);
    console.log(`   Recycles Into:`);

    const components = Object.entries(result.recyclesInto);
    if (components.length === 0) {
      console.log(`      (none - doesn't recycle!)`);
    } else {
      for (const [component, amount] of components) {
        const valuePerComponent = Math.round(result.targetRecycleValue / amount);
        console.log(`      ${amount}x ${component} → ${valuePerComponent} each`);
      }
    }
    console.log();
  }
}

verifyROI().catch(console.error);
