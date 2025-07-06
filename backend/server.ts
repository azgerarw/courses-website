import xss from 'xss-clean'
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import configurePassport from './middlewares/passport.js';
import morgan from 'morgan';
import fs from 'fs';

import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { swaggerSpec, swaggerUi } from './middlewares/swagger.js';

import perfilRoute from './routes/perfil.js';
import cursosRoute from './routes/cursos.js';
import inscripcionesRoute from './routes/inscripciones.js';
import feedbackRoute from './routes/feedback.js';
import registerRoute from './routes/register.js';
import loginRoute from './routes/login.js';
import logoutRoute from './routes/logout.js';
import verificarRoute from './routes/verificarUsuario.js';
import restablecerRoute from './routes/restablecerPassword.js';
import usuariosRoute from './routes/usuarios.js';
import contactoRoute from './routes/contacto.js';
import mensajesRoute from './routes/mensajes.js';
import mensajeriaRoute from './routes/mensajeria.js';

import adminContactoRoute from './admin-api/admin-contacto.js'
import adminCursosRoute from './admin-api/admin-cursos.js'

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
// seguridad 

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 3,
  statusCode: 429,
  message: {
    error: 'Demasiadas solicitudes desde esta IP. Intenta de nuevo en un minuto.',
  },
  standardHeaders: true,
  legacyHeaders: true,
});

const isDev = process.env.NODE_ENV !== 'production';

app.use(helmet({
  contentSecurityPolicy: isDev
      ? false // Desactivamos CSP en desarrollo para evitar bloqueos de fuentes, scripts locales, etc.
      :
   {
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "data:", "blob:", "http://localhost:3000", "https://*"],
      "default-src": ["'self'"],
      "script-src": ["'self'"], // cuidado con estos en prod
      "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
  exposedHeaders: ['Content-Range']
}));

app.use(xss());

app.use(express.json());


// morgan

const logStream = fs.createWriteStream(path.join('logs', 'access.log'), { flags: 'a' });

app.use(morgan('combined', { stream: logStream }));

// passport 
configurePassport(passport);
app.use(passport.initialize());

// Servir archivos subidos
app.use('/uploads', express.static('uploads'));


// API

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API pública
app.use('/api/register', registerRoute);

if (process.env.NODE_ENV !== 'test') {
  app.use('/api/login', limiter, loginRoute); // 👈 Solo en producción/desarrollo
} else {
  app.use('/api/login', loginRoute);
}
app.use('/api/logout', logoutRoute);
app.use('/api/perfil', perfilRoute);
app.use('/api/cursos', cursosRoute);
app.use('/api/usuarios', usuariosRoute);
app.use('/api/inscripciones', inscripcionesRoute);
app.use('/api/feedback', feedbackRoute);
app.use('/api/verificarUsuario', verificarRoute);
app.use('/api/restablecerPassword', restablecerRoute);
app.use('/api/contacto', contactoRoute);
app.use('/api/mensajes', mensajesRoute);
app.use('/api/mensajeria', mensajeriaRoute);


// API privada para el panel de administración
app.use('/api/admin-contacto', adminContactoRoute);
app.use('/api/admin-cursos', adminCursosRoute);

// Frontend
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));


app.get('/*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});




const PORT = process.env.PORT;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

export default app;
