import { useEffect, useState } from 'react';
import Boton from '../components/boton';
import { BiMessageDetail } from "react-icons/bi";
import { Link } from 'react-router-dom';

type Usuario = {
  id: number;
  usuario: string;
  usuario_id: string;
  imagen?: string;
};

export default function Usuarios() {

    const token = localStorage.getItem('token');
    
    
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const LIMIT: number = 5;

    const cargarUsuarios = () => {
        

        fetch(`/api/usuarios?offset=${offset}&limit=${LIMIT}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.length < LIMIT) setHasMore(false); // No hay más usuarios
            setUsuarios(prev => [...prev, ...data]); // Añadir nuevos usuarios
            setOffset(prev => prev + LIMIT); // Incrementar offset
        })
        .catch(err => console.error('Error al cargar usuarios:', err));
    };

    useEffect(() => {
        
    
        cargarUsuarios();
        
      }, []);


    return (
        <>
                <h2>Usuarios</h2>
                <ul className="w-[400px] h-fit p-[30px] m-auto flex flex-col justify-center gap-2">
                    
            {usuarios.length > 0 ? (
                
                usuarios.map(usuario => (
                <li key={usuario.id} data-cy="usuario-item" className='list-none p-2 m-0 flex flex-row w-full items-center h-[50px] shadow-[0px_0px_5px_0px_black] gap-3 dark:bg-gray-800'>
                    <div className='w-[20%] h-[100%]'>
                    {usuario.imagen ? <img className='rounded-full h-full w-full object-cover' src={/^https/.test(usuario.imagen) ? `${usuario.imagen}`: `http://localhost:3000/uploads/${usuario.imagen}`}/> : <img alt='avatar'/>}
                    </div>
                    <div className='flex flex-row gap-2 w-full justify-end'>
                        <p>{usuario.usuario}</p>
                        <p># {usuario.usuario_id}</p>
                        {token ? <Link to={`/Chatprivado/${usuario.usuario_id}/${usuario.usuario}`} ><BiMessageDetail className='icon' title="mandar mensaje privado" /></Link> : ''}
                        
                    </div>
                </li>
                ))
            ) 
            : (
                <p>No se han encontrado usuarios en la base de datos.</p>
            )}
            
         </ul>
            
            {hasMore && (
                <Boton onClick={cargarUsuarios}>Mostrar más</Boton>
            )}
            
        </>
    )

}