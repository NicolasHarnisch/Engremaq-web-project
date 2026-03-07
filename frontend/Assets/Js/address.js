// address.js - Lógica da Página de Endereço
document.addEventListener('DOMContentLoaded', () => {
    // PROTEÇÃO: Expulsa para o Login se tentar entrar na URL diretamente sem estar logado
    if (!localStorage.getItem('tokenEngremaq')) {
        window.location.href = "Login.html";
        return;
    }

    // Cria o bloco de entrega dinamicamente no HTML se ele não existir
    prepararBlocoEntregaHTML();

    renderizarEnderecos();
    carregarResumoPedido();

    const modal = document.getElementById('modal-endereco');
    document.getElementById('btn-abrir-modal')?.addEventListener('click', () => modal.classList.add('active'));
    document.getElementById('btn-fechar-modal')?.addEventListener('click', () => modal.classList.remove('active'));

    const inputCep = document.getElementById('cep');
    if (inputCep) inputCep.addEventListener('blur', buscarCep);

    const form = document.getElementById('form-endereco');
    const btnSalvar = document.querySelector('.btn-salvar-endereco');
    
    if (form) {
        form.addEventListener('input', () => {
            const isValid = ['cep', 'identificacao', 'logradouro', 'numero', 'bairro', 'cidade', 'uf']
                .every(id => document.getElementById(id).value.trim() !== '');
            
            if (isValid) {
                btnSalvar.classList.add('active'); btnSalvar.disabled = false;
            } else {
                btnSalvar.classList.remove('active'); btnSalvar.disabled = true;
            }
        });

        // Salvar Novo Endereço (Agora super rápido, sem cotar frete aqui)
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const novoEndereco = {
                id: Date.now(),
                identificacao: document.getElementById('identificacao').value,
                rua: document.getElementById('logradouro').value,
                numero: document.getElementById('numero').value,
                cep: document.getElementById('cep').value,
                cidade: document.getElementById('cidade').value,
                uf: document.getElementById('uf').value
            };

            let enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq')) || [];
            enderecos.push(novoEndereco);
            localStorage.setItem('enderecosEngremaq', JSON.stringify(enderecos));
            
            // Define o novo como selecionado e apaga escolhas de frete antigas
            localStorage.setItem('enderecoSelecionado', novoEndereco.id);
            localStorage.removeItem('freteSelecionado');
            
            modal.classList.remove('active');
            form.reset(); 
            renderizarEnderecos(); 
        });
    }

    // Botão Final - Ir para Pagamento
    document.getElementById('btn-ir-pagamento')?.addEventListener('click', () => {
        const enderecoSel = localStorage.getItem('enderecoSelecionado');
        const freteSel = localStorage.getItem('freteSelecionado');

        if (!enderecoSel) return alert("Por favor, selecione um endereço de entrega.");
        if (!freteSel) return alert("Por favor, escolha uma transportadora (Opção de Entrega).");

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

// =========================================================
// RENDERIZAÇÃO E SELEÇÃO (Estilo KaBuM!)
// =========================================================
function renderizarEnderecos() {
    const container = document.getElementById('lista-enderecos');
    if (!container) return;

    const enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq')) || [];
    const selecionadoId = localStorage.getItem('enderecoSelecionado');

    if (enderecos.length === 0) {
        container.innerHTML = `
            <div style='padding: 20px; text-align: center; border: 2px dashed #ddd; border-radius: 8px;'>
                <p style='color:#666; margin-bottom: 15px;'>Você ainda não tem endereços cadastrados.</p>
                <button onclick="document.getElementById('modal-endereco').classList.add('active')" 
                        style="color: #d4a000; font-weight: 700; background: none; border: none; cursor: pointer; text-decoration: underline;">
                    Cadastrar meu primeiro endereço
                </button>
            </div>`;
        document.getElementById('bloco-entrega').style.display = 'none';
        return;
    }

    container.innerHTML = enderecos.map(end => `
        <div class="address-card ${end.id == selecionadoId ? 'selected' : ''}" onclick="selecionarEndereco(${end.id})" style="cursor: pointer; margin-bottom: 15px;">
            <input type="radio" name="endereco" ${end.id == selecionadoId ? 'checked' : ''} style="pointer-events: none;">
            <div class="address-details" style="width: 100%;">
                <strong style="color: #333; font-size: 15px;">${end.identificacao}</strong>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">${end.rua}, ${end.numero} - ${end.bairro} - ${end.cidade}/${end.uf}</p>
                <p style="margin: 2px 0 0 0; color: #666; font-size: 13px;">CEP: ${end.cep}</p>
            </div>
        </div>
    `).join('');

    // Se há um endereço selecionado, abre o menu de transportadoras
    if (selecionadoId) {
        buscarOpcoesDeFrete(selecionadoId);
    }
}

window.selecionarEndereco = function(id) {
    localStorage.setItem('enderecoSelecionado', id);
    localStorage.removeItem('freteSelecionado'); // Reseta a transportadora ao mudar de endereço
    renderizarEnderecos(); 
};

// =========================================================
// O MOTOR DE OPÇÕES DE ENTREGA (Transportadoras)
// =========================================================
async function buscarOpcoesDeFrete(idEndereco) {
    const enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq')) || [];
    const end = enderecos.find(e => e.id == idEndereco);
    if (!end) return;

    const cepNumeros = end.cep.replace(/\D/g, '');
    const blocoEntrega = document.getElementById('bloco-entrega');
    const listaFretes = document.getElementById('lista-fretes');

    if(blocoEntrega) blocoEntrega.style.display = 'block';
    if(listaFretes) listaFretes.innerHTML = `
        <div style="padding: 20px; text-align: center;">
            <svg class="spinner" viewBox="0 0 50 50" style="width: 30px; height: 30px; animation: rotate 2s linear infinite;"><circle cx="25" cy="25" r="20" fill="none" stroke="#d4a000" stroke-width="4" stroke-dasharray="90 150"></circle></svg>
            <p style="color: #666; margin-top: 10px;">Buscando melhores transportadoras...</p>
        </div>`;

    try {
        const freteResp = await fetch('http://localhost:3000/api/frete/calcular', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cepDestino: cepNumeros })
        });
        const dadosFrete = await freteResp.json();

        if (dadosFrete.sucesso && dadosFrete.fretes.length > 0) {
            let htmlFretes = '';
            
            // Pega a escolha anterior, se houver
            const freteSalvo = JSON.parse(localStorage.getItem('freteSelecionado'));

            dadosFrete.fretes.forEach((f, index) => {
                // Se não tem frete salvo, seleciona o primeiro automaticamente
                let isChecked = false;
                if (freteSalvo && freteSalvo.nome === f.nome) isChecked = true;
                else if (!freteSalvo && index === 0) {
                    isChecked = true;
                    salvarFreteEscolhido(f.preco, f.nome, f.prazo); // Auto-salva o primeiro
                }

                htmlFretes += `
                <label class="frete-option" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid ${isChecked ? '#d4a000' : '#ddd'}; margin-bottom: 10px; border-radius: 8px; cursor: pointer; background: ${isChecked ? '#fffdf0' : '#fff'}; transition: 0.2s;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <input type="radio" name="escolha_frete" value="${f.preco}" onchange="salvarFreteEscolhido(${f.preco}, '${f.nome}', ${f.prazo})" ${isChecked ? 'checked' : ''} style="transform: scale(1.2); accent-color: #d4a000;">
                        <div>
                            <strong style="display: block; color: #333; font-size: 15px;">${f.nome}</strong>
                            <small style="color: #666; font-size: 13px;">Entrega em até <strong>${f.prazo} dias úteis</strong></small>
                        </div>
                    </div>
                    <strong style="color: #111; font-size: 16px;">${f.preco.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</strong>
                </label>
                `;
            });
            if(listaFretes) listaFretes.innerHTML = htmlFretes;
        } else {
            if(listaFretes) listaFretes.innerHTML = '<p style="color: red; padding: 15px;">Nenhuma transportadora atende este CEP no momento.</p>';
        }
    } catch(e) {
        if(listaFretes) listaFretes.innerHTML = '<p style="color: red; padding: 15px;">Erro ao conectar com servidor de transportes.</p>';
    }
}

