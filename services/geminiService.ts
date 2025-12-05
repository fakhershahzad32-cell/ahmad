import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing. Please check your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'DUMMY_KEY_FOR_BUILD' });

export const generateRecipesFromIngredients = async (
  ingredients: string[]
): Promise<Recipe[]> => {
  if (ingredients.length === 0) return [];

  const model = "gemini-2.5-flash";
  
  const prompt = `
    I have the following ingredients: ${ingredients.join(", ")}.
    Please suggest 3 distinct recipes that use these ingredients. 
    Focus on minimizing food waste. 
    It is okay to include a few common pantry items (like oil, salt, pepper, flour, sugar) that I might likely have, but mark significant missing ingredients.
    
    Return a valid JSON array of recipe objects.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Name of the recipe" },
              description: { type: Type.STRING, description: "A short, appetizing description" },
              prepTime: { type: Type.STRING, description: "Preparation and cooking time (e.g., '30 mins')" },
              difficulty: { type: Type.STRING, description: "Difficulty level: Easy, Medium, or Hard" },
              calories: { type: Type.INTEGER, description: "Approximate calories per serving" },
              ingredients: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of ingredients with quantities"
              },
              missingIngredients: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of ingredients the user probably doesn't have from their input list"
              },
              instructions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Step-by-step cooking instructions"
              }
            },
            required: ["name", "description", "prepTime", "difficulty", "ingredients", "instructions"]
          }
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(responseText) as Recipe[];
    // Add client-side IDs
    return data.map((recipe) => ({
      ...recipe,
      id: crypto.randomUUID()
    }));

  } catch (error) {
    console.error("Error generating recipes:", error);
    throw error;
  }
};