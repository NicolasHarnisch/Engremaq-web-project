const Pedido = require('../models/Pedido');

exports.criarPedido = async (req, res) => {
    try {
        const { cliente, enderecoEntrega, itens, pagamento, frete, totalGeral, dataEntrega } = req.body;

        // Gera um número de pedido aleatório de 8 dígitos
        const numeroPedido = Math.floor(10000000 + Math.random() * 90000000);

        const novoPedido = new Pedido({
            numeroPedido,
            cliente,
            enderecoEntrega,
            itens,
            pagamento,
            frete,
            totalGeral,
            dataEntrega
        });

        await novoPedido.save();
        res.status(201).json({ success: true, numeroPedido });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ success: false, erro: 'Erro ao criar pedido.' });
    }
};

exports.listarPedidosUsuario = async (req, res) => {
    try {
        const { email } = req.params;
        // Busca os pedidos usando o e-mail que está dentro do objeto "cliente"
        const pedidos = await Pedido.find({ "cliente.email": email }).sort({ createdAt: -1 });
        res.status(200).json(pedidos);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar pedidos.' });
    }
};

// Substitua ou adicione esta função no seu PedidoController.js
exports.cancelarPedido = async (req, res) => {
    try {
        const { numero } = req.params;
        const { motivo } = req.body; // Puxa o motivo que o cliente digitou no Modal!

        console.log(`\n=========================================`);
        console.log(`🛑 TENTATIVA DE CANCELAMENTO INICIADA`);
        console.log(`👉 Pedido Alvo: ${numero}`);
        console.log(`👉 Motivo: ${motivo}`);

        // TENTATIVA 1: Busca o pedido como Texto (String)
        let pedidoAtualizado = await Pedido.findOneAndUpdate(
            { numeroPedido: String(numero) }, // Tenta buscar como texto
            { 
                $set: { 
                    "pagamento.status": "CANCELADO",
                    "motivoCancelamento": motivo // Guarda o motivo no banco!
                } 
            },
            { new: true }
        );

        // TENTATIVA 2: Se não achar, busca como Número Matemático
        if (!pedidoAtualizado) {
            console.log(`⚠️ Não encontrado como Texto. Tentando como Número...`);
            pedidoAtualizado = await Pedido.findOneAndUpdate(
                { numeroPedido: Number(numero) }, // Tenta buscar como número
                { 
                    $set: { 
                        "pagamento.status": "CANCELADO",
                        "motivoCancelamento": motivo 
                    } 
                },
                { new: true }
            );
        }

        // Se mesmo assim não achar, envia o erro claro!
        if (!pedidoAtualizado) {
            console.log(`❌ ERRO: O pedido ${numero} realmente não existe no banco de dados!`);
            console.log(`=========================================\n`);
            return res.status(404).json({ erro: 'Pedido não encontrado na base de dados.' });
        }

        // Deu tudo certo!
        console.log(`✅ SUCESSO: Pedido cancelado e atualizado no Banco de Dados!`);
        console.log(`=========================================\n`);
        res.status(200).json({ sucesso: true, pedido: pedidoAtualizado });

    } catch (erro) {
        console.error("❌ ERRO GRAVE NO SERVIDOR:", erro);
        res.status(500).json({ erro: 'Erro interno ao cancelar' });
    }
};

// Adicione isto no final do seu PedidoController.js
exports.aprovarPedido = async (req, res) => {
    try {
        const { numero } = req.params;

        // Tenta achar o pedido e muda o status para Aprovado
        let pedidoAtualizado = await Pedido.findOneAndUpdate(
            { numeroPedido: String(numero) },
            { $set: { "pagamento.status": "PAGAMENTO APROVADO" } },
            { new: true }
        );

        if (!pedidoAtualizado) {
            pedidoAtualizado = await Pedido.findOneAndUpdate(
                { numeroPedido: Number(numero) },
                { $set: { "pagamento.status": "PAGAMENTO APROVADO" } },
                { new: true }
            );
        }

        if (!pedidoAtualizado) return res.status(404).json({ erro: 'Pedido não encontrado' });

        res.status(200).json({ sucesso: true, pedido: pedidoAtualizado });
    } catch (erro) {
        console.error("Erro ao aprovar:", erro);
        res.status(500).json({ erro: 'Erro interno ao aprovar' });
    }
};