import React, { useState, useEffect } from 'react';
import IngredientInput from './components/IngredientInput';
import RecipeCard from './components/RecipeCard';
import RecipeDetailModal from './components/RecipeDetailModal';
import { generateRecipesFromIngredients } from './services/geminiService';
import { Recipe, ViewState } from './types';
import { ChefHatIcon, HeartIcon, SparklesIcon, ArrowLeftIcon } from './components/Icons';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [view, setView] = useState<ViewState>('search');

  // Load favorites from local storage on mount
  useEffect(() => {
    const savedFavs = localStorage.getItem('ecoChefFavorites');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  // Save favorites whenever they change
  useEffect(() => {
    localStorage.setItem('ecoChefFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setRecipes([]);
    
    try {
      const generated = await generateRecipesFromIngredients(ingredients);
      setRecipes(generated);
      if (generated.length === 0) {
        setError("Couldn't generate any recipes for these ingredients. Try adding common staples like 'flour' or 'rice'.");
      }
    } catch (err) {
      setError("Failed to generate recipes. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleFavorite = (recipe: Recipe) => {
    const exists = favorites.find(r => r.id === recipe.id);
    if (exists) {
      setFavorites(favorites.filter(r => r.id !== recipe.id));
    } else {
      setFavorites([...favorites, recipe]);
    }
  };

  const isFavorite = (recipe: Recipe) => favorites.some(r => r.id === recipe.id);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => setView('search')}
            >
              <div className="bg-emerald-600 p-1.5 rounded-lg text-white">
                <ChefHatIcon className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-emerald-900">EcoChef</span>
            </div>
            
            <nav className="flex gap-4">
              <button 
                onClick={() => setView('search')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'search' ? 'text-emerald-700 bg-emerald-50' : 'text-stone-500 hover:text-stone-900'}`}
              >
                Find Recipes
              </button>
              <button 
                onClick={() => setView('favorites')}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'favorites' ? 'text-emerald-700 bg-emerald-50' : 'text-stone-500 hover:text-stone-900'}`}
              >
                <HeartIcon className="w-4 h-4" filled={view === 'favorites'} />
                Favorites
                {favorites.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-emerald-200 text-emerald-800 rounded-full">
                    {favorites.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {view === 'favorites' ? (
          <div className="animate-fadeIn">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setView('search')} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                <ArrowLeftIcon className="w-5 h-5 text-stone-600"/>
              </button>
              <h1 className="text-3xl font-bold text-stone-800">Your Cookbook</h1>
            </div>
            
            {favorites.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-300">
                <div className="mx-auto w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                  <HeartIcon className="w-8 h-8 text-stone-400" />
                </div>
                <h3 className="text-lg font-medium text-stone-900">No favorites yet</h3>
                <p className="text-stone-500 mt-1 max-w-sm mx-auto">Save recipes you love here to easily find them later.</p>
                <button 
                  onClick={() => setView('search')}
                  className="mt-6 text-emerald-600 font-medium hover:underline"
                >
                  Go find some recipes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map(recipe => (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    onClick={() => setSelectedRecipe(recipe)}
                    isFavorite={true}
                    onToggleFavorite={(e) => {
                      e.stopPropagation();
                      toggleFavorite(recipe);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Search View */
          <div className="space-y-12 animate-fadeIn">
            {/* Input Section */}
            <section className="flex flex-col items-center">
              <IngredientInput 
                ingredients={ingredients}
                setIngredients={setIngredients}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </section>

            {/* Error Message */}
            {error && (
              <div className="max-w-2xl mx-auto p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-center">
                {error}
              </div>
            )}

            {/* Results Section */}
            {(recipes.length > 0) && (
              <section className="animate-slideUp">
                 <div className="flex items-center gap-2 mb-6">
                    <SparklesIcon className="w-6 h-6 text-emerald-500" />
                    <h2 className="text-2xl font-bold text-stone-800">Suggested Recipes</h2>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   {recipes.map(recipe => (
                     <RecipeCard 
                       key={recipe.id} 
                       recipe={recipe} 
                       onClick={() => setSelectedRecipe(recipe)}
                       isFavorite={isFavorite(recipe)}
                       onToggleFavorite={(e) => {
                         e.stopPropagation();
                         toggleFavorite(recipe);
                       }}
                     />
                   ))}
                 </div>
              </section>
            )}

            {!isGenerating && recipes.length === 0 && ingredients.length === 0 && (
                <div className="text-center mt-12 opacity-50">
                    <div className="text-6xl mb-4">🥦 🥕 🌽</div>
                    <p className="text-lg text-stone-500 font-medium">Add ingredients above to start cooking!</p>
                </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedRecipe && (
        <RecipeDetailModal 
          recipe={selectedRecipe} 
          isOpen={!!selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          isFavorite={isFavorite(selectedRecipe)}
          onToggleFavorite={() => toggleFavorite(selectedRecipe)}
        />
      )}
    </div>
  );
};

export default App;