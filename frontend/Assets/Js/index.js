// index.js - Gerenciador da Página Inicial Engremaq
let bancoDePrecosHome = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Busca os produtos à base de dados logo ao carregar
    try {
        const res = await fetch('http://localhost:3000/api/produtos');
        if (res.ok) {
            const produtosNoBanco = await res.json();
            bancoDePrecosHome = produtosNoBanco.map(p => ({
                id: p.codigo,
                preco: p.preco
            }));
        }
    } catch (erro) {
        console.error("Erro ao carregar produtos na Home:", erro);
    }
    
    // ==========================================
    // 0. LÓGICA DO CARROSSEL (BANNER PRINCIPAL)
    // ==========================================
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

    // ==========================================
    // 1. LÓGICA DO WHATSAPP
    // ==========================================
    const botoesWhatsHome = document.querySelectorAll('.btn-whats');
    botoesWhatsHome.forEach(botao => {
        botao.addEventListener('click', (e) => {
            e.preventDefault();
            const card = botao.closest('.product-card') || botao.closest('.card');
            if (!card) return;

            const nome = card.querySelector('h3').innerText;
            const codigo = card.querySelector('.product-code').innerText;
            const mensagem = `Olá Engremaq! Vi na Home e gostaria de negociar a peça: ${nome} (${codigo})`;
            const linkFinal = `https://api.whatsapp.com/send?phone=5585996883588&text=${encodeURIComponent(mensagem)}`;
            window.open(linkFinal, '_blank');
        });
    });

    // ==========================================
    // 2. LÓGICA DE ADICIONAR AO CARRINHO
    // ==========================================
    const botoesCartHome = document.querySelectorAll('.btn-cart');
    botoesCartHome.forEach(botao => {
        botao.addEventListener('click', (e) => {
            e.preventDefault();
            const card = botao.closest('.product-card') || botao.closest('.card');
            if (!card) return;

            const idLimpo = card.querySelector('.product-code').innerText.replace('COD: ', '').trim();
            const nome = card.querySelector('h3').innerText;
            const imagem = card.querySelector('img').src;

            const dadosDoProduto = bancoDePrecosHome.find(p => p.id === idLimpo);
            const precoReal = dadosDoProduto ? dadosDoProduto.preco : 0;

            if (precoReal === 0) return alert("A aguardar o carregamento dos preços, tente novamente num instante!");

            adicionarAoCarrinhoHome({ id: idLimpo, nome, preco: precoReal, imagem, quantidade: 1 });
        });
    });
});

function adicionarAoCarrinhoHome(novoProduto) {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
    const itemExistente = carrinho.find(item => item.id === novoProduto.id);
    if (itemExistente) itemExistente.quantidade += 1;
    else carrinho.push(novoProduto);

    localStorage.setItem('carrinhoEngremaq', JSON.stringify(carrinho));
    if (window.atualizarBadge) window.atualizarBadge();
    alert(`✅ ${novoProduto.nome} foi adicionado ao seu carrinho!`);
}