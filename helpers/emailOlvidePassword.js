import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const emailOlvidePassword = async (datos) => {
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
        subject: "Reestablece tu password en tu cuenta en APV", //Asunto del email
        text: "Reestablece tu password en tu cuenta en APV", //Texto del email
        html: `
            <p> Hola ${nombre}, has solicitado reestablecer tu password <apv@correo.com></p>
            <p> Sigue el siguiente enlace para reestablecer tu password:
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer password</a></p>
            <p>Si tu no creaste esta cuenta puedes ignorar este mensaje</p>
        `
    });

    console.log("Mensaje enviado: %s", info.messageId);
    
    
}

export default emailOlvidePassword;