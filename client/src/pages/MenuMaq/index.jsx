// src/MenuMaq.jsx
import React, { useEffect, useState } from 'react';
import { FaTools } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function MenuMaq() {
    const [maquinasAtrib, setMaquinasAtrib] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMaquinas = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/maquinas');
                const data = await response.json();
                setMaquinasAtrib(data);
            } catch (error) {
                console.error('Erro ao buscar máquinas:', error);
            }
        };

        fetchMaquinas();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredMaq = maquinasAtrib.filter((maquina) =>
        maquina.nomeMaquina.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Função para navegar para a tela dos cursos da máquina
    const handleMaqClick = (idmaquina) => {
        navigate(`/cursos-da-maquina/${idmaquina}`); // Navega para a tela de cursos usando o idmaquina
    };

    return (
        <main className="menu-maq-content">
            <section className="menu-maq-section">
                <h2 className="maquinas-text">Máquinas</h2>
                <hr className="separador" />
                <input
                    type="text"
                    placeholder="Pesquisar máquinas..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="menu-maquina-search-bar"
                />
                <div className="menu-maq-grid">
                    {filteredMaq.map((maquina) => {
                        const progressPercent = 70; // Progresso estático
                        return (
                            <div 
                                key={maquina.idmaquina}
                                className="menu-maq-item"
                                onClick={() => handleMaqClick(maquina.idmaquina)} // Aqui estamos passando idmaquina
                            >
                                <div className="menu-maq-nome">{maquina.nomeMaquina}</div>
                                <div className="menu-maq-icon-container">
                                    <div className="menu-maq-icon-circle">
                                        <FaTools className="menu-maq-icon" />
                                    </div>
                                </div>
                                <div className="menu-maq-progress-container">
                                    <div className="menu-maq-progress-bar-container">
                                        <div className="menu-maq-progress-bar" style={{ width: `${progressPercent}%` }}></div>
                                    </div>
                                    <div className="menu-maq-progress-text">{progressPercent}%</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}

export default MenuMaq;
