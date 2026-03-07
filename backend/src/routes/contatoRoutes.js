const express = require('express');
const router = express.Router();
const ContatoController = require('../controllers/ContatoController');

// Rota de envio de mensagem de contacto
router.post('/contato', ContatoController.enviarMensagem);

// ESTA LINHA É A MAIS IMPORTANTE:
module.exports = router;