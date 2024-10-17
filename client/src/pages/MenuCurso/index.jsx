import React, { useEffect, useState } from 'react';
import { FaSwatchbook } from 'react-icons/fa'; 
import './styles.css'; 

function MenuCurso() {
    const [cursosEmProgresso, setCursosEmProgresso] = useState([]); // Estado para armazenar cursos

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/cursos'); // Substituir pelo seu endpoint da API
                const data = await response.json();
                setCursosEmProgresso(data); // Atualiza os cursos no estado
            } catch (error) {
                console.error('Erro ao buscar cursos:', error);
            }
        };

        fetchCursos(); // Puxa os cursos ao carregar o componente
    }, []);

    return (
        <main className="menu-curso-content">
            <section className="menu-curso-section">
                <h2>Cursos</h2>
                <div className="menu-curso-grid">
                    {cursosEmProgresso.map((curso) => {
                        const progressPercent = 70; // Progresso estático
                        return (
                            <div key={curso.id} className="menu-curso-item">
                                <div className="menu-curso-nome">{curso.titulo}</div> {/* Nome do curso no topo */}
                                <div className="menu-curso-icon-container">
                                    <div className="menu-curso-icon-circle">
                                        <FaSwatchbook className="menu-curso-icon" />
                                    </div>
                                </div>
                                <div className="menu-curso-progress-container">
                                    <div className="menu-curso-progress-bar-container">
                                        <div className="menu-curso-progress-bar" style={{ width: `${progressPercent}%` }}></div>
                                    </div>
                                    <div className="menu-curso-progress-text">{progressPercent}%</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}

export default MenuCurso;
