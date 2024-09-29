import React, { useState } from 'react';
import './style.css';

function LoginUsuarios() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validação simples
    if (email.trim() === '' || senha.trim() === '') {
      setErro('Email e senha são obrigatórios.');
    } else {
      // Realizar login (a lógica de autenticação seria adicionada aqui)
      console.log('Login realizado:', email);
      setErro(''); // Limpa qualquer erro
      setEmail(''); // Limpa os campos após o login
      setSenha('');
    }
  };

  return (
    <div className="container">
      <h1>Login de Funcionários</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email do Funcionário"
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
