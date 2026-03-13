// Assets/Js/address.js

let enderecoEmEdicao = null; // Variável para controlar se estamos a criar ou a editar

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('tokenEngremaq')) {
        window.location.href = "Login.html";
        return;
    }

    prepararBlocoEntregaHTML();
    renderizarEnderecos();
    carregarResumoPedidoEndereco(); 

    const modal = document.getElementById('modal-endereco');
    document.getElementById('btn-abrir-modal')?.addEventListener('click', () => {
        enderecoEmEdicao = null; // Garante que é um novo endereço
        document.getElementById('form-endereco').reset();
        modal.classList.add('active');
    });

    document.getElementById('btn-fechar-modal')?.addEventListener('click', () => {
        modal.classList.remove('active');
        document.getElementById('form-endereco').reset();
        enderecoEmEdicao = null;
    });

    const inputCep = document.getElementById('cep');
    if (inputCep) inputCep.addEventListener('blur', buscarCep);

    const form = document.getElementById('form-endereco');
    const btnSalvar = document.querySelector('.btn-salvar-endereco');
    
    if (form) {
        form.addEventListener('input', () => {
            const isValid = ['cep', 'identificacao', 'logradouro', 'numero', 'bairro', 'cidade', 'uf']
                .every(id => document.getElementById(id).value.trim() !== '');
            if (isValid) { btnSalvar.classList.add('active'); btnSalvar.disabled = false; } 
            else { btnSalvar.classList.remove('active'); btnSalvar.disabled = true; }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Dados capturados do formulário (agora com o Bairro incluído!)
            const dadosEndereco = {
                identificacao: document.getElementById('identificacao').value,
                rua: document.getElementById('logradouro').value,
                numero: document.getElementById('numero').value,
                bairro: document.getElementById('bairro').value, // Correção do "undefined"
                cep: document.getElementById('cep').value,
                cidade: document.getElementById('cidade').value,
                uf: document.getElementById('uf').value
            };

            let enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq')) || [];

            if (enderecoEmEdicao) {
                // MODO EDIÇÃO: Atualiza o endereço existente
                const index = enderecos.findIndex(e => e.id === enderecoEmEdicao);
                if (index !== -1) {
                    enderecos[index] = { ...enderecos[index], ...dadosEndereco };
                }
                enderecoEmEdicao = null; // Limpa o estado
            } else {
                // MODO CRIAÇÃO: Cria um endereço novo
                dadosEndereco.id = Date.now();
                enderecos.push(dadosEndereco);
                localStorage.setItem('enderecoSelecionado', dadosEndereco.id); // Já seleciona o novo
            }

            localStorage.setItem('enderecosEngremaq', JSON.stringify(enderecos));
            localStorage.removeItem('freteSelecionado'); // Força a recalcular o frete
            
            modal.classList.remove('active');
            form.reset(); 
            renderizarEnderecos(); 
        });
    }

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
        <div class="address-card" onclick="selecionarEndereco(${end.id})" style="cursor: pointer; margin-bottom: 15px; position: relative; padding: 15px; border: 2px solid ${end.id == selecionadoId ? '#d4a000' : '#eee'}; border-radius: 8px; background: ${end.id == selecionadoId ? '#fffdf0' : '#fff'}; transition: 0.2s;">
            <div style="display: flex; gap: 15px; align-items: flex-start;">
                <input type="radio" name="endereco" ${end.id == selecionadoId ? 'checked' : ''} style="pointer-events: none; margin-top: 3px; accent-color: #d4a000; transform: scale(1.2);">
                <div class="address-details" style="flex: 1;">
                    <strong style="color: #333; font-size: 16px; display: block;">${end.identificacao}</strong>
                    <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">${end.rua}, ${end.numero} - ${end.bairro || 'Centro'} - ${end.cidade}/${end.uf}</p>
                    <p style="margin: 2px 0 0 0; color: #666; font-size: 13px;">CEP: ${end.cep}</p>
                    
                    <div style="display: flex; gap: 15px; margin-top: 12px; padding-top: 12px; border-top: 1px dashed ${end.id == selecionadoId ? '#f0dfa8' : '#eee'};">
                        <button onclick="event.stopPropagation(); editarEnderecoCheckout(${end.id})" style="background: none; border: none; color: #d4a000; cursor: pointer; font-size: 13px; font-weight: 600; text-decoration: underline; padding: 0;">Editar</button>
                        <button onclick="event.stopPropagation(); removerEnderecoCheckout(${end.id})" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 13px; font-weight: 600; text-decoration: underline; padding: 0;">Excluir</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    if (selecionadoId) buscarOpcoesDeFrete(selecionadoId);
}

