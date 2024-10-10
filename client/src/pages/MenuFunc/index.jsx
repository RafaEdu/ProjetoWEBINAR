import React from 'react';
import './style.css';

function MenuFunc() {
    const maquinasEmProgresso = [
        { id: 1, nome: "Máquina 1" },
        { id: 2, nome: "Máquina 2" },
        { id: 3, nome: "Máquina 3" },
    ];

    const cursosEmProgresso = [
        { id: 4, nome: "Curso A" },
        { id: 5, nome: "Curso B" },
    ];

    return (
        <main className="content">
            <h1>Olá, (NOME DO USUÁRIO)</h1>

            <section className="courses-section">
                {/* Cursos em progresso */}
                <div className="courses-row">
                    <h2>Máquinas</h2>
                    <div className="carousel">
                        <div className="carousel-content">
                            {maquinasEmProgresso.map((maquina) => (
                                <div key={maquina.id} className="carousel-item">
                                    {maquina.nome}
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
                            {cursosEmProgresso.map((curso) => (
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
