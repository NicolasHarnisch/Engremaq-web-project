// backend/src/controllers/ProdutoController.js
const Produto = require('../models/Produto');

// Retorna todos os produtos para o Front-end
exports.listarProdutos = async (req, res) => {
    try {
        const produtos = await Produto.find();
        res.status(200).json(produtos);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar produtos.' });
    }
};

// Um "Quebra-galho" para colocar os seus 6 produtos iniciais no banco com 1 clique
exports.popularBancoIncial = async (req, res) => {
    try {
        const produtosIniciais = [
            { codigo: "100001", nome: "Filtro de Óleo", preco: 150.00, categoria: "filtros", marca: "mahle", imagem: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/frontend/Assets/Images/download.jpeg" },
            { codigo: "100003", nome: "Engrenagem de Tração Trator MF", preco: 820.00, categoria: "engrenagens", marca: "massey", imagem: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/frontend/Assets/Images/engrenagem_satelite_27_d_tracao_trator_mf_660_680_036420r1_1881_1_27082a9123eabe425be96e622170ffd7.webp" },
            { codigo: "000001", nome: "Correia de Reposição", preco: 250.00, categoria: "correias", marca: "multimarca", imagem: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/frontend/Assets/Images/8PK1930GOOD_02.webp" },
            { codigo: "100004", nome: "Bomba Injetora New Holland", preco: 3500.00, categoria: "bombas", marca: "newholland", imagem: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/frontend/Assets/Images/bomba-injetora-trator-new-holland-7610-dps-ano-inicial-1992-ano-final-motor-fnh-268-cu-in-codigo-montadora-esnn9a543va-0d8e4a0a.webp" },
            { codigo: "000002", nome: "Peça Metálica Linha Pesada", preco: 450.00, categoria: "acessorios", marca: "multimarca", imagem: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/frontend/Assets/Images/images.jpeg" },
            { codigo: "000003", nome: "Filtro de Ar Massey", preco: 180.00, categoria: "filtros", marca: "massey", imagem: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/frontend/Assets/Images/filtro_ar_trator_massey_ant_292_295_296_610_620_640_jogo_1081_1_00686a861dfc45d1cf5521491040ea81_20240528141146.webp" }
        ];
        
        // Limpa tudo e insere os novos
        await Produto.deleteMany({});
        await Produto.insertMany(produtosIniciais);
        res.status(200).json({ mensagem: 'As suas peças foram adicionadas ao MongoDB com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao popular banco.' });
    }
};