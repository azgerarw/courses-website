import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode, JwtPayload } from 'jwt-decode';

type Mensaje = {
  id?: number;
  fecha?: string;
  contenido?: string;
  remitente_id?: number;
}

export default function Chatprivado() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');

    const { destinatarioId, destinatarioUsuario } = useParams();
    const token = localStorage.getItem('token');
    
    
    const decoded: { id?: String } = jwtDecode(token ?? '');
    
    const usuarioActual = decoded.id;
    
    
    
  const cargarMensajes = async () => {
    const res = await fetch(`/api/mensajes/conversacion/${usuarioActual}/${destinatarioId}`);
    const data = await res.json();
    setMensajes(data);
    await fetch('/api/mensajes/marcar-leido', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    remitente_id: destinatarioId,
    destinatario_id: usuarioActual
  })
});
  };

  const enviarMensaje = async () => {
    await fetch('/api/mensajes/enviar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        remitente_id: usuarioActual,
        destinatario_id: destinatarioId,
        contenido: nuevoMensaje,
      })
    });
    setNuevoMensaje('');
    cargarMensajes();
  };

  useEffect(() => {
    cargarMensajes();
  }, [usuarioActual, destinatarioId]);

  return (
    <>
    <h2>Chat con usuario {destinatarioId}</h2>
    
      
      <div className='min-w-[280px] w-[60%] h-[450px] max-h-fit shadow-[0px_0px_5px_0px_black] m-auto flex flex-col gap-3 p-3'>
        <div className="h-[90%] flex flex-col gap-2 overflow-scroll w-[100%] pr-5">
            {mensajes.map((m) => (
            <div key={m.id} className={m.remitente_id === usuarioActual ? ' w-full flex flex-row justify-start    h-fit' : 'w-full flex flex-row justify-end   h-fit'}>
                
                    <div className={m.remitente_id === usuarioActual ? 'bg-blue-100 w-fit p-2 text-left  max-w-[80%]' : 'bg-gray-200 w-fit p-2 text-left  max-w-[80%]'}>
                        {m.remitente_id === usuarioActual ? <strong className='text-blue-900'>Yo: </strong> : <strong className='text-blueproject'>{destinatarioUsuario}: </strong>} {m.contenido}
                    <strong className={m.remitente_id === usuarioActual ? ' w-full flex flex-row justify-start    h-fit' : 'w-full flex flex-row justify-end   h-fit'}>{m.fecha}</strong>
                    </div>
                    
                
            </div>
            ))}
        </div>
        <div className="h-[10%] w-[100%] flex flex-row gap-2 p-1">
            <input className='w-[90%] bg-blue-100' value={nuevoMensaje} onChange={(e) => setNuevoMensaje(e.target.value)} />
            <button className=' min-w-fit w-[10%] bg-blueproject text-white px-2 cursor-pointer hover:bg-blue-500 active:bg-blueproject active:scale-95 transition-transform' onClick={enviarMensaje}>Enviar</button>
        </div>
      </div>
      
    
    </>
  );
}
