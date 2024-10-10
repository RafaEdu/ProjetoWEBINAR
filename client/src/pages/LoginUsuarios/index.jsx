import React, { useState } from 'react';
import './login.css';
import logo from './logo.png'; // Certifique-se de que o caminho esteja correto

function LoginUsuarios({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (email === 'usuario@gmail.com' && senha === 'usuario') {
      setErro('');
      onLoginSuccess();
    } else {
      setErro('Email ou senha inválidos.');
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
      
        <img src={logo} alt="Logo" className="login-logo" />
        
        <p className="welcome-message">Seja bem-vindo(a) ao WebinarFruki</p>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="login-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="login-input"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          {erro && <p className="login-error">{erro}</p>}
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginUsuarios;
