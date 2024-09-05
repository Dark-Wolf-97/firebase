import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import Home from "./pages/Home/Home";

function RoutesApp(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/cadastro" element={<Cadastro/>}/>
                <Route path="/Home" element={<Home/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export  default RoutesApp