/**
 * Solve for component values that match cheat sheet ROI
 * Uses known values and works through items systematically
 */

// Known ROI from cheat sheet with actual recycling data
const knownItems = [
  // Simple cases - single component or known components
  { name: 'Moss', sell: 500, roi: -40, recyclesInto: { assorted_seeds: 3 } },
  { name: 'Diving Goggles', sell: 640, roi: -50, recyclesInto: { rubber_parts: 12 } },
  { name: 'Industrial Charger', sell: 1000, roi: -50, recyclesInto: { metal_parts: 5, voltage_converter: 1 } },
  { name: 'Radio', sell: 1000, roi: -50, recyclesInto: { speaker_component: 1, sensors: 1 } },
  { name: 'Unusable Weapon', sell: 2000, roi: -90, recyclesInto: { metal_parts: 4, simple_gun_parts: 5 } },
  { name: 'Alarm Clock', sell: 1000, roi: -70, recyclesInto: { plastic_parts: 6, processor: 1 } },
  { name: 'Remote Control', sell: 1000, roi: -50, recyclesInto: { plastic_parts: 7, sensors: 1 } },
];

const componentValues = {};

// Step 1: Solve single-component items
console.log('=== Step 1: Single Component Items ===\n');

for (const item of knownItems) {
  const components = Object.keys(item.recyclesInto);
  if (components.length === 1) {
    const component = components[0];
    const amount = item.recyclesInto[component];
    const targetRecycleValue = Math.round(item.sell * (1 + item.roi / 100));
    const value = Math.round(targetRecycleValue / amount);

    componentValues[component] = value;
    console.log(`${item.name}:`);
    console.log(`  ${component} = ${targetRecycleValue} / ${amount} = ${value}`);
    console.log();
  }
}

// Step 2: Use base component values from game design (all base components = 50)
console.log('\n=== Step 2: Assuming Base Components = 50 ===\n');

const baseComponents = ['metal_parts', 'plastic_parts', 'rubber_parts', 'fabric', 'chemicals'];
for (const component of baseComponents) {
  if (!componentValues[component]) {
    componentValues[component] = 50;
    console.log(`${component} = 50 (base component standard)`);
  }
}

// Step 3: Solve two-component items where one is known
console.log('\n=== Step 3: Two Component Items (one known) ===\n');

let changed = true;
let iterations = 0;
while (changed && iterations < 10) {
  changed = false;
  iterations++;

  for (const item of knownItems) {
    const components = Object.keys(item.recyclesInto);
    const unknown = components.filter(c => componentValues[c] === undefined);

    if (unknown.length === 1) {
      // We can solve for the one unknown
      const unknownComponent = unknown[0];
      const targetRecycleValue = Math.round(item.sell * (1 + item.roi / 100));

      let knownValue = 0;
      for (const [component, amount] of Object.entries(item.recyclesInto)) {
        if (component !== unknownComponent) {
          knownValue += (componentValues[component] || 0) * amount;
        }
      }

      const remainingValue = targetRecycleValue - knownValue;
      const unknownAmount = item.recyclesInto[unknownComponent];
      const value = Math.round(remainingValue / unknownAmount);

      componentValues[unknownComponent] = value;
      changed = true;

      console.log(`${item.name}:`);
      console.log(`  Target recycle value: ${targetRecycleValue}`);
      console.log(`  Known components value: ${knownValue}`);
      console.log(`  Therefore: ${unknownComponent} = ${remainingValue} / ${unknownAmount} = ${value}`);
      console.log();
    }
  }
}

// Step 4: Verify all calculations
console.log('\n=== Step 4: Verification ===\n');

for (const item of knownItems) {
  const targetRecycleValue = Math.round(item.sell * (1 + item.roi / 100));
  let calculatedRecycleValue = 0;

  for (const [component, amount] of Object.entries(item.recyclesInto)) {
    const value = componentValues[component] || 0;
    calculatedRecycleValue += value * amount;
  }

  const calculatedROI = Math.round(((calculatedRecycleValue - item.sell) / item.sell) * 100);
  const match = calculatedROI === item.roi ? '✓' : '✗';

  console.log(`${match} ${item.name}`);
  console.log(`   Expected: ${item.roi}%, Got: ${calculatedROI}%`);
  console.log(`   Target recycle: ${targetRecycleValue}, Calculated: ${calculatedRecycleValue}`);
  console.log();
}

// Step 5: Output TypeScript
console.log('\n=== Step 5: TypeScript Export ===\n');
console.log('Component values derived from cheat sheet ROI:\n');

const sorted = Object.entries(componentValues).sort((a, b) => a[0].localeCompare(b[0]));
for (const [component, value] of sorted) {
  console.log(`  ${component}: ${value},`);
}
