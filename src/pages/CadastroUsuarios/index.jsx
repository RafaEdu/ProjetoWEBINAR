import React, { useState } from 'react';
import './style.css';

function CadastroFuncionarios() {
  const [nomeFuncionario, setNomeFuncionario] = useState('');
  const [emailFuncionario, setEmailFuncionario] = useState('');
  const [senhaFuncionario, setSenhaFuncionario] = useState('');
  const [funcionariosCadastrados, setFuncionariosCadastrados] = useState([]);
  const [erro, setErro] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Verifica se os campos estão preenchidos
    if (nomeFuncionario.trim() === '' || emailFuncionario.trim() === '' || senhaFuncionario.trim() === '') {
      setErro('Todos os campos são obrigatórios.');
    } else if (funcionariosCadastrados.some((func) => func.email === emailFuncionario)) {
      setErro('Este email já está cadastrado.');
    } else {
      // Cadastra o funcionário
      const novoFuncionario = { nome: nomeFuncionario, email: emailFuncionario };
      setFuncionariosCadastrados([...funcionariosCadastrados, novoFuncionario]);
      setNomeFuncionario('');
      setEmailFuncionario('');
      setSenhaFuncionario('');
      setErro('');
    }
  };

  return (
    <div className="container">
      <h1>Cadastro de Funcionários</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome do Funcionário"
          value={nomeFuncionario}
          onChange={(e) => setNomeFuncionario(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email do Funcionário"
          value={emailFuncionario}
          onChange={(e) => setEmailFuncionario(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senhaFuncionario}
          onChange={(e) => setSenhaFuncionario(e.target.value)}
        />
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        <button type="submit">Cadastrar Funcionário</button>
      </form>

      <h2>Funcionários Cadastrados:</h2>
      <ul>
        {funcionariosCadastrados.map((funcionario, index) => (
          <li key={index}>
            {funcionario.nome} - {funcionario.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CadastroFuncionarios;
