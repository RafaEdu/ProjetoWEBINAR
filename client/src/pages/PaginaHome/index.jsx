import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import NavbarPage from '../CadastrosNavbar';
import MenuFunc from '../MenuFunc';
import MenuCurso from '../MenuCurso';
import MenuMaq from '../MenuMaq';
import ConsultaFuncs from '../ConsultaFuncs';
import CursosDaMaquina from '../CursosDaMaquina';
import AulasDoCurso from '../AulasDoCurso';
import VisualizarAula from '../VisualizarAula';
import CadastroTreinamento from '../CadastroTreinamento';
import CadastroAulas from '../CadastroAulas';
import CadastroMaquinas from '../CadastroMaquinas';
import CadastroUsuarios from '../CadastroUsuarios';
import CadastroArea from '../CadastroAreas';
import CadastroQuestionario from '../CadastroQuestionario';
import './styles.css';
import { FaHome, FaBook, FaRoute, FaFile, FaCog, FaUsers, FaTools } from 'react-icons/fa';

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <button onClick={() => navigate('/')} className="icon-button" title="Página Inicial">
        <FaHome />
      </button>
      <button onClick={() => navigate('/consulta-funcs')} className="icon-button" title="Funcionários">
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
        <Sidebar />

        <div className="main-content">

          <Routes>
            <Route path="/" element={<MenuFunc />} />
            <Route path="/consulta-funcs" element={<ConsultaFuncs />} />
            <Route path="/menu-maq" element={<MenuMaq />} />
            <Route path="/menu-curso" element={<MenuCurso />} />
            <Route path="/curso/:idcurso" element={<AulasDoCurso />} />
            <Route path="/cursos-da-maquina/:id" element={<CursosDaMaquina />} />
            <Route path="/aula/:idaula" element={<VisualizarAula />} />
            <Route path="/cadastro-navbar" element={<NavbarPage />} />
            <Route path="/cadastro-treinamento" element={<CadastroTreinamento />} />
            <Route path="/cadastro-aulas" element={<CadastroAulas />} />
            <Route path="/cadastro-maquinas" element={<CadastroMaquinas />} />
            <Route path="/cadastro-usuarios" element={<CadastroUsuarios />} />
            <Route path="/cadastro-area" element={<CadastroArea />} />
            <Route path="/cadastro-questionario" element={<CadastroQuestionario />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}


export default PaginaHome;
