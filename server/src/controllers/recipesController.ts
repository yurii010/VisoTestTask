import { Request, Response } from "express";
import prisma from "./prismaClient";
import { AuthRequest } from "../middleware/authMiddleware";

export const createRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { title, description, ingredients, instructions } = req.body;

    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const recipe = await prisma.recipe.create({
      data: {
        title,
        description: description || null,
        ingredients,
        instructions,
        userId,
      },
    });

    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getRecipes = async (req: AuthRequest, res: Response) => {
  try {
    const { search } = req.query;
    const userId = req.userId;

    const where = typeof search === "string" && search.length > 0 ? { title: { contains: search, mode: "insensitive" as const } } : {};

    const recipes = await prisma.recipe.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        ratings: userId
          ? {
              where: { userId },
              select: { stars: true },
            }
          : false,
      },
    });

    const recipesWithUserRating = recipes.map((recipe) => ({
      ...recipe,
      userRating: recipe.ratings?.[0]?.stars ?? null,
      ratings: undefined,
    }));

    res.json(recipesWithUserRating);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUserRecipes = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const recipes = await prisma.recipe.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const rateRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { recipeId, stars } = req.body;

    if (typeof recipeId !== "number" || typeof stars !== "number" || stars < 1 || stars > 5) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });

    if (existingRating) {
      const updated = await prisma.rating.update({
        where: { id: existingRating.id },
        data: { stars },
      });
      return res.json(updated);
    } else {
      const created = await prisma.rating.create({
        data: { userId, recipeId, stars },
      });
      return res.status(201).json(created);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export async function getRecipeById(req: AuthRequest, res: Response) {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid recipe ID" });
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id },
  });

  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  res.json(recipe);
}

export const deleteRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid recipe ID" });
    }

    const recipe = await prisma.recipe.findUnique({ where: { id } });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    if (recipe.userId !== userId) {
      return res.status(403).json({ message: "Forbidden: You can delete only your own recipes" });
    }

    await prisma.recipe.delete({ where: { id } });

    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
