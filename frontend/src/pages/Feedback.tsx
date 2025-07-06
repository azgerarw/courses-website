import Boton from '../components/boton';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { CiStar } from "react-icons/ci";
import { RxDoubleArrowDown } from "react-icons/rx";
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import EmojiPicker from 'emoji-picker-react';

type EmojiData = {
    emoji: string;
} 

type Review = {
    id?: number;
    autor?: string;
    voto?: number;
    descripcion?: string;
}

export default function Feedback() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    

    const [mensaje, setMensaje] = useState<string>();
     const [mostrarPicker, setMostrarPicker] = useState(false);

    const onEmojiClick = (emojiData: EmojiData) => {
        setMensaje(prev => prev + emojiData.emoji);
    };
    /* creación de reseñas starts*/
    const [formData, setFormData] = useState<Review>({});


    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'descripcion') {
            setMensaje(value); // controlamos el textarea con mensaje 
            
                       
        } else {
            setFormData(prev => ({ ...prev, [name]: name === 'voto' ? parseInt(value) : value }));
        }
        
    };


    const recogerDatos = async () => {
            
            try {
        
            const res = await fetch('/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                voto: formData.voto,
                descripcion: mensaje,
                
            }),
            });
            
            setMensaje('');
            setFormData({});


            const result = await res.json();
            if(result.ok) {
            alert(result.message)
            navigate('/Feedback');
            } else {
                let cadenaErrores: string[] = [];

                if (result.error.errors){
                        
                    result.error.errors.forEach((e: any) => {
                        
                        cadenaErrores.push(` ${e.msg}`)
                    })
                    
                    return alert(cadenaErrores)
                } else {
                    alert(result.error)
                }
            }
            } catch (err) {
                alert('inicie sesión')
            }
        
    };

    /* creación de reseñas ends */

    /* mostrar reseñas starts */ 
    const [feedback, setFeedback] = useState<Review[]>([]);

    useEffect(() => {

        fetch('/api/feedback')
      .then(res => res.json())
      .then((data: Review[]) => setFeedback(data))
      .catch(err => console.error('Error al cargar la página:', err));
    }, [])

    
    /* mostrar reseñas ends */ 
    return (

        <>
        
        <h2>Publicar una reseña</h2>

        <div className='h-dvh relative z-1'>
            <form onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()} className="w-[300px] h-auto m-auto flex flex-col p-2 gap-2 shadow-[0px_0px_5px_0px_black] justify-start">

            <label htmlFor="voto_select">Votación</label>
            <select className='w-[40px]' id="voto_select" name="voto" onChange={handleChange} value={formData.voto ?? ''}>
                <option value="">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>

            
            <label htmlFor="descripcion">Descripción</label>
            <div className='w-full h-[22px] relative'>
            <span className=' h-[22px] p-0 cursor-pointer absolute border-b-1 left-0 border-b-blue-800 ' onClick={() => setMostrarPicker(!mostrarPicker)} title='emojis'>😊</span>
            </div>
            <textarea value={mensaje ?? ''} name="descripcion" id="descripcion" onChange={handleChange}></textarea>
            
            <Boton onClick={recogerDatos}>Publicar</Boton>

            </form>
            {mostrarPicker && <EmojiPicker className='absolute z-10 -top-[300px] left-[65%]' onEmojiClick={onEmojiClick} />}
            <div className='mt-[50px] flex flex-col justify-center items-center gap-2'>
                <a href="#feedback">Ver todas las Reseñas haz clic sobre la flecha.</a>
                <a href="#feedback"><RxDoubleArrowDown className='icon animate-bounce mt-3' title='ver todas las reseñas' /></a>
            </div>
        </div>

        <div className="w-full h-auto flex flex-row flex-wrap gap-5 justify-center items-center mb-[40px]" id="feedback">
            
           {feedback.map(r => (
                <div key={r.id}>
                   <div className='w-[400px] h-[200px] shadow-[0px_0px_5px_0px_black] p-3 dark:bg-gray-800'>
                        <p >{r.autor}</p>
                        <div className='border-b-1 border-black  flex flex-row gap-2 justify-center items-center my-2 pb-2 dark:border-white'>
                            {Array.from({ length: r.voto ?? 0 }, (_, i) => (
                            <CiStar key={i} className='icon' />
                            ))}
                        </div>
                        <p className='w-full h-[50%] overflow-auto'>{r.descripcion}</p>
                        
                    </div>
                </div>
            ))}
        </div>
        </>

    )

}