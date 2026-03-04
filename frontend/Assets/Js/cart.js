let valorFreteGlobal = 0;

// Função para desenhar os itens na tela (Estilo Kabum)
function renderizarCarrinho() {
    const container = document.getElementById("cart-items-container");
    if (!container) return;
    
    const carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
    
    // Se o carrinho estiver vazio
    if (carrinho.length === 0) {
        container.innerHTML = "<p style='padding:20px; font-weight:600; text-align:center;'>Seu carrinho está vazio.</p>";
        document.getElementById("subtotal-carrinho").textContent = "R$ 0,00";
        document.getElementById("total-carrinho").textContent = "R$ 0,00";
        return;
    }

    container.innerHTML = "";

    let subtotal = 0;
    carrinho.forEach(item => {
        let itemTotal = item.preco * item.quantidade;
        subtotal += itemTotal;

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
                <div class="item-pricing">
                    <strong>${itemTotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</strong>
                </div>
                <button class="btn-remove-item" onclick="removerDoCarrinho('${item.id}')">
                    <img src="https://img.icons8.com/ios-filled/50/ef4444/trash.png" alt="Remover">
                </button>
            </div>`;
        container.appendChild(div);
    });

    // Atualiza os valores no resumo lateral
    document.getElementById("subtotal-carrinho").textContent = subtotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    
    const totalFinal = subtotal + valorFreteGlobal;
    document.getElementById("total-carrinho").textContent = totalFinal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
}

// Funções de controle de quantidade e remoção
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

// Lógica de Frete (ViaCEP)
document.getElementById("btn-calcular-frete")?.addEventListener("click", async () => {
    const cep = document.getElementById("cep-input").value.replace(/\D/g, '');
    const display = document.getElementById("frete-display");
    const resumoFrete = document.getElementById("valor-frete-resumo");

    if (cep.length !== 8) return alert("CEP inválido");

    display.textContent = "Calculando...";
    
    try {
        const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await resp.json();

        if (dados.erro) {
            display.textContent = "CEP não encontrado";
            return;
        }

        // Regra de negócio: Ceará é mais barato
        valorFreteGlobal = dados.uf === 'CE' ? 15.00 : 45.00;
        
        display.textContent = `Frete para ${dados.localidade}-${dados.uf}`;
        if(resumoFrete) resumoFrete.textContent = valorFreteGlobal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
        
        renderizarCarrinho(); 
    } catch (error) {
        display.textContent = "Erro na conexão";
    }
});

// Limpar todo o carrinho
document.getElementById("btn-limpar-carrinho")?.addEventListener("click", () => {
    if(confirm("Tem certeza que deseja remover todos os itens do carrinho?")) {
        localStorage.removeItem('carrinhoEngremaq');
        if (window.atualizarBadge) window.atualizarBadge();
        renderizarCarrinho();
    }
});

// =========================================================
// BOTÃO CONTINUAR (IR PARA ENDEREÇO)
// =========================================================
document.getElementById("btn-pagar-mp")?.addEventListener("click", () => {
    const carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
    
    // Trava de segurança: não deixa avançar se o carrinho estiver vazio
    if (carrinho.length === 0) {
        return alert("Seu carrinho está vazio! Adicione produtos antes de continuar.");
    }
    
    // Redireciona para a página de endereço
    window.location.href = "Address.html";
});

// =========================================================
// BOTÃO NEGOCIAR VIA WHATSAPP
// =========================================================
document.getElementById("btn-finalizar-whats")?.addEventListener("click", () => {
    const carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
    if (carrinho.length === 0) return alert("Seu carrinho está vazio!");

    let mensagem = "Olá Engremaq! Gostaria de negociar o seguinte pedido:\n\n";
    
    carrinho.forEach(item => {
        mensagem += `• ${item.quantidade}x ${item.nome} (COD: ${item.id})\n`;
    });

    let subtotal = carrinho.reduce((acc, i) => acc + (i.preco * i.quantidade), 0);
    let totalComFrete = subtotal + valorFreteGlobal;

    mensagem += `\n📦 Frete: ${valorFreteGlobal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
    mensagem += `\n💰 Total: ${totalComFrete.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;

    const linkFinal = `https://api.whatsapp.com/send?phone=5585996883588&text=${encodeURIComponent(mensagem)}`;
    window.open(linkFinal, '_blank');
});

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', renderizarCarrinho);