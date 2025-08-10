import { useEffect, useState } from "react";
import * as recipesApi from "../../api/recipes";

interface Props {
  recipeId: number;
  onDeleted?: () => void;
  onClose?: () => void;
}

interface Recipe {
  id: number;
  title: string;
  description?: string;
  ingredients: string;
  instructions: string;
  createdAt: string;
}

export default function RecipeDetails({ recipeId, onDeleted, onClose }: Props) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setDeleteError("You must be logged in to get a recipe.");
          return;
        }
        const data = await recipesApi.getRecipeById(recipeId, token);
        setRecipe(data);
      } catch {
        setError("Failed to load recipe");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [recipeId]);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setDeleteError("You must be logged in to delete a recipe.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await recipesApi.deleteRecipe(token, recipeId);
      if (onDeleted) onDeleted();
    } catch {
      setDeleteError("Failed to delete recipe");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <p className="text-center py-6">Loading recipe...</p>;
  if (error) return <p className="text-red-600 text-center py-6">{error}</p>;
  if (!recipe) return <p className="text-center py-6">Recipe not found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {onClose && (
        <div className="flex justify-center mb-6">
          <button onClick={onClose} className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400 transition font-semibold text-gray-700 shadow">
            ← Back to My Recipes
          </button>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
      {recipe.description && <p className="italic mb-8 text-gray-600">{recipe.description}</p>}

      <section className="mb-6">
        <h3 className="font-semibold text-lg mb-2 border-b border-gray-300 pb-1">Ingredients:</h3>
        <p className="whitespace-pre-wrap text-gray-800">{recipe.ingredients}</p>
      </section>

      <section className="mb-8">
        <h3 className="font-semibold text-lg mb-2 border-b border-gray-300 pb-1">Instructions:</h3>
        <p className="whitespace-pre-wrap text-gray-800">{recipe.instructions}</p>
      </section>

      {deleteError && <p className="text-red-600 mb-4 text-center font-medium">{deleteError}</p>}

      <div className="text-center">
        <button
          onClick={handleDelete}
          disabled={deleteLoading}
          className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold px-6 py-3 rounded transition"
        >
          {deleteLoading ? "Deleting..." : "Delete Recipe"}
        </button>
      </div>
    </div>
  );
}
