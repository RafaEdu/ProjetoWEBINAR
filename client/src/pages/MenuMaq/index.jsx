import React from 'react';
import './styles.css';

function MenuMaq() {
    const maquinasAtrib = [
        { id: 1, nome: "Máquina 1" },
        { id: 2, nome: "Máquina 2" },
        { id: 3, nome: "Máquina 3" },
        { id: 3, nome: "Máquina 3" },
    ];


    return (
        <main className="content">

            <section className="courses-section">
              
                <div className="courses-row">
                    <h2>Máquinas</h2>
                    <div className="carousel">
                        <div className="carousel-content">
                            {maquinasAtrib.map((maquina) => (
                                <div key={maquina.id} className="carousel-item">
                                    {maquina.nome}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default MenuMaq;
