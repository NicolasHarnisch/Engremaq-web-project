// revision.js - Lógica da Página de Revisão Final

document.addEventListener('DOMContentLoaded', () => {
    carregarDadosRevisao();

    const btnFinalizar = document.getElementById('btn-finalizar-tudo');
    const checkTermos = document.getElementById('termos');

    if (checkTermos && btnFinalizar) {
        checkTermos.addEventListener('change', () => {
            btnFinalizar.disabled = !checkTermos.checked;
            if(checkTermos.checked) {
                btnFinalizar.style.background = '#ffcc00';
                btnFinalizar.style.color = '#111';
            } else {
                btnFinalizar.style.background = '#eee';
                btnFinalizar.style.color = '#aaa';
            }
        });

        btnFinalizar.disabled = true;
        btnFinalizar.style.background = '#eee';
        btnFinalizar.style.color = '#aaa';

        btnFinalizar.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!checkTermos.checked) return;
            
            const btnOriginalText = btnFinalizar.innerText;
            btnFinalizar.innerText = "PROCESSANDO...";
            btnFinalizar.disabled = true;

            const usuario = JSON.parse(localStorage.getItem('usuarioEngremaq'));
            const carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
            const metodo = localStorage.getItem('metodoPagamento');
            const enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq')) || [];
            const endSelecionado = enderecos.find(ed => ed.id == localStorage.getItem('enderecoSelecionado'));

            if (!endSelecionado) {
                alert("⚠️ Ocorreu um erro ao localizar o seu endereço. Por favor, volte à etapa de Entrega.");
                btnFinalizar.innerText = btnOriginalText;
                btnFinalizar.disabled = false;
                return;
            }

            const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
            
            // Puxa os dados reais da transportadora escolhida para enviar ao Banco de Dados
            let freteFinalValor = 0;
            let freteFinalNome = 'Padrão';
            let prazoFinal = 7;
            const freteSalvo = JSON.parse(localStorage.getItem('freteSelecionado'));
            
            if (freteSalvo) {
                freteFinalValor = freteSalvo.preco;
                freteFinalNome = freteSalvo.nome;
                prazoFinal = freteSalvo.prazo || 7;
            } else {
                freteFinalValor = endSelecionado.frete || 0;
            }

            const itensFormatados = carrinho.map(item => ({
                produtoId: item.id, 
                nome: item.nome, 
                preco: item.preco, 
                quantidade: item.quantidade, 
                imagem: item.imagem
            }));

            let dataPrevista = new Date();
            dataPrevista.setDate(dataPrevista.getDate() + prazoFinal); // Usa o prazo real da transportadora

            // MONTANDO O PACOTE DE DADOS PARA O SEU BACK-END
            const payload = {
                cliente: { nome: usuario.nome, email: usuario.email },
                enderecoEntrega: {
                    cep: endSelecionado.cep, rua: endSelecionado.rua, numero: endSelecionado.numero,
                    bairro: endSelecionado.bairro, cidade: endSelecionado.cidade, uf: endSelecionado.uf
                },
                itens: itensFormatados,
                pagamento: { metodo: metodo },
                frete: { transportadora: freteFinalNome, valor: freteFinalValor, prazoDias: prazoFinal }, // Agora envia o nome real!
                totalGeral: subtotal + freteFinalValor,
                dataEntrega: dataPrevista
            };

            try {
                const resposta = await fetch('http://localhost:3000/api/pedidos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const dados = await resposta.json();

                if (resposta.ok) {
                    localStorage.setItem('ultimoNumeroPedido', dados.numeroPedido);
                    window.location.assign("Conclude.html");
                } else {
                    alert("Erro ao criar pedido: " + dados.erro);
                    btnFinalizar.innerText = btnOriginalText;
                    btnFinalizar.disabled = false;
                }
            } catch (erro) {
                alert("Erro de conexão com o servidor. O Node.js está rodando?");
                btnFinalizar.innerText = btnOriginalText;
                btnFinalizar.disabled = false;
            }
        });
    }
});

// =========================================================
// CORREÇÃO: ALINHAMENTO ABSOLUTO NO RESUMO DA REVISÃO
// =========================================================
function carregarDadosRevisao() {
    try {
        const carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
        if (carrinho.length === 0) return window.location.href = "Cart.html";
        
        const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
        
        let freteValor = 0;
        let freteNome = "";

        const enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq')) || [];
        const selecionadoId = localStorage.getItem('enderecoSelecionado');
        const end = enderecos.find(e => e.id == selecionadoId);
        
        // 1. DADOS DO ENDEREÇO
        const elEndereco = document.getElementById('rev-endereco-completo');
        if (end) {
            if (elEndereco) {
                elEndereco.innerHTML = 
                    `<strong>Endereço:</strong> ${end.rua}, ${end.numero}, ${end.bairro}<br>
                     <strong>Complemento:</strong> ${end.complemento || 'N/A'}<br>
                     <strong>Cidade:</strong> ${end.cidade} - ${end.uf}<br>
                     <strong>CEP:</strong> ${end.cep}`;
            }
        } else {
            if (elEndereco) elEndereco.innerHTML = "<span style='color:#ef4444; font-weight:bold;'>⚠️ Nenhum endereço selecionado! Volte à aba de Entrega.</span>";
        }

        // Puxa o frete selecionado real da transportadora
        const freteSalvo = JSON.parse(localStorage.getItem('freteSelecionado'));
        if (freteSalvo) {
            freteValor = freteSalvo.preco;
            freteNome = freteSalvo.nome;
        } else if (end) {
            freteValor = end.frete || 0;
        }

        // 2. DADOS DO PAGAMENTO
        const metodo = localStorage.getItem('metodoPagamento');
        const elMetodo = document.getElementById('rev-metodo-pagamento');
        if (elMetodo) {
            if (metodo) elMetodo.textContent = metodo.toUpperCase();
            else elMetodo.innerHTML = "<span style='color:#ef4444; font-weight:bold;'>⚠️ Método não selecionado! Volte à aba de Pagamento.</span>";
        }

        // 3. CÁLCULO E FORMATAÇÃO DE VALORES (Idêntico à KaBuM!)
        const totalFinal = subtotal + freteValor;
        
        const elSubtotal = document.getElementById('rev-subtotal');
        if (elSubtotal) elSubtotal.textContent = subtotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
        
        const elFrete = document.getElementById('rev-frete');
        if (elFrete) {
            if (freteNome) {
                // Força o alinhamento à direita na revisão também
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
        
        const elTotal = document.getElementById('rev-total');
        if (elTotal) elTotal.textContent = totalFinal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});

    } catch (erro) {
        console.error("Erro ao carregar a revisão do pedido:", erro);
    }
}