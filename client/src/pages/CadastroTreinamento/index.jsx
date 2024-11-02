import React, { useEffect, useState } from 'react';
import NavbarPage from '../CadastrosNavbar';
import { useLocation } from 'react-router-dom';
import './style.css';

function CadastroTreinamento() {
  const [opcoesDisponiveis, setOpcoesDisponiveis] = useState([]);
  const [selectedMaquinas, setSelectedMaquinas] = useState([]);
  const [areas, setAreas] = useState([]);
  const [questionarios, setQuestionarios] = useState([]);
  const [selectedQuestionario, setSelectedQuestionario] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');

  // Estado para os campos do formulário
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataCriacao, setDataCriacao] = useState("");

  const location = useLocation();
  const treinamentoParaEditar = location.state?.dadosEdicao || null;

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

        // Preenche os campos com os dados do treinamento a ser editado, se houver
        if (treinamentoParaEditar) {
          setTitulo(treinamentoParaEditar.titulo);
          setDescricao(treinamentoParaEditar.descricao);
          setDataCriacao(treinamentoParaEditar.dataCriacao);
          setSelectedMaquinas(treinamentoParaEditar.maquina || []);
          setSelectedQuestionario(treinamentoParaEditar.idquestionario || "");
          setSelectedArea(treinamentoParaEditar.idarea || "");
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setErrorMessage('Erro ao carregar dados. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelecionarMaquinas = (event) => {
    const selectedValues = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedMaquinas(selectedValues);
  };

  const handleSelecionarQuestionario = (event) => {
    setSelectedQuestionario(event.target.value);
  };

  const handleSelecionarArea = (event) => {
    setSelectedArea(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cursoData = {
      titulo,
      descricao,
      dataCriacao,
      idquestionario: selectedQuestionario,
      idarea: selectedArea,
      maquina: selectedMaquinas,
    };

    try {
      const response = await fetch(
        `http://localhost:8000/api/cursos/${treinamentoParaEditar ? treinamentoParaEditar.id : ''}`,
        {
          method: treinamentoParaEditar ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cursoData),
        }
      );

      if (response.ok) {
        setMensagem(treinamentoParaEditar ? 'Curso atualizado com sucesso!' : 'Curso cadastrado com sucesso!');
        if (!treinamentoParaEditar) {
          setTitulo("");
          setDescricao("");
          setDataCriacao("");
          setSelectedMaquinas([]);
          setSelectedQuestionario("");
          setSelectedArea("");
        }
      } else {
        setErrorMessage('Erro ao cadastrar ou atualizar o curso.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar ou atualizar curso:', error);
      setErrorMessage('Erro na conexão com o servidor.');
    }
  };

  if (isLoading) {
    return <div>Carregando dados...</div>;
  }

  return (
    <div className='container'>
      <NavbarPage />
      <form onSubmit={handleSubmit}>
        <h1>{treinamentoParaEditar ? 'Editar Curso' : 'Cadastro De Novo Curso'}</h1>
        <input
          name="titulo"
          type='text'
          placeholder='Dê um título'
          required
          maxLength={30}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <input
          name="descricao"
          type='text'
          placeholder='Descrição do curso'
          required
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <input
          name="dataCriacao"
          type='date'
          placeholder='Data de Criação do Curso'
          required
          value={dataCriacao}
          onChange={(e) => setDataCriacao(e.target.value)}
        />

        <h2>Máquinas</h2>
        <select
          name="maquinas"
          value={selectedMaquinas}
          onChange={handleSelecionarMaquinas}
          multiple
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
        {mensagem && <p style={{ color: 'green' }}>{mensagem}</p>}
        <button type='submit'>{treinamentoParaEditar ? 'Atualizar Curso' : 'Cadastrar'}</button>
      </form>
    </div>
  );
}

export default CadastroTreinamento;
