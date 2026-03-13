// index.js - Gerenciador da Página Inicial Engremaq
let bancoDePrecosHome = [];

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. BUSCA OS PRODUTOS NO MONGODB
    try {
        const res = await fetch('http://localhost:3000/api/produtos');
        if (res.ok) {
            const produtosNoBanco = await res.json();
            bancoDePrecosHome = produtosNoBanco; 
            renderizarVitrinesHome(produtosNoBanco);
        }
    } catch (erro) {
        console.error("Erro ao carregar produtos na Home:", erro);
        const gridPromocoes = document.getElementById('grid-promocoes');
        if(gridPromocoes) gridPromocoes.innerHTML = "<p style='padding: 20px; grid-column: 1/-1; text-align: center; font-weight: bold;'>A carregar produtos do banco de dados... ☁️</p>";
    }
    
    // 2. LÓGICA DO CARROSSEL (BANNER PRINCIPAL)
    const slides = document.querySelectorAll('.hero-slide');
    const btnPrev = document.getElementById('heroPrev');
    const btnNext = document.getElementById('heroNext');
    let currentSlide = 0;
    let autoPlayInterval;

    if (slides.length > 0 && btnPrev && btnNext) {
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('is-active'));
            slides[index].classList.add('is-active');
        }
        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                currentSlide++;
                if (currentSlide >= slides.length) currentSlide = 0; 
                showSlide(currentSlide);
            }, 5000);
        }
        function resetAutoPlay() { clearInterval(autoPlayInterval); startAutoPlay(); }

        btnPrev.addEventListener('click', () => {
            currentSlide--;
            if (currentSlide < 0) currentSlide = slides.length - 1; 
            showSlide(currentSlide);
            resetAutoPlay();
        });

        btnNext.addEventListener('click', () => {
            currentSlide++;
            if (currentSlide >= slides.length) currentSlide = 0; 
            showSlide(currentSlide);
            resetAutoPlay();
        });
        
        startAutoPlay();
    }
});

// 3. RENDERIZAR OS PRODUTOS NA HOME
function renderizarVitrinesHome(produtos) {
    const gridPromocoes = document.getElementById('grid-promocoes');
    const gridMaisVendidos = document.getElementById('grid-mais-vendidos');

    // REGRA DE OURO: Os 4 primeiros são Promoção, os próximos 4 são Mais Vendidos
    const promocoes = produtos.slice(0, 4);
    const maisVendidos = produtos.slice(4, 8); 

    if (gridPromocoes) {
        gridPromocoes.className = "cards-grid cards-grid-4"; // Garante 4 colunas
        // Passa o parâmetro 'true' para ativar a etiqueta de -15%
        gridPromocoes.innerHTML = promocoes.map(p => gerarHtmlCardModerno(p, true)).join('');
    }
    
    if (gridMaisVendidos) {
        // Passa o parâmetro 'false' para Ocultar a etiqueta (aplica só os 5% do PIX padrão)
        gridMaisVendidos.innerHTML = maisVendidos.map(p => gerarHtmlCardModerno(p, false)).join('');
    }
}

// CONSTRUTOR DOS CARTÕES (Usado por ambas as vitrines)
function gerarHtmlCardModerno(produto, isPromocao) {
    const precoOriginal = produto.preco;
    
    // Matemática: Se for promoção 15%, senão 5%
    const descontoPercent = isPromocao ? 0.15 : 0.05;
    const precoDesconto = precoOriginal * (1 - descontoPercent);
    const parcela = precoOriginal / 10;

    // A Etiqueta amarela SÓ APARECE se isPromocao for verdadeiro!
    const etiquetaDescontoHtml = isPromocao 
        ? `<span style="background:#ffcc00; color:#111; font-size:11px; font-weight:800; padding:3px 6px; border-radius:4px; margin-left: 8px;">-15%</span>` 
        : ``;

    return `
    <article class="card" style="display:flex; flex-direction:column; background:#fff; border:1px solid #eee; border-radius:8px; padding:20px; transition:0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.05); cursor: pointer;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 25px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.05)';">
        <div style="height:180px; display:flex; align-items:center; justify-content:center; margin-bottom:15px; padding: 10px;">
            <img src="${produto.imagem}" alt="${produto.nome}" style="max-height:100%; max-width:100%; object-fit:contain;">
        </div>
        
        <h3 style="font-size:15px; color:#333; margin-bottom:10px; font-weight:600; line-height:1.4;">${produto.nome}</h3>
        
        <div style="margin-top:auto;">
            <span style="text-decoration:line-through; color:#aaa; font-size:12px; font-weight: 500;">
                ${precoOriginal.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}
            </span>
            
            <div style="display:flex; align-items:center; margin:2px 0 5px 0;">
                <strong style="color:#d4a000; font-size:22px; font-weight:800;">
                    ${precoDesconto.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}
                </strong>
                ${etiquetaDescontoHtml}
            </div>
            
            <p style="color:#666; font-size:12px; margin:0 0 2px 0;">À vista no PIX</p>
            <p style="color:#666; font-size:12px; margin:0 0 15px 0;">ou até <strong>10x de ${parcela.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</strong></p>
            
            <button onclick="window.adicionarAoCarrinhoHome('${produto.codigo}', event)" style="width:100%; background:#ffcc00; color:#111; font-weight:800; border:none; padding:12px; border-radius:4px; cursor:pointer; font-size:14px; transition:0.2s;" onmouseover="this.style.filter='brightness(0.95)'" onmouseout="this.style.filter='brightness(1)'">
                COMPRAR
            </button>
        </div>
    </article>
    `;
}

// 4. LÓGICA DE ADICIONAR AO CARRINHO
window.adicionarAoCarrinhoHome = function(codigoStr, event) {
    if (event) event.stopPropagation(); 

    const produtoData = bancoDePrecosHome.find(p => String(p.codigo) === String(codigoStr));
    if (!produtoData) return alert("Produto ainda a carregar do banco de dados...");

    const novoProduto = { 
        id: String(produtoData.codigo), 
        nome: produtoData.nome, 
        preco: produtoData.preco, 
        imagem: produtoData.imagem, 
        quantidade: 1 
    };

    let carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
    const itemExistente = carrinho.find(item => item.id === novoProduto.id);
    
    if (itemExistente) itemExistente.quantidade += 1;
    else carrinho.push(novoProduto);

    localStorage.setItem('carrinhoEngremaq', JSON.stringify(carrinho));
    if (window.atualizarBadge) window.atualizarBadge();
    
    alert(`✅ ${novoProduto.nome} foi adicionado ao seu carrinho!`);
}