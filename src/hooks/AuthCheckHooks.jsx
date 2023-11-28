import { useSelector } from "react-redux";

// Utility function to check if the user is authenticated
export const useIsAuthenticated = () => {
  const isLoggedInRedux = useSelector((state) => state.auth.isLoggedIn);
  const authToken = localStorage.getItem("authToken");
  const isLoggedInLocalStorage = !!authToken;

  return isLoggedInRedux || isLoggedInLocalStorage;
};

// auth info export const useAuthInfo = () => {
export const useAuthInfo = () => {
  const authUserInfo = localStorage.getItem("user");
  const userInfo = authUserInfo ? JSON.parse(authUserInfo) : null;
  return userInfo;
};
