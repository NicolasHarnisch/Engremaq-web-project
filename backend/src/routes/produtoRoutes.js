const express = require('express');
const router = express.Router();
const ProdutoController = require('../controllers/ProdutoController');

// Listar produtos
router.get('/produtos', ProdutoController.listarProdutos);

// Popular banco (rota para teste no Apidog/Postman)
router.post('/produtos/popular', ProdutoController.popularBancoIncial);

// ESTA LINHA É A MAIS IMPORTANTE:
module.exports = router;