import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SalesmanList from "./pages/SalesmanList";
import ShopsList from "./pages/Shops";
import LoginScreen from "./pages/auth/Login";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useIsAuthenticated } from "./hooks/AuthCheckHooks";
import ShopsAssign from "./pages/ShopsAssign";
import SalesmanTask from "./pages/SalesmanTask";
import DateRange from "./pages/DateRange";

function App() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/salesman-list"
            element={
              isAuthenticated ? (
                <SalesmanList />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/shops-list"
            element={
              isAuthenticated ? <ShopsList /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/shops-assign"
            element={
              isAuthenticated ? (
                <ShopsAssign />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/salesman-task"
            element={
              isAuthenticated ? (
                <SalesmanTask />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/date-range"
            element={
              isAuthenticated ? (
                <DateRange />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginScreen />
            }
          />
          <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom}
        style={{
          width: "300px",
          fontSize: "14px",
        }}
      />
    </>
  );
}

export default App;
