/**
 * Search recipes by keyword
 *
 * Demonstrates the search functionality with the `q` parameter.
 *
 * Usage:
 *   npm run search -- --q="chicken"
 *   npm run search -- --q="pasta" --page=2
 */

import { apiRequest } from '../client.js';
import {
  header,
  label,
  divider,
  formatDuration,
  parseArgs,
  highlight,
  truncate,
} from '../utils.js';
import type { RecipeListResponse } from '../../types/api.js';

async function main() {
  const args = parseArgs();
  const query = args.q || args.query;

  if (!query) {
    console.log('\nSearch for recipes by keyword\n');
    console.log('Usage: npm run search -- --q="your search term"\n');
    console.log('Examples:');
    console.log('  npm run search -- --q="chicken"');
    console.log('  npm run search -- --q="quick dinner"');
    console.log('  npm run search -- --q="chocolate" --page=2\n');
    return;
  }

  header(`Search: "${query}"`);

  const response = await apiRequest<RecipeListResponse>('/api/v1/recipes', {
    q: query,
    page: parseInt(args.page) || 1,
    per_page: parseInt(args.per_page) || 10,
  });

  const { data: recipes, meta } = response;

  if (recipes.length === 0) {
    console.log('No recipes found matching your search.\n');
    console.log('Try:');
    console.log('  * Different keywords');
    console.log('  * Broader terms');
    console.log('  * Check spelling\n');
    return;
  }

  console.log(`Found ${meta.total} recipes (showing ${recipes.length})\n`);

  for (const recipe of recipes) {
    console.log(`${highlight(recipe.name)}`);
    label('ID', recipe.id);
    label('Category', `${recipe.category} | ${recipe.cuisine}`);
    label('Time', formatDuration(recipe.meta.total_time));
    label('Calories', `${Math.round(recipe.nutrition_summary.calories)} kcal`);
    console.log(`  ${truncate(recipe.description, 80)}`);
    divider();
  }

  console.log('\n>> Get full recipe: npm run recipe -- --id=<recipe_id>\n');
}

main().catch(console.error);
