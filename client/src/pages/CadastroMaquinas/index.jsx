import React, { useState } from 'react';
import './styles.css';

function CadastroMaquinas() {
  const [nomeMaquina, setNomeMaquina] = useState('');
  const [maquinasCadastradas, setMaquinasCadastradas] = useState([]);
  const [erro, setErro] = useState('');

  const handleChange = (event) => {
    setNomeMaquina(event.target.value);
    setErro(''); // Limpa o erro ao digitar um novo nome
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (nomeMaquina.trim() === '') {
      setErro('O nome da máquina não pode estar vazio.');
      return;
    }

    try {
      // Faz o POST para a API de máquinas
      const response = await fetch('http://localhost:8000/api/maquinas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nomeMaquina: nomeMaquina,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Adiciona a nova máquina à lista de cadastradas
        setMaquinasCadastradas([...maquinasCadastradas, data.nomeMaquina]);
        setNomeMaquina(''); // Reseta o campo de input
      } else {
        setErro('Erro ao cadastrar a máquina.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar máquina:', error);
      setErro('Erro na conexão com o servidor.');
    }
  };

  return (
    <div className="container">
      <h1>Cadastro de Máquinas</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome da Máquina"
          value={nomeMaquina}
          onChange={handleChange}
        />
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        <button type="submit">Cadastrar Máquina</button>
      </form>

      <h2>Máquinas Cadastradas:</h2>
      <ul>
        {maquinasCadastradas.map((maquina, index) => (
          <li key={index}>{maquina}</li>
        ))}
      </ul>
    </div>
  );
}

export default CadastroMaquinas;
