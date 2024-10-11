import React from 'react';
import './styles.css';

function MenuCurso() {
    const cursosAtrib = [
        { id: 1, nome: "Curso 1" },
        { id: 2, nome: "Curso 2" },
        { id: 3, nome: "Curso 3" },
    ];


    return (
        <main className="content">

            <section className="courses-section">
              
                <div className="courses-row">
                    <h2>Cursos</h2>
                    <div className="carousel">
                        <div className="carousel-content">
                            {cursosAtrib.map((curso) => (
                                <div key={curso.id} className="carousel-item">
                                    {curso.nome}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default MenuCurso;
