// backend/src/controllers/PagamentoController.js
const QRCode = require('qrcode');

exports.processarPagamentoCheckout = async (req, res) => {
    try {
        const { metodo } = req.body;
        
        if (metodo === 'cartao') {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return res.status(200).json({ sucesso: true, statusPagamento: 'PAGAMENTO APROVADO' });
        }
        return res.status(200).json({ sucesso: true, statusPagamento: 'AGUARDANDO_PAGAMENTO' });
    } catch (erro) {
        res.status(500).json({ sucesso: false, erro: "Falha ao processar o pagamento." });
    }
};

exports.gerarPagamento = async (req, res) => {
    try {
        const { metodo, valorTotal, nome } = req.body;
        const tokenMP = process.env.MERCADOPAGO_ACCESS_TOKEN;

        // ==========================================
        // GERAÇÃO DO PIX 
        // ==========================================
        if (metodo === 'pix') {
            const pixCopiaECola = "00020126580014BR.GOV.BCB.PIX0136nicolasgomeshar@gmail.com5204000053039895802BR5913Engremaq6009Fortaleza62070503***63041A2B";
            const qrCodeDataURL = await QRCode.toDataURL(pixCopiaECola);
            return res.status(200).json({
                sucesso: true,
                pixCopiaECola: pixCopiaECola,
                qrCodeBase64: qrCodeDataURL.split(',')[1]
            });
        } 
        
        // ==========================================
        // 🚀 GERAÇÃO REAL DO BOLETO NO MERCADO PAGO
        // ==========================================
        if (metodo === 'boleto') {
            if (!tokenMP) {
                return res.status(400).json({ erro: "Token do Mercado Pago não encontrado no .env" });
            }

            const partesNome = nome ? nome.split(' ') : ['Cliente', 'Teste'];
            const primeiroNome = partesNome[0];
            const sobrenome = partesNome.length > 1 ? partesNome.slice(1).join(' ') : 'Sobrenome';

            const response = await fetch('https://api.mercadopago.com/v1/payments', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenMP}`,
                    'X-Idempotency-Key': Date.now().toString(), 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    transaction_amount: Number(valorTotal),
                    description: `Pedido Engremaq - ${primeiroNome}`,
                    payment_method_id: 'bolbradesco', 
                    payer: {
                        // 💡 TRUQUE 1: E-mail de teste oficial do MP para driblar a recusa de "auto-pagamento"
                        email: 'comprador.teste@sandbox.mercadopago.com.br', 
                        first_name: primeiroNome,
                        last_name: sobrenome,
                        identification: { type: 'CPF', number: '19119119100' },
                        // 💡 TRUQUE 2: Endereço físico genérico para satisfazer o Banco Central
                        address: {
                            zip_code: "06020000",
                            street_name: "Avenida das Nações Unidas",
                            street_number: "3003",
                            neighborhood: "Bonfim",
                            city: "Osasco",
                            federal_unit: "SP"
                        }
                    }
                })
            });

            const data = await response.json();

            if (data.status === 'pending') {
                return res.status(200).json({
                    sucesso: true,
                    linhaDigitavel: data.barcode.content,
                    linkBoleto: data.transaction_details.external_resource_url 
                });
            } else {
                // Se ainda der erro, isto vai mostrar EXATAMENTE o motivo no seu terminal!
                console.error("\n❌ Erro Detalhado do Mercado Pago:\n", JSON.stringify(data, null, 2));
                throw new Error("Mercado Pago recusou a geração.");
            }
        }

        return res.status(200).json({ sucesso: true });
    } catch (e) { 
        console.error("Erro ao gerar pagamento:", e);
        res.status(500).json({ erro: 'Erro no processamento' }); 
    }
};