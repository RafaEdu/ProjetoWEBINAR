import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

function ConsultaGeral() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [aulas, setAulas] = useState([]); // Novo estado para aulas
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('pessoas');
  const [busca, setBusca] = useState('');

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users/');
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        console.error('Erro ao buscar usuários.');
      }
    } catch (error) {
      console.error('Erro na conexão com o servidor:', error);
    }
  };

  const fetchMaquinas = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/maquinas/');
      if (response.ok) {
        const data = await response.json();
        setMaquinas(data);
      } else {
        console.error('Erro ao buscar máquinas.');
      }
    } catch (error) {
      console.error('Erro na conexão com o servidor:', error);
    }
  };

  const fetchCursos = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/cursos/');
      if (response.ok) {
        const data = await response.json();
        setCursos(data);
      } else {
        console.error('Erro ao buscar cursos.');
      }
    } catch (error) {
      console.error('Erro na conexão com o servidor:', error);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/areas/');
      if (response.ok) {
        const data = await response.json();
        setAreas(data);
      } else {
        console.error('Erro ao buscar áreas.');
      }
    } catch (error) {
      console.error('Erro na conexão com o servidor:', error);
    }
  };

  // Função para buscar aulas
  const fetchAulas = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/aulas/');
      if (response.ok) {
        const data = await response.json();
        setAulas(data);
      } else {
        console.error('Erro ao buscar aulas.');
      }
    } catch (error) {
      console.error('Erro na conexão com o servidor:', error);
    }
  };

  useEffect(() => {
    if (categoriaSelecionada === 'pessoas') fetchUsuarios();
    else if (categoriaSelecionada === 'maquinas') fetchMaquinas();
    else if (categoriaSelecionada === 'cursos') fetchCursos();
    else if (categoriaSelecionada === 'areas') fetchAreas();
    else if (categoriaSelecionada === 'aulas') fetchAulas(); // Adiciona a condição para aulas
  }, [categoriaSelecionada]);

  const itensFiltrados = (categoriaSelecionada === 'pessoas' ? usuarios :
                          categoriaSelecionada === 'maquinas' ? maquinas :
                          categoriaSelecionada === 'cursos' ? cursos :
                          categoriaSelecionada === 'areas' ? areas : aulas)
                          .filter(item => 
                            item.nome?.toLowerCase().includes(busca.toLowerCase()) || 
                            item.titulo?.toLowerCase().includes(busca.toLowerCase()) // Filtra por título em aulas
                          );

  const handleEditar = (item) => {
    const path = categoriaSelecionada === 'pessoas' ? '/cadastro-usuarios' :
                 categoriaSelecionada === 'maquinas' ? '/cadastro-maquinas' :
                 categoriaSelecionada === 'cursos' ? '/cadastro-cursos' :
                 categoriaSelecionada === 'areas' ? '/cadastro-areas' :
                 '/cadastro-aulas';
    navigate(path, { state: { item } });
  };

  const handleExcluir = async (id) => {
    const url = categoriaSelecionada === 'pessoas' 
      ? `http://localhost:8000/api/users/${id}/`
      : categoriaSelecionada === 'maquinas' 
      ? `http://localhost:8000/api/maquinas/${id}/`
      : categoriaSelecionada === 'cursos' 
      ? `http://localhost:8000/api/cursos/${id}/`
      : categoriaSelecionada === 'areas' 
      ? `http://localhost:8000/api/areas/${id}/`
      : `http://localhost:8000/api/aulas/${id}/`;

    if (window.confirm("Tem certeza que deseja excluir este item?")) {
      try {
        const response = await fetch(url, { method: 'DELETE' });
        if (response.ok) {
          alert('Item excluído com sucesso!');
          if (categoriaSelecionada === 'pessoas') fetchUsuarios();
          else if (categoriaSelecionada === 'maquinas') fetchMaquinas();
          else if (categoriaSelecionada === 'cursos') fetchCursos();
          else if (categoriaSelecionada === 'areas') fetchAreas();
          else fetchAulas();
        } else {
          alert('Erro ao excluir o item.');
        }
      } catch (error) {
        console.error('Erro na conexão com o servidor:', error);
        alert('Erro na conexão com o servidor.');
      }
    }
  };

  return (
    <div className="consulta-container">
      <h1>Consulta Geral</h1>
      <div className="botoes-categoria">
        <button onClick={() => setCategoriaSelecionada('pessoas')}>Pessoas</button>
        <button onClick={() => setCategoriaSelecionada('maquinas')}>Máquinas</button>
        <button onClick={() => setCategoriaSelecionada('cursos')}>Cursos</button>
        <button onClick={() => setCategoriaSelecionada('areas')}>Áreas</button>
        <button onClick={() => setCategoriaSelecionada('aulas')}>Aulas</button> {/* Botão de aulas */}
      </div>
      
      <input 
        type="text"
        placeholder="Buscar..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="barra-busca"
      />

      <ul>
        {itensFiltrados.length > 0 ? (
          itensFiltrados.map((item, index) => (
            <li key={index} className="item-lista">
              <strong>{categoriaSelecionada === 'pessoas' ? 'Nome:' : 'Título:'}</strong> {item.nome || item.titulo}<br />
              {categoriaSelecionada === 'pessoas' && <><strong>Email:</strong> {item.email}</>}
              {categoriaSelecionada === 'maquinas' && <><strong>Modelo:</strong> {item.modelo}</>}
              {categoriaSelecionada === 'cursos' && <><strong>Descrição:</strong> {item.descricao}</>}
              {categoriaSelecionada === 'areas' && <><strong>Descrição:</strong> {item.descricao}</>}
              {categoriaSelecionada === 'aulas' && <><strong>Duração:</strong> {item.duracao}</>}
              
              <button onClick={() => handleEditar(item)}>Editar</button>
              <button onClick={() => handleExcluir(item.id)}>Excluir</button>
            </li>
          ))
        ) : (
          <p>Nenhum item encontrado.</p>
        )}
      </ul>
    </div>
  );
}

export default ConsultaGeral;
