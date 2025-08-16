import React, { useEffect } from "react";
import {  Routes, Route, useNavigate} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const App = () => {
 const navigate = useNavigate();
 useEffect(() => {
   
   if (localStorage.getItem("userloggedIn")) {
     navigate("/dashboard");
   } else {
     navigate("/login");
   }
  }, []);
  return (
    <>
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
    </>
  );
};


export default App;
