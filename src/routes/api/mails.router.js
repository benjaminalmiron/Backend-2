import express from 'express';



import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.mensajeria' }); 
const emailRouter = express.Router()

const transporter = nodemailer.createTransport({    
    service: 'gmail',    
    host : "stmp.gmail.com",
    port : 587,
    secure: false,
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASSWORD
    } , 
    tls: {
        rejectUnauthorized: false, 
      },
});

emailRouter.get("/", (req, res) => {
    res.render("email");
});

emailRouter.post("/mail", async (req, res) => {
    try {
        const { email, subject, text } = req.body;
        const result = await transporter.sendMail({
            from:`Correo de prueba <{process.env.MAIL}>`,
            to: email,
            subject: "Correo de prueba",
            html:`<div
                <h1>Hola</h1>
                <p>Gracias por tu compra</p>
                <p>Recuerda que tus productos serán enviados a esta dirección: ${email}</p>
            </div>`,
            attachments:[
                {
                    filename: 'example.jpg',
                    path: './src/public/img/example.png',
                    cid: "example"
                }
            ]
        })
        res.status(200).json({message: 'Email sent successfully'}); 
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'An error occurred while sending the email'});
    }
    
    
    })

    export default emailRouter;


// src/views/email.ejs