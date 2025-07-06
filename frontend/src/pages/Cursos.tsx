import Boton from '../components/boton';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FcSearch } from "react-icons/fc";
import { useEffect, useState, ChangeEvent, FormEvent, LinkHTMLAttributes, ReactElement, ReactNode } from 'react';

type Curso = {
    id: string;
    titulo?: string;
    descripcion?: string;
    imagen?: string;
}

export default function Cursos() {

    const [cursos, setCursos] = useState<Curso[]>([]);
    const [expandedCursos, setExpandedCursos] = useState<{ [id: string]: boolean }>({});

    const token = localStorage.getItem('token');

    const toggleTexto = (id: string) => {
        setExpandedCursos(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };
    
    useEffect(() => {
    

    fetch('/api/cursos')
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(err => console.error('Error al cargar perfil:', err));
  }, []);

    const mostrarCursos = (e: React.MouseEvent<HTMLButtonElement>) => {
        
        const button = e.target as HTMLButtonElement;
        const categoria = button.id;

        fetch(`/api/cursos/${categoria}`)
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(err => console.error('Error al cargar perfil:', err));
    };

    const recogerValor = (e: ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value;
        
        fetch(`/api/cursos/buscar?search=${search}`)
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(err => console.error('Error al cargar perfil:', err));

    };


    return (
        <>
            <h2>Cursos disponibles</h2>
                
                <input onChange={(e) => recogerValor(e)} type="text" name="search" placeholder='escribe aquí...' className='bg-blue-100 placeholder:text-center dark:text-black'  />
                
            
            <div className='flex flex-row gap-2 justify-center mt-[20px]'>
                <div>
                <Boton id='all' onClick={(e) => mostrarCursos(e)}>Todos</Boton>

                </div>
                <div>
                <Boton id='frontend' onClick={(e) => mostrarCursos(e)}>Frontend</Boton>

                </div>
                <div>
                <Boton id='backend' onClick={(e) => mostrarCursos(e)}>Backend</Boton>

                </div>
            </div>
        <div className="flex flex-row flex-wrap justify-center items-center gap-4 my-[40px]">
            {cursos.length > 0 ? (
                
                cursos.map(curso => (
                <div key={curso.id} data-cy="curso-item"  className="flex flex-col gap-2 h-[250px] w-[250px] justify-center items-center p-2 shadow-[0px_0px_5px_0px_black] dark:bg-gray-800">
                    
                    <img src={`http://localhost:3000/uploads/${curso.imagen}`} alt={curso.titulo} className={expandedCursos[curso.id] ? 'hidden' : 'block w-full h-full object-cover'}/>
                    <div className={expandedCursos[curso.id] ? 'w-full h-[250px] flex flex-col gap-4 ' : 'hidden'}>
                    <span className="font-bold size-2 w-full h-[10px]">{curso.titulo}</span>
                    <span className={expandedCursos[curso.id] ? 'overflow-scroll p-2 h-[120px]' : 'hidden'}>{curso.descripcion}
                    </span>
                    
                    
                    </div>
                    <span onClick={() => toggleTexto(curso.id)} className="cursor-pointer text-blue-800 dark:text-white" title="leer más">{expandedCursos[curso.id] ? 'atrás' : 'Ver detalles...'}</span>
                    
                    <Boton ><Link to="/Inscripciones"><span className='text-white'>Inscribir</span></Link></Boton>
                    
                </div>
                ))
            ) : (
                <p>No hay cursos disponibles.</p>
            )}
            
        </div>
        </>
    )
}