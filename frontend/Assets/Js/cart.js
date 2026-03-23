// --- CONFIGURAÇÃO DE PROMOÇÕES ---
// Coloque aqui os Códigos (IDs) exatos dos produtos que têm 15% de desconto.
// O sistema aplicará 15% para esses, e 5% (padrão PIX) para o restante.
const PRODUTOS_EM_PROMOCAO = ["000001", "000002", "000003", "000004"]; 

let valorFreteGlobal = 0;

function renderizarCarrinho() {
    const container = document.getElementById("cart-items-container");
    if (!container) return;
    
    const carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
    
    if (carrinho.length === 0) {
        container.innerHTML = "<p style='padding:20px; font-weight:600; text-align:center;'>Seu carrinho está vazio.</p>";
        document.getElementById("subtotal-carrinho").textContent = "R$ 0,00";
        document.getElementById("total-carrinho").textContent = "R$ 0,00";
        return;
    }

    container.innerHTML = "";
    let subtotalOriginal = 0;
    let totalDesconto = 0;

    carrinho.forEach(item => {
        let itemTotalNormal = item.preco * item.quantidade;
        subtotalOriginal += itemTotalNormal;

        // --- LÓGICA DE DESCONTO CORRIGIDA ---
        // Normaliza o ID para string e garante que tenha os zeros à esquerda (ex: de 1 para "000001")
        const idNormalizado = String(item.id).padStart(6, '0');
        
        // Verifica se o ID do item está na nossa lista de promoções (PRODUTOS_EM_PROMOCAO)
        const isPromocao = PRODUTOS_EM_PROMOCAO.includes(idNormalizado) || PRODUTOS_EM_PROMOCAO.includes(String(item.id));
        
        // Aplica 15% se estiver na lista, caso contrário aplica 5% padrão do PIX
        let descontoPercent = isPromocao ? 0.15 : 0.05;
        
        let itemTotalPix = itemTotalNormal * (1 - descontoPercent);
        totalDesconto += (itemTotalNormal - itemTotalPix);

        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}" class="prod-img">
            <div class="item-info">
                <h3>${item.nome}</h3>
                <p>COD: ${item.id}</p>
            </div>
            <div class="item-controls">
                <div class="quantity-box">
                    <button onclick="alterarQuantidade('${item.id}', 'menos')">-</button>
                    <input type="number" value="${item.quantidade}" readonly>
                    <button onclick="alterarQuantidade('${item.id}', 'mais')">+</button>
                </div>
                <div class="item-pricing" style="text-align: right; min-width: 140px;">
                    <span style="font-size: 11px; color: #666; display: block;">Preço à vista no PIX:</span>
                    <strong style="display: block; font-size: 18px; color: #ffcc00; font-weight: 900;">${itemTotalPix.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</strong>
                    <span style="font-size: 11px; color: #aaa; text-decoration: line-through;">${itemTotalNormal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
                </div>
                <button class="btn-remove-item" onclick="removerDoCarrinho('${item.id}')" style="margin-left: 15px;">
                    <img src="https://img.icons8.com/ios-filled/50/ef4444/trash.png" alt="Remover">
                </button>
            </div>`;
        container.appendChild(div);
    });

    const totalFinalPix = (subtotalOriginal - totalDesconto) + valorFreteGlobal;

    // Resumo Lateral
    const elSubtotal = document.getElementById("subtotal-carrinho") || document.getElementById("resumo-subtotal");
    if (elSubtotal) {
        elSubtotal.textContent = subtotalOriginal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
        
        // Injeta a linha de desconto dinamicamente no HTML se ela não existir
        let descLine = document.getElementById('linha-desconto-dinamico-cart');
        if (!descLine) {
            descLine = document.createElement('div');
            descLine.id = 'linha-desconto-dinamico-cart';
            descLine.className = 'summary-line';
            descLine.innerHTML = `<span>Descontos (PIX):</span> <span id="resumo-desconto-valor" style="color: #22c55e; font-weight: 700;"></span>`;
            elSubtotal.parentElement.insertAdjacentElement('afterend', descLine);
        }
        document.getElementById('resumo-desconto-valor').textContent = `- ${totalDesconto.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
    }
    
    const totalVerde = document.getElementById("total-carrinho") || document.getElementById("resumo-total");
    if(totalVerde) {
        totalVerde.textContent = totalFinalPix.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    }
}

window.alterarQuantidade = function(id, acao) {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
    const item = carrinho.find(i => i.id === id);
    if (!item) return;

    if (acao === 'mais') item.quantidade++;
    else if (acao === 'menos' && item.quantidade > 1) item.quantidade--;

    localStorage.setItem('carrinhoEngremaq', JSON.stringify(carrinho));
    if (window.atualizarBadge) window.atualizarBadge();
    renderizarCarrinho();
}

window.removerDoCarrinho = function(id) {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
    carrinho = carrinho.filter(i => i.id !== id);
    localStorage.setItem('carrinhoEngremaq', JSON.stringify(carrinho));
    if (window.atualizarBadge) window.atualizarBadge();
    renderizarCarrinho();
}

// Calculo de Frete do Carrinho
document.getElementById("btn-calcular-frete")?.addEventListener("click", async () => {
    const cepInput = document.getElementById("cep-input").value;
    const cepNumeros = cepInput.replace(/\D/g, '');
    const display = document.getElementById("frete-display");
    const resumoFrete = document.getElementById("valor-frete-resumo");

    if (cepNumeros.length !== 8) return alert("CEP inválido. Digite 8 números.");
    display.innerHTML = `<span style="color: #d4a000; font-weight: bold;">Calculando...</span>`;
    
    try {
        const viaCepResp = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);
        const dadosViaCep = await viaCepResp.json();

        if (dadosViaCep.erro) { display.textContent = "CEP não encontrado"; return; }
        const localidadeTexto = `${dadosViaCep.localidade}-${dadosViaCep.uf}`;

        const freteResp = await fetch('https://api-engremaq.onrender.com/api/frete/calcular', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cepDestino: cepNumeros })
        });
        const dadosFrete = await freteResp.json();

        if (dadosFrete.sucesso && dadosFrete.fretes.length > 0) {
            const freteMaisBarato = dadosFrete.fretes.reduce((min, f) => f.preco < min.preco ? f : min, dadosFrete.fretes[0]);
            valorFreteGlobal = freteMaisBarato.preco;

            let opcoesHtml = `<div style="font-size: 13px; margin-top: 5px;"><strong>${localidadeTexto}</strong><br>`;
            dadosFrete.fretes.forEach(f => {
                opcoesHtml += `<div style="display:flex; justify-content:space-between; margin-top:4px; border-bottom: 1px dotted #ccc;">
                                <span>${f.nome} (${f.prazo}d)</span>
                                <strong>${f.preco.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</strong>
                               </div>`;
            });
            opcoesHtml += `</div>`;

            display.innerHTML = opcoesHtml;
            if(resumoFrete) resumoFrete.textContent = valorFreteGlobal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
            localStorage.setItem('freteSelecionado', JSON.stringify(freteMaisBarato));

            renderizarCarrinho(); 
        } else { display.innerHTML = "Não foi possível obter opções de envio."; }
    } catch (error) { display.textContent = "Erro na conexão com o servidor de frete."; }
});

