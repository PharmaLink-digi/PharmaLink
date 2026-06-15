import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Speedometer2,
  BoxSeam,
  ArrowLeftRight,
  Building,
  ClipboardCheck,
  BarChartFill,
  GearFill,
  BoxArrowRight,
  List,
  X,
} from "react-bootstrap-icons";
import { useAuth } from "../../context/AuthContext";
import "./PharmacyLayout.css";

const NAV_ITEMS = [
  { to: "/pharmacy/dashboard",       icon: <Speedometer2 size={18} />,    label: "Dashboard"        },
  { to: "/pharmacy/inventory",       icon: <BoxSeam size={18} />,         label: "My Inventory"     },
  { to: "/pharmacy/exchange",        icon: <ArrowLeftRight size={18} />,  label: "Exchange Requests" },
  { to: "/pharmacy/warehouse-orders",icon: <Building size={18} />,        label: "Warehouse Orders"  },
  { to: "/pharmacy/order-tracking",  icon: <ClipboardCheck size={18} />,  label: "Order Tracking"   },
  { to: "/pharmacy/sales",           icon: <BarChartFill size={18} />,    label: "Sales"            },
  { to: "/pharmacy/profile",         icon: <GearFill size={18} />,        label: "Settings"         },
];

export default function PharmacyLayout() {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="pharmacy-layout d-flex" dir="ltr">
      {/* Sidebar */}
      <aside className={`pharmacy-sidebar d-flex flex-column ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand px-4 py-3 d-flex align-items-center justify-content-between">
          <span className="fw-bold fs-5 text-white">💊 PharmaLink</span>
          <button className="btn-close btn-close-white d-lg-none" onClick={() => setOpen(false)} />
        </div>

        <nav className="flex-grow-1 py-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link d-flex align-items-center gap-3 px-4 py-3 text-decoration-none ${isActive ? "active" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-4 pb-4">
          <button
            className="sidebar-link d-flex align-items-center gap-3 w-100 border-0 bg-transparent text-start py-3"
            onClick={handleLogout}
          >
            <BoxArrowRight size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && <div className="sidebar-overlay d-lg-none" onClick={() => setOpen(false)} />}

      {/* Main content */}
      <div className="pharmacy-main flex-grow-1 d-flex flex-column">
        {/* Mobile topbar */}
        <div className="pharmacy-topbar d-flex d-lg-none align-items-center px-3 py-2">
          <button className="btn btn-link p-0 text-dark" onClick={() => setOpen(true)}>
            <List size={24} />
          </button>
          <span className="fw-bold ms-3">💊 PharmaLink</span>
        </div>

        <div className="pharmacy-content flex-grow-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
