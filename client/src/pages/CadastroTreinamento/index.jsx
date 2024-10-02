import React, { useState } from 'react';
import './style.css';

function CadastroTreinamento() {
  // Estado para as opções de máquinas disponíveis e selecionadas
  const [opcoesDisponiveis, setOpcoesDisponiveis] = useState([
    { value: "1", label: "Máquina 1" },
    { value: "2", label: "Máquina 2" },
    { value: "3", label: "Máquina 3" }
  ]);

  const [opcoesSelecionadas, setOpcoesSelecionadas] = useState([]);
  const [selectedOption, setSelectedOption] = useState(""); // Estado para controlar o select

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
    // Encontrar a opção a ser removida
    const opcaoRemovida = opcoesSelecionadas.find(opcao => opcao.value === valor);

    if (opcaoRemovida) {
      // Remover a opção da lista de selecionadas
      setOpcoesSelecionadas(opcoesSelecionadas.filter(opcao => opcao.value !== valor));

      // Adicionar de volta ao select
      setOpcoesDisponiveis([...opcoesDisponiveis, opcaoRemovida]);
    }
  };

  return (
    <div className='container'>
      <form action="">
        <h1>Cadastro De Novo Curso</h1>
        <input name="titulo" type='text' placeholder='Dê um título' />
        <input name="descrição" type='text' placeholder='Descrição do curso' />
        <input name="vencimento" type='date' placeholder='Data de vencimento' />

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

        <button type='button'>Cadastrar</button>
      </form>
    </div>
  );
}

export default CadastroTreinamento;
