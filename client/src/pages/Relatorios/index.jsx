import React, { useEffect, useState } from "react";
import "./style.css";

function Relatorios() {
  const [dados, setDados] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("usuarios");

  const fetchDados = async (categoria) => {
    const endpoints = {
      usuarios: "http://localhost:8000/api/users/",
      maquinas: "http://localhost:8000/api/maquinas/",
      cursos: "http://localhost:8000/api/cursos/",
      aulas: "http://localhost:8000/api/aulas/",
      questionarios: "http://localhost:8000/api/questionarios/",
      areas: "http://localhost:8000/api/areas/",
    };

    try {
      const response = await fetch(endpoints[categoria]);
      if (response.ok) {
        const data = await response.json();
        setDados(data);
      } else {
        console.error(`Erro ao buscar os dados da categoria ${categoria}:`, response.status);
        setDados([]); // Limpa os dados em caso de erro.
      }
    } catch (error) {
      console.error("Erro na conexão com o servidor:", error);
      setDados([]); // Limpa os dados em caso de erro.
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
        <button onClick={() => setCategoriaSelecionada("aulas")}>Aulas</button>
        <button onClick={() => setCategoriaSelecionada("questionarios")}>Questionários</button>
        <button onClick={() => setCategoriaSelecionada("areas")}>Áreas</button>
      </div>

      <button onClick={imprimirRelatorio} className="btn-imprimir">
        Imprimir Relatório
      </button>

      <ul>
        {categoriaSelecionada === "usuarios" && dados.length > 0 ? (
          dados.map((usuario, index) => (
            <li key={index} className="item-lista">
              <strong>Nome:</strong> {usuario.nome}<br />
              <strong>Máquinas:</strong> {usuario.maquinas?.map((maquina) => maquina.nomeMaquina).join(", ") || "Nenhuma máquina"}
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
