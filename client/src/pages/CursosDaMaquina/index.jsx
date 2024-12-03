import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaDesktop } from 'react-icons/fa';
import './styles.css';

function CursosDaMaquina() {
    const { id } = useParams(); // Obtém o ID da máquina da URL
    const [cursos, setCursos] = useState([]);
    const [nomeMaquina, setNomeMaquina] = useState('');
    const [progressoMaquina, setProgressoMaquina] = useState(0); // Inicializa o progresso como 0
    const [progressoCursos, setProgressoCursos] = useState({}); // Objeto para armazenar progresso de cada curso
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Busca os cursos
                const cursosResponse = await fetch('http://localhost:8000/api/cursos');
                const cursosData = await cursosResponse.json();
                const cursosFiltrados = cursosData.filter(curso =>
                    curso.maquina.includes(parseInt(id))
                );
                setCursos(cursosFiltrados);

                // Busca o nome da máquina
                const maquinaResponse = await fetch(`http://localhost:8000/api/maquinas/${id}`);
                const maquinaData = await maquinaResponse.json();
                setNomeMaquina(maquinaData.nomeMaquina);

                const userId = localStorage.getItem('id');
                const progressoResponse = await fetch(`http://localhost:8000/api/progresso/${userId}`);
                const progressoData = await progressoResponse.json();

                // Atualiza progresso da máquina
                const progressoMaquinaData = progressoData.maquinas.find(
                    maquina => maquina.maquina__idmaquina === parseInt(id)
                );
                if (progressoMaquinaData) {
                    setProgressoMaquina(progressoMaquinaData.progresso);
                }

                // Atualiza progresso dos cursos
                const progressoCursosData = {};
                progressoData.cursos.forEach(curso => {
                    progressoCursosData[curso.curso__idcurso] = curso.progresso;
                });
                setProgressoCursos(progressoCursosData);

            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };

        fetchData(); // Faz a chamada para buscar os dados
    }, [id]);

    // Função para lidar com o clique em um curso
    const handleCursoClick = (idcurso) => {
        navigate(`/curso/${idcurso}`); // Redireciona para a página de aulas do curso
    };

    return (
        <div className="cursos-da-maquina-content">
            <div className="header-container">
                <h2 className="cursos-da-maquina-header">Cursos da Máquina: {nomeMaquina}</h2>
                <div className="cdm-progress-bar-container">
                    <div className="cdm-progress-bar" style={{ width: `${progressoMaquina}%` }}></div>
                    <span className="cdm-progress-value">{progressoMaquina}%</span>
                </div>
            </div>

            <hr className="separador" />

            {cursos.length > 0 ? (
                cursos.map(curso => {
                    const progressPercent = progressoCursos[curso.idcurso] || 0; // Usa o progresso específico do curso
                    return (
                        <div key={curso.idcurso} className="curso-item" onClick={() => handleCursoClick(curso.idcurso)}>
                            <h3 className="curso-titulo">{curso.titulo}</h3>
                            <p className="curso-descricao">{curso.descricao}</p>
                            <div className="curso-duracao-container">
                                <FaDesktop className="curso-icon" />
                                <p className="curso-duracao-text">15min</p>
                            </div>
                            <div className="curso-progress-container">
                                <div className="curso-progress-bar-container">
                                    <div className="curso-progress-bar" style={{ width: `${progressPercent}%` }}></div>
                                </div>
                                <div className="curso-progress-text">{progressPercent}%</div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="curso-sem-cursos">Nenhum curso encontrado para esta máquina.</p>
            )}
        </div>
    );
}

export default CursosDaMaquina;
