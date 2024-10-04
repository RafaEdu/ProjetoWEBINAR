import React, { useState, useEffect } from 'react';
import './styles.css';

function CadastroMaquinas() {
  const [nomeMaquina, setNomeMaquina] = useState('');
  const [maquinasCadastradas, setMaquinasCadastradas] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true); // Adiciona estado de carregamento

  // Função para buscar máquinas cadastradas ao carregar a página
  const fetchMaquinas = async () => {
    try {
      setCarregando(true); // Inicia o carregamento
      const response = await fetch('http://localhost:8000/api/maquinas/');
      if (response.ok) {
        const data = await response.json();

        // Garantir que o retorno é uma lista antes de definir o estado
        if (Array.isArray(data)) {
          setMaquinasCadastradas(data.map(maquina => maquina.nomeMaquina));
        } else {
          throw new Error('Formato de dados inválido');
        }
      } else {
        setErro('Erro ao buscar máquinas cadastradas.');
      }
    } catch (error) {
      console.error('Erro ao buscar máquinas:', error);
      setErro('Erro na conexão com o servidor.');
    } finally {
      setCarregando(false); // Finaliza o carregamento
    }
  };

  useEffect(() => {
    fetchMaquinas(); // Busca as máquinas cadastradas quando o componente for montado
  }, []);

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

  // Se estiver carregando, mostra uma mensagem de carregamento
  if (carregando) {
    return <div>Carregando...</div>;
  }

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
      {maquinasCadastradas.length === 0 ? (
        <p>Nenhuma máquina cadastrada.</p>
      ) : (
        <ul>
          {maquinasCadastradas.map((maquina, index) => (
            <li key={index}>{maquina}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CadastroMaquinas;
