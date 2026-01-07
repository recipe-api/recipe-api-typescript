/**
 * List all cuisines
 *
 * Fetches the available cuisines you can filter recipes by.
 *
 * Usage: npm run cuisines
 */

import { apiRequest } from '../client.js';
import { header, divider } from '../utils.js';
import type { CuisinesResponse } from '../../types/api.js';

async function main() {
  header('Available Cuisines');

  const response = await apiRequest<CuisinesResponse>('/api/v1/cuisines');

  console.log(`Found ${response.data.length} cuisines:\n`);

  // Sort by count descending
  const sorted = [...response.data].sort((a, b) => b.count - a.count);

  for (const cuisine of sorted) {
    const bar = '█'.repeat(Math.min(Math.floor(cuisine.count / 20), 20));
    console.log(`  ${cuisine.name.padEnd(20)} ${bar} ${cuisine.count}`);
  }

  divider();
  console.log('\n>> Next step: Run `npm run browse` to see recipes\n');
}

main().catch(console.error);
