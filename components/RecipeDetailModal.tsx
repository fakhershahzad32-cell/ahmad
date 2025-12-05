import React from 'react';
import { Recipe } from '../types';
import { ClockIcon, XIcon, HeartIcon, ChefHatIcon } from './Icons';

interface RecipeDetailModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ 
  recipe, 
  isOpen, 
  onClose,
  isFavorite,
  onToggleFavorite
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header Image Area */}
        <div className="relative h-48 sm:h-64 shrink-0">
          <img 
            src={`https://picsum.photos/seed/${recipe.name.replace(/\s+/g, '')}/800/400`} 
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
          >
            <XIcon className="w-6 h-6" />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-3xl font-bold mb-2 shadow-black drop-shadow-md leading-tight">{recipe.name}</h2>
            <div className="flex items-center gap-4 text-sm font-medium">
               <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                  <ClockIcon className="w-4 h-4" /> {recipe.prepTime}
               </span>
               <span className="bg-emerald-500/80 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-400/30">
                  {recipe.difficulty}
               </span>
               {recipe.calories && (
                  <span className="bg-orange-500/80 backdrop-blur-md px-3 py-1 rounded-full border border-orange-400/30">
                    {recipe.calories} kcal
                  </span>
               )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-8">
            {/* Description */}
            <p className="text-stone-600 text-lg leading-relaxed italic border-l-4 border-emerald-500 pl-4 bg-emerald-50/50 py-2 rounded-r-lg">
                {recipe.description}
            </p>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Ingredients */}
                <div>
                    <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm">1</span>
                        Ingredients
                    </h3>
                    <ul className="space-y-3">
                        {recipe.ingredients.map((ing, idx) => (
                            <li key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-stone-50 transition-colors">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                <span className="text-stone-700">{ing}</span>
                            </li>
                        ))}
                    </ul>
                    
                    {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
                        <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                             <h4 className="text-sm font-bold text-amber-800 mb-2 uppercase tracking-wide">Missing Ingredients</h4>
                             <ul className="space-y-1">
                                {recipe.missingIngredients.map((ing, idx) => (
                                    <li key={idx} className="text-amber-700 text-sm flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-amber-400"/> {ing}
                                    </li>
                                ))}
                             </ul>
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div>
                    <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm">2</span>
                        Instructions
                    </h3>
                    <div className="space-y-6">
                        {recipe.instructions.map((step, idx) => (
                            <div key={idx} className="relative pl-6 border-l border-stone-200">
                                <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-emerald-200 border-2 border-white ring-1 ring-emerald-500" />
                                <p className="text-stone-700 leading-relaxed">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        
        {/* Footer Actions */}
        <div className="p-4 border-t border-stone-100 flex justify-end gap-3 bg-stone-50 rounded-b-2xl">
            <button 
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-stone-300 text-stone-600 font-medium hover:bg-stone-100 transition-colors"
            >
                Close
            </button>
            <button 
                onClick={onToggleFavorite}
                className={`px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all active:scale-95
                    ${isFavorite 
                        ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200'
                    }`}
            >
                <HeartIcon className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} filled={isFavorite} />
                {isFavorite ? 'Saved to Favorites' : 'Save Recipe'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailModal;