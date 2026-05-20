import  react, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Person,
  Shop,
  Building,
  Buildings,
  ArrowRight,
  Check2,
} from "react-bootstrap-icons";
import AccountType from "../component/AccountType/AccountType";
import Accountcreatred from "../component/AccountCreated/Accountcreatred";


function App() {
  return(
    <>
      <AccountType/>
      <Accountcreatred/>

    </> 
  )
}

export default App;
