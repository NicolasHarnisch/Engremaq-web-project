// =========================================================
// INJEÇÃO DE CSS PARA A ANIMAÇÃO DO BOTÃO COMPRAR
// =========================================================
const styleAnimacao = document.createElement('style');
styleAnimacao.innerHTML = `
    .btn-comprar-card {
        background-color: #ffcc00;
        color: #111;
        width: 100%;
        text-transform: uppercase;
        padding: 12px;
        border-radius: 4px;
        font-weight: 900;
        border: none;
        cursor: pointer;
        transition: background 0.3s ease;
        font-family: 'Poppins', sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .btn-comprar-card:hover {
        background-color: #e6b800;
    }
    .cart-icon-btn {
        width: 0; /* Começa invisível e sem ocupar espaço */
        height: 20px;
        opacity: 0;
        transition: all 0.3s ease; /* Faz a animação suave */
        margin-right: 0;
        overflow: hidden;
    }
    /* Quando passar o mouse no botão, o carrinho expande e o texto desliza */
    .btn-comprar-card:hover .cart-icon-btn {
        width: 20px;
        opacity: 1;
        margin-right: 10px;
    }
`;
document.head.appendChild(styleAnimacao);

// =========================================================
// 1. BANCO DE DADOS 
// =========================================================
let bancoDeProdutos = []; 
const gridProdutos = document.getElementById("grid-produtos");

async function carregarProdutosDoServidor() {
    if (!gridProdutos) return;
    
    gridProdutos.innerHTML = "<p style='grid-column: 1 / -1; text-align: center; padding: 40px;'>Carregando catálogo de peças... </p>";
    
    try {
        const resposta = await fetch('http://localhost:3000/api/produtos');
        if (resposta.ok) {
            const produtosDoBanco = await resposta.json();
            
            bancoDeProdutos = produtosDoBanco.map(p => ({
                id: String(p.codigo),
                nome: p.nome,
                preco: p.preco,
                categoria: p.categoria,
                marca: p.marca,
                imagem: p.imagem
            }));

            atualizarContadoresFiltros();
            
            const urlParams = new URLSearchParams(window.location.search);
            const termoBusca = urlParams.get('busca');

            if (termoBusca) {
                const inputTopo = document.querySelector('.search-bar input');
                const inputLateral = document.getElementById("busca-nome");
                if (inputTopo) inputTopo.value = termoBusca;
                if (inputLateral) inputLateral.value = termoBusca;
            }

            aplicarFiltrosEOrdenar(true);
        } else {
            gridProdutos.innerHTML = "<p style='color: red; text-align: center;'>Erro ao buscar produtos no servidor.</p>";
        }
    } catch (erro) {
        console.error(erro);
        gridProdutos.innerHTML = "<p style='color: red; text-align: center;'>Erro de conexão. O servidor está rodando?</p>";
    }
}

function atualizarContadoresFiltros() {
    if(!gridProdutos) return;
    const contagemCat = {};
    const contagemMarca = {};

    bancoDeProdutos.forEach(p => {
        contagemCat[p.categoria] = (contagemCat[p.categoria] || 0) + 1;
        contagemMarca[p.marca] = (contagemMarca[p.marca] || 0) + 1;
    });

    document.querySelectorAll("#filter-categorias input").forEach(cb => {
        const countSpan = cb.parentElement.querySelector(".count");
        if(countSpan) countSpan.textContent = `(${contagemCat[cb.value] || 0})`;
    });

    document.querySelectorAll("#filter-marcas input").forEach(cb => {
        const countSpan = cb.parentElement.querySelector(".count");
        if(countSpan) countSpan.textContent = `(${contagemMarca[cb.value] || 0})`;
    });
}

