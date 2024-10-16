import React, { useEffect, useState } from 'react';
import './style.css';

function CadastroTreinamento() {
  const [opcoesDisponiveis, setOpcoesDisponiveis] = useState([]);
  const [selectedMaquina, setSelectedMaquina] = useState(null);
  const [areas, setAreas] = useState([]);
  const [questionarios, setQuestionarios] = useState([]);
  const [selectedQuestionario, setSelectedQuestionario] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const [isLoading, setIsLoading] = useState(true); 

  // Fetch de máquinas, áreas e questionários
  useEffect(() => {
    const fetchData = async () => {
      try {
        const maquinasResponse = await fetch('http://localhost:8000/api/maquinas/');
        const areasResponse = await fetch('http://localhost:8000/api/areas/');
        const questionariosResponse = await fetch('http://localhost:8000/api/questionarios/');
        
        if (!maquinasResponse.ok || !areasResponse.ok || !questionariosResponse.ok) {
          throw new Error('Erro ao buscar dados das APIs');
        }

        const maquinasData = await maquinasResponse.json();
        const areasData = await areasResponse.json();
        const questionariosData = await questionariosResponse.json();
        
        setOpcoesDisponiveis(maquinasData);
        setAreas(areasData);
        setQuestionarios(questionariosData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setErrorMessage('Erro ao carregar dados. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelecionarOpcao = (event) => {
    const selectedValue = event.target.value;
    const opcaoSelecionada = opcoesDisponiveis.find(opcao => opcao.idmaquina === parseInt(selectedValue, 10));

    if (opcaoSelecionada) {
      setSelectedMaquina(opcaoSelecionada);
    }
  };

  const handleSelecionarQuestionario = (event) => {
    const selectedValue = event.target.value;
    setSelectedQuestionario(selectedValue); // Mantenha como string para comparação
    console.log('Questionário selecionado:', selectedValue); // Log para verificação
  };

  const handleSelecionarArea = (event) => {
    const selectedValue = event.target.value;
    setSelectedArea(selectedValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cursoData = {
      titulo: event.target.titulo.value,
      descricao: event.target.descricao.value,
      dataCriacao: event.target.dataCriacao.value,
      idquestionario: selectedQuestionario, // String ID do questionário
      idarea: selectedArea,
      maquina: selectedMaquina ? selectedMaquina.idmaquina : null,
    };

    console.log('Dados do curso a serem enviados:', cursoData); // Log dos dados do curso

    try {
      const response = await fetch('http://localhost:8000/api/cursos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cursoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro ao cadastrar o curso:', errorData); // Log do erro
        throw new Error(`Erro ao cadastrar o curso: ${errorData.detail || 'Erro desconhecido'}`);
      }

      event.target.reset();
      setSelectedMaquina(null);
      setSelectedQuestionario("");
      setSelectedArea("");
      setErrorMessage(""); // Limpa mensagens de erro
    } catch (error) {
      console.error('Erro ao cadastrar o curso:', error);
      setErrorMessage(error.message); // Atualiza a mensagem de erro
    }
  };

  if (isLoading) {
    return <div>Carregando dados...</div>;
  }

  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <h1>Cadastro De Novo Curso</h1>
        <input
          name="titulo"
          type='text'
          placeholder='Dê um título'
          required
          maxLength={30} // Limita o número de caracteres a 30
        />
        <input
          name="descricao"
          type='text'
          placeholder='Descrição do curso'
          required
        />
        <input
          name="dataCriacao"
          type='date'
          placeholder='Data de Criação do Curso'
          required
        />

        <h2>Máquinas</h2>
        <select
          name="maquinas"
          value={selectedMaquina ? selectedMaquina.idmaquina : ""}
          onChange={handleSelecionarOpcao}
          required
        >
          <option value="" disabled>Selecione uma máquina</option>
          {opcoesDisponiveis.map(opcao => (
            <option key={opcao.idmaquina} value={opcao.idmaquina}>
              {opcao.nomeMaquina}
            </option>
          ))}
        </select>

        <h2>Área</h2> 
        <select
          name="areas"
          value={selectedArea}
          onChange={handleSelecionarArea}
          required
        >
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
          value={selectedQuestionario} 
          onChange={handleSelecionarQuestionario}
          required
        >
          <option value="" disabled>Selecione um questionário</option>
          {questionarios.map(questionario => (
            <option key={questionario.idquestionario} value={questionario.idquestionario}>
              {questionario.titulo}
            </option>
          ))}
        </select>

        {errorMessage && <p className="error-message">{errorMessage}</p>} 

        <button type='submit'>Cadastrar</button>
      </form>
    </div>
  );
}

export default CadastroTreinamento;
