import React, { useState } from 'react';
import './style.css';

function LoginUsuarios({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Verificar se o email e senha são o padrão
    if (email === 'usuario@gmail.com' && senha === 'usuario') {
      setErro(''); // Limpa o erro
      onLoginSuccess(); // Chama a função passada como prop quando o login for bem-sucedido
    } else {
      setErro('Email ou senha inválidos.');
    }
  };

  return (
    <div className="container">
      <h1>Entrar no sistema</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginUsuarios;
