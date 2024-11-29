import React, { useEffect, useState } from 'react';
import { FaTools } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function MenuMaq() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const [maquinasAtrib, setMaquinasAtrib] = useState([]);
    const [progressData, setProgressData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Busca máquinas associadas
    useEffect(() => {
        const fetchMaquinas = async () => {
            try {
                const userId = localStorage.getItem('id');
                const url = isAdmin
                    ? `http://localhost:8000/api/maquinas`
                    : `http://localhost:8000/api/maquinas-do-usuario/${userId}/`;

                const response = await fetch(url);
                const data = await response.json();
                setMaquinasAtrib(data);
            } catch (error) {
                console.error('Erro ao buscar máquinas:', error);
            }
        };

        fetchMaquinas();
    }, [isAdmin]);

    // Busca progresso do usuário
    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const userId = localStorage.getItem('id');
                if (!userId) {
                    console.error('ID do usuário não encontrado no localStorage.');
                    return;
                }

                const response = await fetch(`http://localhost:8000/api/progresso/${userId}/`);
                const data = await response.json();

                // Mapeia o progresso das máquinas
                const progressMap = {};
                data.maquinas.forEach((item) => {
                    progressMap[item.maquina__idmaquina] = item.progresso;
                });

                setProgressData(progressMap);
            } catch (error) {
                console.error('Erro ao buscar progresso das máquinas:', error);
            }
        };

        fetchProgress();
    }, []);

    // Filtro de máquinas pelo termo de busca
    const filteredMaq = maquinasAtrib.filter((maquina) =>
        maquina.nomeMaquina.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Manipula o clique na máquina
    const handleMaqClick = (idmaquina) => {
        navigate(`/cursos-da-maquina/${idmaquina}`);
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="menu-maquina-search-bar"
                />
                <div className="menu-maq-grid">
                    {filteredMaq.map((maquina) => {
                        const progressPercent = progressData[maquina.idmaquina] || 0;
                        return (
                            <div
                                key={maquina.idmaquina}
                                className="menu-maq-item"
                                onClick={() => handleMaqClick(maquina.idmaquina)}
                            >
                                <div className="menu-maq-nome">{maquina.nomeMaquina}</div>
                                <div className="menu-maq-icon-container">
                                    <div className="menu-maq-icon-circle">
                                        <FaTools className="menu-maq-icon" />
                                    </div>
                                </div>
                                <div className="menu-maq-progress-container">
                                    <div className="menu-maq-progress-bar-container">
                                        <div
                                            className="menu-maq-progress-bar"
                                            style={{ width: `${progressPercent}%` }}
                                        ></div>
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
