import axios from "axios";
import { api } from "../config/config";

function getAuthHeader(token: string) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

export async function getRecipes(search?: string, token?: string) {
  const url = search ? `${api}/recipes?search=${encodeURIComponent(search)}` : `${api}/recipes`;
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
  const res = await axios.get(url, config);
  return res.data;
}

export async function getUserRecipes(token: string) {
  const res = await axios.get(`${api}/users/recipes`, getAuthHeader(token));
  return res.data;
}

export async function createRecipe(
  token: string,
  data: {
    title: string;
    description?: string;
    ingredients: string;
    instructions: string;
  }
) {
  const res = await axios.post(`${api}/recipes`, data, getAuthHeader(token));
  return res.data;
}

export async function rateRecipe(
  token: string,
  data: {
    recipeId: number;
    stars: number;
  }
) {
  const res = await axios.post(`${api}/recipes/rate`, data, getAuthHeader(token));
  return res.data;
}

export async function getRecipeById(id: number, token?: string) {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
  const res = await axios.get(`${api}/recipes/${id}`, config);
  return res.data;
}

export async function deleteRecipe(token: string, id: number) {
  const res = await axios.delete(`${api}/recipes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
