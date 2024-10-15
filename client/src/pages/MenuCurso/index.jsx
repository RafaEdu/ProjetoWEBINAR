import React, { useRef, useEffect, useState } from 'react';
import { FaSwatchbook } from 'react-icons/fa'; // Icon for courses
import './styles.css';

function MenuCurso() {
    const [cursosEmProgresso, setCursosEmProgresso] = useState([]); // State to store the fetched courses
    const cursosCarousel = useRef(null); // Ref for the carousel

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/cursos'); // Replace with your API endpoint
                const data = await response.json();
                setCursosEmProgresso(data); // Update the state with the fetched courses
            } catch (error) {
                console.error('Erro ao buscar cursos:', error);
            }
        };

        fetchCursos(); // Fetch courses when the component mounts
    }, []);

    // Function to scroll the carousel
    const handleScroll = (direction) => {
        const itemWidth = cursosCarousel.current.querySelector('.carousel-item').offsetWidth + 20;
        if (direction === 'left') {
            cursosCarousel.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        } else {
            cursosCarousel.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
    };

    return (
        <main className="content">
            <section className="courses-section">
                <h2>Cursos Pendentes</h2>
                <div className="carousel-container">
                    <button className="carousel-arrow left-arrow" onClick={() => handleScroll('left')}>‹</button>
                    <div className="carousel" ref={cursosCarousel}>
                        <div className="carousel-content">
                            {cursosEmProgresso.map((curso) => {
                                const progressPercent = 70; // Static progress percentage, like in MenuFunc
                                return (
                                    <div key={curso.id} className="carousel-item">
                                        <div className="icon-container">
                                            <div className="icon-circle">
                                                <FaSwatchbook className="icon" /> {/* Icon for courses */}
                                            </div>
                                        </div>
                                        <div className="curso-nome">{curso.titulo}</div>
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
                    <button className="carousel-arrow right-arrow" onClick={() => handleScroll('right')}>›</button>
                </div>
            </section>
        </main>
    );
}

export default MenuCurso;
