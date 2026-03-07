document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Recuperar dados do LocalStorage
    const carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
    const usuario = JSON.parse(localStorage.getItem('usuarioEngremaq')) || { nome: "Cliente", email: "cliente@teste.com" };
    const enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq')) || [];
    const idSel = localStorage.getItem('enderecoSelecionado');
    const metodo = localStorage.getItem('metodoPagamento') || 'pix';
    const numeroPedido = localStorage.getItem('ultimoNumeroPedido') || "ENG-" + Math.floor(Math.random() * 90000);

    // 2. Cálculo do Valor
    const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * (item.quantidade || 1)), 0);
    const frete = enderecos.find(e => e.id == idSel)?.frete || 0;
    const total = subtotal + frete;

    // 3. Exibir número do pedido
    document.querySelectorAll('.display-pedido').forEach(el => {
        el.textContent = numeroPedido;
    });

    const subtitle = document.getElementById('conclude-subtitle');

    // 4. Chamada ao Servidor
    try {
        const resposta = await fetch('http://localhost:3000/api/pagamento/pix', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                metodo: metodo,
                email: usuario.email,
                nome: usuario.nome,
                valorTotal: total,
                descricaoPedido: `Pedido ${numeroPedido} - Engremaq`
            })
        });

        const dados = await resposta.json();

        console.log("DADOS RECEBIDOS DO BACKEND:", dados);

        if (dados.sucesso) {
            // Mostra o bloco correto e esconde os outros
            document.querySelectorAll('.bloco-pagamento').forEach(b => b.classList.add('hidden'));
            const blocoAtual = document.getElementById(`bloco-${metodo}`);
            if (blocoAtual) blocoAtual.classList.remove('hidden');

            if (metodo === 'pix') {
                const imgQr = document.getElementById('img-qr-code');
                if (imgQr) {
                    // O SEGREDO ESTÁ AQUI: Adicionar o prefixo para o navegador reconhecer a imagem
                    imgQr.src = `data:image/png;base64,${dados.qrCodeBase64}`;
                }
                configurarBotaoCopiar(dados.pixCopiaECola);

                // ==========================================================
                // TRUQUE DE APRESENTAÇÃO: Simular a aprovação do PIX
                // ==========================================================
                setTimeout(() => {
                    const telaAguardando = document.getElementById('pix-aguardando');
                    const telaAprovado = document.getElementById('pix-aprovado');
                    const instrucoes = document.getElementById('area-instrucoes');
                    const subtitle = document.getElementById('conclude-subtitle');

                    if (telaAguardando && telaAprovado) {
                        // 1. Muda a tela visualmente
                        telaAguardando.classList.add('hidden');
                        if (instrucoes) instrucoes.classList.add('hidden');
                        telaAprovado.classList.remove('hidden');
                        if (subtitle) subtitle.textContent = "PAGAMENTO CONFIRMADO!";

                        // 💡 CORREÇÃO 1: Esvaziar o Carrinho
                        localStorage.removeItem('carrinhoEngremaq');

                        // 💡 CORREÇÃO 2: Atualizar o status do pedido para "Aprovado" no Dashboard
                        let pedidos = JSON.parse(localStorage.getItem('pedidosEngremaq')) || [];
                        let pedidoAtual = pedidos.find(p => p.numero === numeroPedido); // Usa a variável numeroPedido que já existe no topo
                        if (pedidoAtual) {
                            pedidoAtual.status = "Pagamento Aprovado";
                            localStorage.setItem('pedidosEngremaq', JSON.stringify(pedidos));
                        }
                    }
                }, 8000); // Aguarda 8 segundos
                // ==========================================================
            }
        }
    } catch (erro) {
        console.error("Erro na conexão:", erro);
        if (subtitle) subtitle.textContent = "SERVIDOR OFFLINE - ABRA O TERMINAL E RODE O NODE";
    }
});

function configurarBotaoCopiar(codigo) {
    const btn = document.getElementById('btn-copiar-pix');
    const msg = document.getElementById('copy-msg');
    if (btn) {
        btn.onclick = () => {
            navigator.clipboard.writeText(codigo);
            msg?.classList.remove('hidden');
            setTimeout(() => msg?.classList.add('hidden'), 3000);
        };
    }
}