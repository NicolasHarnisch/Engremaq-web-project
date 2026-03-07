// =========================================================
// 1. BANCO DE DADOS (AGORA VEM DO BACK-END)
// =========================================================
let bancoDeProdutos = []; // Começa vazio
const gridProdutos = document.getElementById("grid-produtos");

// Função para buscar os produtos no MongoDB
async function carregarProdutosDoServidor() {
    if (!gridProdutos) return;
    
    gridProdutos.innerHTML = "<p style='grid-column: 1 / -1; text-align: center; padding: 40px;'>Carregando produtos da nuvem... ☁️</p>";
    
    try {
        const resposta = await fetch('http://localhost:3000/api/produtos');
        if (resposta.ok) {
            const produtosDoBanco = await resposta.json();
            
            // Mapeia os dados do MongoDB para o formato que o seu Front-end já entende
            bancoDeProdutos = produtosDoBanco.map(p => ({
                id: p.codigo,
                nome: p.nome,
                preco: p.preco,
                categoria: p.categoria,
                marca: p.marca,
                imagem: p.imagem
            }));

            atualizarContadoresFiltros();
            
            // Lê a URL para ver se veio uma pesquisa da Home
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

// =========================================================
// 2. CONTADORES REAIS (Mostra a quantidade de cada filtro)
// =========================================================
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
// 3. RENDERIZAÇÃO DOS PRODUTOS (Cards Dinâmicos)
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
        const mensagemAjustada = `Olá! Gostaria de comprar a peça: ${produto.nome} (CÓD: ${produto.id})`;
        const linkWhats = `https://api.whatsapp.com/send?phone=5585996883588&text=${encodeURIComponent(mensagemAjustada)}`;

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="card-img"><img src="${produto.imagem}" alt="${produto.nome}"></div>
            <div class="card-info">
                <h3>${produto.nome}</h3>
                <span class="product-code">COD: ${produto.id}</span>
                <p class="preco">${produto.preco.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p>
                <div class="card-buttons">
                    <button class="btn-action btn-cart" onclick="adicionarAoCarrinho('${produto.id}')">Adicionar ao Carrinho</button>
                    <a class="btn-action btn-whats" href="${linkWhats}" target="_blank">Comprar pelo WhatsApp</a>
                </div>
            </div>`;
        gridProdutos.appendChild(card);
    });
}

// =========================================================
// 4. LÓGICA DO CARRINHO (LocalStorage)
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
// 5. FILTROS E ORDENAÇÃO AUTOMÁTICA
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

    filtrados = filtrados.filter(p => {
        const bateBusca = !busca || p.nome.toLowerCase().includes(busca) || p.id.includes(busca);
        const batePreco = p.preco >= min && p.preco <= max;
        const bateCat = catMarcadas.length === 0 || catMarcadas.includes(p.categoria);
        const bateMarca = marcasMarcadas.length === 0 || marcasMarcadas.includes(p.marca);
        return bateBusca && batePreco && bateCat && bateMarca;
    });

    if (ordem === "menor-preco") filtrados.sort((a, b) => a.preco - b.preco);
    else if (ordem === "maior-preco") filtrados.sort((a, b) => b.preco - a.preco);
    else if (ordem === "nome-az") filtrados.sort((a, b) => a.nome.localeCompare(b.nome));

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

// =========================================================
// 6. INICIALIZAÇÃO DA PÁGINA
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    if (gridProdutos) {
        // CHAMA O BACKEND ASSIM QUE A PÁGINA CARREGA
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