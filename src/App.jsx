import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import Home from "./Components/Home/Home";
import "./Components/Home/Home.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import SignInForm from "./Components/SignInForm/SignInForm";
import PharmacyInventory from "./Components/PharmacyInventory/PharmacyInventory";
import WarehouseInventory from "./Components/WarehouseInventory/WarehouseInventory";



// import SignInForm from './Components/SignInForm/SignInForm'

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />,
          <Route path="signup" element={<SignInForm />} />,
          <Route path="SignInForm" element={<SignInForm />} />,
          <Route path="pharmacy-inventory" element={<PharmacyInventory />} />,
          <Route path="warehouse-inventory" element={<WarehouseInventory />} />
        </Routes>
      </BrowserRouter> */}

      {/* <Home /> */}
      <PharmacyInventory />
      <WarehouseInventory />
      <SignInForm />

    </>
  );
}

export default App;
