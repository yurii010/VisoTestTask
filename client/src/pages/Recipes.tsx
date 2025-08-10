import { useEffect, useState, useRef } from "react";
import * as recipesApi from "../api/recipes";

interface Recipe {
  id: number;
  title: string;
  description?: string;
  ingredients: string;
  instructions: string;
  createdAt: string;
  userRating?: number | null;
}

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratingLoadingId, setRatingLoadingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token") || undefined;

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      recipesApi
        .getRecipes(search || undefined, token)
        .then(setRecipes)
        .catch(() => setError("Failed to load recipes"))
        .finally(() => setLoading(false));
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [search, token]);

  const handleRate = async (recipeId: number, stars: number) => {
    if (!token) {
      alert("Please login to rate recipes");
      return;
    }
    setRatingLoadingId(recipeId);
    try {
      await recipesApi.rateRecipe(token, { recipeId, stars });
      setRecipes((prev) => prev.map((r) => (r.id === recipeId ? { ...r, userRating: stars } : r)));
    } catch {
      alert("Failed to rate recipe");
    } finally {
      setRatingLoadingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">All Recipes</h1>

      <input
        type="text"
        placeholder="Search recipes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-3 rounded mb-8 w-full max-w-md mx-auto block"
      />

      {loading && <p className="text-center">Loading recipes...</p>}
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      {!loading && recipes.length === 0 && <p className="text-center">No recipes found.</p>}

      <ul className="space-y-8">
        {recipes.map(({ id, title, description, ingredients, instructions, userRating }) => (
          <li key={id} className="border rounded-lg p-6 shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold mb-3">{title}</h3>
            {description && <p className="mb-4 italic text-gray-700">{description}</p>}

            <p className="mb-2">
              <strong>Ingredients:</strong> <span className="text-gray-800">{ingredients}</span>
            </p>
            <p className="mb-4">
              <strong>Instructions:</strong> <span className="text-gray-800">{instructions}</span>
            </p>

            <div className="flex flex-wrap items-center">
              <span className="mr-4 font-semibold">Rate this recipe:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  disabled={ratingLoadingId === id}
                  onClick={() => handleRate(id, star)}
                  className={`ml-2 mb-2 px-3 py-1 rounded text-sm transition
        ${userRating === star ? "bg-yellow-500 text-white" : "bg-yellow-300 hover:bg-yellow-400"}
        disabled:opacity-50`}
                >
                  {star} ⭐
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