document.getElementById("btn-limpar-carrinho")?.addEventListener("click", () => {
    if(confirm("Tem certeza que deseja remover todos os itens do carrinho?")) {
        localStorage.removeItem('carrinhoEngremaq');
        if (window.atualizarBadge) window.atualizarBadge();
        renderizarCarrinho();
    }
});

document.getElementById("btn-pagar-mp")?.addEventListener("click", () => {
    const carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
    const token = localStorage.getItem('tokenEngremaq'); 
    if (carrinho.length === 0) return alert("Seu carrinho está vazio!");
    if (!token) {
        alert("Para finalizar a compra, você precisa entrar na sua conta.");
        window.location.href = "Login.html?redirect=Address.html"; 
        return;
    }
    window.location.href = "Address.html";
});

document.getElementById("btn-finalizar-whats")?.addEventListener("click", () => {
    const carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
    if (carrinho.length === 0) return alert("Seu carrinho está vazio!");
    let mensagem = "Olá Engremaq! Gostaria de negociar o seguinte pedido:\n\n";
    carrinho.forEach(item => { mensagem += `• ${item.quantidade}x ${item.nome} (COD: ${item.id})\n`; });
    const linkFinal = `https://api.whatsapp.com/send?phone=5585996883588&text=${encodeURIComponent(mensagem)}`;
    window.open(linkFinal, '_blank');
});

document.addEventListener('DOMContentLoaded', renderizarCarrinho);