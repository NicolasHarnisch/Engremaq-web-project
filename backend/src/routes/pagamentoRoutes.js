const express = require('express');
const router = express.Router();
const PagamentoController = require('../controllers/PagamentoController');

// O erro estava aqui! O nome deve ser 'gerarPagamento'
router.post('/pagamento/pix', PagamentoController.gerarPagamento);

module.exports = router;