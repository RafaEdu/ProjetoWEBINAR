import React, { useState, useEffect } from 'react';
import './style.css';

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState('');  // Estado para armazenar o termo de busca

  // Função para buscar os usuários do sistema
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

  useEffect(() => {
    fetchUsuarios();  // Buscar usuários ao carregar o componente
  }, []);

  // Função para filtrar usuários com base no termo de busca
  const usuariosFiltrados = usuarios.filter((usuario) => 
    usuario.nome.toLowerCase().includes(busca.toLowerCase()) || 
    usuario.email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Lista de Usuários Cadastrados</h1>

      {/* Barra de busca */}
      <input 
        type="text"
        placeholder="Buscar por nome ou email..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="barra-busca"
      />

      <ul>
        {usuariosFiltrados.length > 0 ? (
          usuariosFiltrados.map((usuario, index) => (
            <li key={index}>
              <strong>Nome:</strong> {usuario.nome}<br />
              <strong>Email:</strong> {usuario.email}<br />
              <strong>Admin:</strong> {usuario.is_admin ? 'Sim' : 'Não'}
            </li>
          ))
        ) : (
          <p>Nenhum usuário encontrado.</p>
        )}
      </ul>
    </div>
  );
}

export default ListaUsuarios;
