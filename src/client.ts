import 'dotenv/config';

const BASE_URL = 'https://recipe-api.com';

export class RecipeApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'RecipeApiError';
  }
}

function getApiKey(): string {
  const key = process.env.RECIPE_API_KEY;

  if (!key) {
    console.error('\n[X] Missing API key!\n');
    console.error('To fix this:');
    console.error('  1. Copy .env.example to .env');
    console.error('  2. Add your API key from https://recipe-api.com\n');
    process.exit(1);
  }

  if (!key.startsWith('rapi_')) {
    console.error('\n[X] Invalid API key format!\n');
    console.error('API keys should start with "rapi_"');
    console.error('Get your key from https://recipe-api.com\n');
    process.exit(1);
  }

  return key;
}

export async function apiRequest<T>(
  endpoint: string,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  const apiKey = getApiKey();

  // Build URL with query params
  const url = new URL(endpoint, BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'X-API-Key': apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      await handleErrorResponse(response);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof RecipeApiError) {
      throw error;
    }

    // Network or other errors
    console.error('\n[X] Network error!\n');
    console.error('Could not connect to the API. Please check:');
    console.error('  - Your internet connection');
    console.error('  - The API status at https://recipe-api.com\n');
    process.exit(1);
  }
}

async function handleErrorResponse(response: Response): Promise<never> {
  const status = response.status;

  switch (status) {
    case 401:
      console.error('\n[X] Authentication failed!\n');
      console.error('Your API key was rejected. Please check:');
      console.error('  - The key is copied correctly (no extra spaces)');
      console.error('  - The key is active in your dashboard\n');
      process.exit(1);

    case 403:
      console.error('\n[X] Access denied!\n');
      console.error('Your account may not have access to this endpoint.');
      console.error('Check your plan limits at https://recipe-api.com\n');
      process.exit(1);

    case 404:
      throw new RecipeApiError('Resource not found', 404, 'NOT_FOUND');

    case 429:
      console.error('\n[X] Rate limit exceeded!\n');
      console.error('You have exceeded your API limits.');
      console.error('Check your remaining quota in the dashboard.\n');
      process.exit(1);

    default:
      console.error(`\n[X] API error (${status})!\n`);
      const body = await response.text();
      console.error('Response:', body.slice(0, 500));
      process.exit(1);
  }
}

export function showUsage(usage: {
  monthly_remaining: number;
  daily_remaining: number;
}): void {
  console.log('\n--- API Usage ---');
  console.log(`Monthly remaining: ${usage.monthly_remaining.toLocaleString()}`);
  console.log(`Daily remaining:   ${usage.daily_remaining.toLocaleString()}`);
}
