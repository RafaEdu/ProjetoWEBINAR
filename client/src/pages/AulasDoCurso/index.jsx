import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaRegClock } from 'react-icons/fa'; // Importa o ícone de relógio
import './styles.css';

function AulasDoCurso() {
    const { idcurso } = useParams(); // Pega o ID do curso da URL
    const [aulas, setAulas] = useState([]);
    const [tituloCurso, setTituloCurso] = useState(''); // Estado para o título do curso
    const [progressoCurso, setProgressoCurso] = useState(55); 

    useEffect(() => {
        const fetchAulas = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/aulas/curso/${idcurso}/`);
                const data = await response.json();
                setAulas(data); // Atualiza o estado com as aulas
            } catch (error) {
                console.error('Erro ao buscar aulas:', error);
            }
        };

        const fetchTituloCurso = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/cursos/${idcurso}/`); // URL da API para buscar o curso
                const data = await response.json();
                setTituloCurso(data.titulo); // Atualiza o estado com o título do curso
            } catch (error) {
                console.error('Erro ao buscar título do curso:', error);
            }
        };

        fetchAulas(); // Chama a função ao carregar o componente
        fetchTituloCurso(); // Chama a função para buscar o título do curso
    }, [idcurso]);

    return (
        <div className="aulas-curso-content">
            <div className="header-container">
            <h2 className="aulas-text">Aulas do Curso: {tituloCurso}</h2>
            <div className="adc-progress-bar-container">
                    <div className="adc-progress-bar" style={{ width: `${progressoCurso}%` }}></div>
                    <span className="adc-progress-value">{progressoCurso}%</span>
            </div>
            </div>
            <hr className="separador" />
            <div className="aulas-curso-list">
                {aulas.map(aula => (
                    <div key={aula.idaula} className="aulas-curso-item">
                        <button className="aulas-curso-button">Assistir</button>
                        <h3 className="aulas-text">{aula.titulo}</h3>
                        <p className="duracao-aula">
                            <FaRegClock style={{ marginRight: '5px', color: 'blue' }} />
                            {aula.duracao}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AulasDoCurso;
