import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Components/Footer/Footer.css';

import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home/Home";
import Search from "./Components/Search/Search";
import SignInForm from "./Components/SignInForm/SignInForm";
import Signup from "./Components/Signup/Signup";
import AccountType from "./Components/AccountType/AccountType";
import AccountCreated from "./Components/AccountCreated/Accountcreatred";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import Settings from "./Components/Settings/Settings";
import OrderDashboard from "./Components/OrderDashboard/OrderDashboard";
import MedicineDetails from "./Components/MedicineDetails/MedicineDetails";
import CartPage from "./Components/Cart/CartPage";
import ConfirmOrderPage from "./Components/ConfirmOrder/ConfirmOrderPage";
import MyOrders from "./Components/MyOrders/MyOrders";
import PharmacyLayout from "./Components/PharmacyLayout/PharmacyLayout";
import PharmacyDashboard from "./Components/PharmacyDashboard/PharmacyDashboard";
import PharmacyInventory from "./Components/PharmacyInventory/PharmacyInventory";
import ExchangeRequest from "./Components/ExchangeRequest/ExchangeRequest";
import WarehouseOrderTracking from "./Components/WarehouseOrderTracking/WarehouseOrderTracking";
import WarehouseDashboard from "./Components/WarehouseDashboard/WarehouseDashboard";
import WarehouseInventory from "./Components/WarehouseInventory/WarehouseInventory";

// ── Route guards ───────────────────────────────────────────────────────────

/** Requires login; redirects to /signin otherwise */
const PrivateRoute = ({ children }) => {
  const userId = localStorage.getItem("userId");
  if (!userId) return <Navigate to="/signin" replace />;
  return children;
};

/** Requires login + matching role; redirects to correct dashboard on mismatch */
const RoleRoute = ({ children, requiredRole }) => {
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole") || "client";
  if (!userId) return <Navigate to="/signin" replace />;
  if (userRole !== requiredRole) {
    if (userRole === "pharmacy") return <Navigate to="/pharmacy/dashboard" replace />;
    if (userRole === "warehouse") return <Navigate to="/warehouse/dashboard" replace />;
    return <Navigate to="/client/dashboard" replace />;
  }
  return children;
};

/** After login, redirect to the role's dashboard */
const AuthRedirect = () => {
  const userRole = localStorage.getItem("userRole") || "client";
  if (userRole === "pharmacy") return <Navigate to="/pharmacy/dashboard" replace />;
  if (userRole === "warehouse") return <Navigate to="/warehouse/dashboard" replace />;
  return <Navigate to="/client/dashboard" replace />;
};

/** Legacy medicine-details redirect — preserves the :id param */
const MedicineDetailsRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/client/medicine/${id}`} replace />;
};

// ── Router ─────────────────────────────────────────────────────────────────
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // ── Public ──────────────────────────────────────────────────
      { index: true,             element: <Home /> },
      { path: "search",          element: <Search /> },
      { path: "signin",          element: <SignInForm /> },
      { path: "forgot-password", element: <ForgotPassword /> },

      // ── Signup flow ──────────────────────────────────────────────
      // Step 1 — choose role
      { path: "account-type",    element: <AccountType /> },

      // /signup with no role → redirect to account-type
      { path: "signup",          element: <Navigate to="/account-type" replace /> },

      // Step 2 — fill form (role-specific)
      { path: "signup/:role", element: <Signup /> },

      // Step 3 — success screen
      { path: "account-created",  element: <AccountCreated /> },

      // ── Legacy redirects ─────────────────────────────────────────
      { path: "order-dashboard",      element: <Navigate to="/pharmacy/warehouse-orders" replace /> },
      { path: "my-orders",            element: <Navigate to="/client/dashboard"   replace /> },
      { path: "cart",                 element: <Navigate to="/client/cart"        replace /> },
      { path: "medicine-details/:id", element: <MedicineDetailsRedirect /> },
      {
        path: "settings",
        element: <PrivateRoute><AuthRedirect /></PrivateRoute>,
      },

      // ── Client ───────────────────────────────────────────────────
      {
        path: "client/dashboard",
        element: <RoleRoute requiredRole="client"><MyOrders /></RoleRoute>,
      },
      {
        path: "client/search",
        element: <RoleRoute requiredRole="client"><Search /></RoleRoute>,
      },
      {
        path: "client/medicine/:id",
        element: <RoleRoute requiredRole="client"><MedicineDetails /></RoleRoute>,
      },
      {
        path: "client/cart",
        element: <RoleRoute requiredRole="client"><CartPage /></RoleRoute>,
      },
      {
        path: "client/confirm-order",
        element: <RoleRoute requiredRole="client"><ConfirmOrderPage /></RoleRoute>,
      },
      {
        path: "client/profile",
        element: <RoleRoute requiredRole="client"><Settings /></RoleRoute>,
      },

      // ── Pharmacy (PharmacyLayout wraps all sub-pages) ────────────
      {
        path: "pharmacy",
        element: <RoleRoute requiredRole="pharmacy"><PharmacyLayout /></RoleRoute>,
        children: [
          { index: true,              element: <Navigate to="/pharmacy/dashboard" replace /> },
          { path: "dashboard",        element: <PharmacyDashboard /> },
          { path: "inventory",        element: <PharmacyInventory /> },
          { path: "exchange",         element: <ExchangeRequest /> },
          { path: "warehouse-orders", element: <OrderDashboard /> },
          { path: "order-tracking",   element: <WarehouseOrderTracking /> },
          { path: "profile",          element: <Settings /> },
        ],
      },

      // ── Warehouse ────────────────────────────────────────────────
      {
        path: "warehouse/dashboard",
        element: <RoleRoute requiredRole="warehouse"><WarehouseDashboard /></RoleRoute>,
      },
      {
        path: "warehouse/inventory",
        element: <RoleRoute requiredRole="warehouse"><WarehouseInventory /></RoleRoute>,
      },
      {
        path: "warehouse/profile",
        element: <RoleRoute requiredRole="warehouse"><Settings /></RoleRoute>,
      },
    ],
  },
]);

// ── App root ───────────────────────────────────────────────────────────────
function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const isArabic = i18n.language?.startsWith("ar");
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.documentElement.lang = isArabic ? "ar" : "en";
  }, [i18n.language]);

  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
