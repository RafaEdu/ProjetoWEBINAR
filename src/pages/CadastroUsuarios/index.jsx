import React, { useState } from 'react';
import './style.css';

function CadastroUsuarios() {
  // Estado para as opções de máquinas disponíveis e selecionadas
  const [opcoesMaquinas, setOpcoesMaquinas] = useState([
    { value: "1", label: "Máquina 1" },
    { value: "2", label: "Máquina 2" },
    { value: "3", label: "Máquina 3" }
  ]);

  const [maquinasSelecionadas, setMaquinasSelecionadas] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState("");

  const [nomeFuncionario, setNomeFuncionario] = useState('');
  const [emailFuncionario, setEmailFuncionario] = useState('');
  const [senhaFuncionario, setSenhaFuncionario] = useState('');
  const [funcionariosCadastrados, setFuncionariosCadastrados] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); 
  const [erro, setErro] = useState('');

  
  const handleSelecionarMaquina = (event) => {
    const selectedValue = event.target.value;

    
    const maquinaSelecionada = opcoesMaquinas.find(maquina => maquina.value === selectedValue);

    if (maquinaSelecionada) {
     
      setMaquinasSelecionadas([...maquinasSelecionadas, maquinaSelecionada]);

     
      setOpcoesMaquinas(opcoesMaquinas.filter(maquina => maquina.value !== selectedValue));

  
      setSelectedMachine("");
    }
  };

  // Função para remover uma máquina da lista de selecionadas e voltar ao select
  const handleRemoverMaquina = (valor) => {
    // Encontrar a máquina a ser removida
    const maquinaRemovida = maquinasSelecionadas.find(maquina => maquina.value === valor);

    if (maquinaRemovida) {
      // Remover a máquina da lista de selecionadas
      setMaquinasSelecionadas(maquinasSelecionadas.filter(maquina => maquina.value !== valor));

      // Adicionar de volta ao select
      setOpcoesMaquinas([...opcoesMaquinas, maquinaRemovida]);
    }
  };

  // Função para cadastrar o usuário
  const handleSubmit = (event) => {
    event.preventDefault();

    // Verifica se os campos estão preenchidos
    if (nomeFuncionario.trim() === '' || emailFuncionario.trim() === '' || senhaFuncionario.trim() === '') {
      setErro('Todos os campos são obrigatórios.');
    } else if (funcionariosCadastrados.some(func => func.email === emailFuncionario)) {
      setErro('Este email já está cadastrado.');
    } else {
      // Cadastra o funcionário
      const novoFuncionario = {
        nome: nomeFuncionario,
        email: emailFuncionario,
        isAdmin: isAdmin,
        maquinas: maquinasSelecionadas.map(maquina => maquina.label)
      };
      setFuncionariosCadastrados([...funcionariosCadastrados, novoFuncionario]);
      setNomeFuncionario('');
      setEmailFuncionario('');
      setSenhaFuncionario('');
      setMaquinasSelecionadas([]); 
      setErro('');
    }
  };

  return (
    <div className="container">
      <h1>Cadastro de Usuários</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome do Usuário"
          value={nomeFuncionario}
          onChange={(e) => setNomeFuncionario(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email do Usuário"
          value={emailFuncionario}
          onChange={(e) => setEmailFuncionario(e.target.value)}
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
            {funcionario.nome} - {funcionario.email} - {funcionario.isAdmin ? 'Admin' : 'Funcionário'}<br />
            Máquinas: {funcionario.maquinas.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CadastroUsuarios;
