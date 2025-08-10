import { useState } from "react";
import * as recipesApi from "../../api/recipes";

interface Props {
  token: string;
  onCreated?: () => void;
}

export default function CreateRecipe({ token, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!title || !ingredients || !instructions) {
      setError("Title, ingredients, and instructions are required.");
      setLoading(false);
      return;
    }

    try {
      await recipesApi.createRecipe(token, {
        title,
        description: description || undefined,
        ingredients,
        instructions,
      });
      setTitle("");
      setDescription("");
      setIngredients("");
      setInstructions("");
      if (onCreated) onCreated();
    } catch {
      setError("Failed to create recipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Create Recipe</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <label className="block mb-2">
        Title*
        <input className="w-full border px-2 py-1" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label className="block mb-2">
        Description
        <textarea className="w-full border px-2 py-1" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
      </label>
      <label className="block mb-2">
        Ingredients* (comma separated)
        <textarea className="w-full border px-2 py-1" value={ingredients} onChange={(e) => setIngredients(e.target.value)} rows={3} required />
      </label>
      <label className="block mb-4">
        Instructions*
        <textarea className="w-full border px-2 py-1" value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={5} required />
      </label>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled={loading}>
        {loading ? "Saving..." : "Create"}
      </button>
    </form>
  );
}
