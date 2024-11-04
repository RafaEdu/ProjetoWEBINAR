import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles.css';

function VisualizarAula() {
    const { idcurso, idaula } = useParams(); 
    const navigate = useNavigate();
    const [aula, setAula] = useState(null);
    const [conteudo, setConteudo] = useState(null);
    const [aulas, setAulas] = useState([]);
    const [videoWatched, setVideoWatched] = useState(false); 
    const [canProceed, setCanProceed] = useState(false); 
    const [timer, setTimer] = useState(0); 
    const [hasQuestionario, setHasQuestionario] = useState(false); 
    const videoRef = useRef(null); 

    useEffect(() => {
        const fetchAula = async () => {
            try {
                setCanProceed(false);
                setVideoWatched(false);
                setTimer(0);

                const response = await fetch(`http://localhost:8000/api/aulas/${idaula}/`);
                if (!response.ok) throw new Error('Erro na resposta da API');

                const data = await response.json();
                setAula(data);

                if (data.idvideo_id) {
                    const videoResponse = await fetch(`http://localhost:8000/api/videos/${data.idvideo_id}/`);
                    if (!videoResponse.ok) throw new Error('Erro ao buscar vídeo');
                    const videoData = await videoResponse.json();
                    setConteudo({ tipo: 'video', url: videoData.arquivo_video });
                } else if (data.idslide_id) {
                    const slideResponse = await fetch(`http://localhost:8000/api/slides/${data.idslide_id}/`);
                    if (!slideResponse.ok) throw new Error('Erro ao buscar slide');
                    const slideData = await slideResponse.json();
                    setConteudo({ tipo: 'slide', url: slideData.arquivo_pdf });
                }
            } catch (error) {
                console.error('Erro ao buscar aula:', error);
            }
        };

        const fetchAulasDoCurso = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/aulas/curso/${idcurso}/`);
                const data = await response.json();
                data.sort((a, b) => a.titulo.localeCompare(b.titulo));
                setAulas(data);
            } catch (error) {
                console.error('Erro ao buscar aulas do curso:', error);
            }
        };

        const fetchCurso = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/cursos/${idcurso}/`);
                if (!response.ok) throw new Error('Erro ao buscar curso');

                const cursoData = await response.json();
                setHasQuestionario(!!cursoData.idquestionario);
            } catch (error) {
                console.error('Erro ao buscar curso:', error);
            }
        };

        fetchAula();
        fetchAulasDoCurso();
        fetchCurso();
    }, [idcurso, idaula]);

    useEffect(() => {
        if (conteudo?.tipo === 'slide') {
            setTimer(0);
            const intervalId = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer >= 15) {
                        clearInterval(intervalId);
                        setCanProceed(true);
                        return prevTimer;
                    }
                    return prevTimer + 1;
                });
            }, 1000);
            return () => clearInterval(intervalId);
        } else if (conteudo?.tipo === 'video') {
            setCanProceed(false); 
        }
    }, [conteudo]);

    const getNextAulaId = () => {
        const currentIndex = aulas.findIndex(a => a.idaula === parseInt(idaula));
        return currentIndex < aulas.length - 1 ? aulas[currentIndex + 1].idaula : null;
    };

    const getPrevAulaId = () => {
        const currentIndex = aulas.findIndex(a => a.idaula === parseInt(idaula));
        return currentIndex > 0 ? aulas[currentIndex - 1].idaula : null;
    };

    const handleNextClick = () => {
        const nextAulaId = getNextAulaId();
        if (nextAulaId) {
            navigate(`/curso/${idcurso}/aula/${nextAulaId}`); 
        }
    };

    const handlePrevClick = () => {
        const prevAulaId = getPrevAulaId();
        if (prevAulaId) {
            navigate(`/curso/${idcurso}/aula/${prevAulaId}`); 
        }
    };

    const handleVideoEnded = () => {
        setVideoWatched(true);
        setCanProceed(true);
    };

    if (!aula) return <p>Carregando...</p>;

    const isLastAula = getNextAulaId() === null;

    return (
        <main className="aula-content">
            <div className="alert alert-info">
                <i className="icon-info"></i> Visualize todo o conteúdo e após finalizar, clique em Concluir Aula.
            </div>
            <div className="alert alert-warning">
                <i className="icon-warning"></i> Se o conteúdo for vídeo, é necessário assistir todo o vídeo sem pular partes. Caso contrário, não será possível Concluir Aula.
            </div>

            <section className="aula-section">
                <h2 className="aula-title">{aula.titulo}</h2>
                <hr className="aula-separator" />
                
                <div className="aula-content-display">
                    {conteudo ? (
                        conteudo.tipo === 'video' ? (
                            <div className="aula-video-container">
                                <h3>Vídeo</h3>
                                <video 
                                    ref={videoRef}
                                    controls 
                                    width="900"
                                    onEnded={handleVideoEnded} 
                                >
                                    <source src={conteudo.url} type="video/mp4" />
                                    Seu navegador não suporta a exibição de vídeos.
                                </video>
                            </div>
                        ) : (
                            <div className="aula-slide-container">
                                <h3>Slides</h3>
                                <iframe
                                    src={conteudo.url}
                                    title="Slides PDF"
                                    className="aula-slide"
                                    frameBorder="0"
                                >
                                    Este navegador não suporta iframes.
                                </iframe>
                            </div>
                        )
                    ) : (
                        <p className="aula-content-empty">Conteúdo da aula não disponível.</p>
                    )}
                </div>

                <div className="navigation-buttons">
                    <button onClick={handlePrevClick} disabled={!getPrevAulaId()}>Voltar</button>
                    {isLastAula ? (
                        hasQuestionario ? (
                            <button onClick={() => navigate(`/curso/${idcurso}/questionario`)} disabled={!canProceed}>Responder Questionário</button>
                        ) : (
                            <button onClick={() => navigate(`/curso/${idcurso}/concluir`)} disabled={!canProceed}>Concluir Curso</button>
                        )
                    ) : (
                        <button onClick={handleNextClick} disabled={!canProceed}>Próximo</button>
                    )}
                </div>
                {conteudo?.tipo === 'slide' && !canProceed && (
                    <p>Timer: {timer} / 15 segundos</p>
                )}
            </section>
        </main>
    );
}

export default VisualizarAula;
