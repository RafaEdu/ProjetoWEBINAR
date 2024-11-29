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
    const [questionario, setQuestionario] = useState(null);
    const [showQuestionario, setShowQuestionario] = useState(false);
    const [respostas, setRespostas] = useState({});
    const videoRef = useRef(null);

    useEffect(() => {
        const fetchAula = async () => {
            try {
                setCanProceed(false);
                setVideoWatched(false);
                setTimer(0);
                setConteudo(null); // Limpa conteúdo anterior

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

                if (cursoData.idquestionario) {
                    const questionarioResponse = await fetch(`http://localhost:8000/api/questionarios/${cursoData.idquestionario}/`);
                    if (!questionarioResponse.ok) throw new Error('Erro ao buscar questionário');
                    const questionarioData = await questionarioResponse.json();
                    setQuestionario(questionarioData);
                }
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
                setTimer((prevTimer) => {
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

    useEffect(() => {
        if (conteudo?.tipo === 'video' && videoRef.current) {
            videoRef.current.load(); // Recarrega o vídeo ao atualizar o conteúdo
        }
    }, [conteudo]);

    const getNextAulaId = () => {
        const currentIndex = aulas.findIndex((a) => a.idaula === parseInt(idaula));
        return currentIndex < aulas.length - 1 ? aulas[currentIndex + 1].idaula : null;
    };

    const getPrevAulaId = () => {
        const currentIndex = aulas.findIndex((a) => a.idaula === parseInt(idaula));
        return currentIndex > 0 ? aulas[currentIndex - 1].idaula : null;
    };

    const handleNextClick = async () => {
        const nextAulaId = getNextAulaId();
        if (nextAulaId) {
            try {
                const userId = localStorage.getItem('id');
                const response = await fetch('http://localhost:8000/api/concluir-aula/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        aula_id: idaula,
                    }),
                });
    
                if (!response.ok) {
                    throw new Error('Erro ao concluir aula');
                }
    
                navigate(`/curso/${idcurso}/aula/${nextAulaId}`);
            } catch (error) {
                console.error('Erro ao concluir aula:', error);
            }
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

    const handleShowQuestionario = () => {
        setShowQuestionario(true);
    };

    const handleRespostaChange = (perguntaIndex, alternativaIndex) => {
        const alternativaSelecionada = questionario.perguntas[perguntaIndex].alternativas[alternativaIndex];
        if (alternativaSelecionada) {
            setRespostas((prevRespostas) => ({
                ...prevRespostas,
                [perguntaIndex]: {
                    is_correta: alternativaSelecionada.is_correta,
                },
            }));
        }
    };

    const handleEnviarRespostas = async () => {
        const resultados = Object.values(respostas).map(resposta => resposta.is_correta);
    
        // Verifica se todas as respostas estão corretas
        const todasCorretas = resultados.every(isCorreta => isCorreta);
        
        if (todasCorretas) {
            alert('Todas as respostas estão corretas! Você concluiu o questionário.');
    
            try {
                const userId = localStorage.getItem('id'); 
                const response = await fetch('http://localhost:8000/api/concluir-aula/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        aula_id: idaula,
                    }),
                });
    
                if (!response.ok) {
                    throw new Error('Erro ao concluir aula');
                }
    
                navigate('/home');
            } catch (error) {
                console.error('Erro ao concluir aula:', error);
            }
        } else {
            alert('Alguma resposta está errada. Por favor, refaça o questionário.');
        }
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
                    <button onClick={handlePrevClick} disabled={!getPrevAulaId()}>
                        Voltar
                    </button>
                    {isLastAula ? (
                        hasQuestionario && !showQuestionario ? (
                            <button onClick={handleShowQuestionario} disabled={!canProceed}>
                                Responder Questionário
                            </button>
                        ) : (
                            <button disabled={!canProceed}>Concluir Aula</button>
                        )
                    ) : (
                        <button onClick={handleNextClick} disabled={!canProceed}>
                            Próxima Aula
                        </button>
                    )}
                </div>

                {showQuestionario && questionario && (
                    <div className="questionario-container">
                        <h3>Questionário</h3>
                        {questionario.perguntas.map((pergunta, index) => (
                            <div key={index}>
                                <h4>{pergunta.texto}</h4>
                                <ul>
                                    {pergunta.alternativas.map((alternativa, altIndex) => (
                                        <li key={altIndex}>
                                            <input
                                                type="radio"
                                                id={`pergunta-${index}-alt-${altIndex}`}
                                                name={`pergunta-${index}`}
                                                onChange={() => handleRespostaChange(index, altIndex)}
                                            />
                                            <label htmlFor={`pergunta-${index}-alt-${altIndex}`}>
                                                {alternativa.texto}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        <button onClick={handleEnviarRespostas}>Enviar Respostas</button>
                    </div>
                )}
            </section>
        </main>
    );
}

export default VisualizarAula;
