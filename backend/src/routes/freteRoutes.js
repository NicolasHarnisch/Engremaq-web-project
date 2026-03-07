const express = require('express');
const router = express.Router();
const FreteController = require('../controllers/FreteController');

router.post('/frete/calcular', FreteController.calcularFrete);
module.exports = router;