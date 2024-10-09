import React, { useState } from 'react';
import NavbarPage from '../CadastrosNavbar';
import './styles.css';  
import { FaHome, FaBook, FaRoute, FaChartBar, FaFile, FaCog } from 'react-icons/fa'; 
function PaginaHome() {
  const [showNavbarPage, setShowNavbarPage] = useState(false);

  // Ao clicar na última opção da sidebar
  const handleOptionClick = (option) => {
    if (option === 'CadastroNavbar') {
      setShowNavbarPage(true); 
    }
  };

  if (showNavbarPage) {
    return <NavbarPage />;
  }

  return (
    <div className="home-container">
      <aside className="sidebar">
        <button onClick={() => handleOptionClick('option1')} className="icon-button">
          <FaHome />
        </button> 
        <button onClick={() => handleOptionClick('option2')} className="icon-button">
          <FaRoute />
        </button> 
        <button onClick={() => handleOptionClick('option3')} className="icon-button">
          <FaBook/>
        </button>
        <button onClick={() => handleOptionClick('option4')} className="icon-button">
          <FaFile />
        </button> 
        <button onClick={() => handleOptionClick('CadastroNavbar')} className="icon-button">
          <FaCog />
        </button>  
        
      </aside>
      <div className="main-content">
        <h1>Bem-vindo à Página Home</h1>
        <p>Landing page em construção...</p>
      </div>
    </div>
  );
}

export default PaginaHome;
