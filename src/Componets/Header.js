import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Header.css';

function Header() {

  return (
    <header className="header">
      <div className="left">
        <p>Bem-vindo</p>
      </div>
      <div className="right">
        <Link to="/Home">Home</Link>
        <Link to="/Perfil">Perfil</Link>
        <Link to="/Carteira">Carteira</Link>
      </div>
    </header>
  );
}

export default Header;
