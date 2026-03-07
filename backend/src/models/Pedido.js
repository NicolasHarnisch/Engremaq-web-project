// backend/src/models/Pedido.js
const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    numeroPedido: { type: Number, unique: true },
    cliente: {
        nome: String,
        email: String,
        cpf: String,
        telefone: String
    },
    enderecoEntrega: {
        cep: String,
        rua: String,
        numero: String,
        bairro: String,
        cidade: String,
        uf: String
    },
    itens: [{
        produtoId: String,
        nome: String,
        quantidade: Number,
        preco: Number,
        imagem: String // <--- ADICIONADO PARA O VISUAL DA KABUM
    }],
    pagamento: {
        metodo: String,
        status: { type: String, default: 'AGUARDANDO_PAGAMENTO' }, 
        linkPagamento: String, 
        idTransacaoMP: String
    },
    frete: {
        transportadora: String, 
        valor: Number,
        prazoDias: Number,
        codigoRastreio: String
    },
    totalGeral: Number,
    dataEntrega: Date // <--- ADICIONADO PARA MOSTRAR A PREVISÃO
}, { timestamps: true }); 

module.exports = mongoose.model('Pedido', pedidoSchema);