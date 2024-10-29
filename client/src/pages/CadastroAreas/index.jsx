import React, { useState } from 'react';
import './styles.css';
import NavbarPage from '../CadastrosNavbar';
const CadastroArea = () => {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [erro, setErro] = useState('');
    const [mensagem, setMensagem] = useState('');

    const handleChange = (event) => {
        setErro(''); // Limpa o erro ao digitar um novo nome
        setMensagem(''); // Limpa a mensagem ao alterar os dados
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const areaData = {
            nome: nome,
            descricao: descricao,
        };

        try {
            const response = await fetch('http://localhost:8000/api/areas/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(areaData),
            });

            if (response.ok) {
                setNome(''); // Reseta o campo de input
                setDescricao('');
                setMensagem('Área cadastrada com sucesso!');
              } else {
                setErro('Erro ao cadastrar a área.');
              }
            } catch (error) {
              console.error('Erro ao cadastrar área:', error);
              setErro('Erro na conexão com o servidor.');
            }
          };

    return (
        <div className="container">
            <NavbarPage />
            <h1>Cadastro de Área</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Nome da Área" 
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required 
                />
                <textarea 
                    placeholder="Descrição da Área" 
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    required
                />
                 {erro && <p style={{ color: 'red' }}>{erro}</p>}
                 {mensagem && <p style={{ color: 'green' }}>{mensagem}</p>}
                <button type="submit">Cadastrar Área</button>
            </form>
        </div>
    );
};

export default CadastroArea;
