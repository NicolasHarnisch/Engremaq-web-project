// backend/src/models/Usuario.js
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    cpf: { type: String, required: true, unique: true },
    telefone: { type: String, required: true },
    senha: { type: String, required: true },
    ultimoEnvioCodigo: { type: Date, default: null }, // <-- ADICIONE ESTA LINHA AQUI
    
    // NOVOS CAMPOS PARA EXCLUSÃO DA CONTA
    codigoExclusao: { type: String, default: null },
    expiracaoCodigo: { type: Date, default: null },
    
    papel: { type: String, default: 'cliente' }
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);