document.addEventListener('DOMContentLoaded', async () => {
    
    // Busca os produtos ao Back-end para a barra de pesquisa
    let produtosEngremaq = [];
    try {
        const res = await fetch('http://localhost:3000/api/produtos');
        if (res.ok) {
            const dados = await res.json();
            produtosEngremaq = dados.map(p => ({
                id: p.codigo,
                nome: p.nome,
                img: p.imagem
            }));
        }
    } catch(e) { console.log("Pesquisa a aguardar Back-end..."); }

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
                    msgErro.innerHTML = `<p style="text-align: center; color: #666; font-size: 15px; padding: 40px;">Nenhuma peça encontrada para "<strong>${termoOriginal}</strong>".</p>`;
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
            if (e.key === 'Enter') { e.preventDefault(); executarBusca(); }
        });
    }

    // ==========================================
    // 2. SISTEMA DE USUÁRIO E DROPDOWN (COM VERIFICAÇÃO JWT BÁSICA)
    // ==========================================
    const loginLink = document.querySelector('.user-actions .action-link[href*="Login.html"]') || document.querySelector('.user-actions .action-link[href*="Login"]');
    
    if (loginLink) {
        const usuario = JSON.parse(localStorage.getItem('usuarioEngremaq'));
        const token = localStorage.getItem('tokenEngremaq');

        // Só mostra logado se tiver o Token também, dificultando falsificações no Front-end!
        if (usuario && usuario.nome && token) {
            const spanNome = loginLink.querySelector('span');
            
            if (spanNome) {
                let primeiroNome = usuario.nome.split(' ')[0];
                primeiroNome = primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1).toLowerCase();
                spanNome.textContent = `Olá, ${primeiroNome}`;
            }
            
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
                localStorage.removeItem('tokenEngremaq'); // Limpa a chave também
                window.location.reload(); 
            });
        }
    }

    // ==========================================
    // 3. ATUALIZAÇÃO GLOBAL DO CARRINHO
    // ==========================================
    window.atualizarCarrinhoHeader = function() {
        const carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
        let quantidadeTotal = 0;
        let precoTotal = 0;

        carrinho.forEach(item => {
            quantidadeTotal += item.quantidade;
            precoTotal += (item.preco * item.quantidade);
        });

        const badge = document.querySelector('.cart-badge');
        const priceLabel = document.querySelector('.cart-price');

        if (badge) {
            badge.textContent = quantidadeTotal;
            badge.style.display = quantidadeTotal > 0 ? 'flex' : 'none';
        }

        if (priceLabel) {
            priceLabel.textContent = precoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
    };

    window.atualizarBadge = window.atualizarCarrinhoHeader;
    atualizarCarrinhoHeader();
});