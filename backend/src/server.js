require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// 1. IMPORTAÇÃO DAS ROTAS E CONTROLLERS (Sempre no topo)
const authRoutes = require('./routes/authRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const contatoRoutes = require('./routes/contatoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes'); 
const freteRoutes = require('./routes/freteRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');

const FreteController = require('./controllers/FreteController'); 
const PedidoController = require('./controllers/PedidoController'); // <--- A LINHA MÁGICA QUE FALTAVA!

const app = express();

// 2. MIDDLEWARES
app.use(cors());
app.use(express.json());

// 3. DEFINIÇÃO DAS ROTAS
// Rota de status para teste rápido
app.get('/api/status', (req, res) => {
  res.json({ status: "Online", mensagem: "Servidor operando! 🚜" });
});

// Vinculação dos ficheiros de rota
app.use('/api/auth', authRoutes);
app.use('/api', produtoRoutes);
app.use('/api', contatoRoutes);
app.use('/api', pedidoRoutes); 
app.use('/api', freteRoutes);
app.use('/api', pagamentoRoutes);

// Rotas diretas soltas
app.post('/api/frete/calcular', FreteController.calcularFrete); 
app.put('/api/pedidos/:numero/cancelar', PedidoController.cancelarPedido); // Agora ele sabe quem é o PedidoController!
app.put('/api/pedidos/:numero/aprovar', PedidoController.aprovarPedido);

const PORT = process.env.PORT || 3000;

// 4. FUNÇÃO DE INICIALIZAÇÃO (Base de Dados + Servidor)
async function start() {
  try {
    console.log("🔄 Tentando conectar ao MongoDB Atlas...");

    // Evita que comandos sejam executados sem conexão ativa
    mongoose.set('bufferCommands', false);

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });

    console.log("🟢 CONECTADO COM SUCESSO AO MONGODB ATLAS!");

    app.listen(PORT, () => {
      console.log(`🚀 API da Engremaq iniciada na porta ${PORT}`);
    });

  } catch (err) {
    console.log("🔴 ERRO DE CONEXÃO:");
    console.error(err);
    process.exit(1); 
  }
}

start();