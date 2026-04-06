document.addEventListener('DOMContentLoaded', () => {
    // 1. SEGURANÇA: Se não houver itens, volta ao carrinho
    const carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
    if (carrinho.length === 0) return window.location.replace("Cart.html");

    // 2. INICIALIZAÇÃO DAS INFORMAÇÕES
    carregarDadosRevisao();

    // 3. LÓGICA DO BOTÃO FINALIZAR E TERMOS
    const btnFinalizar = document.getElementById('btn-finalizar-tudo');
    const checkTermos = document.getElementById('termos');

    if (checkTermos && btnFinalizar) {
        btnFinalizar.disabled = true;
        btnFinalizar.style.background = '#eee';
        btnFinalizar.style.color = '#aaa';
        btnFinalizar.style.cursor = 'not-allowed';

        checkTermos.addEventListener('change', () => {
            btnFinalizar.disabled = !checkTermos.checked;
            if(checkTermos.checked) {
                btnFinalizar.style.background = '#ffcc00';
                btnFinalizar.style.color = '#111';
                btnFinalizar.style.cursor = 'pointer';
            } else {
                btnFinalizar.style.background = '#eee';
                btnFinalizar.style.color = '#aaa';
                btnFinalizar.style.cursor = 'not-allowed';
            }
        });

        btnFinalizar.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!checkTermos.checked) return;

            const btnOriginalText = btnFinalizar.innerText;
            btnFinalizar.innerText = "PROCESSANDO PEDIDO...";
            btnFinalizar.disabled = true;

            try {
                const metodo = localStorage.getItem('metodoPagamento');
                const cartaoSalvo = JSON.parse(localStorage.getItem('dadosCartaoEngremaq')); 
                const usuario = JSON.parse(localStorage.getItem('usuarioEngremaq'));
                const enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq')) || [];
                const endSelecionado = enderecos.find(ed => ed.id == localStorage.getItem('enderecoSelecionado'));

                if (!endSelecionado) throw new Error("Endereço não localizado.");

                // RECALCULA O TOTAL FINAL EXATO PARA O BACKEND
                let subtotalOriginal = 0;
                let totalDesconto = 0;
                carrinho.forEach(item => {
                    let itemTotal = item.preco * item.quantidade;
                    subtotalOriginal += itemTotal;
                    if (metodo === 'pix' || metodo === 'boleto') {
                        const ultimoDigito = parseInt(String(item.id).slice(-1));
                        const taxa = [3, 6, 9].includes(ultimoDigito) ? 0.15 : 0.05;
                        totalDesconto += (itemTotal * taxa);
                    }
                });

                const freteSalvo = JSON.parse(localStorage.getItem('freteSelecionado'));
                const freteValor = freteSalvo ? freteSalvo.preco : 0;
                const totalGeralComDesconto = (subtotalOriginal - totalDesconto) + freteValor;

                const respostaPagamento = await fetch('https://api-engremaq.onrender.com/api/pagamento/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        metodo: metodo,
                        valorTotal: totalGeralComDesconto,
                        cliente: usuario,
                        cpf: (metodo === 'cartao' && cartaoSalvo) ? cartaoSalvo.cpf.replace(/\D/g, '') : "19119119100" 
                    })
                });

                const dadosPagamento = await respostaPagamento.json();
                if (!dadosPagamento.sucesso) throw new Error(dadosPagamento.erro);

                const payloadPedido = {
                    cliente: { nome: usuario.nome, email: usuario.email },
                    enderecoEntrega: endSelecionado,
                    itens: carrinho,
                    pagamento: { 
                        metodo: metodo, 
                        status: dadosPagamento.statusPagamento,
                        linkBoleto: dadosPagamento.linkBoleto || null 
                    },
                    frete: { transportadora: freteSalvo?.nome || 'Padrão', valor: freteValor, prazoDias: freteSalvo?.prazo || 5 },
                    totalGeral: totalGeralComDesconto
                };

                const respostaPedido = await fetch('https://api-engremaq.onrender.com/api/pedidos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payloadPedido)
                });

                const dadosPedido = await respostaPedido.json();

                if (respostaPedido.ok) {
                    localStorage.setItem('ultimoNumeroPedido', dadosPedido.numeroPedido);
                    localStorage.setItem('dadosPagamentoFinal', JSON.stringify({
                        metodo: metodo,
                        valorTotal: totalGeralComDesconto,
                        nome: usuario.nome,
                        email: usuario.email
                    }));
                    localStorage.removeItem('carrinhoEngremaq');
                    window.location.replace("Conclude.html");
                } else {
                    throw new Error("Erro ao criar pedido.");
                }

            } catch (erro) {
                alert("❌ Erro: " + erro.message);
                btnFinalizar.innerText = "TENTAR NOVAMENTE";
                btnFinalizar.disabled = false;
            }
        });
    }
});

