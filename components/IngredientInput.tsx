import React, { useState, KeyboardEvent } from 'react';
import { PlusIcon, XIcon, TrashIcon } from './Icons';

interface IngredientInputProps {
  ingredients: string[];
  setIngredients: (ingredients: string[]) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ 
  ingredients, 
  setIngredients, 
  onGenerate,
  isGenerating
}) => {
  const [inputValue, setInputValue] = useState('');

  const addIngredient = () => {
    if (inputValue.trim()) {
      if (!ingredients.includes(inputValue.trim().toLowerCase())) {
        setIngredients([...ingredients, inputValue.trim().toLowerCase()]);
      }
      setInputValue('');
    }
  };

  const removeIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  const clearAll = () => {
    setIngredients([]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-stone-800 mb-2">What's in your kitchen?</h2>
        <p className="text-stone-500">Add ingredients you have, and we'll suggest recipes to minimize waste.</p>
      </div>

      <div className="flex gap-2 mb-6 relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., tomatoes, eggs, spinach"
          className="flex-1 px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-lg"
          disabled={isGenerating}
        />
        <button
          onClick={addIngredient}
          disabled={!inputValue.trim() || isGenerating}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-xl px-4 py-2 transition-colors flex items-center justify-center min-w-[3rem]"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>

      {ingredients.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {ingredients.map((ing, idx) => (
              <span 
                key={`${ing}-${idx}`}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 text-sm font-medium animate-fadeIn"
              >
                {ing}
                <button 
                  onClick={() => removeIngredient(idx)}
                  className="ml-2 p-0.5 hover:bg-emerald-200 rounded-full transition-colors"
                  disabled={isGenerating}
                >
                  <XIcon className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex justify-end">
             <button 
              onClick={clearAll}
              className="text-stone-400 hover:text-red-500 text-sm flex items-center gap-1 transition-colors"
              disabled={isGenerating}
            >
              <TrashIcon className="w-4 h-4" /> Clear all
            </button>
          </div>
        </div>
      )}

      <button
        onClick={onGenerate}
        disabled={ingredients.length === 0 || isGenerating}
        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0
          ${ingredients.length === 0 || isGenerating 
            ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none' 
            : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Recipes...
          </span>
        ) : (
          'Find Recipes'
        )}
      </button>
    </div>
  );
};

export default IngredientInput;