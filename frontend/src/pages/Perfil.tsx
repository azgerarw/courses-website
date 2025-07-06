import Boton from '../components/boton';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { GoPencil, GoUnverified } from "react-icons/go";
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { IoMdCloseCircleOutline } from "react-icons/io";
import { MdVerified } from "react-icons/md";

type Usuario = {
  usuario?: string;
  verificado?: number;
  imagen?: string;
  email?: string;
  inscripciones: Array<{
    id?: number;
    curso_id?: number;
    fecha?: string;
    tipo?: string;
  }>;
};

export default function Perfil() {

  const [user, setUser] = useState<Usuario>({ inscripciones: [] });
 const [fotoStatus, setFotostatus] = useState<boolean>(true);
 const [emailStatus, setEmailstatus] = useState<boolean>(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
   const textoBoton = fotoStatus ? 'Subir foto' : 'Anular';
   const textoBoton2 = fotoStatus ? 'Cambiar foto' : 'Anular';

    /* correo starts */
  
    const [formemailData, setEmailFormData] = useState({
       
        email: '',
        
      });
 
      const recogerEmail = async () => {
         if (!formemailData.email) {
           alert('Escribe un correo nuevo.');
           return;
         }
       
         const data = new FormData();
         data.append('email', formemailData.email);
       
         try {
           const res = await fetch('/api/perfil', {
             method: 'PUT',
             headers: {
               Authorization: `Bearer ${token}`
             },
             body: data
           });
       
           const result = await res.json();
           if (res.ok) {
             alert('Correo actualizado');
             // Recargar perfil para mostrar imagen nueva
             setUser(prev => ({ ...prev, email: result.email }));
           } else {
             alert(result.error || 'Error al cambiar correo');
           }
         } catch (err) {
           console.error('Error subiendo foto:', err);
         }
       };
       
       const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
         setEmailFormData({ email: e.target.value });
       };
 
 
   const toggleEmail = () => {
     setEmailstatus(!emailStatus);
     
   };
   /* correo ends */

   /* foto */
   const [formfotoData, setfotoFormData] = useState<{ foto_perfil: File | null }>({
    foto_perfil: null,
  });


     const recogerFoto = async () => {
        if (!formfotoData.foto_perfil) {
          alert('Seleccioná una imagen.');
          return;
        }
      
        const data = new FormData();
        data.append('imagen', formfotoData.foto_perfil);
      
        try {
          const res = await fetch('/api/perfil', {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: data
          });
      
          const result = await res.json();
          if (res.ok) {
            alert('Foto actualizada');
            // Recargar perfil para mostrar imagen nueva
            setUser(prev => ({ ...prev, imagen: result.imagen }));
          } else {
            alert(result.error || 'Error al subir imagen');
          }
        } catch (err) {
          console.error('Error subiendo foto:', err);
        }
      };
      
      const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        
        if(e.target.files){
        setfotoFormData({ foto_perfil: e.target.files[0] });
        }
      };


  const toggleFoto = () => {
    setFotostatus(!fotoStatus);
    
  };
  
  /* foto */

  const eliminarCuenta = async function () {
    fetch('/api/perfil', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
          localStorage.removeItem('token');
          navigate('/'); // o donde quieras redirigir
          
        });
  }

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('/api/perfil', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error('Error al cargar perfil:', err));
  }, []);

  
  return user ? (
    <>
    <div className="relative h-[80%] w-[100%] flex justify-center">
      
      <div className="w-[50%] h-full items-center">
        <h2>Bienvenido, </h2>
        <h3>{user.usuario}</h3> {user.verificado ? <MdVerified className='icon m-auto' title='usuario verificado' /> : <GoUnverified className='icon' title='usuario no verificado' /> }
        
        <p className={`${emailStatus ? 'block' : 'hidden'}`}>Email: {user.email} </p> 
        {emailStatus ? <GoPencil onClick={toggleEmail} title="cambiar correo" className='icon m-auto' /> : <IoMdCloseCircleOutline onClick={toggleEmail} title="anular cambio" className='icon m-auto' /> } 
        <form onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()} className={`${emailStatus ? 'form_email' : 'block'}`}>
        <input type="email" name="email" onChange={handleEmailChange} required></input>
        <Boton onClick={recogerEmail}>Actualizar</Boton>
        </form>
        <br />
        {user.inscripciones ? (<span>Inscripciones: </span>) : ''}
        <ul className='list-none m-auto p-4 w-[70%] flex flex-col h-[220px] gap-3 overflow-scroll'>
          
        {user.inscripciones.length > 0 ? (
          
          user.inscripciones.map(i => (
          
          <li key={i.id} className='w-full h-auto flex flex-col items-start border-b-2 border-blue-800'>
          <div className='inscripciones_perfil'><span>Código curso: </span><strong>{i.id}</strong></div>
          <div className='inscripciones_perfil'><span>Curso: </span><strong>{i.curso_id}</strong></div>
          <div className='inscripciones_perfil'><span>Empieza en: </span><strong>{i.fecha}</strong></div>
          <div className='inscripciones_perfil'><span>Tipo de curso: </span><strong>{i.tipo}</strong></div>         
          </li>
        ))) : <p>No estas inscrito a ningún curso</p>}
        </ul>
      </div>

      
      <div className="flex flex-col gap-2 w-[50%]">
        
        
        {user.imagen ? <><img src={/^https/.test(user.imagen) ? `${user.imagen}`: `http://localhost:3000/uploads/${user.imagen}`} alt="Foto de perfil" className={`m-auto h-[200px] w-[200px] object-cover rounded-full shadow-[0px_0px_5px_0px_black] ${fotoStatus ? 'block' : 'hidden'}`} /> 
        
        <form onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()} className={` ${fotoStatus ? 'form_foto' : 'block'}`}>
        <input type="file"  onChange={handleFotoChange} required></input>
        <Boton onClick={recogerFoto}>Cargar</Boton>
        </form>
        <Boton className={`boton_subir_foto ${fotoStatus ? '' : 'bg-red-800'}`} onClick={toggleFoto}>{textoBoton2}</Boton></> : 
        <>
        <form onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()} className={` ${fotoStatus ? 'form_foto' : 'block'}`}>
        <input accept='.png' type="file"  onChange={handleFotoChange} required></input>
        <Boton onClick={recogerFoto}>Cargar</Boton>
        </form>
        <Boton className={`boton_subir_foto ${fotoStatus ? '' : 'bg-red-800'}`} onClick={toggleFoto}>{textoBoton}</Boton>
        </>}
        
      </div>
      
    </div>
    
    <div className="perfil_botones">
        
        <Boton onClick={eliminarCuenta}>Eliminar cuenta</Boton>
    </div>
    </>
  ) : (
    <p>Cargando perfil...</p>
  );
}

