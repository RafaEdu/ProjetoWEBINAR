import React, { useState } from 'react';
import NavbarPage from '../CadastrosNavbar';
import './styles.css';

function CriarQuestionario() {
  const [titulo, setTitulo] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [perguntas, setPerguntas] = useState([
    { texto: '', alternativas: [{ texto: '', is_correta: false }] }
  ]);

  const adicionarPergunta = () => {
    setPerguntas([...perguntas, { texto: '', alternativas: [{ texto: '', is_correta: false }] }]);
  };

  const adicionarAlternativa = (perguntaIndex) => {
    const novasPerguntas = [...perguntas];
    novasPerguntas[perguntaIndex].alternativas.push({ texto: '', is_correta: false });
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

  // New: Function to remove a question
  const removerPergunta = (perguntaIndex) => {
    const novasPerguntas = perguntas.filter((_, index) => index !== perguntaIndex);
    setPerguntas(novasPerguntas);
  };

  // New: Function to remove an alternative from a question
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
          texto: pergunta.texto,
          alternativas: pergunta.alternativas.map((alt) => ({
            texto: alt.texto,
            is_correta: alt.is_correta
          }))
        }))
      };
    
      try {
        const response = await fetch('http://localhost:8000/api/questionarios/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(novoQuestionario),
        });
    
        if (response.ok) {
          setTitulo('');  
          setPerguntas([{ texto: '', alternativas: [{ texto: '', is_correta: false }] }]);
          setMensagem('Questionário cadastrado com sucesso!');
        } else {
          setErro('Erro ao cadastrar o questionário.');
        }
      } catch (error) {
        console.error('Erro ao cadastrar questionário:', error);
        setErro('Erro na conexão com o servidor.');
      }
    };
    


  return (
    <div className="container">
      <NavbarPage />
      <h1>Criar Questionário</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título do Questionário"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        {perguntas.map((pergunta, perguntaIndex) => (
          <div key={perguntaIndex} className="pergunta-bloco">
            <input
              type="text"
              placeholder="Pergunta"
              value={pergunta.texto}
              onChange={(e) => handlePerguntaChange(perguntaIndex, e.target.value)}
            />
            {pergunta.alternativas.map((alternativa, alternativaIndex) => (
              <div key={alternativaIndex} className="alternativa-bloco">
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
                {/* Button to remove an alternative */}
                <button type="button" onClick={() => removerAlternativa(perguntaIndex, alternativaIndex)}>
                  Remover Alternativa
                </button>
              </div>
            ))}
            <button type="button" onClick={() => adicionarAlternativa(perguntaIndex)}>Nova Alternativa</button>
            {/* Button to remove the entire question */}
            <button type="button" onClick={() => removerPergunta(perguntaIndex)}>Remover Pergunta</button>
          </div>
        ))}

          {erro && <p style={{ color: 'red' }}>{erro}</p>}
          {mensagem && <p style={{ color: 'green' }}>{mensagem}</p>}
        <button type="button" onClick={adicionarPergunta}>Nova Pergunta</button>
        <button type="submit">Salvar Questionário</button>
      </form>
    </div>
  );
}

export default CriarQuestionario;
