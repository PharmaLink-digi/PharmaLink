import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Home from "./Components/Home/Home";
import Search from "./Components/Search/Search";
import SignInForm from "./Components/SignInForm/SignInForm";
import Layout from "./Components/Layout/Layout";
import Signup from "./Components/Signup/Signup";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Components/Footer/Footer.css';
import { useTranslation } from "react-i18next";
import Settings from "./Components/Settings/Settings";
import OrderDashboard from "./Components/OrderDashboard/OrderDashboard";
import MedicineDetails from "./Components/MedicineDetails/MedicineDetails";
import CartPage from "./Components/Cart/CartPage";
import ConfirmOrderPage from "./Components/ConfirmOrder/ConfirmOrderPage";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import MyOrders from "./Components/MyOrders/MyOrders";

const ProtectedRoute = ({ children }) => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};



// import SignInForm from './Components/SignInForm/SignInForm'
let router = createBrowserRouter([
  {
    path: "/", element: <Layout />, children: [
      { path: "/", element: <Home /> },
      { path: "/search", element: <Search /> },
      { path: "/signin", element: <SignInForm /> },
      { path: "/signup", element: <Signup /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/settings", element: <ProtectedRoute><Settings /></ProtectedRoute> },
      { path: "/order-dashboard", element: <ProtectedRoute><OrderDashboard /></ProtectedRoute> },
      { path: "/medicine-details/:id", element: <MedicineDetails /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/my-orders", element: <ProtectedRoute><MyOrders /></ProtectedRoute> },
      { path: "/confirm-order", element: <ConfirmOrderPage /> },
      // { path: "*", element: <NotFound /> }
    ]
  }
])

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const isArabic = i18n.language?.startsWith('ar') || i18n.language === 'ar';
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
  }, [i18n.language]);

  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router}/>
      </CartProvider>
    </AuthProvider>
  );
}

// Simple 404 Not Found component
const NotFound = () => (
  <div style={{ textAlign: "center", marginTop: "2rem" }}>
    <h2>404 - Page Not Found</h2>
    <p>The page you are looking for does not exist.</p>
    <a href="/" style={{ color: "#0f6bff" }}>Go to Home</a>
  </div>
);

export default App;
