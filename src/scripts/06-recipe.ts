/**
 * Get full recipe details
 *
 * !! This endpoint costs 1 credit per call !!
 *
 * Fetches complete recipe including ingredients, instructions,
 * and nutrition information.
 *
 * Usage:
 *   npm run recipe -- --id=abc123
 */

import { apiRequest, RecipeApiError } from '../client.js';
import {
  header,
  subheader,
  label,
  formatDuration,
  parseArgs,
  highlight,
  warning,
} from '../utils.js';
import type { RecipeResponse } from '../../types/api.js';

async function main() {
  const args = parseArgs();
  const recipeId = args.id;

  if (!recipeId) {
    console.log('\nGet full recipe details\n');
    warning('!! Note: This endpoint costs 1 credit per request !!\n');
    console.log('Usage: npm run recipe -- --id=<recipe_id>\n');
    console.log('To find recipe IDs:');
    console.log('  1. Run `npm run browse` or `npm run search`');
    console.log('  2. Copy the ID from a recipe you want\n');
    return;
  }

  warning('\n!! Fetching full recipe (costs 1 credit) ...\n');

  try {
    const response = await apiRequest<RecipeResponse>(`/api/v1/recipes/${recipeId}`);
    const recipe = response.data;

    header(recipe.name);

    console.log(recipe.description);
    console.log();

    // Overview
    label('Category', `${recipe.category} | ${recipe.cuisine}`);
    label('Difficulty', recipe.difficulty);
    label('Active time', formatDuration(recipe.meta.active_time));
    label('Passive time', formatDuration(recipe.meta.passive_time));
    label('Total time', formatDuration(recipe.meta.total_time));
    label('Yields', recipe.meta.yields);
    if (recipe.dietary.flags.length > 0) {
      label('Dietary', recipe.dietary.flags.join(', '));
    }
    if (recipe.meta.overnight_required) {
      warning('  ** Requires overnight preparation **');
    }

    // Nutrition
    const nutrition = recipe.nutrition.per_serving;
    console.log();
    subheader('Nutrition (per serving)');
    label('Calories', `${Math.round(nutrition.calories)} kcal`);
    label('Protein', `${Math.round(nutrition.protein_g)}g`);
    label('Carbs', `${Math.round(nutrition.carbohydrates_g)}g`);
    label('Fat', `${Math.round(nutrition.fat_g)}g`);
    if (nutrition.fiber_g) {
      label('Fiber', `${Math.round(nutrition.fiber_g)}g`);
    }

    // Equipment
    if (recipe.equipment.length > 0) {
      console.log();
      subheader('Equipment');
      for (const item of recipe.equipment) {
        const alt = item.alternative ? ` (or: ${item.alternative})` : '';
        const req = item.required ? '' : ' [optional]';
        console.log(`  * ${item.name}${alt}${req}`);
      }
    }

    // Ingredients
    console.log();
    subheader('Ingredients');
    for (const group of recipe.ingredients) {
      if (group.group_name) {
        console.log(`\n  [${group.group_name}]`);
      }
      for (const ing of group.items) {
        const amount = ing.unit ? `${ing.quantity} ${ing.unit}` : `${ing.quantity}`;
        const prep = ing.preparation ? `, ${ing.preparation}` : '';
        const notes = ing.notes ? ` (${ing.notes})` : '';
        console.log(`  * ${amount} ${ing.name}${prep}${notes}`);
      }
    }

    // Instructions
    console.log();
    subheader('Instructions');
    for (const step of recipe.instructions) {
      const duration = step.structured?.duration
        ? ` ${highlight(`[${formatDuration(step.structured.duration)}]`)}`
        : '';
      console.log(`\n  ${step.step_number}. [${step.phase}] ${step.text}${duration}`);

      if (step.tips && step.tips.length > 0) {
        for (const tip of step.tips) {
          console.log(`     >> ${tip}`);
        }
      }
    }

    // Chef notes
    if (recipe.chef_notes && recipe.chef_notes.length > 0) {
      console.log();
      subheader('Chef Notes');
      for (const note of recipe.chef_notes) {
        console.log(`  * ${note}`);
      }
    }

    // Cultural context
    if (recipe.cultural_context) {
      console.log();
      subheader('About This Dish');
      console.log(`  ${recipe.cultural_context}`);
    }

    // Storage
    if (recipe.storage) {
      console.log();
      subheader('Storage');
      if (recipe.storage.does_not_keep) {
        console.log('  Best eaten immediately.');
      }
      if (recipe.storage.refrigerator) {
        console.log(`  Refrigerator: ${recipe.storage.refrigerator.notes || recipe.storage.refrigerator.duration}`);
      }
      if (recipe.storage.reheating) {
        console.log(`  Reheating: ${recipe.storage.reheating}`);
      }
    }

    // Usage info if available
    if (response.usage) {
      console.log('\n--- API Usage ---');
      console.log(`Monthly remaining: ${response.usage.monthly_remaining.toLocaleString()}`);
      console.log(`Daily remaining:   ${response.usage.daily_remaining.toLocaleString()}`);
    }

    console.log();
  } catch (error) {
    if (error instanceof RecipeApiError && error.code === 'NOT_FOUND') {
      console.error(`\n[X] Recipe not found: ${recipeId}\n`);
      console.error('Make sure the ID is correct. Find IDs with:');
      console.error('  npm run browse');
      console.error('  npm run search -- --q="..."\n');
    } else {
      throw error;
    }
  }
}

main().catch(console.error);
