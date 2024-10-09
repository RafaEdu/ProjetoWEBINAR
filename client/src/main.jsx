import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import PaginaHome from './pages/PaginaHome';
import LoginUsuarios from './pages/LoginUsuarios';
import './index.css';
import { FaPowerOff } from "react-icons/fa6";
import logo from './logo.png'; // Adicione a importação da imagem

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
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
