import React, { useEffect, useState } from "react";
import "./style.css";

function Relatorios() {
  const [dados, setDados] = useState([]);
  const [relacoes, setRelacoes] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("usuarios");

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
          fetchRelacoes("usuarios");
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
        setRelacoes([]);
      }
    } catch (error) {
      console.error("Erro na conexão com o servidor:", error);
      setDados([]);
      setRelacoes([]);
    }
  };

  const fetchRelacoes = async (categoria) => {
    const relacoesEndpoints = {
      usuarios: "http://localhost:8000/api/users/relacoes/",
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
        setRelacoes([]);
      }
    } catch (error) {
      console.error("Erro ao buscar relações:", error);
      setRelacoes([]);
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
              <strong>Máquinas:</strong> {relacoes[usuario.id]?.map((maquina) => maquina.nomeMaquina).join(", ") || "Nenhuma máquina"}
            </li>
          ))
        ) : categoriaSelecionada === "maquinas" && dados.length > 0 ? (
          dados.map((maquina) => (
            <li key={maquina.id} className="item-lista">
              <strong>Máquina:</strong> {maquina.nomeMaquina}<br />
              <strong>Usuários:</strong> {relacoes[maquina.id]?.map((usuario) => usuario.nome).join(", ") || "Nenhum usuário"}
            </li>
          ))
        ) : categoriaSelecionada === "cursos" && dados.length > 0 ? (
          dados.map((curso) => (
            <li key={curso.id} className="item-lista">
              <strong>Curso:</strong> {curso.nomeCurso}<br />
              <strong>Funcionários:</strong> {relacoes[curso.id]?.map((usuario) => usuario.nome).join(", ") || "Nenhum funcionário"}
            </li>
          ))
        ) : categoriaSelecionada === "areas" && dados.length > 0 ? (
          dados.map((area) => (
            <li key={area.id} className="item-lista">
              <strong>Área:</strong> {area.nomeArea}<br />
              <strong>Máquinas:</strong> {relacoes[area.id]?.map((maquina) => maquina.nomeMaquina).join(", ") || "Nenhuma máquina"}
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
