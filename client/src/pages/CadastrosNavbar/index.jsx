import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';  

function NavbarPage() {
  const navigate = useNavigate(); // Inicializa useNavigate

  return (
    <div className="navbar-page-container">
      {/* Navbar fixa no topo */}
      <nav className="navbar">
        <button onClick={() => navigate('/cadastro-treinamento')}>Cadastrar Cursos</button>
        <button onClick={() => navigate('/cadastro-aulas')}>Cadastrar Aulas</button>
        <button onClick={() => navigate('/cadastro-maquinas')}>Cadastrar Máquinas</button>
        <button onClick={() => navigate('/cadastro-usuarios')}>Cadastrar Usuários</button>
        <button onClick={() => navigate('/cadastro-area')}>Cadastrar Áreas</button>
        <button onClick={() => navigate('/cadastro-questionario')}>Cadastrar Questionários</button>
      </nav>
    </div>
  );
}

export default NavbarPage;
