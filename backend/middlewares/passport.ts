// backend/config/passport.js
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import dbPromise from '../db/database.js';
import dotenv from 'dotenv';
import { PassportStatic } from 'passport';
dotenv.config();


export default function configurePassport(passport: PassportStatic) {
  // Local Strategy para login con usuario y password
  passport.use(
    new LocalStrategy(
      { usernameField: 'usuario', passwordField: 'password' },
      async (usuario, password, done) => {
        try {
          const db = await dbPromise;
          const user = await db.get('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);

          if (!user) return done(null, false, { message: 'Usuario no encontrado' });

          const match = await bcrypt.compare(password, user.password);
          if (!match) return done(null, false, { message: 'Contraseña incorrecta' });

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // JWT Strategy para proteger rutas
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET ?? '', // Usa variable de entorno en producción
      },
      async (jwtPayload, done) => {
        
        try {
          const db = await dbPromise;
          const user = await db.get('SELECT * FROM usuarios WHERE usuario_id = ?', [jwtPayload.id]);

          if (user) return done(null, user);
          return done(null, false);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );
}
