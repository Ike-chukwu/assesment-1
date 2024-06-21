import React, { useReducer } from "react";
import MkdSDK from "./utils/MkdSDK";
import { useNavigate } from "react-router";

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  role: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      //TODO
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        role: action.payload.role,
        token: action.payload.token,
        user: action.payload.user,
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        role: null,
      };
    default:
      return state;
  }
};

let sdk = new MkdSDK();

export const tokenExpireError = (dispatch, errorMessage) => {
  const role = localStorage.getItem("role");
  if (errorMessage === "TOKEN_EXPIRED") {
    dispatch({
      type: "Logout",
    });
    window.location.href = "/" + role + "/login";
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // const navigate = useNavigate();
  React.useEffect(() => {
    //TODO
    sdk.check("admin");
    const checkAuth = async () => {
      try {
        await sdk.check("admin");
        // window.location.href = "/admin/dashboard";
        // navigate("/admin/dashboard");
      } catch (error) {
        console.error("Authorization check failed:", error.message);
        // window.location.href = "/admin/login";
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
