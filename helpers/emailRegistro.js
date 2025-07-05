import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const emailRegistro = async (datos) => {
    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
        }
    });

    const {email, nombre, token} = datos;
    //Se envia el email al usuario con el token para confirmar su cuenta
    const info = await transporter.sendMail({
        from: "'APV - Administrador de Pacientes de Veterinaria", //Quien envia el email
        to: email, //A quien se envia el email
        subject: "Comprueba tu cuenta en APV", //Asunto del email
        text: "Confirma tu cuenta en APV", //Texto del email
        html: `
            <p> Hola ${nombre}, comprueba tu cuenta en APV <apv@correo.com></p>
            <p> Tu cuenta ya esta lista solo debes comprobarla en el siguiente enlace:
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a></p>
            <p>Si tu no creaste esta cuenta puedes ignorar este mensaje</p>
        `
    });

    console.log("Mensaje enviado: %s", info.messageId);
    
    
}

export default emailRegistro;