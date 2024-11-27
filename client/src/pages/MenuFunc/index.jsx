import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importação para navegação
import { FaSwatchbook, FaTools } from 'react-icons/fa'; // Importação dos ícones
import './style.css';

function MenuFunc() {
    const [maquinasEmProgresso, setMaquinasEmProgresso] = useState([]);
    const [cursosEmProgresso, setCursosEmProgresso] = useState([]);
    const [userName, setUserName] = useState('');  // Estado para o nome do usuário
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const maquinasCarousel = useRef(null);
    const cursosCarousel = useRef(null);
    const navigate = useNavigate(); // Hook de navegação

    useEffect(() => {
       if(!isAdmin){
        const storedUserName = localStorage.getItem('nome');
        if (storedUserName) {
            setUserName(storedUserName);  // Atualiza o estado com o nome do usuário
        }

        const fetchMaquinas = async () => {
            try {
                const userId = localStorage.getItem('id'); // Pega o ID do usuário do localStorage

                if (!userId) {
                    console.error('ID do usuário não encontrado no localStorage.');
                    return;
                }

                // Chama a API passando o ID do usuário na URL
                const response = await fetch(`http://localhost:8000/api/maquinas-do-usuario/${userId}/`);
                const data = await response.json();

                // Mapear as máquinas para o formato usado no estado
                const maquinas = data.map((maquina) => ({
                    idmaquina: maquina.idmaquina, // Ajustar conforme o retorno da API
                    nomeMaquina: maquina.nomeMaquina,
                }));

                setMaquinasEmProgresso(data); // Atualizar o estado correto
            } catch (error) {
                console.error('Erro ao buscar máquinas do usuário:', error);
            }
        };
        fetchMaquinas();
    } else{

        const fetchMaquinasAdm = async () => {
            const response = await fetch(`http://localhost:8000/api/maquinas`);
            const data = await response.json();    
                
            setMaquinasEmProgresso(data);

    }
    fetchMaquinasAdm();
}
      if(!isAdmin){  
      const fetchCursos = async () => {
            try {
                // Obtém o user_id do localStorage
                const userId = localStorage.getItem('id');

                if (!userId) {
                    console.error('ID do usuário não encontrado no localStorage.');
                    return;
                }

                // Faz a requisição com o user_id no URL
                const response = await fetch(`http://localhost:8000/api/cursos-list/${userId}/`); // Passando userId na URL
                const data = await response.json();

                // Verifica se a resposta foi bem-sucedida
                if (response.ok) {
                    setCursosEmProgresso(data); // Atualiza os cursos no estado
                } else {
                    console.error('Erro ao buscar cursos:', data);
                }
            } catch (error) {
                console.error('Erro ao buscar cursos:', error);
            }
        };

        fetchCursos(); // Puxa os cursos ao carregar o componente
    } else{
        const fetchCursosAdm = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/cursos'); 
                const data = await response.json();
                setCursosEmProgresso(data);
            } catch (error) {
                console.error('Erro ao buscar cursos:', error);
            }
        };
        
        fetchCursosAdm();
        
    } 
    }, []);  // O array vazio significa que esse efeito será executado apenas uma vez quando o componente for montado.

    const handleScroll = (carouselRef, direction) => {
        const itemWidth = carouselRef.current.querySelector('.carousel-item').offsetWidth + 70;
        if (direction === 'left') {
            carouselRef.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        } else {
            carouselRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
    };

    // Função para lidar com o clique em uma máquina e redirecionar para a página CursosDaMaquina
    const handleMaquinaClick = (idmaquina) => {
        navigate(`/cursos-da-maquina/${idmaquina}`);
    };

    // Função para lidar com o clique em um curso e redirecionar para a página AulasDoCurso
    const handleCursoClick = (idcurso) => {
        navigate(`/curso/${idcurso}`);
    };

    return (
        <main className="content">
            <h2>Olá, {userName}</h2>  {/* Exibe o nome do usuário logado */}

            <section className="courses-section">
                <div className="courses-row">
                    <h2>Máquinas Pendentes</h2>

                    <hr className="separador" /> 

                    <div className="carousel-container">
                        <button className="carousel-arrow left-arrow" onClick={() => handleScroll(maquinasCarousel, 'left')}>‹</button>
                        <div className="carousel" ref={maquinasCarousel}>
                            <div className="carousel-content">
                                {maquinasEmProgresso.map((maquina) => {
                                    const progressPercent = 40; // Exemplo de valor estático para progresso
                                    return (
                                        <div key={maquina.idmaquina} className="carousel-item" onClick={() => handleMaquinaClick(maquina.idmaquina)}> {/* Adiciona o evento de clique */}
                                            <div className="maquina-nome">{maquina.nomeMaquina}</div>
                                            <div className="icon-container">
                                                <div className="icon-circle">
                                                    <FaTools className="icon" />  {/* Ícone de ferramenta para máquinas */}
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

                    <hr className="separador" />                  

                    <div className="carousel-container">
                        <button className="carousel-arrow left-arrow" onClick={() => handleScroll(cursosCarousel, 'left')}>‹</button>
                        <div className="carousel" ref={cursosCarousel}>
                            <div className="carousel-content">
                                {cursosEmProgresso.map((curso) => {
                                    const progressPercent = 70; // Exemplo de valor estático para progresso
                                    return (
                                        <div key={curso.id} className="carousel-item" onClick={() => handleCursoClick(curso.idcurso)}> {/* Adiciona o evento de clique */}
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
