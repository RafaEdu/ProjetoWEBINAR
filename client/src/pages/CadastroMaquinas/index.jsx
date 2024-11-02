import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './styles.css';
import NavbarPage from '../CadastrosNavbar';

function CadastroMaquinas() {
  const location = useLocation();
  const maquinaParaEditar = location.state?.dadosEdicao; // Recebe os dados do item para edição
  const [nomeMaquina, setNomeMaquina] = useState(maquinaParaEditar?.nomeMaquina || '');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    if (maquinaParaEditar) {
      setNomeMaquina(maquinaParaEditar.nomeMaquina); // Preenche o campo nome caso esteja editando
    }
  }, [maquinaParaEditar]);

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
      const url = maquinaParaEditar 
        ? `http://localhost:8000/api/maquinas/${maquinaParaEditar.id}/` 
        : 'http://localhost:8000/api/maquinas/';

      const method = maquinaParaEditar ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomeMaquina }),
      });

      if (response.ok) {
        setNomeMaquina('');
        setMensagem(maquinaParaEditar ? 'Máquina atualizada com sucesso!' : 'Máquina cadastrada com sucesso!');
      } else {
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
      <h1>{maquinaParaEditar ? 'Editar Máquina' : 'Cadastro de Máquinas'}</h1>
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
        <button type="submit">{maquinaParaEditar ? 'Atualizar Máquina' : 'Cadastrar Máquina'}</button>
      </form>
    </div>
  );
}

export default CadastroMaquinas;
