import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Mapp from "./components/Mapp";
import Air from "./components/Air";
import { Grid2 } from "@mui/material";
import './App.css';





function App() {
  return (
    <>
      <Nav/>
      <Grid2>
      <Routes>
        
        <Route path="/" element={<Mapp/>} />
        <Route path="/map2" element={<Air/>} />
       
      </Routes>
      </Grid2>
    </>
  );
}

export default App;
