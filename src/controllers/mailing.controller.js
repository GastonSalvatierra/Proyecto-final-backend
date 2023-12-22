import nodemailer from 'nodemailer';
import config from '../config/config.js';
import __dirname from '../utils.js'


const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPassword
    }
})

// verifica si la coxion con transporter esta Ok
/* transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
}) */

function generarEnlaceConExpiracion() {
    const ahora = new Date();
    
    const fechaExpiracion = new Date(ahora.getTime() + 60 * 60 * 1000);
    
    const enlace = `http://localhost:8080/api/recupero/${fechaExpiracion.toISOString()}`;

    return enlace;
}

const mailOptions = {

    from: 'Coder ' + config.gmailAccount,
    to: config.gmailAccount, /**----PONER MAIL DEL USUARIO----**/
    subject: "Correo de prueba CoderHouse Programacion Backend",
    html: `<div>
                <h1>Esto es un test de recupero de clave</h1>

                <button>
                    <a href="${generarEnlaceConExpiracion()}" target="_blank">
                        RESTABLECER CONTRASEÑA
                    </a>
                </button>
                
            </div>`,
    attachments: []
}


const mailOptionsWithAttachments = {
    from: 'Coder ' + config.gmailAccount,
    to: config.gmailAccount,
    subject: "Correo de prueba CoderHouse Programacion Backend clase30",
    html: `<div>
                <h1>Esto es un Test</h1>
                <p>Ahora usando imagenes</p>
                
            </div>`,
}




export const sendEmail = (req, res) => {
    try {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(400).send({ msg: "Error", payload: error })
            }

            console.log('Message sent: %s', info.messageId);
            res.send({ message: 'Success!', payload: info })
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
    }
}






export const sendEmailWithAttachments = (req, res) => {
    try {
        transporter.sendMail(mailOptionsWithAttachments, (error, info) => {
            if (error) {
                console.log(error);
                res.status(400).send({ msg: "Eror", payload: error })
            }

            console.log('Message sent: %s', info.messageId);
            res.send({ message: 'Success!', payload: info })
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
    }
}


export const emailPurchase = ()=>{
    const mailOptionsClient = {
        from: 'Coder ' + config.gmailAccount,
        to: config.gmailAccount, /**----PONER MAIL DEL USUARIO----**/
        subject: "FELICIDADES REALIZASTE TU COMPRA CON EXITO",
        html: `<div>
            <h1>TU PEDIDO YA ESTA EN PREPARACION</h1>                    
        </div>`,
        attachments: []
    };


     const sendEmail2 = (req, res) => {
        try {
            transporter.sendMail(mailOptionsClient, (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(400).send({ msg: "Error", payload: error })
                }
                
                console.log('Message sent: %s', info.messageId);
                res.send({ message: 'Success!', payload: info })
            })
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
        }
    }
    sendEmail2();


}