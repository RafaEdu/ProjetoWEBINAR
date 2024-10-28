import React, { useEffect, useState } from 'react';
import NavbarPage from '../CadastrosNavbar'; // Ajuste o caminho conforme necessário
import './style.css';

function CadastroTreinamento() {
  const [opcoesDisponiveis, setOpcoesDisponiveis] = useState([]);
  const [selectedMaquinas, setSelectedMaquinas] = useState([]); // Altere para armazenar múltiplas máquinas
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

  // Função para gerenciar a seleção de múltiplas máquinas
  const handleSelecionarMaquinas = (event) => {
    const selectedValues = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedMaquinas(selectedValues); // Atualiza a lista de IDs de máquinas selecionadas
  };

  const handleSelecionarQuestionario = (event) => {
    const selectedValue = event.target.value;
    setSelectedQuestionario(selectedValue);
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
      idquestionario: selectedQuestionario,
      idarea: selectedArea,
      maquina: selectedMaquinas, // Envia a lista de máquinas selecionadas
    };

    console.log('Dados do curso a serem enviados:', cursoData);

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
        console.error('Erro ao cadastrar o curso:', errorData);
        throw new Error(`Erro ao cadastrar o curso: ${errorData.detail || 'Erro desconhecido'}`);
      }

      event.target.reset();
      setSelectedMaquinas([]);
      setSelectedQuestionario("");
      setSelectedArea("");
      setErrorMessage(""); 
    } catch (error) {
      console.error('Erro ao cadastrar o curso:', error);
      setErrorMessage(error.message);
    }
  };

  if (isLoading) {
    return <div>Carregando dados...</div>;
  }

  return (
    <div className='container'>
      <NavbarPage />
      <form onSubmit={handleSubmit}>
        <h1>Cadastro De Novo Curso</h1>
        <input
          name="titulo"
          type='text'
          placeholder='Dê um título'
          required
          maxLength={30}
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
          value={selectedMaquinas}
          onChange={handleSelecionarMaquinas}
          multiple // Adiciona suporte a múltipla seleção
          required
        >
          <option value="" disabled>Selecione uma ou mais máquinas</option>
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
