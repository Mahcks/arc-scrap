/**
 * Script to calculate component values from API data
 * This helps ensure ROI calculations are accurate
 */

// Use global fetch available in Node 18+
const fetch = globalThis.fetch || require('node-fetch');

async function getAllItems() {
  console.log('Fetching all items from API...');
  const response = await fetch('https://arcdata.mahcks.com/v1/items');
  const data = await response.json();

  console.log(`Found ${data.items.length} items\n`);

  // Fetch full data for all items
  const itemPromises = data.items.map(item =>
    fetch(`https://arcdata.mahcks.com/v1/items/${item.id}`)
      .then(res => res.json())
      .catch(() => null)
  );

  const items = (await Promise.all(itemPromises)).filter(item => item !== null);
  return items;
}

function analyzeComponents(items) {
  const componentUsage = new Map();

  // Collect all components and where they're used
  items.forEach(item => {
    if (item.recyclesInto) {
      Object.entries(item.recyclesInto).forEach(([component, amount]) => {
        if (!componentUsage.has(component)) {
          componentUsage.set(component, []);
        }
        componentUsage.get(component).push({
          itemName: item.name?.en || item.id,
          itemValue: item.value || 0,
          amount: amount,
          allComponents: item.recyclesInto
        });
      });
    }
  });

  return componentUsage;
}

function calculateComponentValue(componentName, usageData) {
  // Find items where this is the ONLY component (easiest to calculate)
  const soloUses = usageData.filter(use =>
    Object.keys(use.allComponents).length === 1
  );

  if (soloUses.length > 0) {
    const use = soloUses[0];
    return Math.round(use.itemValue / use.amount);
  }

  return null;
}

async function main() {
  const items = await getAllItems();
  const componentUsage = analyzeComponents(items);

  console.log('=== Component Analysis ===\n');

  const componentValues = {};
  const unknownComponents = [];

  // Sort components by name
  const sortedComponents = Array.from(componentUsage.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  for (const [component, uses] of sortedComponents) {
    const calculatedValue = calculateComponentValue(component, uses);

    if (calculatedValue !== null) {
      componentValues[component] = calculatedValue;
      console.log(`✓ ${component}: ${calculatedValue}`);
    } else {
      unknownComponents.push({ component, uses });
      console.log(`? ${component}: NEEDS MANUAL CALCULATION (used in ${uses.length} items)`);

      // Show first few examples
      uses.slice(0, 3).forEach(use => {
        const components = Object.entries(use.allComponents)
          .map(([c, amt]) => `${amt}x ${c}`)
          .join(', ');
        console.log(`  - ${use.itemName} (${use.itemValue} coins) → ${components}`);
      });
    }
  }

  console.log('\n=== TypeScript Export ===\n');
  console.log('export const COMPONENT_VALUES: Record<string, number> = {');

  Object.entries(componentValues)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([component, value]) => {
      console.log(`  ${component}: ${value},`);
    });

  console.log('};\n');

  console.log(`\n✓ Calculated: ${Object.keys(componentValues).length}`);
  console.log(`? Unknown: ${unknownComponents.length}`);
}

main().catch(console.error);
