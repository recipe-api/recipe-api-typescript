// Cuisine (from /api/v1/cuisines)
export interface Cuisine {
  name: string;
  count: number;
}

// Dietary flag (from /api/v1/dietary-flags)
export interface DietaryFlag {
  name: string;
  count: number;
}

// Recipe timing metadata
export interface RecipeMeta {
  active_time: string; // ISO 8601 duration
  passive_time: string;
  total_time: string;
  overnight_required: boolean;
  yields: string;
  yield_count: number;
  serving_size_g: number;
}

// Dietary information
export interface DietaryInfo {
  flags: string[];
  not_suitable_for: string[];
}

// Nutrition summary (on list items)
export interface NutritionSummary {
  calories: number;
  protein_g: number;
  carbohydrates_g: number;
  fat_g: number;
}

// Recipe summary (returned in list/browse endpoints)
export interface RecipeSummary {
  id: string;
  name: string;
  description: string;
  category: string;
  cuisine: string;
  difficulty: string;
  tags: string[];
  meta: RecipeMeta;
  dietary: DietaryInfo;
  nutrition_summary: NutritionSummary;
}

// Pagination/meta for list responses
export interface ListMeta {
  total: number;
  page: number;
  per_page: number;
  total_capped?: boolean;
}

// Cuisines response
export interface CuisinesResponse {
  data: Cuisine[];
}

// Dietary flags response
export interface DietaryFlagsResponse {
  data: DietaryFlag[];
}

// Browse/search recipes response
export interface RecipeListResponse {
  data: RecipeSummary[];
  meta: ListMeta;
}

// Equipment item
export interface Equipment {
  name: string;
  required: boolean;
  alternative: string | null;
}

// Ingredient item
export interface IngredientItem {
  name: string;
  quantity: number | string;
  unit: string | null;
  preparation: string | null;
  notes: string | null;
  substitutions: string[];
  ingredient_id: string;
  nutrition_source: string;
}

// Ingredient group
export interface IngredientGroup {
  group_name: string;
  items: IngredientItem[];
}

// Instruction structured details
export interface InstructionStructured {
  action: string;
  temperature: string | null;
  duration: string | null;
  doneness_cues: string[] | null;
}

// Instruction step
export interface Instruction {
  step_number: number;
  phase: string;
  text: string;
  structured: InstructionStructured;
  tips: string[];
}

// Storage information
export interface StorageInfo {
  refrigerator?: {
    notes: string;
    duration: string;
  };
  freezer?: {
    duration: string | null;
  };
  reheating?: string;
  does_not_keep?: boolean;
}

// Full nutrition (on detail view)
export interface FullNutrition {
  per_serving: NutritionSummary & {
    fiber_g?: number;
    sugar_g?: number;
    sodium_mg?: number;
    saturated_fat_g?: number;
    cholesterol_mg?: number;
  };
  sources: string[];
}

// Full recipe (from /api/v1/recipes/{id})
// Note: Full recipe has `nutrition` instead of `nutrition_summary`
export interface Recipe extends Omit<RecipeSummary, 'nutrition_summary'> {
  nutrition: FullNutrition;
  storage?: StorageInfo;
  equipment: Equipment[];
  ingredients: IngredientGroup[];
  instructions: Instruction[];
  troubleshooting?: Record<string, string>;
  chef_notes?: string[];
  cultural_context?: string;
}

// Full recipe response
export interface RecipeResponse {
  data: Recipe;
  usage?: {
    monthly_remaining: number;
    monthly_limit: number;
    daily_remaining: number;
    daily_limit: number;
  };
}

// Error response format
export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

// Ingredient category (from /api/v1/ingredient-categories)
export interface IngredientCategory {
  name: string;
  count: number;
}

// Ingredient categories response
export interface IngredientCategoriesResponse {
  data: IngredientCategory[];
}

// Ingredient (from /api/v1/ingredients)
export interface Ingredient {
  id: string;
  name: string;
  category: string;
  source: string;
}

// Ingredients response
export interface IngredientsResponse {
  data: Ingredient[];
  meta: ListMeta;
}
