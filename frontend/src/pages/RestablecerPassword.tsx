import { Navigate, useNavigate } from 'react-router-dom';
import Boton from '../components/boton.jsx';
import { useState, ChangeEvent, FormEvent } from 'react';

type RestablecerResponse = {
  message: string;
};

export default function RestablecerPassword() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const handleRestablecimientoContraseña = async () => {
    try {
      const res = await fetch('/api/restablecerPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, email }),
      });

      

      
      if (res.ok) {
        const data: RestablecerResponse = await res.json();
        alert(data.message);
        navigate('/');
      } else {
        const data = await res.json();
        let cadenaErrores: string[] = [];

          if (data.error.errors){
                  
              data.error.errors.forEach((e: any) => {
                  
                  cadenaErrores.push(` ${e.msg}`)
              })
              
              return alert(cadenaErrores)
          } else {
              return alert(data.error)
          }
      }    
      
      } catch (err) {
        console.error('Error detectado:', err);
      }
  };


    return (
        <div className="login_form">
            <h2>Restablecimiento de contraseña</h2>
            <form onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()} >
                <label htmlFor="usuario">Usuario</label>
                <input onChange={(e: ChangeEvent<HTMLInputElement>) => setUsuario(e.target.value)} placeholder='escribir usuario...' type="text" name="usuario" id="usuario" required />
                <label htmlFor="email">Correo</label>
                <input onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder='escribir email...' type="email" name="email" id="email" required />
                <Boton id='1' onClick={handleRestablecimientoContraseña}>Enviar solicitud</Boton>
            </form>
        </div>
    )

};