import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavbarPage from '../CadastrosNavbar';
import './styles.css';

function CriarQuestionario() {
  const location = useLocation();
  const questionarioParaEditar = location.state?.dadosEdicao;
  const [titulo, setTitulo] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [perguntas, setPerguntas] = useState([
    { idpergunta: null, texto: '', alternativas: [{ idalternativa: null, texto: '', is_correta: false }] }
  ]);

  useEffect(() => {
    if (questionarioParaEditar) {
      setTitulo(questionarioParaEditar.titulo);
      setPerguntas(questionarioParaEditar.perguntas.map(pergunta => ({
        idpergunta: pergunta.idpergunta || null,
        texto: pergunta.texto,
        alternativas: pergunta.alternativas.map(alt => ({
          idalternativa: alt.idalternativa || null,
          texto: alt.texto,
          is_correta: alt.is_correta
        }))
      })));
    }
  }, [questionarioParaEditar]);

  const adicionarPergunta = () => {
    setPerguntas([...perguntas, { idpergunta: null, texto: '', alternativas: [{ idalternativa: null, texto: '', is_correta: false }] }]);
  };

  const adicionarAlternativa = (perguntaIndex) => {
    const novasPerguntas = [...perguntas];
    novasPerguntas[perguntaIndex].alternativas.push({ idalternativa: null, texto: '', is_correta: false });
    setPerguntas(novasPerguntas);
  };

  const handlePerguntaChange = (index, value) => {
    const novasPerguntas = [...perguntas];
    novasPerguntas[index].texto = value;
    setPerguntas(novasPerguntas);
  };

  const handleAlternativaChange = (perguntaIndex, alternativaIndex, value) => {
    const novasPerguntas = [...perguntas];
    novasPerguntas[perguntaIndex].alternativas[alternativaIndex].texto = value;
    setPerguntas(novasPerguntas);
  };

  const marcarAlternativaCorreta = (perguntaIndex, alternativaIndex) => {
    const novasPerguntas = [...perguntas];
    novasPerguntas[perguntaIndex].alternativas = novasPerguntas[perguntaIndex].alternativas.map((alt, idx) => ({
      ...alt,
      is_correta: idx === alternativaIndex
    }));
    setPerguntas(novasPerguntas);
  };

  const removerPergunta = (perguntaIndex) => {
    const novasPerguntas = perguntas.filter((_, index) => index !== perguntaIndex);
    setPerguntas(novasPerguntas);
  };

  const removerAlternativa = (perguntaIndex, alternativaIndex) => {
    const novasPerguntas = [...perguntas];
    novasPerguntas[perguntaIndex].alternativas = novasPerguntas[perguntaIndex].alternativas.filter(
      (_, index) => index !== alternativaIndex
    );
    setPerguntas(novasPerguntas);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const novoQuestionario = {
      titulo: titulo,
      perguntas: perguntas.map((pergunta) => ({
        idpergunta: pergunta.idpergunta, // Inclui o ID da pergunta se ela já existir
        texto: pergunta.texto,
        alternativas: pergunta.alternativas.map((alt) => ({
          idalternativa: alt.idalternativa, // Inclui o ID da alternativa se ela já existir
          texto: alt.texto,
          is_correta: alt.is_correta
        }))
      }))
    };

    try {
      const method = questionarioParaEditar ? 'PUT' : 'POST';
      const endpoint = questionarioParaEditar
        ? `http://localhost:8000/api/questionarios/${questionarioParaEditar.idquestionario}/`
        : 'http://localhost:8000/api/questionarios/';

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoQuestionario),
      });

      if (response.ok) {
        setTitulo('');
        setPerguntas([{ idpergunta: null, texto: '', alternativas: [{ idalternativa: null, texto: '', is_correta: false }] }]);
        setMensagem('Questionário salvo com sucesso!');
      } else {
        setErro('Erro ao salvar o questionário.');
      }
    } catch (error) {
      console.error('Erro ao salvar questionário:', error);
      setErro('Erro na conexão com o servidor.');
    }
  };

  return (
    <div className="container">
      <NavbarPage />
      <h1>{questionarioParaEditar ? 'Editar Questionário' : 'Criar Questionário'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título do Questionário"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        {perguntas.map((pergunta, perguntaIndex) => (
          <div key={pergunta.idpergunta || perguntaIndex} className="pergunta-bloco">
            <input
              type="text"
              placeholder="Pergunta"
              value={pergunta.texto}
              onChange={(e) => handlePerguntaChange(perguntaIndex, e.target.value)}
            />
            {pergunta.alternativas.map((alternativa, alternativaIndex) => (
              <div key={alternativa.idalternativa || alternativaIndex} className="alternativa-bloco">
                <input
                  type="text"
                  placeholder={`Alternativa ${String.fromCharCode(97 + alternativaIndex)}`}
                  value={alternativa.texto}
                  onChange={(e) => handleAlternativaChange(perguntaIndex, alternativaIndex, e.target.value)}
                />
                <label>
                  <input
                    type="checkbox"
                    checked={alternativa.is_correta}
                    onChange={() => marcarAlternativaCorreta(perguntaIndex, alternativaIndex)}
                  />
                  Correta
                </label>
                <button type="button" onClick={() => removerAlternativa(perguntaIndex, alternativaIndex)}>
                  Remover Alternativa
                </button>
              </div>
            ))}
            <button type="button" onClick={() => adicionarAlternativa(perguntaIndex)}>Nova Alternativa</button>
            <button type="button" onClick={() => removerPergunta(perguntaIndex)}>Remover Pergunta</button>
          </div>
        ))}

        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        {mensagem && <p style={{ color: 'green' }}>{mensagem}</p>}
        <button type="button" onClick={adicionarPergunta}>Nova Pergunta</button>
        <button type="submit">{questionarioParaEditar ? 'Atualizar Questionário' : 'Salvar Questionário'}</button>
      </form>
    </div>
  );
}

export default CriarQuestionario;
