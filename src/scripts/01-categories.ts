/**
 * List all dietary flags
 *
 * This script demonstrates a simple discovery API call - fetching
 * the list of available dietary filters.
 *
 * Usage: npm run categories
 */

import { apiRequest } from '../client.js';
import { header, divider } from '../utils.js';
import type { DietaryFlagsResponse } from '../../types/api.js';

async function main() {
  header('Dietary Flags');

  const response = await apiRequest<DietaryFlagsResponse>('/api/v1/dietary-flags');

  console.log(`Found ${response.data.length} dietary options:\n`);

  // Sort by count descending
  const sorted = [...response.data].sort((a, b) => b.count - a.count);

  for (const flag of sorted.slice(0, 20)) {
    console.log(`  * ${flag.name} (${flag.count} recipes)`);
  }

  if (sorted.length > 20) {
    console.log(`  ... and ${sorted.length - 20} more`);
  }

  divider();
  console.log('\n>> Next step: Run `npm run cuisines` to see available cuisines\n');
}

main().catch(console.error);
