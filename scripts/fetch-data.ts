/**
 * Data Fetching Script
 * Fetches items from ARC Raiders API, calculates ROI, and merges with manual categories
 */

import { fetchAllItems, fetchItem, calculateROI, getItemImageURL, type APIItem } from '../lib/api';
import manualCategories from '../data/manual-categories.json';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface ProcessedItem {
  name: string;
  value: number;
  roi: number;
  rarity?: string;
  weight?: number;
  valuePerWeight?: number;
  image?: string;
  category?: 'safe' | 'quests' | 'expedition';
  breaksInto?: Array<{
    name: string;
    amount: number;
    value: number;
  }>;
}

async function main() {
  console.log('🔄 Fetching items from ARC Raiders API...');

  const allItems = await fetchAllItems();
  console.log(`✅ Fetched ${allItems.length} items`);

  console.log('📊 Processing items with recycling data...');

  const processedItems: ProcessedItem[] = [];
  let processedCount = 0;

  // Process each item
  for (const basicItem of allItems) {
    // Only process items that have a category from the PDF
    const category = manualCategories.categories[basicItem.id as keyof typeof manualCategories.categories];
    if (!category) {
      continue; // Skip items not in the PDF
    }

    // Note: We include items with value 0 as they may still be in the PDF

    // Fetch full item details to get breaksInto data
    let fullItem: APIItem;
    try {
      fullItem = await fetchItem(basicItem.id);
    } catch (error) {
      console.warn(`⚠️  Failed to fetch details for ${basicItem.name}, using basic data`);
      fullItem = basicItem;
    }

    // Calculate ROI
    const roi = calculateROI(fullItem);

    const processedItem: ProcessedItem = {
      name: fullItem.name,
      value: fullItem.value,
      roi: Math.round(roi * 10) / 10, // Round to 1 decimal
      rarity: fullItem.rarity || undefined,
      weight: fullItem.weight,
      valuePerWeight: fullItem.weight && fullItem.weight > 0
        ? Math.round((fullItem.value / fullItem.weight) * 10) / 10
        : undefined,
      image: getItemImageURL(fullItem.icon),
      category: category as 'safe' | 'quests' | 'expedition',
    };

    // Add breaksInto data if available
    if (fullItem.breaksInto && fullItem.breaksInto.length > 0) {
      processedItem.breaksInto = fullItem.breaksInto.map(component => ({
        name: component.item.name,
        amount: component.amount,
        value: component.item.value,
      }));
    }

    processedItems.push(processedItem);
    processedCount++;

    // Rate limiting - be nice to the API
    if (processedCount % 10 === 0) {
      console.log(`  Processed ${processedCount}/${allItems.length} items...`);
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
    }
  }

  console.log(`✅ Processed ${processedItems.length} items with pricing data`);

  // Sort by ROI descending
  processedItems.sort((a, b) => b.roi - a.roi);

  // Write to file
  const outputPath = join(process.cwd(), 'data', 'items.json');
  writeFileSync(outputPath, JSON.stringify(processedItems, null, 2));

  console.log(`✅ Wrote data to ${outputPath}`);
  console.log('\n📈 Statistics:');
  console.log(`  Total items: ${processedItems.length}`);
  console.log(`  Items with positive ROI: ${processedItems.filter(i => i.roi > 0).length}`);
  console.log(`  Items with negative ROI: ${processedItems.filter(i => i.roi < 0).length}`);
  console.log(`  Items that can't be recycled: ${processedItems.filter(i => i.roi === 0).length}`);
  console.log(`  Categorized items: ${processedItems.filter(i => i.category).length}`);
}

main().catch(console.error);
