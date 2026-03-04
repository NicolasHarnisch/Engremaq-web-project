document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. LÓGICA DA BARRA DE PESQUISA ESTILO KABUM!
    // ==========================================
    const searchBar = document.querySelector('.search-bar');
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');

    if (searchBar && searchInput && searchButton) {
        
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `position: relative; flex: 1; max-width: 350px; min-width: 200px; margin: 0 20px;`;
        searchBar.parentNode.insertBefore(wrapper, searchBar);
        wrapper.appendChild(searchBar);
        searchBar.style.margin = '0';
        searchBar.style.maxWidth = '100%';

        const dropdown = document.createElement('div');
        dropdown.style.cssText = `
            position: absolute; top: calc(100% - 2px); left: 0; right: 0;
            background: #fff; border: 2px solid #ffcc00; border-top: 1px solid #eee;
            border-radius: 0 0 8px 8px; box-shadow: 0 8px 15px rgba(0,0,0,0.1);
            max-height: 300px; overflow-y: auto; z-index: 9999; display: none;
        `;
        wrapper.appendChild(dropdown);

        // Banco de dados de peças
        const produtosEngremaq = [
            { id: "000001", nome: "Correia de Reposição", img: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/Assets/Images/8PK1930GOOD_02.webp" },
            { id: "000002", nome: "Peça metálica — linha pesada", img: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/Assets/Images/images.jpeg" },
            { id: "000003", nome: "Filtro de ar Massey", img: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/Assets/Images/filtro_ar_trator_massey_ant_292_295_296_610_620_640_jogo_1081_1_00686a861dfc45d1cf5521491040ea81_20240528141146.webp" },
            { id: "100001", nome: "Filtro de óleo", img: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/Assets/Images/download.jpeg" },
            { id: "100002", nome: "Kit manutenção de motor 229", img: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/Assets/Images/pecas-para-tratores-kit-manutencao-motor-229-4-cilindros-aspirado-p-1739990766956.png" },
            { id: "100003", nome: "Engrenagem de Tração Trator MF", img: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/Assets/Images/engrenagem_satelite_27_d_tracao_trator_mf_660_680_036420r1_1881_1_27082a9123eabe425be96e622170ffd7.webp" },
            { id: "100004", nome: "Bomba Injetora New Holland", img: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/Assets/Images/bomba-injetora-trator-new-holland-7610-dps-ano-inicial-1992-ano-final-motor-fnh-268-cu-in-codigo-montadora-esnn9a543va-0d8e4a0a.webp" }
        ];

        const isHome = window.location.pathname.toLowerCase().includes('index.html') || window.location.pathname.endsWith('/');
        const linkProdutos = isHome ? 'Pages/Products.html' : 'Products.html';

        searchInput.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase().trim();
            dropdown.innerHTML = ''; 

            if (termo.length === 0) {
                dropdown.style.display = 'none';
                searchBar.style.borderRadius = '8px';
                return;
            }

            const resultados = produtosEngremaq.filter(p => p.nome.toLowerCase().includes(termo) || p.id.includes(termo));

            if (resultados.length > 0) {
                dropdown.style.display = 'block';
                searchBar.style.borderRadius = '8px 8px 0 0';

                resultados.forEach(produto => {
                    const item = document.createElement('div');
                    item.style.cssText = `display: flex; align-items: center; padding: 10px; gap: 15px; cursor: pointer; border-bottom: 1px solid #eee; transition: background 0.2s;`;
                    item.innerHTML = `
                        <img src="${produto.img}" style="width: 40px; height: 40px; object-fit: contain;">
                        <div style="display:flex; flex-direction:column;">
                            <span style="font-size: 13px; font-weight: 600; color: #111;">${produto.nome}</span>
                            <span style="font-size: 11px; color: #888;">COD: ${produto.id}</span>
                        </div>
                    `;

                    item.addEventListener('mouseenter', () => item.style.backgroundColor = '#f9f9f9');
                    item.addEventListener('mouseleave', () => item.style.backgroundColor = 'transparent');
                    
                    item.addEventListener('click', () => {
                        searchInput.value = produto.nome;
                        executarBusca();
                    });

                    dropdown.appendChild(item);
                });
            } else {
                dropdown.style.display = 'none';
                searchBar.style.borderRadius = '8px';
            }
        });

        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                dropdown.style.display = 'none';
                searchBar.style.borderRadius = '8px';
            }
        });

        function executarBusca() {
            const termoOriginal = searchInput.value.trim();
            const termo = termoOriginal.toLowerCase();
            if (termo === '') return;

            dropdown.style.display = 'none';
            searchBar.style.borderRadius = '8px';

            const produtosNaTela = document.querySelectorAll('.product-card, .card, [class*="produto"]');

            if (!isHome && produtosNaTela.length > 0) {
                let encontrou = false;
                
                produtosNaTela.forEach(card => {
                    const texto = card.innerText.toLowerCase();
                    if(texto.includes(termo)) {
                        card.style.display = '';
                        encontrou = true;
                    } else {
                        card.style.display = 'none';
                    }
                });

                const container = produtosNaTela[0].parentElement;
                let tituloPesquisa = document.getElementById('titulo-pesquisa-dinamico');
                if(!tituloPesquisa) {
                    tituloPesquisa = document.createElement('div');
                    tituloPesquisa.id = 'titulo-pesquisa-dinamico';
                    tituloPesquisa.style.width = '100%';
                    tituloPesquisa.style.gridColumn = '1 / -1';
                    tituloPesquisa.style.marginBottom = '20px';
                    container.insertBefore(tituloPesquisa, container.firstChild);
                }
                tituloPesquisa.innerHTML = `<h3 style="font-size: 18px; font-weight: 700; color: #333; margin:0;">Você pesquisou por: <span style="color: #666; font-weight: 400;">"${termoOriginal}"</span></h3>`;

                const msgErroAntiga = document.getElementById('msg-erro-pesquisa');
                if(msgErroAntiga) msgErroAntiga.remove();

                if(!encontrou) {
                    const msgErro = document.createElement('div');
                    msgErro.id = 'msg-erro-pesquisa';
                    msgErro.style.width = '100%';
                    msgErro.style.gridColumn = '1 / -1';
                    msgErro.innerHTML = `<p style="text-align: center; color: #666; font-size: 15px; padding: 40px;">Nenhum produto encontrado para "<strong>${termoOriginal}</strong>".</p>`;
                    container.appendChild(msgErro);
                }

                const url = new URL(window.location);
                url.searchParams.set('busca', termoOriginal);
                window.history.pushState({}, '', url);

            } else {
                window.location.href = `${linkProdutos}?busca=${encodeURIComponent(termoOriginal)}`;
            }
        }

        searchButton.addEventListener('click', executarBusca);
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); 
                executarBusca();
            }
        });
    }

    // ==========================================
    // 2. SISTEMA DE USUÁRIO E DROPDOWN
    // ==========================================
    const loginLink = document.querySelector('.user-actions .action-link[href*="Login.html"]') || 
                      document.querySelector('.user-actions .action-link[href*="Login"]');
    
    if (loginLink) {
        const usuario = JSON.parse(localStorage.getItem('usuarioEngremaq'));

        if (usuario) {
            const spanNome = loginLink.querySelector('span');
            if (spanNome) spanNome.textContent = `Olá, ${usuario.nome.split(' ')[0]}`;
            
            const isHome = window.location.pathname.toLowerCase().includes('index.html') || window.location.pathname.endsWith('/');
            const prefix = isHome ? 'Pages/' : '';
            
            loginLink.href = `${prefix}Dashboard.html`;

            const container = document.createElement('div');
            container.style.cssText = 'position: relative; display: flex; align-items: center; height: 100%; cursor: pointer;';
            loginLink.parentNode.insertBefore(container, loginLink);
            container.appendChild(loginLink);

            const dropdown = document.createElement('div');
            dropdown.style.cssText = 'position: absolute; top: 100%; right: -10px; padding-top: 15px; display: none; z-index: 1000;';
            dropdown.innerHTML = `
                <div style="background: #fff; border: 2px solid #ffcc00; border-radius: 8px; box-shadow: 0 8px 15px rgba(0,0,0,0.1); width: 220px; display: flex; flex-direction: column; font-family: 'Poppins', sans-serif; position: relative;">
                    <div style="position: absolute; top: -10px; right: 30px; border-width: 0 10px 10px 10px; border-style: solid; border-color: transparent transparent #ffcc00 transparent;"></div>
                    <div style="background: #111; color: #fff; padding: 15px; border-radius: 5px 5px 0 0; text-align: center; font-size: 13px;">
                        <strong>CONTA ENGREMAQ</strong>
                    </div>
                    <a href="${prefix}Dashboard.html#central" style="padding: 12px 20px; color: #333; text-decoration: none; font-size: 14px; font-weight: 600; border-bottom: 1px solid #eee; transition: background 0.2s;">Central Minha Conta</a>
                    <a href="${prefix}Dashboard.html#pedidos" style="padding: 12px 20px; color: #333; text-decoration: none; font-size: 14px; font-weight: 600; border-bottom: 1px solid #eee; transition: background 0.2s;">Meus Pedidos</a>
                    <a href="${prefix}Dashboard.html#enderecos" style="padding: 12px 20px; color: #333; text-decoration: none; font-size: 14px; font-weight: 600; border-bottom: 1px solid #eee; transition: background 0.2s;">Endereços</a>
                    <a href="${prefix}Dashboard.html#dados" style="padding: 12px 20px; color: #333; text-decoration: none; font-size: 14px; font-weight: 600; border-bottom: 1px solid #eee; transition: background 0.2s;">Meus Dados</a>
                    <a href="#" id="btn-sair-conta" style="padding: 12px 20px; color: #ef4444; text-decoration: none; font-size: 14px; font-weight: 600; transition: background 0.2s; border-radius: 0 0 5px 5px;">Sair</a>
                </div>
            `;
            container.appendChild(dropdown);

            let fecharTimer;
            container.addEventListener('mouseenter', () => { clearTimeout(fecharTimer); dropdown.style.display = 'block'; });
            container.addEventListener('mouseleave', () => { fecharTimer = setTimeout(() => { dropdown.style.display = 'none'; }, 200); });

            const links = dropdown.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('mouseenter', () => { link.style.backgroundColor = '#f9f9f9'; link.style.color = link.id === 'btn-sair-conta' ? '#dc2626' : '#ffcc00'; });
                link.addEventListener('mouseleave', () => { link.style.backgroundColor = 'transparent'; link.style.color = link.id === 'btn-sair-conta' ? '#ef4444' : '#333'; });
            });

            document.getElementById('btn-sair-conta').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('usuarioEngremaq'); 
                window.location.reload(); 
            });
        }
    }

    // ==========================================
    // 3. ATUALIZAÇÃO GLOBAL DO CARRINHO (NOVO!)
    // ==========================================
    window.atualizarCarrinhoHeader = function() {
        const carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
        
        let quantidadeTotal = 0;
        let precoTotal = 0;

        // Calcula a quantidade de itens e o preço total
        carrinho.forEach(item => {
            quantidadeTotal += item.quantidade;
            precoTotal += (item.preco * item.quantidade);
        });

        // Procura os elementos visuais no Cabeçalho
        const badge = document.querySelector('.cart-badge');
        const priceLabel = document.querySelector('.cart-price');

        if (badge) {
            badge.textContent = quantidadeTotal;
            // Oculta a bolinha vermelha se não houver produtos no carrinho
            badge.style.display = quantidadeTotal > 0 ? 'flex' : 'none';
        }

        if (priceLabel) {
            // Formata para o padrão Brasileiro (R$ 0,00)
            priceLabel.textContent = precoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
    };

    // Apelido para garantir compatibilidade com o cart.js antigo
    window.atualizarBadge = window.atualizarCarrinhoHeader;

    // Executa a função imediatamente ao carregar qualquer página
    atualizarCarrinhoHeader();

});