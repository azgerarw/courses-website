import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

type Conversacion = {
    usuario?: string;
    imagen?: string;
    no_leidos?: number;
    usuario_id?: number;
    fecha?: string;
}

export default function Mensajeria() {
    const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
    const token = localStorage.getItem('token');

    if (!token) {
    throw new Error('Token no encontrado. Redirigir o manejar sesión.');
    }
    const decoded = jwtDecode<{ id: number }>(token);
    
    const usuario: number = decoded.id;
    
    const { actualizarNoLeidos } = useOutletContext<{ actualizarNoLeidos: () => void }>();

    useEffect(() => {
            
            fetch(`/api/mensajeria/${usuario}`)
          .then(res => res.json())
          .then((data: Conversacion[]) => setConversaciones(data))
          .catch(err => console.error('Error al cargar la página:', err));
          actualizarNoLeidos();
        }, [])

    
    return (
        <>
        <h2>Conversaciones</h2>
        <div className='m-auto mb-6 shadow-[0px_0px_5px_0px_black] p-4 max-w-[400px] h-fit max-h-[600px] flex flex-col gap-3 overflow-scroll'>
        {conversaciones.map((c => (
            <>
            <div className='h-fit m-auto w-fit bg-blue-100 flex flex-col gap-1 p-3 relative'>
                <div className='flex flex-row gap-2 items-center justify-center'>
                    <img className='h-[30px] w-[30px] rounded-full' src={/^https/.test(c.imagen ? c.imagen : '') ? `${c.imagen}`: `http://localhost:3000/uploads/${c.imagen}`} />
                    <p>{c.usuario}</p>
                </div>
                <div>
                    <p>Último mensaje: {c.fecha}</p>
                    <Link className='cursor-pointer' to={`/Chatprivado/${c.usuario_id}/${c.usuario}`}>Abrir conversación</Link>
                </div>
                {(c.no_leidos ?? 0) > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
                    {c.no_leidos}
                    </span>
                )}
            </div>
            
            </>
        )))}
        </div>
        </>
    )

}