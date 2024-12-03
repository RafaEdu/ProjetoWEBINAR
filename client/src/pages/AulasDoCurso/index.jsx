import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaRegClock } from 'react-icons/fa'; 
import './styles.css';

function AulasDoCurso() {
    const { idcurso } = useParams();
    const navigate = useNavigate();
    const [aulas, setAulas] = useState([]);
    const [tituloCurso, setTituloCurso] = useState('');
    const [progressoCurso, setProgressoCurso] = useState(0);  // Inicializado com 0, pode ser ajustado conforme a API

    useEffect(() => {
        const fetchAulas = async () => {
            try {
                const userId = localStorage.getItem('id');
                const response = await fetch(`http://localhost:8000/api/aulas/curso/${idcurso}/completadas/?user_id=${userId}`);
                const data = await response.json();
                // Ordenar as aulas por título
                data.sort((a, b) => a.titulo.localeCompare(b.titulo));
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

    useEffect(() => {
        // Função para buscar o progresso dos cursos
        const fetchProgress = async () => {
            try {
                const userId = localStorage.getItem('id');
                const response = await fetch(`http://localhost:8000/api/progresso/${userId}/`);
                const data = await response.json();
                
                // Cria um mapa de progresso com idcurso como chave
                const progressMap = {};
                data.cursos.forEach((curso) => {
                    progressMap[curso.curso__idcurso] = curso.progresso;
                });

                // Atualiza o progresso do curso específico
                if (progressMap[idcurso]) {
                    setProgressoCurso(progressMap[idcurso]);
                } else {
                    setProgressoCurso(0); // Caso o progresso do curso não seja encontrado
                }
            } catch (error) {
                console.error('Erro ao buscar progresso dos cursos:', error);
            }
        };

        fetchProgress(); // Puxa o progresso dos cursos
    }, [idcurso]);  // Atualiza sempre que o idcurso mudar

    const handleAssistirClick = (idaula) => {
        navigate(`/curso/${idcurso}/aula/${idaula}`);
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
                                <button
                                    className={`aulas-curso-button ${aula.concluida ? 'concluida' : ''}`}
                                    onClick={() => !aula.concluida && handleAssistirClick(aula.idaula)}
                                    disabled={aula.concluida}
                                >
                                    {aula.concluida ? 'Concluída' : 'Assistir'}
                                </button>
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
