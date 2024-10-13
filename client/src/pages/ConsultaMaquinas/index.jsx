import React, { useState, useEffect } from 'react';
import './style.css';

function ListaMaquinas() {
  const [maquinas, setMaquinas] = useState([]);
  const [busca, setBusca] = useState('');  // Estado para armazenar o termo de busca

  // Função para buscar as máquinas do sistema
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

  useEffect(() => {
    fetchMaquinas();  // Buscar máquinas ao carregar o componente
  }, []);

  // Função para filtrar máquinas com base no termo de busca
  const maquinasFiltradas = maquinas.filter((maquina) => 
    maquina.nome.toLowerCase().includes(busca.toLowerCase()) ||
    maquina.codigo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Lista de Máquinas Cadastradas</h1>

      {/* Barra de busca */}
      <input 
        type="text"
        placeholder="Buscar por nome ou código..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="barra-busca"
      />

      <ul>
        {maquinasFiltradas.length > 0 ? (
          maquinasFiltradas.map((maquina, index) => (
            <li key={index}>
              <strong>Nome:</strong> {maquina.nome}<br />
              <strong>Código:</strong> {maquina.codigo}<br />
              
              {/* Botões de edição e exclusão */}
              <button className="btn-editar">
                <i className="fas fa-cog"></i> Editar
              </button>
              <button className="btn-excluir">
                <i className="fas fa-times"></i> Excluir
              </button>
            </li>
          ))
        ) : (
          <p>Nenhuma máquina encontrada.</p>
        )}
      </ul>
    </div>
  );
}

export default ListaMaquinas;
