document.addEventListener('DOMContentLoaded', () => {
    carregarDadosRevisao();

    const btnFinalizar = document.getElementById('btn-finalizar-tudo');
    const checkTermos = document.getElementById('termos');

    checkTermos.addEventListener('change', () => {
        btnFinalizar.disabled = !checkTermos.checked;
        if(checkTermos.checked) {
            btnFinalizar.style.background = '#ffcc00';
            btnFinalizar.style.color = '#111';
        } else {
            btnFinalizar.style.background = '#eee';
            btnFinalizar.style.color = '#aaa';
        }
    });

    btnFinalizar.disabled = true;
    btnFinalizar.style.background = '#eee';
    btnFinalizar.style.color = '#aaa';

    // REDIRECIONA PARA A PÁGINA FINAL
    btnFinalizar.addEventListener('click', (e) => {
        e.preventDefault();
        if (!checkTermos.checked) return;
        
        // Redireciona para a página Concluir
        window.location.assign("Conclude.html");
    });
});

function carregarDadosRevisao() {
    const carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
    if (carrinho.length === 0) return window.location.href = "Cart.html";
    
    const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

    let frete = 0;
    const enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq')) || [];
    const selecionadoId = localStorage.getItem('enderecoSelecionado');
    const end = enderecos.find(e => e.id == selecionadoId);
    
    if (end) {
        frete = end.frete || 0;
        document.getElementById('rev-endereco-completo').innerHTML = 
            `<strong>Endereço:</strong> ${end.rua}, ${end.numero}, ${end.bairro}<br>
             <strong>Complemento:</strong> ${end.complemento || 'N/A'}<br>
             <strong>Cidade:</strong> ${end.cidade} - ${end.uf}<br>
             <strong>CEP:</strong> ${end.cep}`;
    }

    const metodo = localStorage.getItem('metodoPagamento') || 'Não selecionado';
    document.getElementById('rev-metodo-pagamento').textContent = metodo.toUpperCase();

    const totalFinal = subtotal + frete;
    document.getElementById('rev-subtotal').textContent = subtotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    document.getElementById('rev-frete').textContent = frete.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    document.getElementById('rev-total').textContent = totalFinal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
}