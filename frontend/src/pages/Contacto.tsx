import Boton from '../components/boton';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contacto() {

     const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: null,
        email: null,
        mensaje: null,
        
        });


    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        
            setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
            console.log(formData)
    };

        const recogerDatos = async () => {
        
        
            const res = await fetch('/api/contacto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: formData.nombre,
                email: formData.email,
                mensaje: formData.mensaje,
                
            }),
            });
            
            const result = await res.json();

            let cadenaErrores: string[] = [];

            if (!res.ok){
                    
                result.error.errors.forEach((e: any) => {
                    
                    cadenaErrores.push(` ${e.msg}`)
                })
                
                return alert(cadenaErrores)
            } 

                     
            navigate('/');
            alert(result.message)
        
    };

    return (
        <>
        <h2>
            Formulario de contacto
        </h2>

        <form action="">

            <label htmlFor="nombre">Nombre</label>
            <input type="text" id="nombre" name="nombre" placeholder="ej. nombre apellido" onChange={handleChange} required />

            <label htmlFor="email">Correo</label>
            <input type="email" id="email" name="email" placeholder="ej. correo@proveedor.com" onChange={handleChange} required />

            <label htmlFor="mensaje">Mensaje</label>
            <textarea name="mensaje" id="mensaje" placeholder="escribe tu mensaje aquí..." onChange={(e) => handleChange(e)} required >

            </textarea>

            <Boton onClick={recogerDatos}>Enviar</Boton>
        </form>
        </>
    )

}