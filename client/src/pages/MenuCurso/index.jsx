import React, { useEffect, useState } from 'react';
import { FaSwatchbook } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import './styles.css';

function MenuCurso() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const [cursosEmProgresso, setCursosEmProgresso] = useState([]); // Estado para armazenar cursos
    const [searchTerm, setSearchTerm] = useState(''); // Estado para armazenar a busca
    const navigate = useNavigate(); // Hook para navegação

    useEffect(() => {
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
    }   else {
        const fetchCursosAdm = async () => {
            try {
            const response = await fetch(`http://localhost:8000/api/cursos`)
            const data = await response.json();

            if (response.ok) {
                setCursosEmProgresso(data); // Atualiza os cursos no estado
            } else {
                console.error('Erro ao buscar cursos:', data);
            }
        } catch (error) {
            console.error('Erro ao buscar cursos:', error);
        }
            
    }
    fetchCursosAdm();
}

}, []);


    // Função que atualiza o estado da busca conforme o usuário digita
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filtra os cursos com base no título
    const filteredCursos = cursosEmProgresso.filter((curso) =>
        curso.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Função para redirecionar ao clicar em um curso
    const handleCursoClick = (idcurso) => {
        navigate(`/curso/${idcurso}`); // Redireciona para a página do curso
    };

    return (
        <main className="menu-curso-content">
            <section className="menu-curso-section">
                <h2 className="cursos-text">Cursos</h2>
                
                <hr className="separador" />

                {/* Barra de pesquisa */}
                <input
                    type="text"
                    placeholder="Pesquisar cursos..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="menu-curso-search-bar"
                />

                <div className="menu-curso-grid">
                    {filteredCursos.map((curso) => {
                        const progressPercent = 70; // Progresso estático
                        return (
                            <div key={curso.idcurso} className="menu-curso-item" onClick={() => handleCursoClick(curso.idcurso)}> {/* Adicionado onClick */}
                                <div className="menu-curso-nome">{curso.titulo}</div> {/* Nome do curso no topo */}
                                <div className="menu-curso-icon-container">
                                    <div className="menu-curso-icon-circle">
                                        <FaSwatchbook className="menu-curso-icon" />
                                    </div>
                                </div>
                                <div className="menu-curso-progress-container">
                                    <div className="menu-curso-progress-bar-container">
                                        <div className="menu-curso-progress-bar" style={{ width: `${progressPercent}%` }}></div>
                                    </div>
                                    <div className="menu-curso-progress-text">{progressPercent}%</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}

export default MenuCurso;
