import React, { useRef } from 'react';
import './style.css';

function MenuFunc() {
    const maquinasEmProgresso = [
        { id: 1, nome: "Máquina 1" },
        { id: 2, nome: "Máquina 2" },
        { id: 3, nome: "Máquina 3" },
        { id: 4, nome: "Máquina 4" },
        { id: 5, nome: "Máquina 5" },
        { id: 6, nome: "Máquina 6" },
        { id: 7, nome: "Máquina 7" },
    ];

    const cursosEmProgresso = [
        { id: 5, nome: "Curso A" },
        { id: 6, nome: "Curso B" },
        { id: 7, nome: "Curso C" },
        { id: 8, nome: "Curso D" },
        { id: 9, nome: "Curso F" },
        { id: 10, nome: "Curso G" },
    ];

    const maquinasCarousel = useRef(null);
    const cursosCarousel = useRef(null);

    // Função para mover o carrossel
    const handleScroll = (carouselRef, direction) => {
        const itemWidth = carouselRef.current.querySelector('.carousel-item').offsetWidth + 75; // Adiciona a lacuna entre os itens
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
                {/* Máquinas em progresso */}
                <div className="courses-row">
                    <h2>Máquinas Pendentes</h2>
                    <div className="carousel-container">
                        <button className="carousel-arrow left-arrow" onClick={() => handleScroll(maquinasCarousel, 'left')}>‹</button>
                        <div className="carousel" ref={maquinasCarousel}>
                            <div className="carousel-content">
                                {maquinasEmProgresso.map((maquina) => (
                                    <div key={maquina.id} className="carousel-item">
                                        {maquina.nome}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button className="carousel-arrow right-arrow" onClick={() => handleScroll(maquinasCarousel, 'right')}>›</button>
                    </div>
                </div>

                {/* Cursos em progresso */}
                <div className="courses-row">
                    <h2>Cursos Pendentes</h2>
                    <div className="carousel-container">
                        <button className="carousel-arrow left-arrow" onClick={() => handleScroll(cursosCarousel, 'left')}>‹</button>
                        <div className="carousel" ref={cursosCarousel}>
                            <div className="carousel-content">
                                {cursosEmProgresso.map((curso) => (
                                    <div key={curso.id} className="carousel-item">
                                        {curso.nome}
                                    </div>
                                ))}
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
