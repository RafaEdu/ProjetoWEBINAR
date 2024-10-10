import React, { useState } from 'react';
import NavbarPage from '../CadastrosNavbar';
import MenuFunc from '../MenuFunc'; // Importe o novo componente
import './styles.css';
import { FaHome, FaBook, FaRoute, FaFile, FaCog } from 'react-icons/fa';

function PaginaHome() {
  const [currentPage, setCurrentPage] = useState('home'); // Estado para rastrear a página atual

  // Função que altera a página com base na opção clicada
  const handleOptionClick = (option) => {
    setCurrentPage(option);
  };

  return (
    <div className="home-container">
      {/* Sidebar fixa */}
      <aside className="sidebar">
        <button onClick={() => handleOptionClick('home')} className="icon-button">
          <FaHome />
        </button>
        <button onClick={() => handleOptionClick('MenuFunc')} className="icon-button">
          <FaRoute />
        </button>
        <button onClick={() => handleOptionClick('option3')} className="icon-button">
          <FaBook />
        </button>
        <button onClick={() => handleOptionClick('option4')} className="icon-button">
          <FaFile />
        </button>
        <button onClick={() => handleOptionClick('CadastroNavbar')} className="icon-button">
          <FaCog />
        </button>
      </aside>

      {/* Conteúdo principal, que muda com base na página selecionada */}
      <div className="main-content">
        {currentPage === 'home' && (
          <div>
            <h1>Bem-vindo à Página Home</h1>
            <p>Landing page em construção...</p>
          </div>
        )}

        {currentPage === 'MenuFunc' && <MenuFunc />} {/* Renderiza o MenuFunc */}

        {currentPage === 'CadastroNavbar' && <NavbarPage />} {/* Renderiza o CadastroNavbar */}

        {/* Outras opções de páginas */}
        {currentPage === 'option3' && (
          <div>
            <h1>Página 3</h1>
            <p>Conteúdo da página 3</p>
          </div>
        )}

        {currentPage === 'option4' && (
          <div>
            <h1>Página 4</h1>
            <p>Conteúdo da página 4</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaginaHome;