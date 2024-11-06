import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import PaginaHome from './pages/PaginaHome';
import LoginUsuarios from './pages/LoginUsuarios';
import './index.css';
import { FaPowerOff } from "react-icons/fa6";
import logo from './logo.png'; // Adicione a importação da imagem
// Importações principais do React e do React Router
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Importando as páginas de lista de usuários e cadastro de usuários
import ConsultaFuncs from './pages/ConsultaFuncs'; 
import CadastroUsuarios from './pages/CadastroUsuarios/index'; 

// Função principal que configura o roteamento das páginas
function enviaConsCad() {
  return (
    <Router>
      <Routes>
        {/* Definindo a rota para a lista de usuários */}
        <Route path="/ConsultaFuncs" element={<ConsultaFuncs />} />
        
        {/* Definindo a rota para o cadastro de usuários */}
        <Route path="/CadastroUsuarios" element={<CadastroUsuarios />} />
      </Routes>
    </Router>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verifica se o usuário está autenticado ao carregar o componente
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Função chamada quando o login for bem-sucedido
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  // Função de logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('access'); // Remover o token de acesso
    localStorage.removeItem('refresh'); // Remover o token de refresh
    window.location.href = '/login'; // Redirecionar para a página de login
  };

  if (!isAuthenticated) {
    return <LoginUsuarios onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {isAuthenticated ? (
        <>
          <div className="main-navbar">
            <div className="navbar-content">
              <div className="logo">
                <img src={logo} alt="Logo" style={{ height: '50px' }} /> {/* Ajuste a altura conforme necessário */}
              </div>
              <button onClick={handleLogout} className="logout-button">
                <FaPowerOff />
              </button>
            </div>
          </div>
          <div className="main-content">
            <PaginaHome onLogout={handleLogout} />
          </div>
        </>
      ) : (
        <LoginUsuarios onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Exportando o App como componente principal
export default enviaConsCad;
