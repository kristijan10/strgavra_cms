import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
// import apiCall from "../utils/apiCall";
import AuthContext from "./authContext.js";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hasToken, setHasToken] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();
  const location = useLocation();

  const login = (token) => {
    localStorage.setItem("token", JSON.stringify(token));
    setUser(token);
    setHasToken(true);
    // fetchUser();
  };

  const logout = () => {
    setUser(null);
    setHasToken(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  // const fetchUser = async () => {
  //   try {
  //     const userData = await apiCall("/users/me", {
  //       method: "GET",
  //     });
  //     setUser(userData);
  //   } catch (error) {
  //     console.log(error);
  //     logout();
  //   }
  // };

  useEffect(() => {
    // if (!user && hasToken) fetchUser();
    // else
    if (!user && !hasToken) {
      const allowedRoutes = ["/login"];
      if (!allowedRoutes.includes(location.pathname)) navigate("/login");
    }
  }, [hasToken, user, location.pathname, navigate]);

  return (
    <AuthContext.Provider value={{ hasToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
