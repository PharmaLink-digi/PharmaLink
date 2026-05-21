import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import SignInForm from "./Components/SignInForm/SignInForm";
import Home from "./Components/Home/Home";
import { RouterProvider } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";



// import SignInForm from './Components/SignInForm/SignInForm'

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
     <SignInForm/>
      {/* <SignInForm/> */}
      {/* <Home/> */}

      {/* <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} /> 
      <Route path="/search" element={<Search />} /> */}

      {/* dkkjoiuhgihjldk */}

      {/* <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter> */}

{/* <Route path="/signup" element={<Signup />} />
<Route path="/بحث" element={<Search />} /> */}

    </>
  );
}

export default App;
