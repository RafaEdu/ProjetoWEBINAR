import React, { useState } from 'react';
import './style.css'; // Mantendo o estilo igual aos outros

function CadastroAula() {
  const [titulo, setTitulo] = useState('');
  const [horas, setHoras] = useState('');
  const [minutos, setMinutos] = useState('');
  const [segundos, setSegundos] = useState('');
  const [tipo, setTipo] = useState(''); // Armazena 'video' ou 'slide'
  const [video, setVideo] = useState(null); // Para armazenar o vídeo
  const [slide, setSlide] = useState(null); // Para armazenar o PDF
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleTipoChange = (event) => {
    setTipo(event.target.value);
    setVideo(null);
    setSlide(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validações básicas
    if (!titulo || !horas || !minutos || !segundos || !tipo) {
      setErro('Todos os campos são obrigatórios.');
      setSucesso('');
      return;
    }

    // Verifica se anexou o arquivo correto
    if (tipo === 'video' && !video) {
      setErro('Por favor, anexe um vídeo.');
      return;
    } else if (tipo === 'slide' && !slide) {
      setErro('Por favor, anexe um arquivo PDF.');
      return;
    }

    // Simulação de cadastro (substituir por integração real com backend)
    setSucesso('Aula cadastrada com sucesso!');
    setErro('');

    // Limpar os campos após o cadastro
    setTitulo('');
    setHoras('');
    setMinutos('');
    setSegundos('');
    setTipo('');
    setVideo(null);
    setSlide(null);
  };

  return (
    <div className="container">
      <h1>Cadastro de Aula</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título da aula"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        {/* Campo de duração com precisão de horas, minutos e segundos */}
        <div className="duration-container">
          <label>Duração:</label>
          <input
            type="number"
            placeholder="Horas"
            value={horas}
            onChange={(e) => setHoras(e.target.value)}
            min="0"
          />
          <input
            type="number"
            placeholder="Minutos"
            value={minutos}
            onChange={(e) => setMinutos(e.target.value)}
            min="0"
            max="59"
          />
          <input
            type="number"
            placeholder="Segundos"
            value={segundos}
            onChange={(e) => setSegundos(e.target.value)}
            min="0"
            max="59"
          />
        </div>

        <div>
          <label>
            <input
              type="radio"
              value="video"
              checked={tipo === 'video'}
              onChange={handleTipoChange}
            />
            Vídeo
          </label>
          <label>
            <input
              type="radio"
              value="slide"
              checked={tipo === 'slide'}
              onChange={handleTipoChange}
            />
            Slide
          </label>
        </div>

        {tipo === 'video' && (
          <div>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
            />
          </div>
        )}

        {tipo === 'slide' && (
          <div>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setSlide(e.target.files[0])}
            />
          </div>
        )}

        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}

        <button type="submit">Cadastrar Aula</button>
      </form>
    </div>
  );
}

export default CadastroAula;