// Salva a escolha do usuário e atualiza a caixinha de Resumo
window.salvarFreteEscolhido = function(valor, nome, prazo) {
    const freteEscolhido = { preco: valor, nome: nome, prazo: prazo };
    localStorage.setItem('freteSelecionado', JSON.stringify(freteEscolhido));
    
    // Repinta a lista de fretes para atualizar a borda amarela do selecionado
    const radios = document.getElementsByName('escolha_frete');
    radios.forEach(r => {
        const label = r.closest('.frete-option');
        if(r.checked) {
            label.style.borderColor = '#d4a000';
            label.style.background = '#fffdf0';
        } else {
            label.style.borderColor = '#ddd';
            label.style.background = '#fff';
        }
    });

    carregarResumoPedido();
};

// =========================================================
// CORREÇÃO: ALINHAMENTO ABSOLUTO (FORÇADO PARA A DIREITA)
// =========================================================
function carregarResumoPedido() {
    const carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
    const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    
    let freteValor = 0;
    let freteNome = "";
    
    const freteSalvo = JSON.parse(localStorage.getItem('freteSelecionado'));
    if (freteSalvo) {
        freteValor = freteSalvo.preco;
        freteNome = freteSalvo.nome;
    }
    
    const total = subtotal + freteValor;

    const elSubtotal = document.getElementById('resumo-subtotal');
    const elFrete = document.getElementById('resumo-frete');
    const elTotal = document.getElementById('resumo-total');

    if (elSubtotal) elSubtotal.textContent = subtotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    if (elTotal) elTotal.textContent = total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    
    if (elFrete) {
        if (freteValor > 0) {
            // O display: block com text-align: right força o elemento a ocupar o espaço e empurrar o texto para o canto
            elFrete.innerHTML = `
                <span style="display: block; text-align: right; line-height: 1.4;">
                    ${freteValor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                    <br><small style="font-size: 11px; color: #888; font-weight: 400;">via ${freteNome}</small>
                </span>
            `;
        } else {
            elFrete.textContent = "A calcular";
        }
    }
}

// Função utilitária para injetar o HTML sem que você precise mexer no arquivo original
function prepararBlocoEntregaHTML() {
    const listaEnderecos = document.getElementById('lista-enderecos');
    if (listaEnderecos && !document.getElementById('bloco-entrega')) {
        const bloco = document.createElement('div');
        bloco.id = 'bloco-entrega';
        bloco.style.cssText = 'display: none; margin-top: 35px; border-top: 2px solid #eee; padding-top: 25px;';
        bloco.innerHTML = `
            <h3 style="margin-bottom: 15px; font-size: 18px; color: #333; display: flex; align-items: center; gap: 10px;">
                <svg viewBox="0 0 24 24" fill="none" stroke="#d4a000" stroke-width="2" style="width: 24px; height: 24px;"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                Selecione o tipo de entrega
            </h3>
            <div id="lista-fretes"></div>
        `;
        // Insere logo abaixo da lista de endereços
        listaEnderecos.parentNode.insertBefore(bloco, listaEnderecos.nextSibling);
    }
}