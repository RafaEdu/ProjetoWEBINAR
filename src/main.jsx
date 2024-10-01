import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import CadastroTreinamento from './pages/CadastroTreinamento';
import CadastroLinhas from './pages/CadastroLinhas';
import CadastroMaquinas from './pages/CadastroMaquinas';
import CadastroUsuarios from './pages/CadastroUsuarios';
import LoginUsuarios from './pages/LoginUsuarios';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setCurrentPage('treinamento'); // Defina a página inicial após o login
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    setCurrentPage('treinamento'); // Redireciona para a página de treinamento após o login
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    setCurrentPage('login'); 
  };

  if (!isAuthenticated) {
    return <LoginUsuarios onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div>
      <nav>
        <button onClick={() => setCurrentPage('treinamento')}>Cadastro de Treinamento</button>
        <button onClick={() => setCurrentPage('linha')}>Cadastro de Linha</button>
        <button onClick={() => setCurrentPage('maquinas')}>Cadastro de Máquinas</button>
        <button onClick={() => setCurrentPage('novo usuario')}>Novo usuário</button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </nav>

      <div>
        {currentPage === 'treinamento' && <CadastroTreinamento />}
        {currentPage === 'linha' && <CadastroLinhas />}
        {currentPage === 'maquinas' && <CadastroMaquinas />}
        {currentPage === 'novo usuario' && <CadastroUsuarios />}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
