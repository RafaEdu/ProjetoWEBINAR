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

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Verifica se o nome da máquina já existe
    if (maquinasCadastradas.includes(nomeMaquina)) {
      setErro('Essa máquina já está cadastrada.');
    } else if (nomeMaquina.trim() === '') {
      setErro('O nome da máquina não pode estar vazio.');
    } else {
      // Cadastra a nova máquina
      setMaquinasCadastradas([...maquinasCadastradas, nomeMaquina]);
      setNomeMaquina(''); // Reseta o campo de input
      console.log('Máquina cadastrada:', nomeMaquina);
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
