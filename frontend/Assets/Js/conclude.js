document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Gera o número de pedido e preenche em todos os blocos possíveis
    const numeroPedido = Math.floor(10000000 + Math.random() * 90000000);
    document.querySelectorAll('.display-pedido').forEach(el => {
        el.textContent = numeroPedido;
    });

    // 2. Descobre qual foi o método pago e esconde os outros
    const metodoSelecionado = localStorage.getItem('metodoPagamento') || 'pix';
    
    const blocoPix = document.getElementById('bloco-pix');
    const blocoCartao = document.getElementById('bloco-cartao');
    const blocoBoleto = document.getElementById('bloco-boleto');
    
    const subtitle = document.getElementById('conclude-subtitle');
    const areaInstrucoes = document.getElementById('area-instrucoes');
    const textInstrucao1 = document.getElementById('instrucao-texto-1');

    if (metodoSelecionado === 'cartao') {
        blocoCartao.style.display = 'block';
        subtitle.textContent = "ESTAMOS A PREPARAR O SEU ENVIO"; // Cartão não precisa "pagar agora"
        areaInstrucoes.style.display = 'none'; // Esconde regras de Pix/Boleto
        
    } else if (metodoSelecionado === 'boleto') {
        blocoBoleto.style.display = 'block';
        subtitle.textContent = "AGORA É SÓ PAGAR O SEU BOLETO";
        textInstrucao1.textContent = "Imprima o boleto ou copie a linha digitável e pague no aplicativo do seu banco.";
        
    } else { // Padrao: PIX
        blocoPix.style.display = 'block';
        subtitle.textContent = "AGORA É SÓ REALIZAR O PAGAMENTO VIA PIX";
        textInstrucao1.textContent = "Utilize o aplicativo do seu banco copiando o código PIX ou escaneando o QR-Code acima.";
    }

    // 3. Limpa o carrinho e dados sensíveis (a compra já acabou)
    localStorage.removeItem('carrinhoEngremaq');
    localStorage.removeItem('metodoPagamento');

    // 4. Lógica do botão "Copiar PIX"
    const btnCopiar = document.getElementById('btn-copiar-pix');
    if (btnCopiar) {
        const msgCopiado = document.getElementById('copy-msg');
        const codigoPix = "00020126580014BR.GOV.BCB.PIX0136nicolasgomeshar@gmail.com5204000053039995802BR5913Engremaq6009Fortaleza62070503***63041A2B";

        btnCopiar.addEventListener('click', () => {
            navigator.clipboard.writeText(codigoPix).then(() => {
                msgCopiado.style.display = 'block';
                setTimeout(() => { msgCopiado.style.display = 'none'; }, 3000);
            }).catch(err => { alert("Não foi possível copiar o código."); });
        });
    }
});