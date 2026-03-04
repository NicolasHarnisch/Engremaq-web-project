// address.js - Lógica da Página de Endereço
document.addEventListener('DOMContentLoaded', () => {
    carregarResumoPedido();
    renderizarEnderecos();

    const modal = document.getElementById('modal-endereco');
    document.getElementById('btn-abrir-modal').addEventListener('click', () => modal.classList.add('active'));
    document.getElementById('btn-fechar-modal').addEventListener('click', () => modal.classList.remove('active'));

    const inputCep = document.getElementById('cep');
    inputCep.addEventListener('blur', buscarCep);

    const form = document.getElementById('form-endereco');
    const btnSalvar = document.querySelector('.btn-salvar-endereco');
    form.addEventListener('input', () => {
        const isValid = ['cep', 'identificacao', 'logradouro', 'numero', 'bairro', 'cidade', 'uf']
            .every(id => document.getElementById(id).value.trim() !== '');
        
        if (isValid) {
            btnSalvar.classList.add('active'); btnSalvar.disabled = false;
        } else {
            btnSalvar.classList.remove('active'); btnSalvar.disabled = true;
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const novoEndereco = {
            id: Date.now(),
            identificacao: document.getElementById('identificacao').value,
            rua: document.getElementById('logradouro').value,
            numero: document.getElementById('numero').value,
            cep: document.getElementById('cep').value,
            cidade: document.getElementById('cidade').value,
            uf: document.getElementById('uf').value,
            frete: document.getElementById('uf').value === 'CE' ? 15.00 : 45.00
        };

        let enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq')) || [];
        enderecos.push(novoEndereco);
        localStorage.setItem('enderecosEngremaq', JSON.stringify(enderecos));
        localStorage.setItem('enderecoSelecionado', novoEndereco.id);
        
        modal.classList.remove('active');
        form.reset(); renderizarEnderecos(); carregarResumoPedido();
    });

    document.getElementById('btn-ir-pagamento').addEventListener('click', () => {
        const selecionado = localStorage.getItem('enderecoSelecionado');
        if (!selecionado) return alert("Por favor, cadastre ou selecione um endereço de entrega.");
        window.location.href = "Payment.html";
    });
});

async function buscarCep() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    if (cep.length !== 8) return;
    document.getElementById('cep-loading').style.display = 'block';
    try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await res.json();
        if (!dados.erro) {
            document.getElementById('logradouro').value = dados.logradouro;
            document.getElementById('bairro').value = dados.bairro;
            document.getElementById('cidade').value = dados.localidade;
            document.getElementById('uf').value = dados.uf;
        } else { alert("CEP não encontrado."); }
    } catch (e) { alert("Erro ao buscar CEP."); } 
    finally { document.getElementById('cep-loading').style.display = 'none'; document.getElementById('numero').focus(); }
}

function renderizarEnderecos() {
    const container = document.getElementById('lista-enderecos');
    const enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq')) || [];
    const selecionadoId = localStorage.getItem('enderecoSelecionado');

    if (enderecos.length === 0) return container.innerHTML = "<p style='color:#666;'>Nenhum endereço cadastrado.</p>";

    container.innerHTML = enderecos.map(end => `
        <div class="address-card ${end.id == selecionadoId ? 'selected' : ''}" onclick="selecionarEndereco(${end.id})">
            <input type="radio" name="endereco" ${end.id == selecionadoId ? 'checked' : ''}>
            <div class="address-details">
                <strong>${end.identificacao}</strong>
                <p>${end.rua}, ${end.numero} - ${end.cidade}, ${end.uf}, CEP: ${end.cep}</p>
            </div>
        </div>
    `).join('');
}

window.selecionarEndereco = function(id) {
    localStorage.setItem('enderecoSelecionado', id);
    renderizarEnderecos(); carregarResumoPedido();
};

function carregarResumoPedido() {
    const carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
    const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    let frete = 0;
    const selecionadoId = localStorage.getItem('enderecoSelecionado');
    const enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq')) || [];
    const endSelecionado = enderecos.find(e => e.id == selecionadoId);
    
    if (endSelecionado) frete = endSelecionado.frete;
    const total = subtotal + frete;

    document.getElementById('resumo-subtotal').textContent = subtotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    document.getElementById('resumo-frete').textContent = frete.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    document.getElementById('resumo-total').textContent = total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
}