import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Recipes from "./pages/Recipes";
import MyRecipes from "./pages/MyRecipes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./context/AuthContext";
import { useAuthRedirect } from "./hooks/useAuthRedirect";

export default function RoutesComponent() {
  useAuthRedirect();
  const { token } = useAuth();

  return (
    <>
      {token && <Navbar />}
      <Routes>
        <Route path="/" element={token ? <Navigate to="/recipes" replace /> : <Navigate to="/login" replace />} />
        <Route path="/recipes" element={token ? <Recipes /> : <Navigate to="/login" replace />} />
        <Route path="/myRecipes" element={token ? <MyRecipes /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/recipes" replace />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/recipes" replace />} />
      </Routes>
    </>
  );
}
