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
                    console.log('Dados do slide:', slideData); // Para debug
                    
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
        <div className="aula-viewer">
            <h2>{aula.titulo}</h2>
            {conteudo ? (
                conteudo.tipo === 'video' ? (
                    <div>
                        <h3>Vídeo</h3>
                        <video controls width="600">
                            <source src={conteudo.url} type="video/mp4" />
                            Seu navegador não suporta a exibição de vídeos.
                        </video>
                    </div>
                ) : (
                    <div>
                        <h3>Slides</h3>
                        <iframe
                            src={conteudo.url}
                            width="600"
                            height="500"
                            title="Slides PDF"
                            frameBorder="0"
                        >
                            Este navegador não suporta iframes.
                        </iframe>
                    </div>
                )
            ) : (
                <p>Conteúdo da aula não disponível.</p>
            )}
        </div>
    );
}

export default VisualizarAula;
