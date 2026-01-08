/**
 * List all ingredient categories
 *
 * This script demonstrates fetching ingredient categories with counts.
 *
 * Usage: npm run ingredient-categories
 */

import { apiRequest } from '../client.js';
import { header, divider } from '../utils.js';
import type { IngredientCategoriesResponse } from '../../types/api.js';

async function main() {
  header('Ingredient Categories');

  const response = await apiRequest<IngredientCategoriesResponse>('/api/v1/ingredient-categories');

  console.log(`Found ${response.data.length} ingredient categories:\n`);

  // Sort by count descending
  const sorted = [...response.data].sort((a, b) => b.count - a.count);

  for (const category of sorted.slice(0, 20)) {
    console.log(`  * ${category.name} (${category.count.toLocaleString()} ingredients)`);
  }

  if (sorted.length > 20) {
    console.log(`  ... and ${sorted.length - 20} more`);
  }

  divider();
  console.log('\n>> Next step: Run `npm run ingredients` to browse ingredients\n');
}

main().catch(console.error);
