/**
 * Merge API data (images, rarity) with existing ROI data
 * Run with: bun run scripts/merge-api-data.ts
 */

import fs from 'fs';
import path from 'path';

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

interface LocalItem {
  name: string;
  value: number;
  roi?: number;
  category?: string;
  weight?: number;
  amount?: number;
  phase?: number;
  image?: string;
  rarity?: string;
}

async function mergeData() {
  console.log('🔄 Fetching data from ardb.app API...');

  const response = await fetch('https://ardb.app/api/items');
  const apiItems: APIItem[] = await response.json();

  console.log(`✅ Fetched ${apiItems.length} items from API\n`);

  // Load existing data
  const itemsPath = path.join(process.cwd(), 'data', 'items.json');
  const itemsData = JSON.parse(fs.readFileSync(itemsPath, 'utf-8'));

  let enhancedCount = 0;
  let matchedCount = 0;

  // Helper to find API item by name (case-insensitive)
  const findAPIItem = (name: string): APIItem | undefined => {
    return apiItems.find(api =>
      api.name.toLowerCase() === name.toLowerCase()
    );
  };

  // Enhance safeToRecycle items
  console.log('📦 Enhancing Safe to Recycle items...');
  itemsData.safeToRecycle = itemsData.safeToRecycle.map((item: LocalItem) => {
    const apiItem = findAPIItem(item.name);
    if (apiItem && apiItem.icon) {
      matchedCount++;
      return {
        ...item,
        image: `https://ardb.app${apiItem.icon}`,
        rarity: apiItem.rarity || undefined,
      };
    }
    return item;
  });

  // Enhance expeditionProject items
  console.log('🚀 Enhancing Expedition Project items...');
  itemsData.expeditionProject = itemsData.expeditionProject.map((item: LocalItem) => {
    const apiItem = findAPIItem(item.name);
    if (apiItem && apiItem.icon) {
      matchedCount++;
      return {
        ...item,
        image: `https://ardb.app${apiItem.icon}`,
        rarity: apiItem.rarity || undefined,
      };
    }
    return item;
  });

  // Enhance keepForQuests items
  console.log('📋 Enhancing Quest items...');
  itemsData.keepForQuests = itemsData.keepForQuests.map((item: LocalItem) => {
    const apiItem = findAPIItem(item.name);
    if (apiItem && apiItem.icon) {
      matchedCount++;
      return {
        ...item,
        image: `https://ardb.app${apiItem.icon}`,
        rarity: apiItem.rarity || undefined,
      };
    }
    return item;
  });

  // Save enhanced data
  const backupPath = path.join(process.cwd(), 'data', 'items.backup.json');
  console.log(`\n💾 Creating backup at ${backupPath}...`);
  fs.writeFileSync(backupPath, JSON.stringify(itemsData, null, 2));

  const outputPath = path.join(process.cwd(), 'data', 'items.json');
  console.log(`💾 Saving enhanced data to ${outputPath}...`);
  fs.writeFileSync(outputPath, JSON.stringify(itemsData, null, 2));

  console.log('\n✨ Success!');
  console.log(`📊 Enhanced ${matchedCount} items with images and rarity`);
  console.log(`📦 Safe to Recycle: ${itemsData.safeToRecycle.length} items`);
  console.log(`🚀 Expedition: ${itemsData.expeditionProject.length} items`);
  console.log(`📋 Quests: ${itemsData.keepForQuests.length} items`);

  // Show some examples
  console.log('\n🎨 Sample enhanced items:');
  const samples = itemsData.safeToRecycle
    .filter((i: LocalItem) => i.image)
    .slice(0, 3);

  samples.forEach((item: LocalItem) => {
    console.log(`  • ${item.name} - ${item.rarity || 'no rarity'} - ${item.roi}% ROI`);
  });

  console.log('\n🎉 Data merge complete! Refresh your browser to see images and rarity badges.');
}

mergeData().catch(console.error);
