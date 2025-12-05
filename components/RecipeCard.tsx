import React from 'react';
import { Recipe } from '../types';
import { ClockIcon, HeartIcon } from './Icons';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick, isFavorite, onToggleFavorite }) => {
  // Simple difficulty color mapping
  const difficultyColor = {
    'Easy': 'bg-green-100 text-green-700',
    'Medium': 'bg-yellow-100 text-yellow-700',
    'Hard': 'bg-red-100 text-red-700',
  }[recipe.difficulty] || 'bg-stone-100 text-stone-600';

  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer h-full flex flex-col"
    >
      <div className="h-32 bg-emerald-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Placeholder decorative pattern */}
        <div className="absolute inset-0 bg-emerald-600 opacity-5 pattern-dots"></div>
        <img 
            src={`https://picsum.photos/seed/${recipe.name.replace(/\s+/g, '')}/400/200`} 
            alt={recipe.name}
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <h3 className="relative z-10 text-white font-bold text-xl text-center shadow-black drop-shadow-md">{recipe.name}</h3>
        
        <button 
          onClick={onToggleFavorite}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors z-20"
        >
          <HeartIcon className={`w-5 h-5 ${isFavorite ? 'text-red-500' : 'text-white'}`} filled={isFavorite} />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${difficultyColor}`}>
            {recipe.difficulty}
          </span>
          <div className="flex items-center text-stone-500 text-xs">
            <ClockIcon className="w-3.5 h-3.5 mr-1" />
            {recipe.prepTime}
          </div>
        </div>
        
        <p className="text-stone-600 text-sm line-clamp-3 mb-4 flex-1">
          {recipe.description}
        </p>

        <div className="mt-auto pt-4 border-t border-stone-100">
           <div className="flex flex-wrap gap-1">
             {recipe.ingredients.slice(0, 3).map((ing, i) => (
               <span key={i} className="text-xs text-stone-500 bg-stone-50 px-2 py-1 rounded-md">
                 {ing.split(' ').slice(-1)[0] /* Simple approximation to get ingredient name */}
               </span>
             ))}
             {recipe.ingredients.length > 3 && (
               <span className="text-xs text-stone-400 px-1 py-1">+{recipe.ingredients.length - 3} more</span>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;