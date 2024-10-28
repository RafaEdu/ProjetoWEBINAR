import React, { useState } from 'react';
import './styles.css';
import NavbarPage from '../CadastrosNavbar';
const CadastroArea = () => {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');

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
                const data = await response.json();
                alert('Área cadastrada com sucesso!');
                setNome('');
                setDescricao('');
            } else {
                alert('Erro ao cadastrar a área.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro na conexão com o servidor.');
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
                <button type="submit">Cadastrar Área</button>
            </form>
        </div>
    );
};

export default CadastroArea;
