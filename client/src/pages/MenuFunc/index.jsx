import React from 'react';
import './style.css';

function MenuFunc() {
    const cursosEmProgresso = [
        { id: 1, nome: "Curso 1" },
        { id: 2, nome: "Curso 2" },
        { id: 3, nome: "Curso 3" },
    ];

    const cursosConcluidos = [
        { id: 4, nome: "Curso A" },
        { id: 5, nome: "Curso B" },
    ];

    return (
        <main className="content">
            <h1>Painel do Funcionário</h1>

            <section className="courses-section">
                {/* Cursos em progresso */}
                <div className="courses-row">
                    <h2>Cursos em Progresso</h2>
                    <div className="carousel">
                        <div className="carousel-content">
                            {cursosEmProgresso.map((curso) => (
                                <div key={curso.id} className="carousel-item">
                                    {curso.nome}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cursos concluídos */}
                <div className="courses-row">
                    <h2>Cursos Concluídos</h2>
                    <div className="carousel">
                        <div className="carousel-content">
                            {cursosConcluidos.map((curso) => (
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

export default MenuFunc;
