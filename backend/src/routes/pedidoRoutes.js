// backend/src/routes/pedidoRoutes.js
const express = require('express');
const router = express.Router();
const PedidoController = require('../controllers/PedidoController');

// Rota para criar um novo pedido (quando o cliente finaliza a compra)
router.post('/pedidos', PedidoController.criarPedido);

// Rota para listar os pedidos de um cliente específico (para mostrar no Dashboard)
router.get('/pedidos/:email', PedidoController.listarPedidosUsuario);

module.exports = router;