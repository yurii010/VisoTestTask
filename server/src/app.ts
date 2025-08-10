import express from "express";
import cors from "cors";
import path from "path";
import authRouter from "./routes/auth";
import * as recipeController from "./controllers/recipesController";
import { authenticateToken } from "./middleware/authMiddleware";

const app = express();

const buildPath = path.join(__dirname, "../../client/build");

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.get("/recipes", authenticateToken, recipeController.getRecipes);
app.get("/recipes/:id", authenticateToken, recipeController.getRecipeById);
app.get("/users/recipes", authenticateToken, recipeController.getUserRecipes);
app.post("/recipes", authenticateToken, recipeController.createRecipe);
app.delete("/recipes/:id", authenticateToken, recipeController.deleteRecipe);
app.post("/recipes/rate", authenticateToken, recipeController.rateRecipe);

app.use(express.static(buildPath));

app.get(['/login', '/register', '/recipes', '/myRecipes', '/'], (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

export default app;
