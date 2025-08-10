import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function useAuthRedirect() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token) {
      if (location.pathname === "/login" || location.pathname === "/register") {
        navigate("/recipes", { replace: true });
      }
    } else {
      if (location.pathname !== "/login" && location.pathname !== "/register") {
        navigate("/login", { replace: true });
      }
    }
  }, [token, location.pathname, navigate]);
}
