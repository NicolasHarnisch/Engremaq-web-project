const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
    codigo: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    preco: { type: Number, required: true },
    imagem: { type: String, required: true },
    categoria: { type: String, required: true },
    marca: { type: String, required: true },
    estoque: { type: Number, default: 10 },
    descricao: { type: String },
    // NOVOS CAMPOS PARA O FRETE (Obrigatórios para o Melhor Envio)
    peso: { type: Number, default: 1 }, // Em Kg
    altura: { type: Number, default: 10 }, // Em cm
    largura: { type: Number, default: 15 }, // Em cm
    comprimento: { type: Number, default: 20 } // Em cm
}, { timestamps: true });

module.exports = mongoose.model('Produto', produtoSchema);