import React, { useEffect, useState } from 'react';
import { FaTools } from 'react-icons/fa'; // Ícone para as máquinas
import './styles.css'; // Estilos

function MenuMaq() {
    const [maquinasAtrib, setMaquinasAtrib] = useState([]); // Estado para armazenar as máquinas

    useEffect(() => {
        const fetchMaquinas = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/maquinas'); // Substituir pelo seu endpoint da API
                const data = await response.json();
                setMaquinasAtrib(data); // Atualiza o estado com as máquinas
            } catch (error) {
                console.error('Erro ao buscar máquinas:', error);
            }
        };

        fetchMaquinas(); // Faz a chamada para buscar as máquinas
    }, []);

    return (
        <main className="menu-maq-content">
            <section className="menu-maq-section">
                <h2>Máquinas</h2>
                <div className="menu-maq-grid">
                    {maquinasAtrib.map((maquina) => {
                        const progressPercent = 70; // Progresso estático
                        return (
                            <div key={maquina.id} className="menu-maq-item">
                                <div className="menu-maq-nome">{maquina.nomeMaquina}</div> {/* Nome da máquina no topo */}
                                <div className="menu-maq-icon-container">
                                    <div className="menu-maq-icon-circle">
                                        <FaTools className="menu-maq-icon" /> {/* Ícone da máquina */}
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
