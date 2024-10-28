import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavbarPage from '../CadastrosNavbar';
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

  // Função para carregar todas as máquinas e máquinas do usuário
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

        // Se o usuário estiver sendo editado, filtra as máquinas dele
        if (usuarioParaEditar && usuarioParaEditar.maquinas) {
          const maquinasDoUsuario = maquinas.filter(maquina => 
            usuarioParaEditar.maquinas.includes(maquina.value)
          );
          setMaquinasSelecionadas(maquinasDoUsuario);

          // Remove máquinas do usuário da lista de opções
          setOpcoesMaquinas(maquinas.filter(maquina =>
            !usuarioParaEditar.maquinas.includes(maquina.value)
          ));
        }
      } catch (error) {
        console.error('Erro ao buscar máquinas:', error);
      }
    };
    fetchMaquinas();
  }, [usuarioParaEditar]);

  const handleSelecionarMaquina = (event) => {
    const selectedValue = event.target.value;
    const maquinaSelecionada = opcoesMaquinas.find(maquina => maquina.value.toString() === selectedValue);
    if (maquinaSelecionada) {
      setMaquinasSelecionadas([...maquinasSelecionadas, maquinaSelecionada]);
      setOpcoesMaquinas(opcoesMaquinas.filter(maquina => maquina.value.toString() !== selectedValue));
      setSelectedMachine('');
    }
  };

  const handleRemoverMaquina = (valor) => {
    const maquinaRemovida = maquinasSelecionadas.find(maquina => maquina.value === valor);
    if (maquinaRemovida) {
      setMaquinasSelecionadas(maquinasSelecionadas.filter(maquina => maquina.value !== valor));
      setOpcoesMaquinas([...opcoesMaquinas, maquinaRemovida]);
    }
  };

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
      <NavbarPage />
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

        <select
          name="maquinas"
          value={selectedMachine}
          onChange={handleSelecionarMaquina}
        >
          <option value="" disabled>Selecione uma máquina</option>
          {opcoesMaquinas.map(maquina => (
            <option key={maquina.value} value={maquina.value}>
              {maquina.label}
            </option>
          ))}
        </select>
        <div>
          <h2>Máquinas Selecionadas</h2>
          {maquinasSelecionadas.length > 0 ? (
            <ul>
              {maquinasSelecionadas.map(maquina => (
                <li key={maquina.value}>
                  {maquina.label}
                  <button type="button" onClick={() => handleRemoverMaquina(maquina.value)}>Remover</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma máquina selecionada.</p>
          )}
        </div>
        
        <button type="submit">{usuarioParaEditar ? 'Atualizar Usuário' : 'Cadastrar Usuário'}</button>
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        {mensagem && <p style={{ color: 'green' }}>{mensagem}</p>}
      </form>
    </div>
  );
}

export default CadastroUsuarios;
