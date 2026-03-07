// backend/src/controllers/AuthController.js
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer'); // <--- ADICIONE ESTA LINHA
const jwt = require('jsonwebtoken');

// backend/src/controllers/AuthController.js


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ==========================================
// Função de Login Real
// ==========================================
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        const usuario = await Usuario.findOne({ email });
        if (!usuario) return res.status(404).json({ erro: 'E-mail não encontrado. Crie uma conta primeiro.' });

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) return res.status(401).json({ erro: 'Senha incorreta.' });

        // GERA O TOKEN DE SEGURANÇA (Válido por 7 dias)
        const token = jwt.sign({ id: usuario._id, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ 
            mensagem: 'Login efetuado com sucesso!',
            token: token, // Envia o token para o Front-end
            usuario: { nome: usuario.nome, email: usuario.email }
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
};


exports.registrar = async (req, res) => {
    try {
        const { nome, email, cpf, telefone, senha } = req.body;

        // 1. Verifica se o utilizador já existe no banco
        const usuarioExiste = await Usuario.findOne({ $or: [{ email }, { cpf }] });
        if (usuarioExiste) {
            return res.status(400).json({ erro: 'Este E-mail ou CPF já está cadastrado!' });
        }

        // 2. Criptografa a palavra-passe
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        // 3. Cria o novo utilizador com a senha protegida
        const novoUsuario = new Usuario({
            nome,
            email,
            cpf,
            telefone,
            senha: senhaCriptografada
        });

        // 4. Salva na nuvem (MongoDB Atlas)
        await novoUsuario.save();

        res.status(201).json({ mensagem: 'Conta criada com sucesso!' });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
};

// Função Inteligente: Gera código, personaliza o e-mail e aplica o limite de 2 minutos
exports.solicitarCodigoSeguranca = async (req, res) => {
    try {
        const { email, acao } = req.body;
        const usuario = await Usuario.findOne({ email });

        if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' });

        // SISTEMA DE PROTEÇÃO: COOLDOWN DE 2 MINUTOS
        if (usuario.ultimoEnvioCodigo) {
            const tempoPassado = Date.now() - usuario.ultimoEnvioCodigo.getTime();
            const doisMinutos = 2 * 60 * 1000;

            if (tempoPassado < doisMinutos) {
                const segundosRestantes = Math.ceil((doisMinutos - tempoPassado) / 1000);
                return res.status(429).json({ 
                    erro: `Aguarde ${segundosRestantes} segundos para solicitar um novo código.` 
                });
            }
        }

        const codigo = Math.floor(100000 + Math.random() * 900000).toString();
        usuario.codigoExclusao = codigo; 
        usuario.expiracaoCodigo = Date.now() + 10 * 60 * 1000;
        usuario.ultimoEnvioCodigo = Date.now(); // Marca a hora exata deste envio
        await usuario.save();

        // INTELIGÊNCIA DO E-MAIL: Muda o texto dependendo de onde o botão foi clicado
        let assunto = 'Engremaq - Código de Segurança';
        let textoAcao = 'uma solicitação de segurança';

        if (acao === 'excluir') {
            assunto = 'Engremaq - Código para Exclusão de Conta';
            textoAcao = 'um pedido para excluir permanentemente a sua conta';
        } else if (acao === 'email') {
            assunto = 'Engremaq - Código para Alterar E-mail';
            textoAcao = 'um pedido para alterar o seu endereço de e-mail';
        } else if (acao === 'senha') {
            assunto = 'Engremaq - Código para Alterar Senha';
            textoAcao = 'um pedido para alterar a sua senha de acesso';
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: assunto,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; text-align: center; padding: 20px;">
                    <h2 style="color: #d4a000;">Olá, ${usuario.nome.split(' ')[0]}</h2>
                    <p>Recebemos ${textoAcao}.</p>
                    <p>O seu código de verificação é:</p>
                    <h1 style="letter-spacing: 5px; color: #111; background: #eee; padding: 10px; display: inline-block; border-radius: 8px;">${codigo}</h1>
                    <p style="font-size: 12px; color: #777;">Este código expira em 10 minutos. Se você não solicitou esta ação, por favor, ignore este e-mail.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ mensagem: 'Código enviado com sucesso!' });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao enviar o código.' });
    }
};

// Função 2: Verifica o código e apaga a conta do banco
exports.confirmarExclusao = async (req, res) => {
    try {
        const { email, codigo } = req.body;
        const usuario = await Usuario.findOne({ email });

        if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' });

        // Verifica se o código bate e se não expirou
        if (usuario.codigoExclusao !== codigo) {
            return res.status(400).json({ erro: 'Código incorreto.' });
        }
        if (usuario.expiracaoCodigo < Date.now()) {
            return res.status(400).json({ erro: 'O código expirou. Solicite um novo.' });
        }

        // Se tudo estiver certo, apaga o cliente da base de dados!
        await Usuario.findByIdAndDelete(usuario._id);
        
        res.status(200).json({ mensagem: 'Conta excluída com sucesso!' });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao excluir a conta.' });
    }
};


// 1. Apenas verifica se o código está certo (usado para liberar a próxima tela do modal)
exports.verificarCodigo = async (req, res) => {
    try {
        const { email, codigo } = req.body;
        const usuario = await Usuario.findOne({ email });

        if (!usuario || usuario.codigoExclusao !== codigo || usuario.expiracaoCodigo < Date.now()) {
            return res.status(400).json({ erro: 'Código incorreto ou expirado.' });
        }
        res.status(200).json({ mensagem: 'Código válido!' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao verificar o código.' });
    }
};

// 2. Altera o E-mail de fato
exports.alterarEmail = async (req, res) => {
    try {
        const { emailAtual, novoEmail, codigo } = req.body;
        const usuario = await Usuario.findOne({ email: emailAtual });

        if (!usuario || usuario.codigoExclusao !== codigo) {
            return res.status(400).json({ erro: 'Autenticação falhou.' });
        }

        usuario.email = novoEmail;
        usuario.codigoExclusao = null; // Limpa o código por segurança
        await usuario.save();

        res.status(200).json({ mensagem: 'E-mail atualizado!' });
    } catch (erro) {
        // Erro 11000 no MongoDB significa que o e-mail já está a ser usado por outra pessoa
        if (erro.code === 11000) return res.status(400).json({ erro: 'Este e-mail já está em uso.' });
        res.status(500).json({ erro: 'Erro ao alterar e-mail.' });
    }
};

// 3. Altera a Senha de fato
exports.alterarSenha = async (req, res) => {
    try {
        const { email, novaSenha, codigo } = req.body;
        const usuario = await Usuario.findOne({ email });

        if (!usuario || usuario.codigoExclusao !== codigo) {
            return res.status(400).json({ erro: 'Autenticação falhou.' });
        }

        // Criptografa a nova senha antes de salvar
        const salt = await bcrypt.genSalt(10);
        usuario.senha = await bcrypt.hash(novaSenha, salt);
        usuario.codigoExclusao = null; // Limpa o código
        await usuario.save();

        res.status(200).json({ mensagem: 'Senha atualizada com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao alterar senha.' });
    }
};