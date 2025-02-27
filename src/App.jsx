import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Mapp from "./components/Mapp";
import Air from "./components/Air";




function App() {
  return (
    <>
      <Nav/>
      <Routes>
        <Route path="/" element={<Mapp/>} />
        <Route path="/map2" element={<Air/>} />
        



      </Routes>
    </>
  );
}

export default App;