window.selecionarEndereco = function(id) {
    localStorage.setItem('enderecoSelecionado', id);
    localStorage.removeItem('freteSelecionado'); 
    renderizarEnderecos(); 
};

// --- NOVAS FUNÇÕES: EDITAR E EXCLUIR ENDEREÇO ---
window.editarEnderecoCheckout = function(id) {
    const enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq')) || [];
    const end = enderecos.find(e => e.id === id);
    if (!end) return;

    enderecoEmEdicao = id; // Marca que estamos a editar este ID
    
    // Preenche os campos do modal com os dados antigos
    document.getElementById('identificacao').value = end.identificacao || '';
    document.getElementById('cep').value = end.cep || '';
    document.getElementById('logradouro').value = end.rua || '';
    document.getElementById('numero').value = end.numero || '';
    document.getElementById('bairro').value = end.bairro || '';
    document.getElementById('cidade').value = end.cidade || '';
    document.getElementById('uf').value = end.uf || '';

    // Libera o botão de salvar caso já esteja tudo preenchido
    const btnSalvar = document.querySelector('.btn-salvar-endereco');
    btnSalvar.classList.add('active');
    btnSalvar.disabled = false;

    // Abre o modal
    document.getElementById('modal-endereco').classList.add('active');
};

window.removerEnderecoCheckout = function(id) {
    if(confirm("Deseja realmente excluir este endereço?")) {
        let enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq')) || [];
        enderecos = enderecos.filter(e => e.id !== id);
        localStorage.setItem('enderecosEngremaq', JSON.stringify(enderecos));
        
        // Se excluiu o que estava selecionado, limpa a seleção
        if (localStorage.getItem('enderecoSelecionado') == id) {
            localStorage.removeItem('enderecoSelecionado');
            localStorage.removeItem('freteSelecionado');
            document.getElementById('bloco-entrega').style.display = 'none';
        }
        
        renderizarEnderecos();
        carregarResumoPedidoEndereco();
    }
};

async function buscarOpcoesDeFrete(idEndereco) {
    const enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq')) || [];
    const end = enderecos.find(e => e.id == idEndereco);
    if (!end) return;

    const cepNumeros = end.cep.replace(/\D/g, '');
    const blocoEntrega = document.getElementById('bloco-entrega');
    const listaFretes = document.getElementById('lista-fretes');

    if(blocoEntrega) blocoEntrega.style.display = 'block';
    if(listaFretes) listaFretes.innerHTML = '<p style="color: #666; padding: 20px;">Calculando opções de frete...</p>';

    try {
        const freteResp = await fetch('http://localhost:3000/api/frete/calcular', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cepDestino: cepNumeros })
        });
        const dadosFrete = await freteResp.json();

        if (dadosFrete.sucesso && dadosFrete.fretes.length > 0) {
            let htmlFretes = '';
            const freteSalvo = JSON.parse(localStorage.getItem('freteSelecionado'));

            dadosFrete.fretes.forEach((f, index) => {
                let isChecked = false;
                if (freteSalvo && freteSalvo.nome === f.nome) isChecked = true;
                else if (!freteSalvo && index === 0) {
                    isChecked = true;
                    salvarFreteEscolhido(f.preco, f.nome, f.prazo); 
                }

                const nomeEscapado = f.nome.replace(/'/g, "\\'");

                htmlFretes += `
                <label class="frete-option" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid ${isChecked ? '#d4a000' : '#ddd'}; margin-bottom: 10px; border-radius: 8px; cursor: pointer; background: ${isChecked ? '#fffdf0' : '#fff'}; transition: 0.2s;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <input type="radio" name="escolha_frete" value="${f.preco}" onchange="salvarFreteEscolhido(${f.preco}, '${nomeEscapado}', ${f.prazo})" ${isChecked ? 'checked' : ''} style="transform: scale(1.2); accent-color: #d4a000;">
                        <div>
                            <strong style="display: block; color: #333; font-size: 15px;">${f.nome}</strong>
                            <small style="color: #666; font-size: 13px;">Entrega em até <strong>${f.prazo} dias úteis</strong></small>
                        </div>
                    </div>
                    <strong style="color: #111; font-size: 16px;">${f.preco.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</strong>
                </label>`;
            });
            if(listaFretes) listaFretes.innerHTML = htmlFretes;
        } else {
            if(listaFretes) listaFretes.innerHTML = '<p style="color: red; padding: 15px;">Nenhuma transportadora atende este CEP no momento.</p>';
        }
    } catch(e) {
        if(listaFretes) listaFretes.innerHTML = '<p style="color: red; padding: 15px;">Erro ao conectar com servidor de transportes.</p>';
    }
}

