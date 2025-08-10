import axios from "axios";
import { api } from "../config/config";

export async function login(email: string, password: string) {
  const res = await axios.post(`${api}/auth/login`, { email, password });
  return res.data;
}

export async function register(email: string, password: string, name?: string) {
  const res = await axios.post(`${api}/auth/register`, { email, password, name });
  return res.data;
}
