/**
 * Sync item data from ardb.app API
 * Run with: bun run scripts/sync-from-api.ts
 */

interface APIItem {
  id: string;
  name: string;
  description: string;
  rarity: string | null;
  type: string;
  value: number;
  icon: string;
  foundIn: string[];
}

async function syncItems() {
  console.log('Fetching items from ardb.app API...');

  const response = await fetch('https://ardb.app/api/items');
  const items: APIItem[] = await response.json();

  console.log(`Fetched ${items.length} items from API`);

  // Map API items to our format
  const mappedItems = items.map(item => ({
    name: item.name,
    value: item.value,
    rarity: item.rarity || undefined,
    image: item.icon ? `https://ardb.app${item.icon}` : undefined,
    type: item.type,
    description: item.description,
  }));

  // Sort by value descending
  mappedItems.sort((a, b) => b.value - a.value);

  // Log some stats
  const rarities = mappedItems.reduce((acc, item) => {
    const rarity = item.rarity || 'unknown';
    acc[rarity] = (acc[rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('\nRarity distribution:');
  Object.entries(rarities).forEach(([rarity, count]) => {
    console.log(`  ${rarity}: ${count}`);
  });

  console.log('\nSample items:');
  mappedItems.slice(0, 5).forEach(item => {
    console.log(`  ${item.name} - ${item.value} coins (${item.rarity || 'no rarity'})`);
  });

  console.log('\n✅ Data synced successfully!');
  console.log('📝 To use this data, you can merge it with your existing items.json');
  console.log('💾 Consider saving to a new file: data/api-items.json');

  return mappedItems;
}

// Run the sync
syncItems().catch(console.error);
