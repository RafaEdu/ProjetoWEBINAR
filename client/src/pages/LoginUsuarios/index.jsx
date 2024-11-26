import React, { useState } from 'react';
import './login.css';
import logo from './logo.png'; // Certifique-se de que o caminho esteja correto

function LoginUsuarios({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [is_admin, setIsAdmin] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: senha,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Armazena os tokens JWT no localStorage
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('id', data.id)
        localStorage.setItem('nome', data.nome);  
        localStorage.setItem('isAdmin', data.is_admin);

        setErro('');
        onLoginSuccess(); // Chama a função de sucesso de login para redirecionar ou atualizar o estado global
      } else {
        setErro('Email ou senha inválidos.');
      }
    } catch (error) {
      setErro('Erro ao conectar ao servidor. Tente novamente mais tarde.');
      console.error('Erro:', error);
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
