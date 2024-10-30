import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './styles.css';

function VisualizarAula() {
    const { idaula } = useParams();
    const [aula, setAula] = useState(null);
    const [conteudo, setConteudo] = useState(null);

    useEffect(() => {
        const fetchAula = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/aulas/${idaula}/`);
                if (!response.ok) throw new Error('Erro na resposta da API');

                const data = await response.json();
                setAula(data);

                if (data.idvideo_id) {
                    const videoResponse = await fetch(`http://localhost:8000/api/videos/${data.idvideo_id}/`);
                    if (!videoResponse.ok) throw new Error('Erro ao buscar vídeo');
                    const videoData = await videoResponse.json();
                    
                    if (videoData && videoData.arquivo_video) {
                        setConteudo({ tipo: 'video', url: videoData.arquivo_video });
                    } else {
                        console.error('Dados do vídeo não encontrados');
                    }
                } else if (data.idslide_id) {
                    const slideResponse = await fetch(`http://localhost:8000/api/slides/${data.idslide_id}/`);
                    if (!slideResponse.ok) throw new Error('Erro ao buscar slide');
                    
                    const slideData = await slideResponse.json();
                    if (slideData && slideData.arquivo_pdf) {
                        setConteudo({ tipo: 'slide', url: slideData.arquivo_pdf });
                    } else {
                        console.error('Dados do slide não encontrados');
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar aula:', error);
            }
        };

        fetchAula();
    }, [idaula]);

    if (!aula) return <p>Carregando...</p>;

    return (
        <main className="aula-content">
            {/* Avisos */}
            <div className="alert alert-info">
                <i className="icon-info"></i> Visualize todo o conteúdo e após finalizar, clique em Concluir Aula.
            </div>
            <div className="alert alert-warning">
                <i className="icon-warning"></i> Se o conteúdo for vídeo, é necessário assistir todo o vídeo sem pular partes. Caso contrário, não será possível Concluir Aula.
            </div>

            {/* Seção da Aula */}
            <section className="aula-section">
                <h2 className="aula-title">{aula.titulo}</h2>
                <hr className="aula-separator" />
                
                <div className="aula-content-display">
                    {conteudo ? (
                        conteudo.tipo === 'video' ? (
                            <div className="aula-video-container">
                                <h3>Vídeo</h3>
                                <video controls width="900">
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
            </section>
        </main>
    );
}

export default VisualizarAula;
