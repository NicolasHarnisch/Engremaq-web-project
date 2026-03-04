// index.js - Gerenciador da Página Inicial Engremaq

// BANCO DE DADOS DE PREÇOS
const bancoDePrecosHome = [
    { id: "000001", preco: 250.00 },
    { id: "000002", preco: 450.00 },
    { id: "000003", preco: 180.00 },
    { id: "100001", preco: 150.00 },
    { id: "100002", preco: 950.00 },
    { id: "100003", preco: 820.00 },
    { id: "100004", preco: 3500.00 }
];

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 0. LÓGICA DO CARROSSEL (BANNER PRINCIPAL)
    // ==========================================
    const slides = document.querySelectorAll('.hero-slide');
    const btnPrev = document.getElementById('heroPrev');
    const btnNext = document.getElementById('heroNext');
    
    let currentSlide = 0;
    let autoPlayInterval; // Variável para guardar o temporizador

    if (slides.length > 0 && btnPrev && btnNext) {
        
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('is-active'));
            slides[index].classList.add('is-active');
        }

        // Função para iniciar o temporizador
        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                currentSlide++;
                if (currentSlide >= slides.length) {
                    currentSlide = 0; 
                }
                showSlide(currentSlide);
            }, 5000);
        }

        // Função para resetar o temporizador quando o usuário clica
        function resetAutoPlay() {
            clearInterval(autoPlayInterval); // Para o contador atual
            startAutoPlay(); // Começa do zero de novo
        }

        // Clique para voltar
        btnPrev.addEventListener('click', () => {
            currentSlide--;
            if (currentSlide < 0) {
                currentSlide = slides.length - 1; 
            }
            showSlide(currentSlide);
            resetAutoPlay(); // Reinicia o tempo aqui!
        });

        // Clique para avançar
        btnNext.addEventListener('click', () => {
            currentSlide++;
            if (currentSlide >= slides.length) {
                currentSlide = 0; 
            }
            showSlide(currentSlide);
            resetAutoPlay(); // Reinicia o tempo aqui!
        });
        
        // Inicia o temporizador automático assim que a página carrega
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

            const codigoBruto = card.querySelector('.product-code').innerText;
            const idLimpo = codigoBruto.replace('COD: ', '').trim();
            const nome = card.querySelector('h3').innerText;
            const imagem = card.querySelector('img').src;

            const dadosDoProduto = bancoDePrecosHome.find(p => p.id === idLimpo);
            const precoReal = dadosDoProduto ? dadosDoProduto.preco : 0;

            const produtoParaAdicionar = {
                id: idLimpo,
                nome: nome,
                preco: precoReal,
                imagem: imagem,
                quantidade: 1
            };

            adicionarAoCarrinhoHome(produtoParaAdicionar);
        });
    });
});

// ==========================================
// FUNÇÕES GLOBAIS DA HOME
// ==========================================
function adicionarAoCarrinhoHome(novoProduto) {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
    
    const itemExistente = carrinho.find(item => item.id === novoProduto.id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push(novoProduto);
    }

    localStorage.setItem('carrinhoEngremaq', JSON.stringify(carrinho));

    if (window.atualizarBadge) {
        window.atualizarBadge();
    }

    alert(`✅ ${novoProduto.nome} foi adicionado ao seu carrinho!`);
}