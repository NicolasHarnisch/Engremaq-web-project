// backend/src/controllers/FreteController.js

exports.calcularFrete = async (req, res) => {
    try {
        const { cepDestino } = req.body;
        
        if (!cepDestino) {
            return res.status(400).json({ sucesso: false, erro: "CEP destino é obrigatório" });
        }

        const token = process.env.MELHOR_ENVIO_TOKEN; 

        // DETETIVE: Mostra no terminal se o token existe e as primeiras 15 letras dele
        if (!token || token.length < 50) {
            console.log("❌ ALERTA: O seu token no .env está vazio ou é muito curto!");
        } else {
            console.log(`🔎 Testando Token que começa com: ${token.substring(0, 15)}...`);
        }

        const response = await fetch('https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'User-Agent': 'Engremaq App (nicolasgomeshar@gmail.com)' 
            },
            body: JSON.stringify({
                from: { postal_code: "62886000" }, 
                to: { postal_code: cepDestino.replace(/\D/g, '') }, 
                products: [
                    { id: "1", width: 15, height: 15, length: 15, weight: 1.5, insurance_value: 100.0, quantity: 1 }
                ]
            })
        });

        const data = await response.json();

        if (!Array.isArray(data)) {
            console.log("\n⚠️ A API do Melhor Envio recusou a conexão.");
            console.log("Mensagem Exata da API:", data);
            throw new Error("Token expirado ou resposta inválida.");
        }

        const opcoesFrete = data.filter(t => !t.error).map(t => ({
            nome: t.name,
            preco: parseFloat(t.price),
            prazo: t.delivery_time
        }));

        res.status(200).json({ sucesso: true, fretes: opcoesFrete });

    } catch (erro) {
        console.log(`ℹ️ Sistema de segurança ativado para o frete: Usando valores simulados.`);
        res.status(200).json({
            sucesso: true,
            fretes: [
                { nome: "Correios PAC (Estimado)", preco: 22.90, prazo: 7 },
                { nome: "Jadlog Package (Estimado)", preco: 18.50, prazo: 4 }
            ]
        });
    }
};