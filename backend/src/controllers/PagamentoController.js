// Importe a biblioteca no topo do arquivo
const QRCode = require('qrcode');

exports.gerarPagamento = async (req, res) => {
    try {
        const { metodo, valorTotal, nome } = req.body;
        console.log(`🚜 Processando ${metodo} para ${nome} (R$ ${valorTotal})`);

        if (metodo === 'pix') {
            // O código "Copia e Cola" do PIX que você quer transformar em imagem
            const pixCopiaECola = "00020126580014BR.GOV.BCB.PIX0136nicolasgomeshar@gmail.com5204000053039895802BR5913Engremaq6009Fortaleza62070503***63041A2B";
            
            // 1. Gera o QR Code dinamicamente (Ele retorna "data:image/png;base64,iVBORw0K...")
            const qrCodeDataURL = await QRCode.toDataURL(pixCopiaECola);

            // 2. Remove o prefixo para não duplicar com o que já tem no seu conclude.js
            const qrCodePuro = qrCodeDataURL.split(',')[1];

            return res.status(200).json({
                sucesso: true,
                pixCopiaECola: pixCopiaECola,
                qrCodeBase64: qrCodePuro
            });
        } 
        
        if (metodo === 'boleto') {
            return res.status(200).json({
                sucesso: true,
                linhaDigitavel: "23793.38128 60083.430009 17001.210004 1 96500000000100"
            });
        }

        if (metodo === 'cartao') {
            return res.status(200).json({ sucesso: true });
        }

    } catch (e) { 
        console.error("Erro ao gerar pagamento:", e);
        res.status(500).json({ erro: 'Erro no processamento' }); 
    }
};