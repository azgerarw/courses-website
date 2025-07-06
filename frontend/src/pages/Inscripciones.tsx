import Boton from '../components/boton';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';

type FormData = {
  usuario_id?: number;
  fecha?: string;
  tipo?: string;
  curso_id?: number;
}

export default function () {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState<FormData>({});

    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement >) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
      
    }

    const token = localStorage.getItem('token');

const recogerDatos = async () => {
  try {
    const res = await fetch('/api/inscripciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        curso_id: formData.curso_id,
        fecha: formData.fecha,
        tipo: formData.tipo,
      }),
    });

    const result = await res.json();
    if(result.ok) {
      alert(result.message)
      navigate('/');
      
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
    return alert('inicie sesión')
  }
};


    return (
        <>
        <h2 className="titulo_formulario_inscripciones">Formulario de inscripciones</h2>
        <div className='w-full h-dvh'>
            <form action="" onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()} >
                <label htmlFor="curso_id">Selecciona un curso</label>
                <select name="curso_id" id="" onChange={handleChange}>
                    <option value="5">html</option>
                    <option value="9">css</option>
                    <option value="10">javascript</option>
                    <option value="11">nodejs</option>
                    <option value="12">bootstrap</option>
                    <option value="13">react</option>
                    <option value="14">sql</option>
                    <option value="16">angular</option>
                    <option value="17">vue</option>
                    <option value="18">jquery</option>
                    <option value="19">python</option>
                    <option value="20">ruby</option>
                    <option value="21">php</option>
                    <option value="24">c#</option>
                    
                </select>

                <label htmlFor="fecha">Selecciona fecha</label>
                <select name="fecha" id="" onChange={handleChange}>
                    <option value="enero">enero</option>
                    <option value="abril">abril</option>
                    <option value="septiembre">septiembre</option>
                    
                </select>
                
                <fieldset >
                    <legend>Tipo de curso</legend>
                    <label htmlFor="tipo">
                    <input onChange={handleChange}  type="radio" id="tipo_online" name="tipo" value="online" />
                    Online
                    </label>
                    <label htmlFor="tipo">
                    <input onChange={handleChange} type="radio" id="tipo_presencial" name="tipo" value="presencial" />
                    Presencial
                    </label>
                </fieldset>

                <Boton onClick={recogerDatos}>Inscribir</Boton>
            </form>
        </div>
        </>
    )
}