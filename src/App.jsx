import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Search from "./Components/Search/Search";
import SignInForm from "./Components/SignInForm/SignInForm";


// import SignInForm from './Components/SignInForm/SignInForm'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/signin" element={<SignInForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
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
