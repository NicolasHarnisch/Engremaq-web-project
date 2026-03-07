const Contato = require('../models/Contato'); // Importa o novo model
const nodemailer = require('nodemailer');

exports.enviarMensagem = async (req, res) => {
    try {
        const { nome, email, assunto, mensagem } = req.body;

        // 1. SALVAR NA BASE DE DADOS (Backup)
        const novoContato = new Contato({ nome, email, assunto, mensagem });
        await novoContato.save();

        // 2. CONFIGURAR E ENVIAR O E-MAIL
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `NOVO CONTACTO SITE: ${assunto || 'Dúvida Geral'}`,
            text: `Recebeu uma nova mensagem!\n\nNome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${mensagem}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, mensagem: 'Mensagem guardada e e-mail enviado!' });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ success: false, erro: 'Erro ao processar o contacto.' });
    }
};