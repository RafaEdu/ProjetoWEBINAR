import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import CadastroTreinamento from './pages/CadastroTreinamento';
import CadastroLinhas from './pages/CadastroLinhas';
import CadastroMaquinas from './pages/CadastroMaquinas';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('treinamento');

  return (
    <div>
      <nav>
        <button onClick={() => setCurrentPage('treinamento')}>Cadastro de Treinamento</button>
        <button onClick={() => setCurrentPage('linha')}>Cadastro de Linha</button>
        <button onClick={() => setCurrentPage('maquinas')}>Cadastro de Máquinas</button>
      </nav>

      <div>
        {currentPage === 'treinamento' && <CadastroTreinamento />}
        {currentPage === 'linha' && <CadastroLinhas />}
        {currentPage === 'maquinas' && <CadastroMaquinas />}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
