import React, { useState } from 'react';
import NavbarPage from '../CadastrosNavbar';
import MenuFunc from '../MenuFunc';
import MenuCurso from '../MenuCurso';
import MenuMaq from '../MenuMaq';
import './styles.css';
import { FaHome, FaBook, FaRoute, FaFile, FaCog } from 'react-icons/fa';

function PaginaHome() {
  const [currentPage, setCurrentPage] = useState('MenuFunc'); // Estado para rastrear a página atual
  const [tooltips, setTooltips] = useState({
    home: 'Página Inicial',
    Maquinas: 'Máquinas',
    Cursos: 'Cursos',
    Relatorios: 'Relatórios',
    CadastroNavbar: 'Cadastros'
  }); // Estado para armazenar os nomes dos botões

  // Função que altera a página com base na opção clicada
  const handleOptionClick = (option) => {
    setCurrentPage(option);
  };

  return (
    <div className="home-container">
      {/* Sidebar fixa */}
      <aside className="sidebar">
        <button
          onClick={() => handleOptionClick('MenuFunc')}
          className="icon-button"
          title={tooltips.home} // Tooltip editável
        >
          <FaHome />
        </button>
        <button
          onClick={() => handleOptionClick('MenuMaq')}
          className="icon-button"
          title={tooltips.Maquinas} // Tooltip editável
        >
          <FaRoute />
        </button>
        <button
          onClick={() => handleOptionClick('MenuCurso')}
          className="icon-button"
          title={tooltips.Cursos} // Tooltip editável
        >
          <FaBook />
        </button>
        <button
          onClick={() => handleOptionClick('option4')}
          className="icon-button"
          title={tooltips.Relatorios} // Tooltip editável
        >
          <FaFile />
        </button>
        <button
          onClick={() => handleOptionClick('CadastroNavbar')}
          className="icon-button"
          title={tooltips.CadastroNavbar} // Tooltip editável
        >
          <FaCog />
        </button>
      </aside>

      {/* Conteúdo principal, que muda com base na página selecionada */}
      <div className="main-content">

        {currentPage === 'MenuFunc' && <MenuFunc />} 

        {currentPage === 'MenuMaq' && <MenuMaq />} 

        {currentPage === 'MenuCurso' && <MenuCurso />}

        {currentPage === 'CadastroNavbar' && <NavbarPage />} 

        {currentPage === 'option4' && (
          <div>
            <h1>Relatórios</h1>
            <p>Em construção</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaginaHome;
