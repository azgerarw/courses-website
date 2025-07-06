import { useState, ChangeEvent, FormEvent } from 'react';
import Boton from '../components/boton';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Login() {
  const [usuario, setUsuario] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password }),
      });

      const data: { token: string, message: string, error: string, errors: [] } = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        if (data.message) {
          alert(data.message)
        } if (data.error) {
          alert(data.error)
        } else {
          
        alert(`${Object.keys(data.errors)[0]} es un campo obligatorio`);
        
        }
             
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
    }
  };

  return (
    <>
      <h2>Iniciar sesión</h2>
      <form onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}>
        <label htmlFor="username">Usuario</label>
        <input type="text" id="username" value={usuario} onChange={(e: ChangeEvent<HTMLInputElement>) => setUsuario(e.target.value)} required />

        <label htmlFor="password">Contraseña</label>
        <input type="password" id="password" value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />

        <p className="registrar">Si no tiene una cuenta haga click <strong><Link to="/Register">aquí</Link></strong></p>
        <p className="registrar">¿Ha olvidado su contraseña? haga clic <strong><Link to='/RestablecerPassword'>aquí</Link></strong></p>
        <Boton onClick={handleLogin}>Continuar</Boton>
      </form>
    </>
  );
}
