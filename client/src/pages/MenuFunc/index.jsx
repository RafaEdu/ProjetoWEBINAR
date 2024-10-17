import React, { useRef, useEffect, useState } from 'react';
import { FaSwatchbook } from 'react-icons/fa'; // Importação dos ícones
import { BsTools } from 'react-icons/bs'; // Importação dos ícones
import './style.css';

function MenuFunc() {
    const [maquinasEmProgresso, setMaquinasEmProgresso] = useState([]);
    const [cursosEmProgresso, setCursosEmProgresso] = useState([]);

    const maquinasCarousel = useRef(null);
    const cursosCarousel = useRef(null);

    useEffect(() => {
        const fetchMaquinas = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/maquinas'); 
                const data = await response.json();
                setMaquinasEmProgresso(data);
            } catch (error) {
                console.error('Erro ao buscar máquinas:', error);
            }
        };

        const fetchCursos = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/cursos'); 
                const data = await response.json();
                setCursosEmProgresso(data);
            } catch (error) {
                console.error('Erro ao buscar cursos:', error);
            }
        };

        fetchMaquinas();
        fetchCursos();
    }, []);

    const handleScroll = (carouselRef, direction) => {
        const itemWidth = carouselRef.current.querySelector('.carousel-item').offsetWidth + 75;
        if (direction === 'left') {
            carouselRef.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        } else {
            carouselRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
    };

    return (
        <main className="content">
            <h2>Olá, (NOME DO USUÁRIO)</h2>

            <section className="courses-section">
                <div className="courses-row">
                    <h2>Máquinas Pendentes</h2>
                    <div className="carousel-container">
                        <button className="carousel-arrow left-arrow" onClick={() => handleScroll(maquinasCarousel, 'left')}>‹</button>
                        <div className="carousel" ref={maquinasCarousel}>
                            <div className="carousel-content">
                                {maquinasEmProgresso.map((maquina) => {
                                    const progressPercent = 40; // Exemplo de valor estático para progresso
                                    return (
                                        <div key={maquina.id} className="carousel-item">
                                            <div className="maquina-nome">{maquina.nomeMaquina}</div>
                                            <div className="icon-container">
                                                <div className="icon-circle">
                                                    <BsTools className="icon" />  {/* Ícone de ferramenta para máquinas */}
                                                </div>
                                            </div>
                                            <div className="progress-container">
                                                <div className="progress-bar-container">
                                                    <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
                                                </div>
                                                <div className="progress-text">{progressPercent}%</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <button className="carousel-arrow right-arrow" onClick={() => handleScroll(maquinasCarousel, 'right')}>›</button>
                    </div>
                </div>

                <div className="courses-row">
                    <h2>Cursos Pendentes</h2>
                    <div className="carousel-container">
                        <button className="carousel-arrow left-arrow" onClick={() => handleScroll(cursosCarousel, 'left')}>‹</button>
                        <div className="carousel" ref={cursosCarousel}>
                            <div className="carousel-content">
                                {cursosEmProgresso.map((curso) => {
                                    const progressPercent = 70; // Exemplo de valor estático para progresso
                                    return (
                                        <div key={curso.id} className="carousel-item">
                                            <div className="curso-nome">{curso.titulo}</div>
                                            <div className="icon-container">
                                                <div className="icon-circle">
                                                    <FaSwatchbook className="icon" />  {/* Ícone de livro para cursos */}
                                                </div>
                                            </div>
                                            <div className="progress-container">
                                                <div className="progress-bar-container">
                                                    <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
                                                </div>
                                                <div className="progress-text">{progressPercent}%</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <button className="carousel-arrow right-arrow" onClick={() => handleScroll(cursosCarousel, 'right')}>›</button>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default MenuFunc;
