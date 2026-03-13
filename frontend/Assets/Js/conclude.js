document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('conclude-content');
    const dadosPagamento = JSON.parse(localStorage.getItem('dadosPagamentoFinal'));
    const numPedido = localStorage.getItem('ultimoNumeroPedido') || '000000';

    // Se o utilizador aceder à página sem ter feito uma compra, mostra genérico
    if (!dadosPagamento) {
        container.innerHTML = `
            <div style="text-align: center;">
                <h2 style="color: #27ae60; margin-bottom: 10px; font-family: 'Poppins', sans-serif;">✅ PEDIDO #${numPedido} CONCLUÍDO!</h2>
                <p style="color: #666; font-size: 15px; margin-bottom: 25px;">Acesse o painel para gerenciar suas compras.</p>
                <a href="Dashboard.html#pedidos" style="display: inline-block; background: #ffcc00; color: #111; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-weight: bold;">ACOMPANHAR PEDIDO</a>
            </div>
        `;
        return;
    }

    const { metodo, valorTotal, nome, email } = dadosPagamento;

    // ==========================================
    // SE FOI CARTÃO DE CRÉDITO
    // ==========================================
    if (metodo === 'cartao') {
        container.innerHTML = `
            <div style="text-align: center;">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width: 60px; height: 60px; margin-bottom: 15px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <h1 style="color: #27ae60; margin-bottom: 5px; font-family: 'Poppins', sans-serif; font-size: 24px;">PAGAMENTO APROVADO!</h1>
                <h2 style="color: #333; font-size: 16px; margin-bottom: 25px;">O SEU PEDIDO #${numPedido} JÁ ESTÁ NA EXPEDIÇÃO</h2>
                <p style="color: #666; font-size: 14px; margin-bottom: 30px;">A transação com Cartão de Crédito foi confirmada com sucesso. A nota fiscal será enviada para o e-mail: <strong>${email}</strong>.</p>
                <a href="Dashboard.html#pedidos" style="display: inline-block; background: #111; color: #ffcc00; text-decoration: none; padding: 15px 30px; border-radius: 4px; font-weight: bold; width: 100%; box-sizing: border-box;">📦 ACOMPANHAR ENTREGA</a>
            </div>
        `;
        localStorage.removeItem('dadosPagamentoFinal');
        document.getElementById('area-instrucoes').style.display = 'none'; // Esconde as instruções de pagar
        return;
    }

    // ==========================================
    // SE FOI PIX OU BOLETO (Faz a requisição ao Backend)
    // ==========================================
    try {
        const resposta = await fetch('https://api-engremaq.onrender.com/api/pagamento/gerar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ metodo, valorTotal, nome, email })
        });

        const dados = await resposta.json();

        if (dados.sucesso) {
            
            // --- DESENHO DO PIX ---
            if (metodo === 'pix') {
                container.innerHTML = `
                    <div style="text-align: center;">
                        <h1 style="color: #d4a000; margin-bottom: 5px; font-family: 'Poppins', sans-serif; font-size: 22px;">PEDIDO #${numPedido} RESERVADO!</h1>
                        <h2 style="color: #333; font-size: 14px; margin-bottom: 25px; font-weight: normal;">Escaneie o QR Code abaixo ou copie a chave para pagar.</h2>
                        
                        <div style="background: #fff; padding: 15px; border-radius: 8px; border: 2px solid #32bcad; display: inline-block; margin-bottom: 20px;">
                            <img src="data:image/png;base64,${dados.qrCodeBase64}" style="width: 220px; height: 220px; display: block;">
                        </div>
                        
                        <div style="display: flex; gap: 5px; margin-bottom: 25px; width: 100%; max-width: 450px; margin-left: auto; margin-right: auto;">
                            <input type="text" value="${dados.pixCopiaECola}" id="input-pix-copia" readonly style="flex: 1; padding: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 12px; color: #666; background: #f9f9f9; outline: none;">
                            <button onclick="navigator.clipboard.writeText(document.getElementById('input-pix-copia').value); alert('Chave PIX Copiada!');" style="background: #32bcad; color: #fff; border: none; padding: 0 20px; border-radius: 4px; font-weight: bold; cursor: pointer;">COPIAR</button>
                        </div>

                        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; color: #d4a000; font-size: 13px; font-weight: bold;">
                            <svg viewBox="0 0 50 50" style="width: 16px; height: 16px; animation: rotate 2s linear infinite;"><circle cx="25" cy="25" r="20" fill="none" stroke="#d4a000" stroke-width="5" stroke-dasharray="90 150"></circle></svg>
                            Aguardando compensação no sistema...
                        </div>
                    </div>
                `;
            } 
            
            // --- DESENHO DO BOLETO ---
            else if (metodo === 'boleto') {
                const dataVenc = new Date();
                dataVenc.setDate(dataVenc.getDate() + 3);
                const vencStr = dataVenc.toLocaleDateString('pt-BR');
                const linhaDigitavelOficial = dados.linhaDigitavel || "23793.38128 60083.430009 17001.210004 1 96500000000100";

                container.innerHTML = `
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #d4a000; margin-bottom: 5px; font-family: 'Poppins', sans-serif; font-size: 22px;">PEDIDO #${numPedido} RESERVADO!</h1>
                        <h2 style="color: #333; font-size: 14px; margin-bottom: 5px; font-weight: normal;">Copie a linha digitável abaixo ou acesse o boleto oficial do banco.</h2>
                    </div>

                    <div style="background: #fff; border: 1px solid #ccc; padding: 25px; border-radius: 8px; font-family: monospace; color: #111; text-align: left; margin-bottom: 25px;">
                        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #111; padding-bottom: 15px; margin-bottom: 20px; align-items: center;">
                            <strong style="font-size: 24px; color: #cc0000; font-family: 'Poppins', sans-serif;">Bradesco</strong>
                            <span style="font-size: 20px; border-left: 2px solid #111; border-right: 2px solid #111; padding: 0 15px;">237-2</span>
                            <span style="font-size: 14px; font-weight: bold; text-align: right;">${linhaDigitavelOficial}</span>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                            <div style="flex: 1; border-right: 1px solid #eee; padding-right: 10px;">
                                <p style="margin: 0 0 5px 0; color: #555;">Beneficiário</p>
                                <p style="margin: 0; font-size: 14px; font-weight: bold;">ENGREMAQ S.A - CNPJ: 00.000.000/0001-00</p>
                            </div>
                            <div style="flex: 1; padding-left: 10px; text-align: right;">
                                <p style="margin: 0 0 5px 0; color: #555;">Vencimento</p>
                                <p style="margin: 0; font-size: 18px; font-weight: bold; color: #cc0000;">${vencStr}</p>
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 15px;">
                            <div style="flex: 1;">
                                <p style="margin: 0 0 5px 0; color: #555;">Pagador</p>
                                <p style="margin: 0; font-size: 14px;">${nome.toUpperCase()}</p>
                            </div>
                            <div style="flex: 1; text-align: right;">
                                <p style="margin: 0 0 5px 0; color: #555;">(=) Valor do Documento</p>
                                <p style="margin: 0; font-size: 20px; font-weight: bold;">${valorTotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p>
                            </div>
                        </div>

                        <div style="background: #f9f9f9; text-align: center; border-top: 1px dashed #ccc; padding-top: 20px; margin-bottom: 25px;">
                            <div style="height: 50px; width: 100%; background: repeating-linear-gradient(90deg, #111, #111 3px, transparent 3px, transparent 6px, #111 6px, #111 8px, transparent 8px, transparent 12px); opacity: 0.8;"></div>
                        </div>

                        <div style="display: flex; gap: 10px;">
                            <button onclick="navigator.clipboard.writeText('${linhaDigitavelOficial}'); alert('Linha Digitável Copiada!');" style="background: #ffcc00; color: #111; border: none; padding: 12px 15px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px; flex: 1; font-family: 'Poppins', sans-serif;">📋 COPIAR LINHA DIGITÁVEL</button>
                            
                            <a href="${dados.linkBoleto || '#'}" target="_blank" style="background: #111; color: #fff; text-decoration: none; padding: 12px 15px; border-radius: 4px; font-weight: bold; font-size: 13px; flex: 1; text-align: center; font-family: 'Poppins', sans-serif;">🖨️ IMPRIMIR BOLETO OFICIAL</a>
                        </div>
                    </div>
                `;
                document.getElementById('instrucao-texto-1').textContent = "Pague através do aplicativo do seu banco ou dirija-se a uma lotérica com o boleto impresso.";
            }

            localStorage.removeItem('dadosPagamentoFinal');

        } else {
            container.innerHTML = `<div style="text-align: center; color: red;"><h3>Erro ao processar integração bancária.</h3><br><a href="Dashboard.html">Ir para Meus Pedidos</a></div>`;
        }

    } catch (e) {
        container.innerHTML = `<div style="text-align: center; color: red;"><h3>Falha de comunicação com o servidor.</h3><br><a href="Dashboard.html">Ir para Meus Pedidos</a></div>`;
    }
});