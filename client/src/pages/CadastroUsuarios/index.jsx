import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './style.css';

function CadastroUsuarios() {
  const location = useLocation();
  const usuarioParaEditar = location.state?.usuario || null;

  const [opcoesMaquinas, setOpcoesMaquinas] = useState([]);
  const [maquinasSelecionadas, setMaquinasSelecionadas] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState('');
  
  const [nomeFuncionario, setNomeFuncionario] = useState(usuarioParaEditar ? usuarioParaEditar.nome : '');
  const [emailFuncionario, setEmailFuncionario] = useState(usuarioParaEditar ? usuarioParaEditar.email : '');
  const [senhaFuncionario, setSenhaFuncionario] = useState('');
  const [isAdmin, setIsAdmin] = useState(usuarioParaEditar ? usuarioParaEditar.is_admin : false);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const fetchMaquinas = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/maquinas/');
        const data = await response.json();
        const maquinas = data.map(maquina => ({
          value: maquina.idmaquina,
          label: maquina.nomeMaquina,
        }));
        setOpcoesMaquinas(maquinas);
      } catch (error) {
        console.error('Erro ao buscar máquinas:', error);
      }
    };
    fetchMaquinas();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (nomeFuncionario.trim() === '' || emailFuncionario.trim() === '' || (!usuarioParaEditar && senhaFuncionario.trim() === '')) {
      setErro('Todos os campos são obrigatórios.');
      return;
    }

    const funcionario = {
      nome: nomeFuncionario,
      email: emailFuncionario,
      senha: senhaFuncionario,
      is_active: true,
      is_admin: isAdmin,
      maquinas: maquinasSelecionadas.map(maquina => maquina.value),
    };

    try {
      const url = usuarioParaEditar 
        ? `http://localhost:8000/api/users/${usuarioParaEditar.id}/` 
        : 'http://localhost:8000/api/users/';
      const method = usuarioParaEditar ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(funcionario),
      });

      if (response.ok) {
        setNomeFuncionario('');
        setEmailFuncionario('');
        setSenhaFuncionario('');
        setMaquinasSelecionadas([]);
        setErro('');
        setMensagem(usuarioParaEditar ? 'Funcionário atualizado com sucesso!' : 'Funcionário cadastrado com sucesso!');
      } else {
        setErro(usuarioParaEditar ? 'Erro ao atualizar o funcionário.' : 'Erro ao cadastrar o funcionário.');
      }
    } catch (error) {
      console.error('Erro na conexão com o servidor:', error);
      setErro('Erro na conexão com o servidor.');
    }
  };

  return (
    <div className="container">
      <h1>{usuarioParaEditar ? 'Editar Usuário' : 'Cadastro de Usuários'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email do Usuário"
          value={emailFuncionario}
          onChange={(e) => setEmailFuncionario(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nome do Usuário"
          value={nomeFuncionario}
          onChange={(e) => setNomeFuncionario(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senhaFuncionario}
          onChange={(e) => setSenhaFuncionario(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={() => setIsAdmin(!isAdmin)}
          />
          Admin
        </label>
        
        <button type="submit">{usuarioParaEditar ? 'Atualizar Usuário' : 'Cadastrar Usuário'}</button>
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        {mensagem && <p style={{ color: 'green' }}>{mensagem}</p>}
      </form>
    </div>
  );
}

export default CadastroUsuarios;
