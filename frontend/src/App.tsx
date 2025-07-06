import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout';
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Register from './pages/Register';
import Perfil from './pages/Perfil';
import Cursos from './pages/Cursos';
import Inscripciones from './pages/Inscripciones';
import Feedback from './pages/Feedback';
import Verificado from './pages/Verificado';
import RestablecerPassword from './pages/RestablecerPassword';
import RestablecerPasswordLink from './pages/RestablecerPasswordLink';
import Usuarios from './pages/Usuarios';
import Contacto from './pages/Contacto';
import Faq from './pages/Faq';
import Chatprivado from './pages/Chatprivado';
import Mensajeria from './pages/Mensajeria';
import { ThemeContext } from './components/themeContext';
import { useContext, useEffect } from 'react';
import { Admin, Resource } from 'react-admin';
import customDataProvider from './react-admin/dataprovider/dataprovider';
import { CursoList } from './react-admin/cursos-panel';
import { ContactoList, ContactoCreate, ContactoEdit } from './react-admin/contacto-panel'
import authProvider from './react-admin/authprovider/authprovider';
// src/main.jsx


export default function App() {
  
  const { darkMode } = useContext(ThemeContext);
  

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);

  return (
    <>
      
      <BrowserRouter>
          <Routes>
              <Route path="/admin/*" element={
                <Admin basename="/admin" dataProvider={customDataProvider} authProvider={authProvider}>
                  <Resource  name="admin-cursos"
                  list={CursoList}
                    />
                  <Resource  name="admin-contacto"
                  list={ContactoList}
                  
                  create={ContactoCreate}

                  edit={ContactoEdit}
                    />
                </Admin>
              } />
              <Route path="/" element={<Layout />}>
              <Route index element={<Inicio />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/Perfil" element={<Perfil />} />
              <Route path="/Cursos" element={<Cursos />} />
              <Route path="/Inscripciones" element={<Inscripciones />} />
              <Route path="/Feedback" element={<Feedback />} />
              <Route path="/Verificado" element={<Verificado />} />
              <Route path="/RestablecerPassword" element={<RestablecerPassword />} />
              <Route path="/RestablecerPasswordLink/:token" element={<RestablecerPasswordLink />} />
              <Route path="/Usuarios" element={<Usuarios />} />
              <Route path="/Contacto" element={<Contacto />} />
              <Route path="/Chatprivado/:destinatarioId/:destinatarioUsuario" element={<Chatprivado />} />
              <Route path="/Mensajeria" element={<Mensajeria />} />
              <Route path="/Faq" element={<Faq />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </>
  );
}



