import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaRegClock } from 'react-icons/fa'; 
import './styles.css';

function AulasDoCurso() {
    const { idcurso } = useParams();
    const [aulas, setAulas] = useState([]);
    const [tituloCurso, setTituloCurso] = useState('');
    const [progressoCurso, setProgressoCurso] = useState(55);
    const [showHelpMessage, setShowHelpMessage] = useState(false);

    useEffect(() => {
        const fetchAulas = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/aulas/curso/${idcurso}/`);
                const data = await response.json();
                setAulas(data);
            } catch (error) {
                console.error('Erro ao buscar aulas:', error);
            }
        };

        const fetchTituloCurso = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/cursos/${idcurso}/`);
                const data = await response.json();
                setTituloCurso(data.titulo);
            } catch (error) {
                console.error('Erro ao buscar título do curso:', error);
            }
        };

        fetchAulas();
        fetchTituloCurso();
    }, [idcurso]);

    const toggleHelpMessage = () => {
        setShowHelpMessage(!showHelpMessage);
    };

    return (
        <div className="aulas-curso-content">
            <div className="curso-container">
            <div className="aulas-container">
                    <div className="header-container">
                        <h2 className="aulas-text">Aulas do Curso: {tituloCurso}</h2>
                        <div className="adc-progress-bar-container">
                            <div className="adc-progress-bar" style={{ width: `${progressoCurso}%` }}></div>
                            <span className="adc-progress-value">{progressoCurso}%</span>
                        </div>
                    </div>
                    <hr className="separador" />
                    <div className="aulas-curso-list">
                        {aulas.map(aula => (
                            <div key={aula.idaula} className="aulas-curso-item">
                                <button className="aulas-curso-button">Assistir</button>
                                <h3 className="aulas-text">{aula.titulo}</h3>
                                <p className="duracao-aula">
                                    <FaRegClock style={{ marginRight: '5px', color: 'blue' }} />
                                    {aula.duracao}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="curso-info">
                    <h3>Informações</h3>
                    <div className="info-content">
                        <p>Assista as aulas em ordem para liberar as próximas.</p>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default AulasDoCurso;
