import React, { useEffect, useState } from "react";
import "./style.css";

function Relatorios() {
  const [dados, setDados] = useState([]);
  const [relacoes, setRelacoes] = useState({});
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("usuarios");

  // Função para buscar os dados das categorias
  const fetchDados = async (categoria) => {
    const endpoints = {
      usuarios: "http://localhost:8000/api/users/",
      maquinas: "http://localhost:8000/api/maquinas/",
      cursos: "http://localhost:8000/api/cursos/",
      areas: "http://localhost:8000/api/areas/",
    };

    try {
      const response = await fetch(endpoints[categoria]);
      if (response.ok) {
        const data = await response.json();
        setDados(data);

        if (categoria === "usuarios") {
          fetchRelacoesUsuarios();
        } else if (categoria === "maquinas") {
          fetchRelacoesMaquinas();
        } else if (categoria === "cursos") {
          fetchRelacoesCursos();
        } else if (categoria === "areas") {
          fetchRelacoesAreas();
        }
      } else {
        console.error(`Erro ao buscar os dados da categoria ${categoria}:`, response.status);
        setDados([]);
        setRelacoes({});
      }
    } catch (error) {
      console.error("Erro na conexão com o servidor:", error);
      setDados([]);
      setRelacoes({});
    }
  };

  // Função para buscar máquinas relacionadas aos usuários
  const fetchRelacoesUsuarios = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/relacoes/usuarios-maquinas/`);
      if (response.ok) {
        const data = await response.json();
        const relacoesMap = {};
  
        data.forEach((relacao) => {
          if (!relacoesMap[relacao.user_id]) {
            relacoesMap[relacao.user_id] = relacao.maquinas; // Usa diretamente o array de máquinas
          }
        });
  
        setRelacoes(relacoesMap);
      } else {
        console.error("Erro ao buscar relações para usuários:", response.status);
        setRelacoes({});
      }
    } catch (error) {
      console.error("Erro ao buscar relações de usuários:", error);
      setRelacoes({});
    }
  };

  // Função para buscar usuários relacionados às máquinas
  const fetchRelacoesMaquinas = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/relacoes/maquinas-usuarios/`);
      if (response.ok) {
        const data = await response.json();
        const relacoesMap = {};
  
        data.forEach((relacao) => {
          if (!relacoesMap[relacao.maquina_id]) {
            relacoesMap[relacao.maquina_id] = relacao.usuarios; // Usa diretamente o array de usuários
          }
        });
  
        setRelacoes(relacoesMap);
      } else {
        console.error("Erro ao buscar relações para máquinas:", response.status);
        setRelacoes({});
      }
    } catch (error) {
      console.error("Erro ao buscar relações de máquinas:", error);
      setRelacoes({});
    }
  };

  // Função para buscar usuários relacionados aos cursos
  const fetchRelacoesCursos = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/relacoes/cursos-usuarios/`);
      if (response.ok) {
        const data = await response.json();
        const relacoesMap = {};

        data.forEach((relacao) => {
          if (!relacoesMap[relacao.curso_id]) {
            relacoesMap[relacao.curso_id] = [];
          }
          relacoesMap[relacao.curso_id].push(relacao.usuario_nome);
        });

        setRelacoes(relacoesMap);
      } else {
        console.error("Erro ao buscar relações para cursos:", response.status);
        setRelacoes({});
      }
    } catch (error) {
      console.error("Erro ao buscar relações de cursos:", error);
      setRelacoes({});
    }
  };

  // Função para buscar máquinas relacionadas às áreas
  const fetchRelacoesAreas = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/relacoes/areas-maquinas/`);
      if (response.ok) {
        const data = await response.json();
        const relacoesMap = {};

        data.forEach((relacao) => {
          if (!relacoesMap[relacao.area_id]) {
            relacoesMap[relacao.area_id] = [];
          }
          relacoesMap[relacao.area_id].push(relacao.maquina_nome);
        });

        setRelacoes(relacoesMap);
      } else {
        console.error("Erro ao buscar relações para áreas:", response.status);
        setRelacoes({});
      }
    } catch (error) {
      console.error("Erro ao buscar relações de áreas:", error);
      setRelacoes({});
    }
  };

  useEffect(() => {
    fetchDados(categoriaSelecionada);
  }, [categoriaSelecionada]);

  const imprimirRelatorio = () => {
    window.print();
  };

  return (
    <div className="consulta-container">
      <h1>Relatórios de {categoriaSelecionada.charAt(0).toUpperCase() + categoriaSelecionada.slice(1)}</h1>
      
      <div className="botoes-categoria">
        <button onClick={() => setCategoriaSelecionada("usuarios")}>Usuários</button>
        <button onClick={() => setCategoriaSelecionada("maquinas")}>Máquinas</button>
        <button onClick={() => setCategoriaSelecionada("cursos")}>Cursos</button>
        <button onClick={() => setCategoriaSelecionada("areas")}>Áreas</button>
      </div>

      <button onClick={imprimirRelatorio} className="btn-imprimir">
        Imprimir Relatório
      </button>

      <ul>
        {categoriaSelecionada === "usuarios" && dados.length > 0 ? (
          dados.map((usuario) => (
            <li key={usuario.id} className="item-lista">
              <strong>Nome:</strong> {usuario.nome}<br />
              <strong>Máquinas:</strong> 
              {relacoes[usuario.id]?.join(", ") || "Nenhuma máquina associada"}
            </li>
          ))
        ) : categoriaSelecionada === "maquinas" && dados.length > 0 ? (
          dados.map((maquina) => (
            <li key={maquina.id} className="item-lista">
              <strong>Máquina:</strong> {maquina.nome}<br />
              <strong>Usuários:</strong> 
              {relacoes[maquina.id]?.join(", ") || "Nenhum usuário associado"}
            </li>
          ))
        ) : categoriaSelecionada === "cursos" && dados.length > 0 ? (
          dados.map((curso) => (
            <li key={curso.id} className="item-lista">
              <strong>Curso:</strong> {curso.nome}<br />
              <strong>Funcionários:</strong> 
              {relacoes[curso.id]?.join(", ") || "Nenhum funcionário associado"}
            </li>
          ))
        ) : categoriaSelecionada === "areas" && dados.length > 0 ? (
          dados.map((area) => (
            <li key={area.id} className="item-lista">
              <strong>Área:</strong> {area.nome}<br />
              <strong>Máquinas:</strong> 
              {relacoes[area.id]?.join(", ") || "Nenhuma máquina associada"}
            </li>
          ))
        ) : (
          <p>Nenhum dado encontrado para a categoria selecionada.</p>
        )}
      </ul>
    </div>
  );
}

export default Relatorios;
