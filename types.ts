export interface Recipe {
  id?: string; // Client-generated
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  difficulty: string;
  calories?: number;
  missingIngredients?: string[];
}

export type ViewState = 'search' | 'favorites';

export interface GenerateRecipeResponse {
  recipes: Recipe[];
}