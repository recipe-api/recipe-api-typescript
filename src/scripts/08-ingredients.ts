/**
 * Browse and search ingredients
 *
 * This script demonstrates searching and filtering ingredients.
 * Use ingredient IDs to filter recipes by ingredients.
 *
 * Usage:
 *   npm run ingredients
 *   npm run ingredients -- --q="chicken"
 *   npm run ingredients -- --category="Vegetables"
 *   npm run ingredients -- --q="tomato" --category="Vegetables"
 */

import { apiRequest } from '../client.js';
import { header, divider, parseArgs } from '../utils.js';
import type { IngredientsResponse } from '../../types/api.js';

async function main() {
  const args = parseArgs();
  const q = args.q as string | undefined;
  const category = args.category as string | undefined;
  const page = args.page ? Number(args.page) : 1;
  const perPage = args.per_page ? Number(args.per_page) : 20;

  header('Browse Ingredients');

  if (q) console.log(`Search: "${q}"`);
  if (category) console.log(`Category: ${category}`);
  console.log();

  const response = await apiRequest<IngredientsResponse>('/api/v1/ingredients', {
    q,
    category,
    page,
    per_page: perPage,
  });

  console.log(`Found ${response.meta.total.toLocaleString()} ingredients (page ${response.meta.page}):\n`);

  for (const ingredient of response.data) {
    console.log(`  ${ingredient.name}`);
    console.log(`    ID: ${ingredient.id}`);
    console.log(`    Category: ${ingredient.category}`);
    console.log(`    Source: ${ingredient.source}`);
    console.log();
  }

  divider();

  console.log('\nUsage examples:');
  console.log('  npm run ingredients -- --q="chicken"');
  console.log('  npm run ingredients -- --category="Vegetables"');
  console.log('  npm run ingredients -- --page=2');
  console.log('\nUse ingredient IDs to filter recipes:');
  console.log('  npm run filter -- --ingredients="<id1>,<id2>"\n');
}

main().catch(console.error);
