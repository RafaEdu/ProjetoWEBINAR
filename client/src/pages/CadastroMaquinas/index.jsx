import React, { useState } from 'react';
import './styles.css';

function CadastroMaquinas() {
  const [nomeMaquina, setNomeMaquina] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleChange = (event) => {
    setNomeMaquina(event.target.value);
    setErro(''); // Limpa o erro ao digitar um novo nome
    setMensagem(''); // Limpa a mensagem ao alterar os dados
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
        body: JSON.stringify({ nomeMaquina }),
      });

      if (response.ok) {
        setNomeMaquina(''); // Reseta o campo de input
        setMensagem('Máquina cadastrada com sucesso!');
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
        {mensagem && <p style={{ color: 'green' }}>{mensagem}</p>}
        <button type="submit">Cadastrar Máquina</button>
      </form>
    </div>
  );
}

export default CadastroMaquinas;
