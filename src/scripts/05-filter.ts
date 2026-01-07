/**
 * Filter recipes by multiple criteria
 *
 * Demonstrates combining multiple filter parameters.
 *
 * Usage:
 *   npm run filter -- --category="Breakfast"
 *   npm run filter -- --cuisine="Italian" --difficulty="Intermediate"
 *   npm run filter -- --dietary="Vegetarian" --max_calories=500
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

  // Check if any filters provided
  const hasFilters =
    args.category ||
    args.cuisine ||
    args.difficulty ||
    args.dietary ||
    args.max_calories ||
    args.min_protein;

  if (!hasFilters) {
    console.log('\nFilter recipes by multiple criteria\n');
    console.log('Available filters:');
    console.log('  --category     Recipe category (Breakfast, Main, Dessert, etc.)');
    console.log('  --cuisine      Cuisine type (run `npm run cuisines` for list)');
    console.log('  --difficulty   Beginner, Intermediate, or Advanced');
    console.log('  --dietary      Vegetarian, Vegan, Gluten-Free, etc. (run `npm run categories`)');
    console.log('  --max_calories Maximum calories per serving');
    console.log('  --min_protein  Minimum protein in grams\n');
    console.log('Examples:');
    console.log('  npm run filter -- --cuisine="Italian" --difficulty="Beginner"');
    console.log('  npm run filter -- --dietary="Vegan" --max_calories=400');
    console.log('  npm run filter -- --category="Dessert" --cuisine="French"\n');
    return;
  }

  // Build filter description for header
  const filterDesc = Object.entries(args)
    .filter(([k]) =>
      ['category', 'cuisine', 'difficulty', 'dietary', 'max_calories', 'min_protein'].includes(k)
    )
    .map(([k, v]) => `${k}=${v}`)
    .join(', ');

  header(`Filtered Recipes`);
  console.log(`Filters: ${filterDesc}\n`);

  const response = await apiRequest<RecipeListResponse>('/api/v1/recipes', {
    category: args.category,
    cuisine: args.cuisine,
    difficulty: args.difficulty,
    dietary: args.dietary,
    max_calories: args.max_calories ? parseInt(args.max_calories) : undefined,
    min_protein: args.min_protein ? parseInt(args.min_protein) : undefined,
    page: parseInt(args.page) || 1,
    per_page: parseInt(args.per_page) || 10,
  });

  const { data: recipes, meta } = response;

  if (recipes.length === 0) {
    console.log('No recipes match your filters.\n');
    console.log('Try relaxing some criteria.\n');
    return;
  }

  console.log(`Found ${meta.total} matching recipes\n`);

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

  console.log('\n>> Get full recipe: npm run recipe -- --id=<recipe_id>\n');
}

main().catch(console.error);
