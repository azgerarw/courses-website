import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
const dbPromise = open({
  filename: './db/database.db',
  driver: sqlite3.Database
});

const db = await dbPromise;

//const imagen = 'c.png'

export function createRandomUser() {
  const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${faker.string.uuid()}`;
  
  return {
    usuario: faker.internet.username(),
    email: faker.internet.email(),
    imagen: avatarUrl, // URL del avatar generada
    password: 'hola1234'
  };
}

const users = faker.helpers.multiple(createRandomUser, {
  count: 1,
});
/*
users.forEach( async u => {
          const db = await dbPromise;
          const hash = await bcrypt.hash(u.password, 10); // Encriptar la contraseña
          const tokenVerificacion = crypto.randomBytes(32).toString("hex"); // 🔥 token aleatorio
          const verificado = 0;
  await db.run(
        `INSERT INTO usuarios (usuario, email, password, imagen, verificado, token_verificacion) VALUES (?, ?, ?, ?, ?, ?)`,
        [u.usuario, u.email, hash, u.imagen, verificado, tokenVerificacion])
})

*/
// Exportamos la promesa para poder usarla en otros archivos
export default dbPromise;