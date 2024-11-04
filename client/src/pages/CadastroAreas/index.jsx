import React, { useState, useEffect } from 'react'; // Adicione useEffect aqui
import './styles.css';
import { useLocation } from 'react-router-dom';
import NavbarPage from '../CadastrosNavbar';

const CadastroArea = () => {
    const location = useLocation();
    const areaParaEditar = location.state?.dadosEdicao; // Recebe os dados do item para edição
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [erro, setErro] = useState('');
    const [mensagem, setMensagem] = useState('');

    // Use useEffect para preencher os campos quando um item for editado
    useEffect(() => {
        if (areaParaEditar) {
            setNome(areaParaEditar.nome);
            setDescricao(areaParaEditar.descricao);
        }
    }, [areaParaEditar]);

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
            const response = areaParaEditar 
                ? await fetch(`http://localhost:8000/api/areas/${areaParaEditar.idarea}/`, { // Requisição PUT para edição
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(areaData),
                })
                : await fetch('http://localhost:8000/api/areas/', { // Requisição POST para criação
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(areaData),
                });

            if (response.ok) {
                setNome(''); // Reseta o campo de input
                setDescricao('');
                setMensagem(areaParaEditar ? 'Área editada com sucesso!' : 'Área cadastrada com sucesso!');
            } else {
                setErro('Erro ao cadastrar/editar a área.');
            }
        } catch (error) {
            console.error('Erro ao cadastrar/editar área:', error);
            setErro('Erro na conexão com o servidor.');
        }
    };

    return (
        <div className="container">
            <NavbarPage />
            <h1>{areaParaEditar ? 'Edição de Área' : 'Cadastro de Área'}</h1>
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
                <button type="submit">{areaParaEditar ? 'Salvar Alterações' : 'Cadastrar Área'}</button>
            </form>
        </div>
    );
};

export default CadastroArea;
