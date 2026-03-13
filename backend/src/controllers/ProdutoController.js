// backend/src/controllers/ProdutoController.js
const Produto = require('../models/Produto');

// ========================================================
// FUNÇÃO 1: LISTAR PRODUTOS (Envia as peças para o site)
// ========================================================
exports.listarProdutos = async (req, res) => {
    try {
        // Busca todos os produtos no banco de dados
        const produtos = await Produto.find();
        res.status(200).json(produtos);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar produtos' });
    }
};

// ========================================================
// FUNÇÃO 2: POPULAR BANCO (A que vamos chamar pelo Apidog)
// ========================================================
exports.popularBancoIncial = async (req, res) => {
    try {
        // Limpa o banco de dados atual para não haver produtos duplicados
        await Produto.deleteMany({}); 

        const pecasIniciais = [
            // OS 4 PRIMEIROS (PROMOÇÃO DE -15%)
            {
                codigo: "000001",
                nome: "Correia — Reposição Rápida",
                preco: 250.00,
                imagem: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/frontend/Assets/Images/8PK1930GOOD_02.webp",
                categoria: "Correias",
                marca: "Massey Ferguson"
            },
            {
                codigo: "000002",
                nome: "Disco de Embreagem 330mm",
                preco: 560.00,
                imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Clutch_disc.jpg/640px-Clutch_disc.jpg",
                categoria: "Engrenagens",
                marca: "Mahle"
            },
            {
                codigo: "000003",
                nome: "Filtro de Ar Massey — Alta Eficiência",
                preco: 180.00,
                imagem: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/frontend/Assets/Images/filtro_ar_trator_massey_ant_292_295_296_610_620_640_jogo_1081_1_00686a861dfc45d1cf5521491040ea81_20240528141146.webp",
                categoria: "Filtros",
                marca: "Massey Ferguson"
            },
            {
                codigo: "000004",
                nome: "Turbina Original Mahle",
                preco: 2150.00,
                imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Turbocharger.jpg/640px-Turbocharger.jpg",
                categoria: "Acessórios em Geral",
                marca: "Mahle"
            },

            // RESTANTES (DESCONTO PIX DE 5%)
            {
                codigo: "100001",
                nome: "Filtro de Óleo",
                preco: 150.00,
                imagem: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/frontend/Assets/Images/download.jpeg",
                categoria: "Filtros",
                marca: "Mahle"
            },
            {
                codigo: "100002",
                nome: "Kit Manutenção de Motor 229",
                preco: 950.00,
                imagem: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/frontend/Assets/Images/pecas-para-tratores-kit-manutencao-motor-229-4-cilindros-aspirado-p-1739990766956.png",
                categoria: "Acessórios em Geral",
                marca: "Massey Ferguson"
            },
            {
                codigo: "100003",
                nome: "Engrenagem de Tração Trator MF",
                preco: 820.00,
                imagem: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/frontend/Assets/Images/engrenagem_satelite_27_d_tracao_trator_mf_660_680_036420r1_1881_1_27082a9123eabe425be96e622170ffd7.webp",
                categoria: "Engrenagens",
                marca: "Massey Ferguson"
            },
            {
                codigo: "100004",
                nome: "Bomba Injetora New Holland",
                preco: 3500.00,
                imagem: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/frontend/Assets/Images/bomba-injetora-trator-new-holland-7610-dps-ano-inicial-1992-ano-final-motor-fnh-268-cu-in-codigo-montadora-esnn9a543va-0d8e4a0a.webp",
                categoria: "Bombas e Hidráulico",
                marca: "New Holland"
            },
            {
                codigo: "100005",
                nome: "Rolamento Esférico de Alta Carga",
                preco: 120.00,
                imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Ball_bearing.jpg/640px-Ball_bearing.jpg",
                categoria: "Acessórios em Geral",
                marca: "Mahle"
            },
            {
                codigo: "100006",
                nome: "Motor de Partida 12V",
                preco: 1200.00,
                imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Starter_motor_with_solenoid.jpg/640px-Starter_motor_with_solenoid.jpg",
                categoria: "Acessórios em Geral",
                marca: "New Holland"
            },
            {
                codigo: "100007",
                nome: "Alternador de Alta Potência",
                preco: 890.00,
                imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Alternator_1.jpg/640px-Alternator_1.jpg",
                categoria: "Acessórios em Geral",
                marca: "Massey Ferguson"
            },
            {
                codigo: "100008",
                nome: "Bomba de Água Trator Linha Pesada",
                preco: 450.00,
                imagem: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Water_pump_1.jpg/640px-Water_pump_1.jpg",
                categoria: "Bombas e Hidráulico",
                marca: "New Holland"
            }
        ];

        await Produto.insertMany(pecasIniciais);
        res.status(201).json({ mensagem: "Catálogo de peças renovado com 12 produtos reais!" });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao popular banco de dados." });
    }
};