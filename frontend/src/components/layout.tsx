import { Link, Outlet } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from './themeContext';

import { FcFaq } from "react-icons/fc";
import { GiBookshelf, GiNotebook } from "react-icons/gi";

import { MdOutlineReviews, MdContactMail, MdOutlineLocalPostOffice } from "react-icons/md";
import { BsTwitterX, BsLightbulb, BsLightbulbOff } from "react-icons/bs";
import { SlSocialLinkedin, SlSocialYoutube, SlSocialInstagram, SlSocialFacebook } from "react-icons/sl";
import { FaTiktok, FaHome } from "react-icons/fa";
import { HiOutlineUser } from "react-icons/hi";
import { CiMinimize1, CiMaximize1 } from "react-icons/ci";
import { RiLogoutBoxLine, RiLoginBoxLine } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { jwtDecode } from 'jwt-decode';

export default function Layout() {
  const [sidebarstatus, setSidebarstatus] = useState(true);
  
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const boton_sidebar = sidebarstatus ? <CiMinimize1 className='icon' title="minimizar" /> : <CiMaximize1 className='icon' title="maximizar" />;

  const [noLeidos, setNoleidos] = useState([]);

  const toggleSidebar = () => {
    setSidebarstatus(!sidebarstatus);
  };

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
 

  const handleLogout = async () => {
  try {
    await fetch('/api/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  } catch (error) {
    console.error('Error al registrar logout:', error);
  }

  localStorage.removeItem('token');
  alert('Sesión cerrada');
  navigate('/login');
};

  const actualizarNoLeidos = () => {

          const token = localStorage.getItem('token');
          
        if (token) {
          const decoded: { id?: String } = jwtDecode(token ?? '');
          
          const usuario = decoded.id;
        fetch(`/api/mensajes/no-leidos/${usuario}`)
          .then(res => res.json())
          .then(data => setNoleidos(data))
          .catch(err => console.error('Error al cargar la página:', err));
      }
   };

  useEffect(() => {

    actualizarNoLeidos();
  
  }, []);
    


    return (
      <div className='dark:bg-black'>
        <header >
          
          <nav className='flex items-center w-[92%] m-auto p-0'>
              <Link to="/"><FaHome className='icon' /></Link>
            <ul className='flex list-none justify-end w-full gap-5'>
              
            {token ? (
              <>
              <li className='relative'>
              <Link to="/Mensajeria"><MdOutlineLocalPostOffice className='icon' title="mensajes privados"/></Link>
              {noLeidos.length > 0 ? <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              {noLeidos.length}</span> : ''} 
              </li>
              <li><Link to="/Perfil"><HiOutlineUser className='icon' title="perfil" /></Link></li>
              <li><Link to="/"><RiLogoutBoxLine onClick={handleLogout} className='icon' title='cerrar sesión' /></Link></li>
              {darkMode ? <BsLightbulb onClick={toggleTheme} className='icon m' title='modo claro' /> : <BsLightbulbOff onClick={toggleTheme} className='icon m' title='modo oscuro' />}
              </>
            ) : (
              <>
              <li><Link to="/Login"><RiLoginBoxLine className='icon' title='iniciar sesión' /></Link></li>
              {darkMode ? <BsLightbulb onClick={toggleTheme} className='icon m' title='modo claro' /> : <BsLightbulbOff onClick={toggleTheme} className='icon m' title='modo oscuro' />}
              
              </>
            )}
              
            </ul>
            
          </nav>
        </header>
        <div className='flex flex-row justify-center items-stretch flex-1 width-full '>
          <aside className="w-[15%] content-center flex h-dvh z-3 sticky left-0 top-6">
          <button onClick={toggleSidebar} className={` bg-blue-100 absolute h-7 w-7 top-12 font-bold ${sidebarstatus ? '-right-3' : 'left-11'}`}>{boton_sidebar}</button>
            <div className="w-15 border-r border-blue-800 dark:border-white">
            <ul className='flex flex-col h-full justify-center items-center m-0 p-0 gap-4'>
              
                <li><Link to="/Cursos"><GiBookshelf className='icon' title="cursos" /></Link></li>
                <li><Link to="/Inscripciones"><GiNotebook className='icon' title="inscripciones" /></Link></li>                
                <li><Link to="Faq"><FcFaq className='icon' title="preguntas frecuentes" /></Link></li>
                <li><Link to="/Usuarios"><FaUsers className='icon' title="usuarios" /></Link></li>
                
                <li><Link to="/Feedback"><MdOutlineReviews className='icon' title="reseñas" /></Link></li>
                <li><Link to="/Contacto"><MdContactMail className='icon' title="formulario de contacto" /></Link></li>
              </ul>
            </div>
            <div className={`w-full border-r border-blue-800 ${sidebarstatus ? '' : 'hidden'} dark:border-white`}>
              <ul className='flex flex-col h-full justify-center items-center m-0 p-0 gap-4 list-none'>
                <li className='li-hover-style'><Link to="Cursos">Cursos</Link></li>
                <li className='li-hover-style'><Link to="Inscripciones">Inscripciones</Link></li>                
                <li className='li-hover-style'><Link to="Faq">FAQ</Link></li>
                <li className='li-hover-style'><Link to="Usuarios">Usuarios</Link></li>
                
                <li className='li-hover-style'><Link to="Feedback">Reseñas</Link></li>
                <li className='li-hover-style'><Link to="Contacto">Contacto</Link></li>
              </ul>
            </div>
          </aside>       
        <main className='text-center min-h-dvh content-center w-[70%] flex-1'>
          <Outlet context={{ actualizarNoLeidos }} />
        </main>
        <aside className='w-[15%]'></aside> 
        </div>
        <footer className='bg-black text-center color-white w-dvw h-48 content-center z-5 flex flex-col gap-3 justify-center dark:border-white border-t-1'>
          <small className='text-white'>Síguenos en nuestras redes sociales</small>
          
          <ul className="flex flex-row justify-center items-center gap-2 p-0">
            <li>
              <Link to='/'><SlSocialFacebook className='icon' title="facebook" /></Link>
            </li>
            <li>
              <Link to='/'><SlSocialInstagram className='icon' title="instagram" /></Link>
            </li>
            <li>
              <Link to='/'><BsTwitterX className='icon' title="twitter" /></Link>
            </li>
            <li>
              <Link to='/'><FaTiktok className='icon' title="tiktok" /></Link>
            </li>
            <li>
              <Link to='/'><SlSocialLinkedin className='icon' title="linkedIn" /></Link>
            </li>
            <li>
              <Link to='/'><SlSocialYoutube className='icon' title="youtube" /></Link>
            </li>
          </ul>
        </footer>
      </div>
    );
  }