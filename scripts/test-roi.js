// Test ROI calculation with updated values
const COMPONENT_VALUES = {
  metal_parts: 50,
  assorted_seeds: 100,
  speaker_component: 500,
  sensors: 500,
  simple_gun_parts: 40,
  plastic_parts: 50,
  processor: 300,
};

function calculateRecyclingValue(recyclesInto) {
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

// Test cases from cheat sheet
const testItems = [
  { name: 'Moss', sell: 500, recyclesInto: { assorted_seeds: 3 }, expectedROI: -40 },
  { name: 'Unusable Weapon', sell: 2000, recyclesInto: { metal_parts: 4, simple_gun_parts: 5 }, expectedROI: -90 },
  { name: 'Alarm Clock', sell: 1000, recyclesInto: { plastic_parts: 6, processor: 1 }, expectedROI: -70 },
  { name: 'Radio', sell: 1000, recyclesInto: { speaker_component: 1, sensors: 1 }, expectedROI: -50 },
];

console.log('=== ROI Verification ===\n');
for (const item of testItems) {
  const recycleValue = calculateRecyclingValue(item.recyclesInto);
  const actualROI = calculateROI(item.sell, recycleValue);
  const match = actualROI === item.expectedROI ? '✓' : '✗';
  console.log(`${match} ${item.name}`);
  console.log(`   Sell: ${item.sell}, Recycle: ${recycleValue}, ROI: ${actualROI}% (expected: ${item.expectedROI}%)`);
  if (actualROI !== item.expectedROI) {
    console.log(`   ⚠️  MISMATCH!`);
  }
  console.log();
}
