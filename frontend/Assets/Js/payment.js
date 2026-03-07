document.addEventListener('DOMContentLoaded', () => {
    let totalFinalParaCartao = 0;
    carregarResumoPedido();
    configurarAcordeaoPagamento();
    configurarCartaoVisual();

    // Evento do Botão IR PARA REVISÃO (Com Validação)
    const btnRevisao = document.getElementById('btn-ir-revisao');
    if (btnRevisao) {
        btnRevisao.addEventListener('click', (e) => {
            e.preventDefault();

            const metodoSelecionado = document.querySelector('input[name="metodo_pagamento"]:checked');
            const valorMetodo = metodoSelecionado ? metodoSelecionado.value : 'pix';
            
            // SE FOR CARTÃO, EXIGE VALIDAÇÃO ANTES DE AVANÇAR
            if (valorMetodo === 'cartao') {
                const inputs = [
                    document.getElementById('inp-cc-num'),
                    document.getElementById('inp-cc-nome'),
                    document.getElementById('inp-cc-val'),
                    document.getElementById('inp-cc-cvv'),
                    document.getElementById('inp-cc-cpf')
                ];
                
                let temErro = false;
                inputs.forEach(inp => {
                    if(!inp.value.trim()) {
                        inp.classList.add('error');
                        temErro = true;
                    } else {
                        inp.classList.remove('error');
                    }
                });

                if (temErro) {
                    alert("Por favor, preencha todos os campos obrigatórios do cartão de crédito.");
                    return; // Trava o utilizador aqui!
                }
            }
            
            localStorage.setItem('metodoPagamento', valorMetodo);
            window.location.assign("Revision.html"); 
        });
    }

    // INTERAÇÃO DO CARTÃO DE CRÉDITO EM TEMPO REAL
    function configurarCartaoVisual() {
        const inpNum = document.getElementById('inp-cc-num');
        const inpNome = document.getElementById('inp-cc-nome');
        const inpVal = document.getElementById('inp-cc-val');

        const dispNum = document.getElementById('display-cc-num');
        const dispNome = document.getElementById('display-cc-nome');
        const dispVal = document.getElementById('display-cc-val');

        if(inpNum) {
            inpNum.addEventListener('input', (e) => {
                let val = e.target.value.replace(/\D/g, '');
                val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
                e.target.value = val;
                dispNum.textContent = val || '•••• •••• •••• ••••';
                e.target.classList.remove('error'); 
            });
        }

        if(inpNome) {
            inpNome.addEventListener('input', (e) => {
                dispNome.textContent = e.target.value.toUpperCase() || 'NOME IMPRESSO';
                e.target.classList.remove('error');
            });
        }

        if(inpVal) {
            inpVal.addEventListener('input', (e) => {
                let val = e.target.value.replace(/\D/g, '');
                if (val.length > 2) val = val.substring(0,2) + '/' + val.substring(2,4);
                e.target.value = val;
                dispVal.textContent = val || '••/••';
                e.target.classList.remove('error');
            });
        }
    }

    function configurarAcordeaoPagamento() {
        const radioButtons = document.querySelectorAll('input[name="metodo_pagamento"]');
        const cards = document.querySelectorAll('.payment-card');
        const textoVista = document.getElementById('pay-text-vista');

        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                cards.forEach(card => {
                    card.classList.remove('active');
                    card.querySelector('.card-body').style.display = 'none';
                    card.style.backgroundColor = '#fff';
                });
                
                const selectedCard = e.target.closest('.payment-card');
                selectedCard.classList.add('active');
                selectedCard.style.backgroundColor = '#fffcf0';
                selectedCard.querySelector('.card-body').style.display = 'block';

                if(e.target.value === 'cartao') {
                    textoVista.textContent = 'Total parcelado:';
                } else {
                    textoVista.textContent = 'À vista no Pix ou Boleto:';
                }
            });
        });
    }

    // =========================================================
    // CORREÇÃO: PUXAR A TRANSPORTADORA CORRETA E ALINHAMENTO
    // =========================================================
    function carregarResumoPedido() {
        const carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
        if (carrinho.length === 0) return window.location.href = "Cart.html";

        const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
        
        let freteValor = 0;
        let freteNome = "";
        
        // Vai buscar o frete exato que o utilizador selecionou na aba anterior
        const freteSalvo = JSON.parse(localStorage.getItem('freteSelecionado'));
        if (freteSalvo) {
            freteValor = freteSalvo.preco;
            freteNome = freteSalvo.nome;
        } else {
            // Fallback de segurança
            const enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq')) || [];
            const selecionadoId = localStorage.getItem('enderecoSelecionado');
            const endSelecionado = enderecos.find(e => e.id == selecionadoId);
            if (endSelecionado) freteValor = endSelecionado.frete || 0;
        }

        totalFinalParaCartao = subtotal + freteValor;

        const elSubtotal = document.getElementById('pay-subtotal');
        const elFrete = document.getElementById('pay-frete');
        const elTotal = document.getElementById('pay-total');

        if (elSubtotal) elSubtotal.textContent = subtotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
        if (elTotal) elTotal.textContent = totalFinalParaCartao.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
        
        // =========================================================
        // ALINHAMENTO ABSOLUTO (FORÇADO PARA A DIREITA)
        // =========================================================
        if (elFrete) {
            if (freteNome) {
                // O display: block com text-align: right força o elemento a ocupar o espaço e empurrar o texto para o canto
                elFrete.innerHTML = `
                    <span style="display: block; text-align: right; line-height: 1.4;">
                        ${freteValor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                        <br><small style="font-size: 11px; color: #888; font-weight: 400;">via ${freteNome}</small>
                    </span>
                `;
            } else {
                elFrete.textContent = freteValor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
            }
        }
    }

    function gerarParcelasSelect(total) {
        const select = document.getElementById('sel-parcelas');
        if(!select) return;
        select.innerHTML = '';
        
        for(let i = 1; i <= 12; i++) {
            const parcela = total / i;
            const text = i === 1 ? `1x sem juros - ${total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}` : 
                                   `${i}x sem juros de ${parcela.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
            select.innerHTML += `<option value="${i}">${text}</option>`;
        }
    }
});