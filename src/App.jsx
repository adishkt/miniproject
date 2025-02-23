import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Hom from "./components/Hom";
import Mapp from "./components/Mapp";
import Air from "./components/Air";
import Team from "./components/Team";



function App() {
  return (
    <>
      <Nav/>
      <Routes>
        <Route path="/" element={<Hom/>} />
        <Route path="/map1" element={<Mapp/>} />
        <Route path="/map2" element={<Air/>} />
        <Route path="/team" element={<Team/>} />



      </Routes>
    </>
  );
}

export default App;
