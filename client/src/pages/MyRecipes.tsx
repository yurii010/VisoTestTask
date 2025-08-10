import { useEffect, useState } from "react";
import * as recipesApi from "../api/recipes";
import RecipeDetails from "../components/RecipeDetails/RecipeDetails";

interface Recipe {
  id: number;
  title: string;
  description?: string;
  ingredients: string;
  instructions: string;
  createdAt: string;
}

export default function MyRecipes() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const tokenRaw = localStorage.getItem("token");
    if (!tokenRaw) {
      setLoading(false);
      return;
    }
    const token: string = tokenRaw;

    async function fetchRecipes() {
      try {
        const data = await recipesApi.getUserRecipes(token);
        setRecipes(data);
      } catch (err) {
        setError("Failed to load recipes");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  const handleCreateClick = () => {
    setShowForm(true);
    setFormError(null);
    setTitle("");
    setDescription("");
    setIngredients("");
    setInstructions("");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setFormError("You must be logged in");
      return;
    }

    if (!title || !ingredients || !instructions) {
      setFormError("Title, ingredients and instructions are required");
      return;
    }

    setFormLoading(true);
    setFormError(null);

    try {
      const newRecipe = await recipesApi.createRecipe(token, {
        title,
        description: description || undefined,
        ingredients,
        instructions,
      });
      setRecipes((prev) => (prev ? [newRecipe, ...prev] : [newRecipe]));
      setShowForm(false);
    } catch {
      setFormError("Failed to create recipe");
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedRecipeId(null);
  };

  if (selectedRecipeId !== null) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <RecipeDetails
          recipeId={selectedRecipeId}
          onDeleted={() => {
            setSelectedRecipeId(null);
            setRecipes((prev) => (prev ? prev.filter((r) => r.id !== selectedRecipeId) : []));
          }}
          onClose={handleCloseDetails}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-8">My Recipes</h1>

      <button onClick={handleCreateClick} className="mb-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Create Recipe
      </button>

      {showForm && (
        <form onSubmit={handleFormSubmit} className="mb-8 border p-6 rounded max-w-md mx-auto text-left">
          {formError && <p className="text-red-600 mb-4">{formError}</p>}

          <label className="block mb-4">
            Title*
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border px-3 py-2 mt-1 rounded" required />
          </label>

          <label className="block mb-4">
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border px-3 py-2 mt-1 rounded" rows={2} />
          </label>

          <label className="block mb-4">
            Ingredients* (comma separated)
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="w-full border px-3 py-2 mt-1 rounded"
              rows={3}
              required
            />
          </label>

          <label className="block mb-6">
            Instructions*
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full border px-3 py-2 mt-1 rounded"
              rows={5}
              required
            />
          </label>

          <button type="submit" disabled={formLoading} className="bg-green-600 text-white px-6 py-3 rounded disabled:opacity-50">
            {formLoading ? "Saving..." : "Save Recipe"}
          </button>
          <button type="button" onClick={() => setShowForm(false)} className="ml-4 px-6 py-3 border rounded hover:bg-gray-100 transition">
            Cancel
          </button>
        </form>
      )}

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (!recipes || recipes.length === 0) && <p>You have no recipes yet.</p>}

      {recipes && recipes.length > 0 && (
        <ul className="text-left max-w-md mx-auto">
          {recipes.map(({ id, title, description }) => (
            <li key={id} className="cursor-pointer border-b py-3 hover:bg-gray-100" onClick={() => setSelectedRecipeId(id)}>
              <h3 className="text-lg font-semibold">{title}</h3>
              {description && <p className="text-gray-700">{description}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