function carregarDadosRevisao() {
    try {
        const carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
        const metodo = localStorage.getItem('metodoPagamento') || 'pix';
        const usuario = JSON.parse(localStorage.getItem('usuarioEngremaq'));
        
        let subtotalOriginal = 0;
        let totalDesconto = 0;

        carrinho.forEach(item => {
            let valorItem = item.preco * item.quantidade;
            subtotalOriginal += valorItem;
            if (metodo === 'pix' || metodo === 'boleto') {
                const ultimoDigito = parseInt(String(item.id).slice(-1));
                const isPromocao = [3, 6, 9].includes(ultimoDigito);
                totalDesconto += (valorItem * (isPromocao ? 0.15 : 0.05));
            }
        });

        const freteSalvo = JSON.parse(localStorage.getItem('freteSelecionado'));
        const freteValor = freteSalvo ? freteSalvo.preco : 0;
        const totalFinal = (subtotalOriginal - totalDesconto) + freteValor;

        // ATUALIZAÇÃO DO RESUMO LATERAL
        const elSubtotal = document.getElementById('rev-subtotal');
        const elFrete = document.getElementById('rev-frete');
        const elTotal = document.getElementById('rev-total');

        if (elSubtotal) elSubtotal.textContent = subtotalOriginal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
        if (elTotal) elTotal.textContent = totalFinal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
        if (elFrete) {
            elFrete.innerHTML = freteSalvo ? `<span style="display: block; text-align: right; line-height: 1.4;">${freteValor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}<br><small style="color: #888;">via ${freteSalvo.nome}</small></span>` : "R$ 0,00";
        }

        // LINHA DE DESCONTO DINÂMICA
        let descLine = document.getElementById('rev-linha-desconto');
        if (totalDesconto > 0) {
            if (!descLine && elSubtotal) {
                descLine = document.createElement('div');
                descLine.id = 'rev-linha-desconto';
                descLine.className = 'summary-line';
                descLine.innerHTML = `<span>Descontos (PIX/Boleto):</span> <strong style="color: #22c55e;">- ${totalDesconto.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</strong>`;
                elSubtotal.parentElement.insertAdjacentElement('afterend', descLine);
            } else if (descLine) {
                descLine.querySelector('strong').textContent = `- ${totalDesconto.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
            }
        } else if (descLine) {
            descLine.remove();
        }

        // DADOS DO COMPRADOR
        if (usuario) {
            if (document.getElementById('rev-nome-comprador')) document.getElementById('rev-nome-comprador').textContent = usuario.nome;
            if (document.getElementById('rev-email-comprador')) document.getElementById('rev-email-comprador').textContent = usuario.email;
            if (document.getElementById('rev-celular-comprador')) document.getElementById('rev-celular-comprador').textContent = usuario.celular || '(85) 99997-3965';
        }

        // ENDEREÇO (CORREÇÃO DO UNDEFINED)
        const enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq')) || [];
        const selecionadoId = localStorage.getItem('enderecoSelecionado');
        const end = enderecos.find(e => e.id == selecionadoId);
        if (end && document.getElementById('rev-endereco-completo')) {
            document.getElementById('rev-endereco-completo').innerHTML = `
                <strong>${end.identificacao}</strong><br>
                ${end.rua}, ${end.numero} - ${end.bairro || ''}<br>
                ${end.cidade} - ${end.uf} | CEP: ${end.cep}
            `;
        }

        // FORMA DE PAGAMENTO COM SVG CORRIGIDO
        const elMetodo = document.getElementById('rev-metodo-pagamento');
        if (elMetodo) {
            if (metodo === 'cartao') {
                const dadosCartao = JSON.parse(localStorage.getItem('dadosCartaoEngremaq'));
                elMetodo.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
                        <img src="https://img.icons8.com/ios-filled/50/666666/bank-cards.png" style="width: 24px;">
                        <div>
                            <strong style="color: #111; display: block;">CARTÃO FINAL ${dadosCartao ? dadosCartao.numero.slice(-4) : '••••'}</strong>
                            <span style="font-size: 12px; color: #666;">Parcelado em ${dadosCartao ? dadosCartao.parcelas : '1'}x</span>
                        </div>
                    </div>`;
            } else if (metodo === 'boleto') {
                // ÍCONE DE BOLETO (SVG QUE VOCÊ ENVIOU)
                elMetodo.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
                        <svg class="method-icon" style="fill: #22c55e; width: 24px; height: 24px;" viewBox="0 0 24 24"><path d="M3 5h2v14H3V5zm4 0h1v14H7V5zm3 0h3v14h-3V5zm5 0h1v14h-1V5zm3 0h3v14h-3V5zm5 0h1v14h-1V5z"/></svg>
                        <div>
                            <strong style="color: #111; display: block;">BOLETO BANCÁRIO</strong>
                            <span style="font-size: 12px; color: #22c55e;">Desconto aplicado no total</span>
                        </div>
                    </div>`;
            } else {
                // ÍCONE DE PIX (SVG ESTÁVEL)
                elMetodo.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
                        <img src="https://img.icons8.com/ios-filled/50/22c55e/pix.png" style="width: 24px;">
                        <div>
                            <strong style="color: #111; display: block;">PIX</strong>
                            <span style="font-size: 12px; color: #22c55e;">Desconto aplicado no total</span>
                        </div>
                    </div>`;
            }
        }
    } catch (erro) { console.error("Erro ao carregar revisão:", erro); }
}