import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import CadastroTreinamento from './pages/CadastroTreinamento';
import CadastroLinhas from './pages/CadastroLinhas';
import CadastroMaquinas from './pages/CadastroMaquinas';
import CadastroUsuarios from './pages/CadastroUsuarios';
import LoginUsuarios from './pages/LoginUsuarios';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  return (
    <div>
      <nav>
        <button onClick={() => setCurrentPage('treinamento')}>Cadastro de Treinamento</button>
        <button onClick={() => setCurrentPage('linha')}>Cadastro de Linha</button>
        <button onClick={() => setCurrentPage('maquinas')}>Cadastro de Máquinas</button>
        <button onClick={() => setCurrentPage('novo usuario')}>Novo usuário</button>
        <button onClick={() => setCurrentPage('login')}>Entrar</button>
      </nav>

      <div>
        {currentPage === 'treinamento' && <CadastroTreinamento />}
        {currentPage === 'linha' && <CadastroLinhas />}
        {currentPage === 'maquinas' && <CadastroMaquinas />}
        {currentPage === 'novo usuario' && <CadastroUsuarios />}
        {currentPage === 'login' && <LoginUsuarios />}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
