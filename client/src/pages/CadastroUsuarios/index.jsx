import React, { useState, useEffect } from 'react';
import './style.css';

function CadastroUsuarios() {
  const [opcoesMaquinas, setOpcoesMaquinas] = useState([]);
  const [maquinasSelecionadas, setMaquinasSelecionadas] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState('');

  const [nomeFuncionario, setNomeFuncionario] = useState('');
  const [emailFuncionario, setEmailFuncionario] = useState('');
  const [senhaFuncionario, setSenhaFuncionario] = useState('');
  const [funcionariosCadastrados, setFuncionariosCadastrados] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [erro, setErro] = useState('');

  // Buscar máquinas do banco de dados ao carregar a página
  useEffect(() => {
    const fetchMaquinas = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/maquinas/');
        const data = await response.json();
        const maquinas = data.map(maquina => ({
          value: maquina.idmaquina,  // Pegando o id da máquina
          label: maquina.nomeMaquina,  // Pegando o nome da máquina
        }));
        setOpcoesMaquinas(maquinas);
      } catch (error) {
        console.error('Erro ao buscar máquinas:', error);
      }
    };

    fetchMaquinas();
  }, []);

  const handleSelecionarMaquina = (event) => {
    const selectedValue = event.target.value;
    const maquinaSelecionada = opcoesMaquinas.find(maquina => maquina.value.toString() === selectedValue);

    if (maquinaSelecionada) {
      setMaquinasSelecionadas([...maquinasSelecionadas, maquinaSelecionada]);
      setOpcoesMaquinas(opcoesMaquinas.filter(maquina => maquina.value.toString() !== selectedValue));
      setSelectedMachine("");
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

    if (nomeFuncionario.trim() === '' || emailFuncionario.trim() === '' || senhaFuncionario.trim() === '') {
      setErro('Todos os campos são obrigatórios.');
    } else if (funcionariosCadastrados.some(func => func.email === emailFuncionario)) {
      setErro('Este email já está cadastrado.');
    } else {
      const novoFuncionario = {
        nome: nomeFuncionario,
        email: emailFuncionario,
        senha: senhaFuncionario,
        is_active: true,
        is_admin: isAdmin,
        idmaquina_id: maquinasSelecionadas.map(maquina => maquina.value) // Usando o ID da máquina selecionada
      };

      try {
        const response = await fetch('http://localhost:8000/api/users/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(novoFuncionario),
        });

        if (response.ok) {
          const data = await response.json();
          setFuncionariosCadastrados([...funcionariosCadastrados, data]);
          setNomeFuncionario('');
          setEmailFuncionario('');
          setSenhaFuncionario('');
          setMaquinasSelecionadas([]);
          setErro('');
        } else {
          setErro('Erro ao cadastrar o funcionário.');
        }
      } catch (error) {
        console.error('Erro ao cadastrar funcionário:', error);
        setErro('Erro na conexão com o servidor.');
      }
    }
  };

  return (
    <div className="container">
      <h1>Cadastro de Usuários</h1>
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
                  <button type="button" onClick={() => handleRemoverMaquina(maquina.value)}>
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma máquina selecionada.</p>
          )}
        </div>

        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        <button type="submit">Cadastrar Usuário</button>
      </form>

      <h2>Usuários Cadastrados:</h2>
      <ul>
        {funcionariosCadastrados.map((funcionario, index) => (
          <li key={index}>
            {funcionario.nome} - {funcionario.email} - {funcionario.is_admin ? 'Admin' : 'Funcionário'}<br />
            Máquinas: {funcionario.idmaquina_id.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CadastroUsuarios;
