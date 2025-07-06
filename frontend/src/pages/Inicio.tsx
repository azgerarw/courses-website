import { GiBookmarklet } from "react-icons/gi";

export default function Inicio() {
 
  

  return (
    <>
      <div className='h-[70%] w-full flex flex-col gap-4 items-center '>
          
          <div className='relative h-fit w-fit animate-spinY m-auto'>
          <GiBookmarklet className='text-[250px] block m-auto' />
          <h3 className="text-[1.3em] text-blue-100 absolute z-5 left-[44%] top-[27%] rotate-310">tuCurso.com</h3>
          </div>
        
      </div>
      <div className="h-10 w-full whitespace-nowrap overflow-hidden  mt-[20px]">
        
          <div className={'animate-marquee h-fit'} data-cy="inicio-marquee">
            <span className='marketing'>clases grabadas por si te saltas alguna </span>
            <span className='marketing'>precio competitivo </span>
            <span className='marketing'>más de 1000 alumnos han completado nuestros cursos </span>
            <span className='marketing'>más de 20 docentes</span>
            <span className='marketing'>5 escuelas en todo el país </span>

           <span className='marketing'>clases grabadas por si te saltas alguna </span>
            <span className='marketing'>precio competitivo </span>
            <span className='marketing'>más de 1000 alumnos han completado nuestros cursos </span>
            <span className='marketing'>más de 20 docentes</span>
            <span className='marketing'>5 escuelas en todo el país </span>
            
          </div>
      
      </div>
    </>
  );
}
