/**
 * Browse recipes
 *
 * Lists recipes with pagination. Shows basic recipe info
 * without fetching full details (which costs credits).
 *
 * Usage:
 *   npm run browse
 *   npm run browse -- --page=2
 *   npm run browse -- --per_page=5
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
  const page = parseInt(args.page) || 1;
  const perPage = parseInt(args.per_page) || 10;

  header('Browse Recipes');

  const response = await apiRequest<RecipeListResponse>('/api/v1/recipes', {
    page,
    per_page: perPage,
  });

  const { data: recipes, meta } = response;

  const totalPages = Math.ceil(meta.total / meta.per_page);
  console.log(`Page ${meta.page} of ${totalPages} (${meta.total} total recipes)\n`);

  for (const recipe of recipes) {
    console.log(`${highlight(recipe.name)}`);
    label('ID', recipe.id);
    label('Category', `${recipe.category} | ${recipe.cuisine}`);
    label('Difficulty', recipe.difficulty);
    label('Time', formatDuration(recipe.meta.total_time));
    if (recipe.dietary.flags.length > 0) {
      label('Dietary', recipe.dietary.flags.slice(0, 4).join(', '));
    }
    label('Calories', `${Math.round(recipe.nutrition_summary.calories)} kcal`);
    console.log(`  ${truncate(recipe.description, 80)}`);
    divider();
  }

  console.log('\n>> Tips:');
  console.log('   * Browse more: npm run browse -- --page=2');
  console.log('   * Search: npm run search -- --q="pasta"');
  console.log('   * Get full recipe: npm run recipe -- --id=<recipe_id>\n');
}

main().catch(console.error);
