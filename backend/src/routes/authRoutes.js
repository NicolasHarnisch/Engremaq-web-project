// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.post('/registrar', AuthController.registrar);
router.post('/login', AuthController.login); // NOVA ROTA AQUI!
router.post('/solicitar-codigo', AuthController.solicitarCodigoSeguranca);
router.post('/confirmar-exclusao', AuthController.confirmarExclusao);
router.post('/verificar-codigo', AuthController.verificarCodigo);
router.post('/alterar-email', AuthController.alterarEmail);
router.post('/alterar-senha', AuthController.alterarSenha);

module.exports = router;

module.exports = router;