import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Mapp from "./components/Mapp";
import GHG from "./components/GHG";
import { Grid2 } from "@mui/material";
import './App.css';





function App() {
  return (
    <>
      <Nav/>
      <Routes>
        
        <Route path="/" element={<Mapp/>} />
        <Route path="/map2" element={<GHG/>} />
       
      </Routes>
    </>
  );
}

export default App;