window.salvarFreteEscolhido = function(valor, nome, prazo) {
    const freteEscolhido = { preco: valor, nome: nome, prazo: prazo };
    localStorage.setItem('freteSelecionado', JSON.stringify(freteEscolhido));
    
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

    carregarResumoPedidoEndereco();
};

function carregarResumoPedidoEndereco() {
    const carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
    
    let subtotalOriginal = 0;
    let totalDesconto = 0;
    
    carrinho.forEach(item => {
        let itemTotalNormal = item.preco * item.quantidade;
        subtotalOriginal += itemTotalNormal;
        
        const ultimoDigito = parseInt(String(item.id).slice(-1));
        const isPromocao = [3, 6, 9].includes(ultimoDigito);
        let descontoPercent = isPromocao ? 0.15 : 0.05;
        totalDesconto += (itemTotalNormal * descontoPercent);
    });

    let subtotalComDesconto = subtotalOriginal - totalDesconto;

    let freteValor = 0;
    let freteNome = "";
    const freteSalvo = JSON.parse(localStorage.getItem('freteSelecionado'));
    if (freteSalvo) {
        freteValor = freteSalvo.preco;
        freteNome = freteSalvo.nome;
    }
    
    const total = subtotalComDesconto + freteValor;

    const elSubtotal = document.getElementById('resumo-subtotal');
    const elFrete = document.getElementById('resumo-frete');
    const elTotal = document.getElementById('resumo-total'); 

    if (elSubtotal) {
        elSubtotal.textContent = subtotalOriginal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
        
        let descLine = document.getElementById('linha-desconto-dinamico-addr');
        if (!descLine) {
            descLine = document.createElement('div');
            descLine.id = 'linha-desconto-dinamico-addr';
            descLine.className = 'summary-line';
            descLine.innerHTML = `<span>Descontos (PIX):</span> <span id="resumo-desconto-valor-addr" style="color: #22c55e; font-weight: 700;"></span>`;
            elSubtotal.parentElement.insertAdjacentElement('afterend', descLine);
        }
        document.getElementById('resumo-desconto-valor-addr').textContent = `- ${totalDesconto.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
    }
    
    if (elTotal) elTotal.textContent = total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    
    if (elFrete) {
        if (freteValor > 0) {
            elFrete.innerHTML = `<span style="display: block; text-align: right; line-height: 1.4;">${freteValor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}<br><small style="font-size: 11px; color: #888; font-weight: 400;">via ${freteNome}</small></span>`;
        } else {
            elFrete.textContent = "A calcular";
        }
    }
}

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
        listaEnderecos.parentNode.insertBefore(bloco, listaEnderecos.nextSibling);
    }
}