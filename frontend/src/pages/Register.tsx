import { useState, ChangeEvent, FormEvent } from 'react';
import Boton from '../components/boton';
import { useNavigate } from 'react-router-dom';

type formularioData = {
  username?: string;
  correo?: string;
  foto_perfil?: File | null;
  password?: string;
};

type formularioErrores = {
  username?: string;
  correo?: string;
  password?: string;
}

export default function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState<formularioData>({});
  
  const [errors, setErrors] = useState<formularioErrores>({});

  const [serverMessage, setServerMessage] = useState('');
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    

    switch (name) {
      case 'username':
        errors.username =
          value.length < 6 ? 'El usuario debe tener al menos 6 caracteres.' : '';
        break;
      case 'correo':
        errors.correo =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Correo no válido.';
        break;
      case 'password':
        errors.password =
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)
            ? ''
            : 'La contraseña debe tener al menos 8 caracteres, una letra y un número.';
        break;
      default:
        break;
    }
  
    setErrors(errors);
  };

  const cogerDatos = async () => {
    const data = new FormData();
    data.append('usuario', formData.username ? formData.username : '');
    data.append('email', formData.correo ? formData.correo : '');
    data.append('password', formData.password ? formData.password : '');
    if (formData.foto_perfil) {
      data.append('imagen', formData.foto_perfil);
    }
    
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        body: data
      });
  
      const result = await res.json();

    if (!res.ok) {
      if (result.errors) {
        setErrors(result.errors);
      }
      
        setServerMessage(result.error || 'Error desconocido');
      } else {
        
        alert(`${result.message}`);
        navigate('/');
      }
    } catch (err) {
      setServerMessage('No se pudo conectar al servidor.');
      console.error('Error al registrar:', err);
    }
  };

  return (
      <>
      <h2>Crear cuenta</h2>
      <form onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}>
        <label htmlFor="username">Usuario</label>
        <input type="text" name="username" id="username" placeholder="..." onChange={handleChange} required />
        {errors.username && <p className="error">{errors.username}</p>}

        <label htmlFor="correo">Correo</label>
        <input type="text" name="correo" id="correo" placeholder="..." onChange={handleChange} required />
        {errors.correo && <p className="error">{errors.correo}</p>}

        <label htmlFor="foto_perfil">Foto del perfil</label>
        <input accept='.png' type="file" name="foto_perfil" id="foto_perfil" onChange={handleChange} />

        <label htmlFor="password">Contraseña</label>
        <input type="password" name="password" id="password" placeholder="..." onChange={handleChange} required />
        {errors.password && <p className="text-red">{errors.password}</p>}
        
        {serverMessage && <p className="text-blue-800">{serverMessage}</p>}
        <Boton onClick={cogerDatos}>Crear</Boton>
      </form>
      </>
  );
}
