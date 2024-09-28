import React, { useState } from 'react';
import './style.css';

function CadastroLinhas() {
  // Estado para as opções de máquinas disponíveis e selecionadas
  const [opcoesDisponiveis, setOpcoesDisponiveis] = useState([
    { value: "1", label: "Máquina 1" },
    { value: "2", label: "Máquina 2" },
    { value: "3", label: "Máquina 3" }
  ]);

  const [opcoesSelecionadas, setOpcoesSelecionadas] = useState([]);
  const [selectedOption, setSelectedOption] = useState(""); // Estado para controlar o select
  const [nomeLinha, setNomeLinha] = useState(""); // Estado para o nome da linha
  const [linhasExistentes, setLinhasExistentes] = useState([]); // Estado para guardar as linhas já cadastradas

  // Função para adicionar a opção selecionada à lista e removê-la do select
  const handleSelecionarOpcao = (event) => {
    const selectedValue = event.target.value;

    // Encontrar a opção selecionada
    const opcaoSelecionada = opcoesDisponiveis.find(opcao => opcao.value === selectedValue);

    if (opcaoSelecionada) {
      // Adicionar a opção selecionada à lista de selecionadas
      setOpcoesSelecionadas([...opcoesSelecionadas, opcaoSelecionada]);

      // Remover a opção selecionada das disponíveis
      setOpcoesDisponiveis(opcoesDisponiveis.filter(opcao => opcao.value !== selectedValue));

      // Resetar o select para mostrar a opção padrão
      setSelectedOption("");
    }
  };

  // Função para remover uma opção da lista de selecionadas e voltar ao select
  const handleRemoverOpcao = (valor) => {
    const opcaoRemovida = opcoesSelecionadas.find(opcao => opcao.value === valor);

    if (opcaoRemovida) {
      
      setOpcoesSelecionadas(opcoesSelecionadas.filter(opcao => opcao.value !== valor));

     
      setOpcoesDisponiveis([...opcoesDisponiveis, opcaoRemovida]);
    }
  };

  // Função para verificar se o nome da linha já existe
  const handleCadastrarLinha = () => {
    
    if (linhasExistentes.includes(nomeLinha.trim())) {
      alert("Já existe uma linha cadastrada com este nome!");
    } else if (nomeLinha.trim() === "" || opcoesSelecionadas.length === 0) {
      alert("Preencha o nome da linha e selecione pelo menos uma máquina.");
    } else {
      
      setLinhasExistentes([...linhasExistentes, nomeLinha.trim()]);
      alert(`Linha ${nomeLinha} cadastrada com sucesso!`);

      
      setNomeLinha("");
      setOpcoesSelecionadas([]);
    }
  };

  return (
    <div className='container'>
      <form action="">
        <h1>Cadastro De Nova Linha</h1>
        <input
          name="nome"
          type='text'
          placeholder='Nome da Linha'
          value={nomeLinha}
          onChange={(e) => setNomeLinha(e.target.value)}
        />

        <select
          name="maquinas"
          value={selectedOption} // Controla o valor do select
          onChange={handleSelecionarOpcao}
        >
          <option value="" disabled>Selecione uma máquina</option>
          {opcoesDisponiveis.map(opcao => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </select>

        <div>
          <h2>Máquinas Selecionadas</h2>
          {opcoesSelecionadas.length > 0 ? (
            <ul>
              {opcoesSelecionadas.map(opcao => (
                <li key={opcao.value}>
                  {opcao.label}
                  <button type="button" onClick={() => handleRemoverOpcao(opcao.value)}>
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma máquina selecionada.</p>
          )}
        </div>

        <button type="button" onClick={handleCadastrarLinha}>Cadastrar</button>
      </form>
    </div>
  );
}

export default CadastroLinhas;
