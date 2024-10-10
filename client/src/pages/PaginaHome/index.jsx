import React, { useState } from 'react';
import NavbarPage from '../CadastrosNavbar';
import MenuFunc from '../MenuFunc';
import './styles.css';
import { FaHome, FaBook, FaRoute, FaFile, FaCog } from 'react-icons/fa';

function PaginaHome() {
  const [currentPage, setCurrentPage] = useState('home'); // Estado para rastrear a página atual
  const [tooltips, setTooltips] = useState({
    home: 'Página Inicial',
    MenuFunc: 'Máquinas',
    option3: 'Cursos',
    option4: 'Relatórios',
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
          onClick={() => handleOptionClick('maquinas')}
          className="icon-button"
          title={tooltips.MenuFunc} // Tooltip editável
        >
          <FaRoute />
        </button>
        <button
          onClick={() => handleOptionClick('option3')}
          className="icon-button"
          title={tooltips.option3} // Tooltip editável
        >
          <FaBook />
        </button>
        <button
          onClick={() => handleOptionClick('option4')}
          className="icon-button"
          title={tooltips.option4} // Tooltip editável
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
        {currentPage === 'maquinas' && (
          <div>
            <h1>Máquinas</h1>
            <p>Em construção...</p>
          </div>
        )}

        {currentPage === 'MenuFunc' && <MenuFunc />} {/* Renderiza o MenuFunc */}

        {currentPage === 'CadastroNavbar' && <NavbarPage />} {/* Renderiza o CadastroNavbar */}

        {/* Outras opções de páginas */}
        {currentPage === 'option3' && (
          <div>
            <h1>Cursos</h1>
            <p>Em construção</p>
          </div>
        )}

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
