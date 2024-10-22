// src/PaginaHome.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import NavbarPage from '../CadastrosNavbar';
import MenuFunc from '../MenuFunc';
import MenuCurso from '../MenuCurso';
import MenuMaq from '../MenuMaq';
import ConsultaFuncs from '../ConsultaFuncs'; 
import ConsultaMaquinas from '../ConsultaMaquinas';
import CursosDaMaquina from '../CursosDaMaquina'; // Componente para cursos por máquina
import AulasDoCurso from '../AulasDoCurso'; // Componente para cursos por máquina
import './styles.css';
import { FaHome, FaBook, FaRoute, FaFile, FaCog, FaUsers } from 'react-icons/fa'; 

function Sidebar() {
  const navigate = useNavigate(); // Inicializa o hook useNavigate

  return (
    <aside className="sidebar">
      <button onClick={() => navigate('/')} className="icon-button" title="Página Inicial">
        <FaHome />
      </button>
      <button onClick={() => navigate('/consulta-funcs')} className="icon-button" title="Funcionários">
        <FaUsers />
      </button>
      <button onClick={() => navigate('/consulta-maquinas')} className="icon-button" title="Consulta Máquinas">
        <FaUsers />
      </button>
      <button onClick={() => navigate('/menu-maq')} className="icon-button" title="Máquinas">
        <FaRoute />
      </button>
      <button onClick={() => navigate('/menu-curso')} className="icon-button" title="Cursos">
        <FaBook />
      </button>
      <button onClick={() => navigate('/relatorios')} className="icon-button" title="Relatórios">
        <FaFile />
      </button>
      <button onClick={() => navigate('/cadastro-navbar')} className="icon-button" title="Cadastros">
        <FaCog />
      </button>
    </aside>
  );
}

function PaginaHome() {
  return (
    <Router>
      <div className="home-container">
        <Sidebar /> {/* Adicionando a sidebar como um componente separado */}

        {/* Conteúdo principal */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<MenuFunc />} />
            <Route path="/consulta-funcs" element={<ConsultaFuncs />} />
            <Route path="/menu-maq" element={<MenuMaq />} />
            <Route path="/consulta-maquinas" element={<ConsultaMaquinas />} />
            <Route path="/menu-curso" element={<MenuCurso />} />
            <Route path="/curso/:idcurso" element={<AulasDoCurso />} />
            <Route path="/cadastro-navbar" element={<NavbarPage />} />
            <Route path="/cursos-da-maquina/:id" element={<CursosDaMaquina />} />
            <Route path="/relatorios" element={<div><h1>Relatórios</h1><p>Em construção</p></div>} />
            <Route path="*" element={<Navigate to="/" />} /> {/* Redireciona para a home se a rota não existir */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default PaginaHome;
