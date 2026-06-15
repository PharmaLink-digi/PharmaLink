# PharmaLink — Frontend

A React + Vite web application for a pharmacy/medicine supply-chain platform supporting four user roles: **Client**, **Pharmacy**, **Warehouse**, and **Admin**. Built with bilingual (AR/EN) support and role-based access control.

## Tech Stack

| Layer | Library / Tool |
|---|---|
| Framework | React 19, Vite 8 |
| Routing | React Router v7 (`createBrowserRouter`) |
| Styling | Bootstrap 5, Bootstrap Icons, Plain CSS |
| Forms | Formik + Yup |
| HTTP | Axios |
| i18n | i18next, react-i18next, i18next-browser-languagedetector |
| Auth | Firebase (Google OAuth) + JWT (localStorage) |
| Icons | Lucide React, React Icons |

## Environment Variables

```
VITE_API_BASE_URL               # Base URL for the backend API
VITE_API_PHARMACY_INVENTORY     # Full URL for pharmacy inventory endpoint
VITE_API_WAREHOUSE_INVENTORY    # Full URL for warehouse inventory endpoint
```

## Getting Started

```bash
cd Pharmalink-Front-end
npm install
npm run dev
```

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Folder Structure

```
Pharmalink-Front-end/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── Components/
│   │   ├── AccountCreated/         # Post-signup confirmation screen
│   │   │   └── Accountcreatred.jsx
│   │   ├── AccountType/            # Role selection (Client / Pharmacy / Warehouse)
│   │   │   └── AccountType.jsx
│   │   ├── Cart/                   # Shopping cart UI
│   │   │   ├── Cart.jsx
│   │   │   └── CartPage.jsx
│   │   ├── Chat/                   # Global real-time chat
│   │   │   ├── GlobalChat.css
│   │   │   └── GlobalChat.jsx
│   │   ├── ConfirmOrder/           # Order confirmation step
│   │   │   ├── ConfirmOrder.jsx
│   │   │   └── ConfirmOrderPage.jsx
│   │   ├── ExchangeRequest/        # P2P pharmacy medicine exchange
│   │   │   ├── ExchangeRequest.css
│   │   │   └── ExchangeRequest.jsx
│   │   ├── Footer/
│   │   │   ├── Footer.css
│   │   │   └── Footer.jsx
│   │   ├── ForgotPassword/
│   │   │   ├── ForgotPassword.css
│   │   │   └── ForgotPassword.jsx
│   │   ├── Home/                   # Public landing page
│   │   │   ├── Category/
│   │   │   │   └── Category.jsx
│   │   │   ├── Hero/
│   │   │   │   └── Hero.jsx
│   │   │   ├── JoinNow/
│   │   │   │   └── JoinNow.jsx
│   │   │   ├── Testimonials/
│   │   │   │   └── Testimonials.jsx
│   │   │   ├── WhyUs/
│   │   │   │   └── WhyUs.jsx
│   │   │   ├── Home.css
│   │   │   └── Home.jsx
│   │   ├── Layout/                 # Shared layout wrapper (Navbar + Footer)
│   │   │   └── Layout.jsx
│   │   ├── Medications/            # Medicine catalogue listing
│   │   │   ├── Medications.css
│   │   │   └── Medications.jsx
│   │   ├── MedicineDetails/        # Single medicine detail view
│   │   │   └── MedicineDetails.jsx
│   │   ├── MyOrders/               # Client order history
│   │   │   ├── MyOrders.css
│   │   │   └── MyOrders.jsx
│   │   ├── Navbar/
│   │   │   ├── Navbar.css
│   │   │   └── Navbar.jsx
│   │   ├── Order/                  # Order card / summary component
│   │   │   ├── Order.css
│   │   │   └── Order.jsx
│   │   ├── OrderDashboard/         # Pharmacy order management dashboard
│   │   │   ├── OrderDashboard.css
│   │   │   └── OrderDashboard.jsx
│   │   ├── PharmacyDashboard/      # Pharmacy main dashboard
│   │   │   ├── PharmacyDashboard.css
│   │   │   └── PharmacyDashboard.jsx
│   │   ├── PharmacyInventory/      # Pharmacy stock management
│   │   │   ├── PharmacyInventory.css
│   │   │   └── PharmacyInventory.jsx
│   │   ├── PharmacyLayout/         # Sidebar layout for pharmacy role
│   │   │   ├── PharmacyLayout.css
│   │   │   └── PharmacyLayout.jsx
│   │   ├── PharmacySales/          # Pharmacy sales overview
│   │   │   └── PharmacySales.jsx
│   │   ├── Prescription/           # Prescription image upload
│   │   │   ├── PrescriptionUpload.css
│   │   │   └── PrescriptionUpload.jsx
│   │   ├── Rating/                 # Star rating widget
│   │   │   └── Rating.jsx
│   │   ├── Sales/                  # Reusable sales sub-components
│   │   │   ├── SalesTable.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── TopStats.jsx
│   │   ├── Search/                 # Medicine search UI
│   │   │   ├── Search.css
│   │   │   └── Search.jsx
│   │   ├── Settings/               # User account settings
│   │   │   ├── Settings.css
│   │   │   └── Settings.jsx
│   │   ├── SignInForm/             # Login form
│   │   │   └── SignInForm.jsx
│   │   ├── Signup/                 # Registration form (role-aware)
│   │   │   └── Signup.jsx
│   │   ├── WarehouseDashboard/     # Warehouse main dashboard
│   │   │   ├── WarehouseDashboard.css
│   │   │   └── WarehouseDashboard.jsx
│   │   ├── WarehouseInventory/     # Warehouse stock management
│   │   │   ├── WarehouseInventory.css
│   │   │   └── WarehouseInventory.jsx
│   │   └── WarehouseOrderTracking/ # Warehouse outbound order tracker
│   │       └── WarehouseOrderTracking.jsx
│   ├── context/
│   │   ├── AuthContext.jsx         # Auth state (token, role, userId)
│   │   └── CartContext.jsx         # Cart state across the client flow
│   ├── locales/
│   │   ├── ar.js                   # Arabic translation strings
│   │   └── en.js                   # English translation strings
│   ├── utils/
│   │   ├── api.js                  # Axios instance with base URL + auth header
│   │   └── translations.js         # Legacy translation helper
│   ├── App.css
│   ├── App.jsx                     # Route definitions (createBrowserRouter)
│   ├── firebase.js                 # Firebase app + Google auth provider init
│   ├── i18n.js                     # i18next configuration (AR/EN, RTL detection)
│   ├── index.css                   # Global styles
│   └── main.jsx                    # React DOM entry point
├── .env                            # Environment variables (not committed)
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

## Route Structure

```
/                       → Home (public landing page)
/account-type           → Role selection
/signup/:role           → Registration form for selected role
/account-created        → Post-signup confirmation
/signin                 → Login
/client/*               → Client dashboard (guarded — role: client)
/pharmacy/*             → Pharmacy dashboard (guarded — role: pharmacy)
/warehouse/*            → Warehouse dashboard (guarded — role: warehouse)
```

Routes under `/client`, `/pharmacy`, and `/warehouse` are protected by a `RoleRoute` guard that reads `userRole` from `localStorage`.

## Auth Flow

- **Email/Password** — handled via backend JWT; token stored in `localStorage` under `token`.
- **Google OAuth** — handled via Firebase; token exchanged with the backend.
- `localStorage` keys: `token`, `userId`, `userRole`, `signupRole`.

## i18n

The app supports Arabic (RTL) and English (LTR) via i18next. Language strings live in `src/locales/ar.js` and `src/locales/en.js`. The active language is auto-detected from the browser and can be toggled at runtime.
