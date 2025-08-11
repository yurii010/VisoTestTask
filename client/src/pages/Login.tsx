import React, { useState } from "react";
import { login } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await login(email, password);
      authLogin(res.token, res.user);
      alert("Login successfully!");
    } catch {
      setError("Incorrect password or email");
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-5 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition">
        Login
      </button>

      <button
        type="button"
        onClick={goToRegister}
        className="w-full mt-4 border border-green-600 text-green-600 p-3 rounded-md hover:bg-green-100 transition"
      >
        Register
      </button>
    </form>
  );
}
