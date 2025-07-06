import dbPromise from '../db/database.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import transporter from '../middlewares/nodemailer.js';
export default async function registerUser(req, res) {
    const { usuario, email, password } = req.body;
    const imagen = req.file ? req.file.filename : null;
    if (!usuario || !email || !password) {
        return res.status(400).json({ status: 400, body: { error: 'Faltan campos requeridos' } });
    }
    const hash = await bcrypt.hash(password, 10); // Encriptar la contraseña
    const tokenVerificacion = crypto.randomBytes(32).toString("hex"); // 🔥 token aleatorio
    const verificado = 0;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: `${email}`,
        subject: `Cuenta creada exitosamente`,
        text: 'Contenido del correo en texto plano',
        html: `
        <h1>Bienvenido a tuCurso.com, <strong>${usuario}</strong> </h1>
        <h3>Haz clic en el siguiente enlace para verificar tu cuenta</h3>
        <a href=http://localhost:3000/api/verificarUsuario/${tokenVerificacion}>Verificar cuenta</a>
        <p>Si ya está verificada, inicia sesión <a href='http://localhost:5173/login'>aquí</a><p>
        `
    };
    try {
        const db = await dbPromise;
        const usuario_existente = await db.get(`SELECT * FROM usuarios WHERE email = ?`, [email]);
        const usuario_existente2 = await db.get(`SELECT * FROM usuarios WHERE usuario = ?`, [usuario]);
        if (usuario_existente || usuario_existente2) {
            return res.status(409).json({ status: 409, body: { error: 'El correo o usuario ya existen en nuestra base de datos.' } });
        }
        await db.run(`INSERT INTO usuarios (usuario, email, password, imagen, verificado, token_verificacion) VALUES (?, ?, ?, ?, ?, ?)`, [usuario, email, hash, imagen, verificado, tokenVerificacion]);
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Correo enviado: ' + info.response);
        });
        return res.status(201).json({ status: 201, body: { message: 'Cuenta creada exitosamente' } });
    }
    catch (err) {
        console.error('DB error:', err);
        return res.status(500).json({ status: 500, body: { error: 'Error al registrar usuario' } });
    }
}
