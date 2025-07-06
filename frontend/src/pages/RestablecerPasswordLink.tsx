import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Boton from '../components/boton.jsx';

export default function RestablecerPasswordLink() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [tokenValido, setTokenValido] = useState(false);
  const [loading, setLoading] = useState(true);

  
    useEffect(() => {
        fetch(`/api/restablecerPassword/${token}`)
        .then(res => res.ok ? setTokenValido(true) : setTokenValido(false))
        .finally(() => setLoading(false));
    }, [token]);

    const handleSubmit = async () => {
        try {
        const res = await fetch('/api/restablecerPassword', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, nuevaContrasena }),
        });

        const result = await res.json();
        
        if (res.ok) {
        alert('Contraseña actualizada');
        navigate('/Login');
        } else {
          let cadenaErrores: string[] = [];

          if (result.error.errors){
                  
              result.error.errors.forEach((e: any) => {
                  
                  cadenaErrores.push(` ${e.msg}`)
              })
              
              return alert(cadenaErrores)
          } else {
              return alert(result.error)
          }
      }
        } catch (err) {
            alert('Error al actualizar contraseña');
            console.error('Error detectado:', err);
        }
    };

  if (loading) return <p>Cargando...</p>;
  if (!tokenValido) return <p>Token inválido o expirado.</p>;

  return (
    <div className="login_form">
      <h2>Restablecimiento de contraseña</h2>
      <form  >
      <label htmlFor="password"></label>
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Nueva contraseña..."
        onChange={(e) => setNuevaContrasena(e.target.value)}
        required
      />
      <Boton id='1' onClick={handleSubmit}>Actualizar</Boton>
      </form>
    </div>
  );
}
