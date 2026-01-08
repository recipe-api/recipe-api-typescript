# Recipe API Starter

A hands-on TypeScript starter kit for exploring the [Recipe API](https://recipe-api.com).

Clone this repo, add your API key, and run interactive scripts to discover recipes, search, filter, and fetch full recipe details.

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm
- Recipe API key ([get one free](https://recipe-api.com))

### Setup

```bash
# 1. Clone this repository
git clone https://github.com/recipe-api/recipe-api-typescript.git
cd recipe-api-typescript

# 2. Install dependencies
npm install

# 3. Configure your API key
cp .env.example .env
# Edit .env and add your API key

# 4. Run your first script
npm run categories
```

## Available Scripts

| Script | Command | Description | Cost |
|--------|---------|-------------|------|
| Dietary | `npm run categories` | List dietary filters (Vegetarian, Vegan, etc.) | Free |
| Cuisines | `npm run cuisines` | List available cuisines | Free |
| Browse | `npm run browse` | Browse recipes with pagination | Free |
| Search | `npm run search -- --q="..."` | Search recipes by keyword | Free |
| Filter | `npm run filter -- --cuisine="..."` | Filter by multiple criteria | Free |
| Recipe | `npm run recipe -- --id="..."` | Get full recipe details | 1 credit |
| Ingredient Categories | `npm run ingredient-categories` | List ingredient categories | Free |
| Ingredients | `npm run ingredients -- --q="..."` | Search 10,000+ ingredients | Free |

## Usage Examples

### Discover What's Available

```bash
# See dietary filters (Vegetarian, Gluten-Free, etc.)
npm run categories

# See all cuisines with recipe counts
npm run cuisines
```

### Browse Recipes

```bash
# First page of recipes
npm run browse

# Specific page
npm run browse -- --page=3

# Change results per page
npm run browse -- --per_page=20
```

### Search Recipes

```bash
npm run search -- --q="chicken parmesan"
npm run search -- --q="quick breakfast" --page=2
```

### Filter Recipes

```bash
# By cuisine
npm run filter -- --cuisine="Italian"

# By difficulty (Beginner, Intermediate, Advanced)
npm run filter -- --difficulty="Intermediate"

# Combined filters
npm run filter -- --cuisine="Mexican" --dietary="Vegetarian" --max_calories=500

# All filter options
npm run filter -- --category="Breakfast" \
                  --cuisine="French" \
                  --difficulty="Intermediate" \
                  --dietary="Gluten-Free" \
                  --max_calories=600 \
                  --min_protein=20
```

### Get Full Recipe

```bash
# Find a recipe ID first
npm run search -- --q="lasagna"

# Then fetch full details (costs 1 credit)
npm run recipe -- --id=c0582be3-10bf-4077-ba54-b6ff6f236e53
```

### Browse Ingredients

```bash
# List ingredient categories
npm run ingredient-categories

# Search ingredients by name
npm run ingredients -- --q="chicken"

# Filter by category
npm run ingredients -- --category="Vegetables"

# Use ingredient IDs to filter recipes
npm run filter -- --ingredients="<ingredient-id-1>,<ingredient-id-2>"
```

## Understanding API Credits

The Recipe API uses a credit system:

| Endpoint Type | Cost |
|--------------|------|
| Discovery (dietary flags, cuisines) | Free |
| Browse & Search | Free |
| Full Recipe Details | 1 credit |

Your usage is shown after fetching a full recipe:

```
--- API Usage ---
Monthly remaining: 4,999
Daily remaining:   499
```

Check your quota at [recipe-api.com](https://recipe-api.com).

## Project Structure

```
recipe-api-starter/
├── .env.example           # API key template
├── package.json           # Scripts and dependencies
├── tsconfig.json          # TypeScript configuration
│
├── src/
│   ├── client.ts          # API client with auth & error handling
│   ├── utils.ts           # Terminal output formatting
│   └── scripts/           # Interactive example scripts
│       ├── 01-categories.ts   # Dietary flags
│       ├── 02-cuisines.ts     # Available cuisines
│       ├── 03-browse.ts       # Browse with pagination
│       ├── 04-search.ts       # Keyword search
│       ├── 05-filter.ts       # Multi-criteria filter
│       ├── 06-recipe.ts       # Full recipe details
│       ├── 07-ingredient-categories.ts  # Ingredient categories
│       └── 08-ingredients.ts  # Browse/search ingredients
│
└── types/
    └── api.ts             # TypeScript type definitions
```

## Using the API Client in Your Code

Import the client in your own scripts:

```typescript
import { apiRequest } from './src/client.js';
import type { RecipeListResponse } from './types/api.js';

const response = await apiRequest<RecipeListResponse>('/api/v1/recipes', {
  cuisine: 'Italian',
  difficulty: 'Intermediate',
});

console.log(response.data); // Array of recipes
console.log(response.meta); // Pagination info
```

## Troubleshooting

### "Missing API key"

Make sure you've created `.env` with your key:

```bash
cp .env.example .env
# Edit .env and add: RECIPE_API_KEY=rapi_your_key_here
```

### "Invalid API key format"

API keys should start with `rapi_`. Check for extra spaces or characters.

### "Rate limit exceeded"

You've hit your daily or monthly limit. Check your dashboard for reset times.

### "Resource not found"

The recipe ID doesn't exist. Double-check the ID from browse/search results.

## API Reference

- [Full API Documentation](https://recipe-api.com/docs)
- [OpenAPI Specification](https://recipe-api.com/openapi.json)

## License

MIT