// =========================================================
// 3. RENDERIZAÇÃO DOS PRODUTOS 
// =========================================================
function renderizarProdutos(produtos, termoBusca = "") {
    if (!gridProdutos) return;
    gridProdutos.innerHTML = "";

    if (produtos.length === 0) {
        let msgErro = termoBusca 
            ? `<p style='grid-column: 1 / -1; text-align: center; padding: 40px; font-size: 16px; font-weight: 600; color: #666;'>Nenhuma peça encontrada para "<strong>${termoBusca}</strong>".</p>`
            : `<p style='grid-column: 1 / -1; text-align: center; padding: 40px; font-weight: 600;'>Nenhuma peça encontrada.</p>`;
        gridProdutos.innerHTML = msgErro;
        return;
    }

    produtos.forEach(produto => {
        // REGRA DE OURO: Verifica a posição real do produto no banco original
        // Se estiver entre os 4 primeiros, é Promoção!
        const indexRealNoBanco = bancoDeProdutos.findIndex(p => p.id === produto.id);
        const isPromocao = indexRealNoBanco >= 0 && indexRealNoBanco < 4;
        
        const precoNormal = produto.preco;
        let descontoDecimal = isPromocao ? 0.15 : 0.05; // 15% se for promo, senão 5% PIX padrão
        let precoPix = precoNormal * (1 - descontoDecimal);
        
        let htmlPrecoAntigo = '';
        let htmlTagPromo = '';

        if (isPromocao) {
            htmlPrecoAntigo = `<span style="font-size: 12px; color: #888; text-decoration: line-through; display: block; margin-bottom: 2px;">${precoNormal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>`;
            htmlTagPromo = `<span style="background-color: #ffcc00; color: #111; font-size: 11px; font-weight: 800; padding: 2px 6px; border-radius: 4px; margin-left: 8px;">-15%</span>`;
        } else {
            // Usa o mesmo espaço vertical para o card não quebrar, mas sem valor e sem o R$
            htmlPrecoAntigo = `<span style="font-size: 12px; display: block; margin-bottom: 2px;">&nbsp;</span>`;
            htmlTagPromo = '';
        }

        const card = document.createElement("div");
        card.className = "card";
        // Estilo moderno aplicado diretamente no card
        card.style.cssText = "display:flex; flex-direction:column; background:#fff; border:1px solid #eee; border-radius:8px; transition:0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow:hidden;";
        card.onmouseover = function() { this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 25px rgba(0,0,0,0.1)'; };
        card.onmouseout = function() { this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.05)'; };
        
        card.innerHTML = `
            <a href="ProductDetail.html?id=${produto.id}" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; flex: 1; cursor: pointer; padding: 20px;">
                <div class="card-img" style="height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px; padding: 10px;">
                    <img src="${produto.imagem}" alt="${produto.nome}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                </div>
                
                <div class="card-info" style="padding: 0; text-align: left; display: flex; flex-direction: column; flex: 1;">
                    <h3 style="font-size: 15px; color: #333; font-weight: 600; line-height: 1.4; margin: 0 0 10px 0;">${produto.nome}</h3>
                    
                    <div style="margin-top: auto;">
                        ${htmlPrecoAntigo}
                        
                        <div style="display: flex; align-items: center; margin: 2px 0 5px 0;">
                            <strong style="font-size: 22px; color: #d4a000; font-weight: 800; line-height: 1;">
                                ${precoPix.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                            </strong>
                            ${htmlTagPromo}
                        </div>
                        
                        <p style="font-size: 12px; color: #666; margin: 0 0 2px 0;">À vista no PIX</p>
                        <p style="font-size: 12px; color: #666; margin: 0 0 15px 0;">ou até <strong>10x de ${(precoNormal/10).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</strong></p>
                    </div>
                </div>
                
                <button class="btn-comprar-card" onclick="event.preventDefault(); window.adicionarAoCarrinho('${produto.id}')">
                    <svg class="cart-icon-btn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span>COMPRAR</span>
                </button>
            </a>`;
        gridProdutos.appendChild(card);
    });
}

// =========================================================
// 4. LÓGICA DO CARRINHO
// =========================================================
window.adicionarAoCarrinho = function(idProduto) {
    const produto = bancoDeProdutos.find(p => p.id === idProduto);
    let carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
    const itemNoCarrinho = carrinho.find(i => i.id === idProduto);
    
    if (itemNoCarrinho) {
        itemNoCarrinho.quantidade += 1;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }

    localStorage.setItem('carrinhoEngremaq', JSON.stringify(carrinho));
    if (window.atualizarBadge) window.atualizarBadge(); 
    alert(`✅ ${produto.nome} adicionado ao carrinho!`);
}

// =========================================================
// 5. FILTROS E ORDENAÇÃO (COM PROMOÇÕES PRIMEIRO)
// =========================================================
function aplicarFiltrosEOrdenar(ignorarScroll = false) {
    let filtrados = [...bancoDeProdutos];

    const inputLateral = document.getElementById("busca-nome");
    const inputTopo = document.querySelector('.search-bar input');
    const busca = (inputTopo?.value || inputLateral?.value || "").toLowerCase().trim();
    const min = parseFloat(document.getElementById("preco-min")?.value) || 0;
    const max = parseFloat(document.getElementById("preco-max")?.value) || Infinity;
    const ordem = document.getElementById("ordenar")?.value;

    const catMarcadas = Array.from(document.querySelectorAll("#filter-categorias input:checked")).map(cb => cb.value);
    const marcasMarcadas = Array.from(document.querySelectorAll("#filter-marcas input:checked")).map(cb => cb.value);

    // Aplica todos os filtros (Busca, Preço, Categoria, Marca)
    filtrados = filtrados.filter(p => {
        const bateBusca = !busca || p.nome.toLowerCase().includes(busca) || p.id.includes(busca);
        const batePreco = p.preco >= min && p.preco <= max;
        const bateCat = catMarcadas.length === 0 || catMarcadas.includes(p.categoria);
        const bateMarca = marcasMarcadas.length === 0 || marcasMarcadas.includes(p.marca);
        return bateBusca && batePreco && bateCat && bateMarca;
    });

    // Função utilitária para saber se é promoção (Baseada na posição real do banco)
    const isPromo = (id) => {
        const idx = bancoDeProdutos.findIndex(p => p.id === id);
        return idx >= 0 && idx < 4;
    };

    // Aplica a ordenação
    if (ordem === "menor-preco") {
        filtrados.sort((a, b) => a.preco - b.preco);
    } else if (ordem === "maior-preco") {
        filtrados.sort((a, b) => b.preco - a.preco);
    } else if (ordem === "nome-az") {
        filtrados.sort((a, b) => a.nome.localeCompare(b.nome));
    } else {
        // ORDENAÇÃO PADRÃO (RELEVÂNCIA): Joga as promoções para o início
        filtrados.sort((a, b) => {
            const promoA = isPromo(a.id) ? 1 : 0;
            const promoB = isPromo(b.id) ? 1 : 0;
            return promoB - promoA; 
        });
    }

    if (!ignorarScroll) window.scrollTo({ top: 0, behavior: 'smooth' });

    renderizarProdutos(filtrados, busca);
    atualizarTituloPesquisa(busca);
}

function atualizarTituloPesquisa(termo) {
    if (!gridProdutos) return;
    let tituloContainer = document.getElementById("titulo-pesquisa-dinamico");
    
    if (termo && termo !== "") {
        if (!tituloContainer) {
            tituloContainer = document.createElement("div");
            tituloContainer.id = "titulo-pesquisa-dinamico";
            tituloContainer.style.width = "100%";
            tituloContainer.style.marginBottom = "20px";
            gridProdutos.parentNode.insertBefore(tituloContainer, gridProdutos);
        }
        tituloContainer.innerHTML = `<h3 style="font-size: 18px; font-weight: 700; color: #333; margin:0;">Você pesquisou por: <span style="color: #666; font-weight: 400;">"${termo}"</span></h3>`;
    } else {
        if (tituloContainer) tituloContainer.remove();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (gridProdutos) {
        carregarProdutosDoServidor();

        const inputLateral = document.getElementById("busca-nome");
        const inputTopo = document.querySelector('.search-bar input');
        
        if (inputLateral) inputLateral.addEventListener("input", () => aplicarFiltrosEOrdenar(true));
        
        if (inputTopo) {
            inputTopo.addEventListener("input", (e) => {
                if (inputLateral) inputLateral.value = e.target.value; 
                aplicarFiltrosEOrdenar(true);
            });
        }

        document.getElementById("preco-min")?.addEventListener("change", () => aplicarFiltrosEOrdenar());
        document.getElementById("preco-max")?.addEventListener("change", () => aplicarFiltrosEOrdenar());
        document.getElementById("ordenar")?.addEventListener("change", () => aplicarFiltrosEOrdenar());
        document.querySelectorAll("input[type='checkbox']").forEach(cb => {
            cb.addEventListener("change", () => aplicarFiltrosEOrdenar());
        });
        
        document.getElementById("btn-limpar")?.addEventListener("click", () => {
            document.querySelectorAll("input[type='checkbox']").forEach(cb => cb.checked = false);
            ["preco-min", "preco-max", "busca-nome"].forEach(id => {
                const el = document.getElementById(id);
                if(el) el.value = "";
            });
            if (inputTopo) inputTopo.value = "";

            const sort = document.getElementById("ordenar");
            if(sort) sort.value = "relevancia";

            const url = new URL(window.location);
            url.searchParams.delete('busca');
            window.history.pushState({}, '', url);

            aplicarFiltrosEOrdenar();
        });
    }
});