// backend/src/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares de Segurança e Formatação
app.use(cors()); // Permite que o seu frontend HTML comunique com este backend
app.use(express.json()); // Permite ler os dados do carrinho (JSON)

// ==========================================
// ROTAS DA API REST
// ==========================================

// Rota de Teste de Vida
app.get('/api/status', (req, res) => {
    res.json({ status: "Online", mensagem: "Servidor Engremaq está a rodar perfeitamente! 🚜" });
});

// Rota de Checkout (A receber dados do Frontend)
app.post('/api/checkout', (req, res) => {
    const { metodoPagamento, carrinho, valorTotal } = req.body;
    
    console.log("🛒 NOVO PEDIDO RECEBIDO!");
    console.log("Método:", metodoPagamento);
    console.log("Total: R$", valorTotal);
    
    // Aqui no futuro chamaremos o Prisma para salvar no PostgreSQL 
    // e o SDK do Mercado Pago para gerar o PIX/Boleto.

    res.json({ 
        sucesso: true, 
        mensagem: "Pedido processado com sucesso!",
        numero_pedido: Math.floor(10000000 + Math.random() * 90000000)
    });
});

// Ligar o motor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API da Engremaq iniciada na porta ${PORT}`);
    console.log(`🔗 Teste no navegador: http://localhost:${PORT}/api/status`);
});