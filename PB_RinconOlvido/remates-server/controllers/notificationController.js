import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mma.ultimates@gmail.com',
        pass: 'yzmesgjxdrzkamhc'
    }
});

// Funcion para enviar correos
export function enviarCorreo(destinatario, asunto, mensaje) {
    const mailOptions = {
        from: 'mma.ultimates@gmail.com',
        to: destinatario,
        subject: asunto,
        text: mensaje
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
        } else {
            console.log('Correo enviado con éxito:', info.response);
        }
    });
}
