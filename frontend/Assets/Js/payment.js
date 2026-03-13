document.addEventListener('DOMContentLoaded', () => {
    let subtotalOriginal = 0;
    let valorDoFrete = 0;
    let totalDescontoReal = 0; // Armazena a soma real de todos os descontos
    
    // Se não tiver carrinho, expulsa para a tela inicial
    const carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
    if (carrinho.length === 0) return window.location.replace("Cart.html");

    // 1. CÁLCULO UNIFICADO (IGUAL AO RESTO DO SITE)
    subtotalOriginal = carrinho.reduce((acc, item) => {
        const valorItemBruto = item.preco * item.quantidade;
        acc += valorItemBruto;

        // Identifica a porcentagem correta do desconto por item
        const ultimoDigito = parseInt(String(item.id).slice(-1));
        const isPromocao = [3, 6, 9].includes(ultimoDigito);
        const taxaDesconto = isPromocao ? 0.15 : 0.05;
        
        totalDescontoReal += (valorItemBruto * taxaDesconto);
        return acc;
    }, 0);

    const freteSalvo = JSON.parse(localStorage.getItem('freteSelecionado'));
    valorDoFrete = freteSalvo ? freteSalvo.preco : 0;
    let freteNome = freteSalvo ? freteSalvo.nome : "";

    // Elementos da interface de Resumo
    const elSubtotal = document.getElementById('pay-subtotal');
    const elFrete = document.getElementById('pay-frete');
    const elTotal = document.getElementById('pay-total'); 
    const elTextoVista = document.getElementById('pay-text-vista');

    // Limpa métodos anteriores
    localStorage.removeItem('metodoPagamento');

    function atualizarResumoDinamico(metodoSelecionado) {
        if (!elTotal) return;

        // Garante que a linha visual de "Descontos" existe (Injeção dinâmica caso falte no HTML)
        let linhaDesconto = document.getElementById('linha-desconto-pagamento');
        if (!linhaDesconto && elSubtotal) {
            linhaDesconto = document.createElement('div');
            linhaDesconto.id = 'linha-desconto-pagamento';
            linhaDesconto.className = 'summary-line';
            linhaDesconto.innerHTML = `<span>Descontos:</span> <strong id="valor-desconto-real" style="color: #22c55e;"></strong>`;
            elSubtotal.parentElement.insertAdjacentElement('afterend', linhaDesconto);
        }
        const displayValorDesconto = document.getElementById('valor-desconto-real');

        // Mostra o Frete e Subtotal
        if (elFrete) {
            elFrete.innerHTML = freteNome ? `<span style="display: block; text-align: right; line-height: 1.4;">${valorDoFrete.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}<br><small style="font-size: 11px; color: #888;">via ${freteNome}</small></span>` : valorDoFrete.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
        }
        if(elSubtotal) elSubtotal.textContent = subtotalOriginal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});

        if (metodoSelecionado === 'cartao') {
            // MODO CARTÃO: Sem desconto, preço cheio.
            let totalFinal = subtotalOriginal + valorDoFrete;
            
            if(displayValorDesconto) {
                displayValorDesconto.textContent = "R$ 0,00";
                displayValorDesconto.style.color = "#888";
            }
            
            elTotal.textContent = totalFinal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
            elTotal.style.color = "#111"; // Fica preto
            if(elTextoVista) elTextoVista.textContent = "Total parcelado no cartão:";
            
            gerarParcelasSelect(totalFinal);

        } else {
            // MODO PIX/BOLETO: Aplica o total de descontos calculado no início
            let totalFinal = (subtotalOriginal - totalDescontoReal) + valorDoFrete;
            
            if(displayValorDesconto) {
                displayValorDesconto.textContent = `- ${totalDescontoReal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
                displayValorDesconto.style.color = "#22c55e"; // Verde
            }

            elTotal.textContent = totalFinal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
            elTotal.style.color = "#22c55e"; // Fica verde
            if(elTextoVista) elTextoVista.textContent = "À vista no Pix ou Boleto:";
        }
    }

    function configurarAcordeaoPagamento() {
        const radioButtons = document.querySelectorAll('input[name="metodo_pagamento"]');
        const cards = document.querySelectorAll('.payment-card');

        cards.forEach(card => {
            card.classList.remove('active');
            const cardBody = card.querySelector('.card-body');
            if (cardBody) cardBody.style.display = 'none';
            card.style.backgroundColor = '#fff';
        });

        const selecionadoInicial = document.querySelector('input[name="metodo_pagamento"]:checked');
        if(selecionadoInicial) atualizarResumoDinamico(selecionadoInicial.value);
        else {
            // Por padrão do site, iniciamos no PIX
            const pixRadio = document.querySelector('input[value="pix"]');
            if(pixRadio) {
                pixRadio.checked = true;
                atualizarResumoDinamico('pix');
                const card = pixRadio.closest('.payment-card');
                card.classList.add('active');
                card.style.backgroundColor = '#fffcf0';
                card.querySelector('.card-body').style.display = 'block';
            }
        }

        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                cards.forEach(card => {
                    card.classList.remove('active');
                    const cardBody = card.querySelector('.card-body');
                    if (cardBody) cardBody.style.display = 'none';
                    card.style.backgroundColor = '#fff';
                });
                
                const selectedCard = e.target.closest('.payment-card');
                if(selectedCard) {
                    selectedCard.classList.add('active');
                    selectedCard.style.backgroundColor = '#fffcf0';
                    const selectedBody = selectedCard.querySelector('.card-body');
                    if (selectedBody) selectedBody.style.display = 'block';
                }

                atualizarResumoDinamico(e.target.value);
            });
        });
    }

    configurarAcordeaoPagamento();
    configurarCartaoVisual();

    // EVENTO DO BOTÃO IR PARA REVISÃO
    const btnRevisao = document.getElementById('btn-ir-revisao');
    if (btnRevisao) {
        btnRevisao.addEventListener('click', (e) => {
            e.preventDefault();

            const metodoSelecionado = document.querySelector('input[name="metodo_pagamento"]:checked');
            if (!metodoSelecionado) {
                alert("⚠️ Por favor, selecione uma forma de pagamento antes de avançar.");
                return;
            }

            const valorMetodo = metodoSelecionado.value;
            
            if (valorMetodo === 'cartao') {
                const inpNum = document.getElementById('inp-cc-num');
                const inpNome = document.getElementById('inp-cc-nome');
                const inpVal = document.getElementById('inp-cc-val');
                const inpCvv = document.getElementById('inp-cc-cvv');
                const inpCpf = document.getElementById('inp-cc-cpf');
                const inpNasc = document.getElementById('inp-cc-nasc');

                const inputs = [inpNum, inpNome, inpVal, inpCvv, inpCpf, inpNasc];
                let temErro = false;
                
                inputs.forEach(inp => {
                    if(!inp || !inp.value.trim()) {
                        if(inp) inp.style.borderColor = '#ef4444';
                        temErro = true;
                    } else {
                        if(inp) inp.style.borderColor = '#ccc';
                    }
                });

                if (temErro) {
                    alert("⚠️ Por favor, preencha todos os campos obrigatórios do cartão.");
                    return; 
                }

                const numLimpo = inpNum.value.replace(/\s/g, '');
                if (!validarCartaoLuhn(numLimpo)) {
                    alert("❌ Número do cartão inválido.");
                    inpNum.style.borderColor = '#ef4444';
                    return;
                }

                if (!validarDataValidade(inpVal.value)) {
                    alert("⚠️ Validade expirada.");
                    inpVal.style.borderColor = '#ef4444';
                    return;
                }

                if (!validarCPF(inpCpf.value)) {
                    alert("❌ CPF inválido.");
                    inpCpf.style.borderColor = '#ef4444';
                    return;
                }
                
                const cartaoData = {
                    numero: inpNum.value,
                    nome: inpNome.value,
                    validade: inpVal.value,
                    cvv: inpCvv.value,
                    cpf: inpCpf.value,
                    nascimento: inpNasc.value,
                    apelido: document.getElementById('inp-cc-apelido')?.value || "Cartão",
                    parcelas: document.getElementById('sel-parcelas')?.value || 1
                };
                localStorage.setItem('dadosCartaoEngremaq', JSON.stringify(cartaoData));
            }
            
            localStorage.setItem('metodoPagamento', valorMetodo);
            window.location.assign("Revision.html"); 
        });
    }

    // --- FUNÇÕES DE APOIO ---
    function validarCartaoLuhn(numero) {
        if (numero.length < 13) return false;
        let soma = 0; let alternar = false;
        for (let i = numero.length - 1; i >= 0; i--) {
            let digito = parseInt(numero.charAt(i), 10);
            if (alternar) { digito *= 2; if (digito > 9) digito -= 9; }
            soma += digito; alternar = !alternar;
        }
        return (soma % 10 === 0);
    }

    function validarCPF(cpfStr) {
        let cpf = cpfStr.replace(/[^\d]+/g, ''); 
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false; 
        let soma = 0, resto;
        for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
        resto = (soma * 10) % 11; if ((resto == 10) || (resto == 11)) resto = 0;
        if (resto != parseInt(cpf.substring(9, 10))) return false;
        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
        resto = (soma * 10) % 11; if ((resto == 10) || (resto == 11)) resto = 0;
        return (resto == parseInt(cpf.substring(10, 11)));
    }

    function validarDataValidade(dataStr) {
        const regex = /^(\d{2})\/(\d{2})$/;
        const match = dataStr.match(regex);
        if (!match) return false;
        const mes = parseInt(match[1], 10); const ano = parseInt(match[2], 10);
        if (mes < 1 || mes > 12) return false;
        const hoje = new Date();
        const anoAtual = hoje.getFullYear() % 100; const mesAtual = hoje.getMonth() + 1;
        if (ano < anoAtual) return false;
        if (ano === anoAtual && mes < mesAtual) return false;
        return true;
    }

    function configurarCartaoVisual() {
        const inpNum = document.getElementById('inp-cc-num');
        const inpNome = document.getElementById('inp-cc-nome');
        const inpVal = document.getElementById('inp-cc-val');
        const inpCvv = document.getElementById('inp-cc-cvv');
        const dispNum = document.getElementById('display-cc-num');
        const dispNome = document.getElementById('display-cc-nome');
        const dispVal = document.getElementById('display-cc-val');

        if(typeof IMask !== 'undefined') {
            if (inpNum) IMask(inpNum, { mask: '0000 0000 0000 0000' });
            if (inpVal) IMask(inpVal, { mask: '00/00' });
            if (inpCvv) IMask(inpCvv, { mask: '0000' });
            if (document.getElementById('inp-cc-cpf')) IMask(document.getElementById('inp-cc-cpf'), { mask: '000.000.000-00' });
            if (document.getElementById('inp-cc-nasc')) IMask(document.getElementById('inp-cc-nasc'), { mask: '00/00/0000' });
        }

        inpNum?.addEventListener('input', (e) => { if(dispNum) dispNum.textContent = e.target.value || '•••• •••• •••• ••••'; });
        inpNome?.addEventListener('input', (e) => { if(dispNome) dispNome.textContent = e.target.value.toUpperCase() || 'NOME IMPRESSO'; });
        inpVal?.addEventListener('input', (e) => { if(dispVal) dispVal.textContent = e.target.value || '••/••'; });

        const toggleCvv = document.getElementById('toggle-cvv');
        if (toggleCvv && inpCvv) {
            toggleCvv.addEventListener('click', () => {
                const isPass = inpCvv.type === 'password';
                inpCvv.type = isPass ? 'text' : 'password';
                toggleCvv.innerHTML = isPass ? '🙈' : '👁️'; // Simplificado para o exemplo
            });
        }
    }

    function gerarParcelasSelect(total) {
        const select = document.getElementById('sel-parcelas');
        if(!select) return;
        select.innerHTML = '';
        for(let i = 1; i <= 10; i++) {
            const parcela = total / i;
            select.innerHTML += `<option value="${i}">${i}x sem juros de ${parcela.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</option>`;
        }
    }
});