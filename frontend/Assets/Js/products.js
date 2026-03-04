// =========================================================
// 1. BANCO DE DADOS (ARRAY DE PRODUTOS)
// =========================================================
const bancoDeProdutos = [
    { id: "100001", nome: "Filtro de Óleo", preco: 150.00, categoria: "filtros", marca: "mahle", imagem: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/Assets/Images/download.jpeg" },
    { id: "100003", nome: "Engrenagem de Tração Trator MF", preco: 820.00, categoria: "engrenagens", marca: "massey", imagem: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/Assets/Images/engrenagem_satelite_27_d_tracao_trator_mf_660_680_036420r1_1881_1_27082a9123eabe425be96e622170ffd7.webp" },
    { id: "000001", nome: "Correia de Reposição", preco: 250.00, categoria: "correias", marca: "multimarca", imagem: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/Assets/Images/8PK1930GOOD_02.webp" },
    { id: "100004", nome: "Bomba Injetora New Holland", preco: 3500.00, categoria: "bombas", marca: "newholland", imagem: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/Assets/Images/bomba-injetora-trator-new-holland-7610-dps-ano-inicial-1992-ano-final-motor-fnh-268-cu-in-codigo-montadora-esnn9a543va-0d8e4a0a.webp" },
    { id: "000002", nome: "Peça Metálica Linha Pesada", preco: 450.00, categoria: "acessorios", marca: "multimarca", imagem: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/Assets/Images/images.jpeg" },
    { id: "000003", nome: "Filtro de Ar Massey", preco: 180.00, categoria: "filtros", marca: "massey", imagem: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/Assets/Images/filtro_ar_trator_massey_ant_292_295_296_610_620_640_jogo_1081_1_00686a861dfc45d1cf5521491040ea81_20240528141146.webp" }
];

const gridProdutos = document.getElementById("grid-produtos");

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

    // Mensagem amigável se a busca não encontrar nada
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

    // Sincroniza a busca da barra do topo com a lateral
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

    // Desce a tela levemente só se o clique for nos checkboxes (ignora ao digitar)
    if (!ignorarScroll) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderizarProdutos(filtrados, busca);
    atualizarTituloPesquisa(busca);
}

// Cria/Atualiza o título "Você pesquisou por:" dinamicamente
function atualizarTituloPesquisa(termo) {
    if (!gridProdutos) return;
    let tituloContainer = document.getElementById("titulo-pesquisa-dinamico");
    
    if (termo && termo !== "") {
        if (!tituloContainer) {
            tituloContainer = document.createElement("div");
            tituloContainer.id = "titulo-pesquisa-dinamico";
            tituloContainer.style.width = "100%";
            tituloContainer.style.marginBottom = "20px";
            // Insere antes da grade de produtos
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
        atualizarContadoresFiltros();
        
        // 1. Lê a URL para ver se veio uma pesquisa da Home
        const urlParams = new URLSearchParams(window.location.search);
        const termoBusca = urlParams.get('busca');

        // Se tiver busca na URL, preenche os campos automaticamente
        if (termoBusca) {
            const inputTopo = document.querySelector('.search-bar input');
            const inputLateral = document.getElementById("busca-nome");
            if (inputTopo) inputTopo.value = termoBusca;
            if (inputLateral) inputLateral.value = termoBusca;
        }

        // Renderiza os produtos inicialmente já aplicando o filtro (se houver)
        aplicarFiltrosEOrdenar(true); 

        // 2. MANTÉM 'input' para busca (para ser instantâneo conforme digita)
        const inputLateral = document.getElementById("busca-nome");
        const inputTopo = document.querySelector('.search-bar input');
        
        if (inputLateral) {
            inputLateral.addEventListener("input", () => aplicarFiltrosEOrdenar(true));
        }
        
        // Faz a barra do topo e a lateral trabalharem juntas em sincronia
        if (inputTopo) {
            inputTopo.addEventListener("input", (e) => {
                if (inputLateral) inputLateral.value = e.target.value; 
                aplicarFiltrosEOrdenar(true);
            });
        }

        // 3. ALTERADO PARA 'change' nos preços (corrige o bug de pular para o topo)
        document.getElementById("preco-min")?.addEventListener("change", () => aplicarFiltrosEOrdenar());
        document.getElementById("preco-max")?.addEventListener("change", () => aplicarFiltrosEOrdenar());
        
        // 4. MANTÉM 'change' para seletores e checkboxes
        document.getElementById("ordenar")?.addEventListener("change", () => aplicarFiltrosEOrdenar());
        document.querySelectorAll("input[type='checkbox']").forEach(cb => {
            cb.addEventListener("change", () => aplicarFiltrosEOrdenar());
        });
        
        // 5. Botão Limpar Tudo
        document.getElementById("btn-limpar")?.addEventListener("click", () => {
            document.querySelectorAll("input[type='checkbox']").forEach(cb => cb.checked = false);
            ["preco-min", "preco-max", "busca-nome"].forEach(id => {
                const el = document.getElementById(id);
                if(el) el.value = "";
            });
            if (inputTopo) inputTopo.value = "";

            const sort = document.getElementById("ordenar");
            if(sort) sort.value = "relevancia";

            // Limpa a URL para não manter o "busca=" ao recarregar a página
            const url = new URL(window.location);
            url.searchParams.delete('busca');
            window.history.pushState({}, '', url);

            aplicarFiltrosEOrdenar();
        });
    }
});