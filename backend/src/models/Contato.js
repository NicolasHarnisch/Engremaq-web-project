const mongoose = require('mongoose');

const contatoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true },
    assunto: { type: String },
    mensagem: { type: String, required: true },
    lido: { type: Boolean, default: false } // Para saberes se já respondeste
}, { timestamps: true }); // Guarda automaticamente a data e hora do envio

module.exports = mongoose.model('Contato', contatoSchema);