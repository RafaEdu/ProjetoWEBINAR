import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './styles.css';
import NavbarPage from '../CadastrosNavbar';

function CadastroMaquinas() {
  const { idmaquina } = useParams(); // Obtém o ID da máquina a partir dos parâmetros da URL
  const location = useLocation();
  const maquinaParaEditar = location.state?.dadosEdicao;

  const [nomeMaquina, setNomeMaquina] = useState(maquinaParaEditar?.nomeMaquina || '');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  console.log("Dados da máquina para editar:", maquinaParaEditar);
  console.log("ID da máquina para editar:", idmaquina || maquinaParaEditar?.idmaquina);

  useEffect(() => {
    if (idmaquina && !maquinaParaEditar) {
      // Fazer uma requisição para obter os dados da máquina pelo ID caso não tenha dados em location.state
      fetch(`http://localhost:8000/api/maquinas/${idmaquina}/`)
        .then(response => response.json())
        .then(data => setNomeMaquina(data.nomeMaquina))
        .catch(error => console.error("Erro ao buscar máquina:", error));
    } else if (maquinaParaEditar) {
      setNomeMaquina(maquinaParaEditar.nomeMaquina); // Preenche o campo nome caso esteja editando
    }
  }, [idmaquina, maquinaParaEditar]);

  const handleChange = (event) => {
    setNomeMaquina(event.target.value);
    setErro('');
    setMensagem('');
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (nomeMaquina.trim() === '') {
      setErro('O nome da máquina não pode estar vazio.');
      return;
    }
  
    try {
      const url = idmaquina || maquinaParaEditar?.idmaquina
        ? `http://localhost:8000/api/maquinas/${idmaquina || maquinaParaEditar.idmaquina}/`
        : 'http://localhost:8000/api/maquinas/';
      const method = idmaquina || maquinaParaEditar?.idmaquina ? 'PUT' : 'POST';
  
      console.log("URL da requisição:", url);
      console.log("Método da requisição:", method);
      console.log("Dados enviados:", { nomeMaquina });
  
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomeMaquina }),
      });
  
      if (response.ok) {
        setNomeMaquina('');
        setMensagem(idmaquina || maquinaParaEditar?.idmaquina ? 'Máquina atualizada com sucesso!' : 'Máquina cadastrada com sucesso!');
      } else {
        const errorText = await response.text();
        console.error("Erro na resposta:", errorText);
        setErro('Erro ao cadastrar a máquina.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar máquina:', error);
      setErro('Erro na conexão com o servidor.');
    }
  };

  return (
    <div className="container">
      <NavbarPage />
      <h1>{idmaquina || maquinaParaEditar?.idmaquina ? 'Editar Máquina' : 'Cadastro de Máquinas'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome da Máquina"
          value={nomeMaquina}
          onChange={handleChange}
          maxLength={30}
        />
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        {mensagem && <p style={{ color: 'green' }}>{mensagem}</p>}
        <button type="submit">{idmaquina || maquinaParaEditar?.idmaquina ? 'Atualizar Máquina' : 'Cadastrar Máquina'}</button>
      </form>
    </div>
  );
}

export default CadastroMaquinas;
