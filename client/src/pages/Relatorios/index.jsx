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
          fetchRelacoesUsuarios();  // Função para buscar as máquinas relacionadas aos usuários
        } else if (categoria === "maquinas") {
          fetchRelacoes("maquinas");
        } else if (categoria === "cursos") {
          fetchRelacoes("cursos");
        } else if (categoria === "areas") {
          fetchRelacoes("areas");
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
      const response = await fetch("http://localhost:8000/api/relacoes/usuarios-maquinas/");  // Ajuste o endpoint se necessário
      if (response.ok) {
        const data = await response.json();
        const relacoesMap = {};

        data.forEach((relacao) => {
          if (!relacoesMap[relacao.user_id]) {
            relacoesMap[relacao.user_id] = [];
          }
          relacoesMap[relacao.user_id].push(relacao.maquina_nome);  // Assumindo que a máquina tem a chave 'maquina_nome'
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

  // Função genérica para buscar relações
  const fetchRelacoes = async (categoria) => {
    const relacoesEndpoints = {
      maquinas: "http://localhost:8000/api/maquinas/relacoes/",
      cursos: "http://localhost:8000/api/cursos/relacoes/",
      areas: "http://localhost:8000/api/areas/relacoes/",
    };

    try {
      const response = await fetch(relacoesEndpoints[categoria]);
      if (response.ok) {
        const data = await response.json();
        setRelacoes(data);
      } else {
        console.error(`Erro ao buscar relações para a categoria ${categoria}:`, response.status);
        setRelacoes({});
      }
    } catch (error) {
      console.error("Erro ao buscar relações:", error);
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
              {relacoes[usuario.id]?.length > 0 ? 
                relacoes[usuario.id].join(", ") : 
                "Nenhuma máquina associada"}
            </li>
          ))
        ) : categoriaSelecionada === "maquinas" && dados.length > 0 ? (
          dados.map((maquina) => (
            <li key={maquina.id} className="item-lista">
              <strong>Máquina:</strong> {maquina.nome}<br />
              <strong>Usuários:</strong> {relacoes[maquina.id]?.join(", ") || "Nenhum usuário"}
            </li>
          ))
        ) : categoriaSelecionada === "cursos" && dados.length > 0 ? (
          dados.map((curso) => (
            <li key={curso.id} className="item-lista">
              <strong>Curso:</strong> {curso.nome}<br />
              <strong>Funcionários:</strong> {relacoes[curso.id]?.join(", ") || "Nenhum funcionário"}
            </li>
          ))
        ) : categoriaSelecionada === "areas" && dados.length > 0 ? (
          dados.map((area) => (
            <li key={area.id} className="item-lista">
              <strong>Área:</strong> {area.nome}<br />
              <strong>Máquinas:</strong> {relacoes[area.id]?.join(", ") || "Nenhuma máquina"}
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