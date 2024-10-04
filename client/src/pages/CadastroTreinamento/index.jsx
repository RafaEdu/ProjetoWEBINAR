import React, { useEffect, useState } from 'react';
import './style.css';

function CadastroTreinamento() {
  const [opcoesDisponiveis, setOpcoesDisponiveis] = useState([]);
  const [selectedMaquina, setSelectedMaquina] = useState(null); // Estado para máquina selecionada
  const [areas, setAreas] = useState([]); // Estado para as áreas
  const [questionarios, setQuestionarios] = useState([]); // Estado para os questionários
  const [selectedQuestionario, setSelectedQuestionario] = useState(""); // Estado para questionário selecionado

  // Fetch de máquinas, áreas e questionários
  useEffect(() => {
    const fetchData = async () => {
      try {
        const maquinasResponse = await fetch('http://localhost:8000/api/maquinas/');
        const areasResponse = await fetch('http://localhost:8000/api/areas/');
        const questionariosResponse = await fetch('http://localhost:8000/api/questionarios/');
        
        const maquinasData = await maquinasResponse.json();
        const areasData = await areasResponse.json();
        const questionariosData = await questionariosResponse.json();
        
        setOpcoesDisponiveis(maquinasData); // Configura as máquinas disponíveis
        setAreas(areasData); // Definir as áreas
        setQuestionarios(questionariosData); // Definir os questionários
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  const handleSelecionarOpcao = (event) => {
    const selectedValue = event.target.value;
    const opcaoSelecionada = opcoesDisponiveis.find(opcao => opcao.idmaquina === parseInt(selectedValue, 10));

    // Definir a máquina selecionada
    if (opcaoSelecionada) {
      setSelectedMaquina(opcaoSelecionada);
    }
  };

  const handleSelecionarQuestionario = (event) => {
    const selectedValue = event.target.value;
    setSelectedQuestionario(selectedValue); // Definir o ID do questionário selecionado
  };

  return (
    <div className='container'>
      <form>
        <h1>Cadastro De Novo Curso</h1>
        <input name="titulo" type='text' placeholder='Dê um título' />
        <input name="descricao" type='text' placeholder='Descrição do curso' />
        <input name="dataCriacao" type='date' placeholder='Data de Criação do Curso' />

        <h2>Máquinas</h2>
        <select
          name="maquinas"
          value={selectedMaquina ? selectedMaquina.idmaquina : ""} // Controla o valor do select
          onChange={handleSelecionarOpcao}
        >
          <option value="" disabled>Selecione uma máquina</option>
          {opcoesDisponiveis.map(opcao => (
            <option key={opcao.idmaquina} value={opcao.idmaquina}>
              {opcao.nomeMaquina}
            </option>
          ))}
        </select>

        <h2>Área</h2> 
        <select name="areas">
          <option value="" disabled>Selecione uma área</option>
          {areas.map(area => (
            <option key={area.idarea} value={area.idarea}>
              {area.nome} 
            </option>
          ))}
        </select>

        <h2>Questionário</h2>
        <select
          name="questionarios"
          value={selectedQuestionario} // Controla o valor do select
          onChange={handleSelecionarQuestionario}
        >
          <option value="" disabled>Selecione um questionário</option>
          {questionarios.map(questionario => (
            <option key={questionario.idquestionario} value={questionario.idquestionario}>
              {questionario.titulo}
            </option>
          ))}
        </select>

        {selectedQuestionario && (
          <div>
            <h2>Questionário Selecionado</h2>
            <p>{questionarios.find(q => q.idquestionario === selectedQuestionario).titulo}</p>
          </div>
        )}

        <button type='button'>Cadastrar</button>
      </form>
    </div>
  );
}

export default CadastroTreinamento;
