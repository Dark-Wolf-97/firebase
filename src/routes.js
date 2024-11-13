import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import Home from "./pages/SlotMachine/SlotMachine";
import Perfil from "./pages/Perfil/Perfil";
import Carteira from "./pages/Carteira/Carteira";
import Header from "./Componets/Header";

function RoutesApp() {
  return (
    <BrowserRouter>
      <RoutesWithHeader />
    </BrowserRouter>
  );
}

function RoutesWithHeader() {
  const location = useLocation();

  const header = ["/Home", "/Perfil", "/Carteira"].includes(location.pathname);

  return (
    <>
      {header && <Header />} 

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/Carteira" element={<Carteira />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </>
  );
}

export default RoutesApp;
