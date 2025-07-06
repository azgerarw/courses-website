import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
// Crear el transportador con configuración SMTP de Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Tu correo
        pass: process.env.EMAIL_PASS // Tu contraseña o app password
    }
});
// Opciones del correo
/*const mailOptions = {
  from: 'gerardotestmailer@gmail.com',
  to: 'gerardotestmailer@gmail.com',
  subject: 'test nodemailer',
  text: 'Contenido del correo en texto plano',
  html: '<h1>Contenido HTML</h1>'
};

// Enviar el correo
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Correo enviado: ' + info.response);
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error en la conexión SMTP:', error);
  } else {
    console.log('Servidor listo para enviar correo');
  }
});*/
export default transporter;
