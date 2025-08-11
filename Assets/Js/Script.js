// Seleciona todos os itens de menu
const menuItems = document.querySelectorAll('.menu-item a');

// Adiciona a classe 'active' ao item de menu correspondente à página
menuItems.forEach(item => {
    if (item.href === window.location.href) {
        item.classList.add('active');
    }
});

// Seleciona os elementos que queremos animar
const animatedItems = document.querySelectorAll('.animated-item');

// Função para adicionar a classe 'in-view' quando o elemento estiver visível
const handleIntersection = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target); // Para parar de observar após a animação
    }
  });
};

// Configura o IntersectionObserver
const observer = new IntersectionObserver(handleIntersection, {
  threshold: 0.5 // Quando 50% do elemento estiver visível
});

// Observa os itens
animatedItems.forEach(item => {
  observer.observe(item);
});


document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("#carrossel .carousel img");
  let currentIndex = 0;

  setInterval(() => {
      images[currentIndex].classList.remove("active");
      currentIndex = (currentIndex + 1) % images.length; // Avança para a próxima imagem
      images[currentIndex].classList.add("active");
  }, 10000); // Troca a cada 10 segundos
});

// Array para armazenar os itens do carrinho
let carrinho = [];

// Função para adicionar item ao carrinho
function adicionarAoCarrinho(nomeProduto, precoProduto) {
    // Cria um objeto com o nome e preço do produto
    const itemCarrinho = {
        nome: nomeProduto,
        preco: precoProduto
    };

    // Adiciona o item ao array do carrinho
    carrinho.push(itemCarrinho);

    // Atualiza a exibição do carrinho
    atualizarCarrinho();
}

// Função para atualizar a exibição do carrinho
function atualizarCarrinho() {
    const carrinhoContainer = document.getElementById('itens-carrinho');
    const finalizarCompraButton = document.getElementById('finalizar-compra');

    // Limpa o conteúdo atual do carrinho
    carrinhoContainer.innerHTML = '';

    // Se o carrinho estiver vazio
    if (carrinho.length === 0) {
        carrinhoContainer.innerHTML = '<p>Nenhum item no carrinho.</p>';
        finalizarCompraButton.style.display = 'none';
    } else {
        // Caso contrário, exibe os itens do carrinho
        carrinho.forEach(item => {
            const itemHTML = document.createElement('p');
            itemHTML.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
            carrinhoContainer.appendChild(itemHTML);
        });

        // Exibe o botão de finalizar compra
        finalizarCompraButton.style.display = 'block';
    }
}

// Função para finalizar a compra (exemplo)
document.getElementById('finalizar-compra').addEventListener('click', function() {
    alert('Compra finalizada com sucesso!');
    carrinho = [];  // Limpa o carrinho
    atualizarCarrinho();  // Atualiza a exibição
});
