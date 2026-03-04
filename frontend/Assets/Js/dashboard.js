// dashboard.js - Lógica funcional para o Painel do Cliente

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. DADOS DO USUÁRIO
    const usuario = JSON.parse(localStorage.getItem('usuarioEngremaq')) || { nome: "Nicolas Gomes Harnisch", email: "nicolasgomeshar@gmail.com" };

    document.getElementById('display-user-name').textContent = usuario.nome;
    document.getElementById('display-user-email').textContent = usuario.email;
    document.querySelectorAll('.user-first-name').forEach(el => el.textContent = usuario.nome.split(' ')[0]);

    const inputNome = document.getElementById('dados-nome');
    const inputEmail = document.getElementById('dados-email');
    if(inputNome) inputNome.value = usuario.nome;
    if(inputEmail) inputEmail.value = usuario.email;

    // 2. NAVEGAÇÃO ENTRE ABAS
    const menuItems = document.querySelectorAll('.nav-item[data-tab]');
    const tabPanes = document.querySelectorAll('.tab-pane');

    function ativarAba(tabId) {
        menuItems.forEach(i => i.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        const itemAtivar = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
        const paneAtivar = document.getElementById(`tab-${tabId}`);
        if(itemAtivar && paneAtivar) {
            itemAtivar.classList.add('active');
            paneAtivar.classList.add('active');
        }
    }

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            ativarAba(tabId);
            window.history.replaceState(null, null, `#${tabId}`);
        });
    });

    if(window.location.hash) {
        ativarAba(window.location.hash.substring(1));
    }

    document.querySelectorAll('.ov-card[data-action]').forEach(card => {
        card.addEventListener('click', () => {
            const action = card.getAttribute('data-action');
            ativarAba(action);
            window.history.replaceState(null, null, `#${action}`);
        });
    });

    // 3. RENDERIZAÇÃO DE PEDIDOS
    const pedidosMock = [
        { id: "ENG-88902", data: "03/03/2026", total: 820.00, status: "transporte", statusTxt: "🚚 Em Transporte", prod: "Engrenagem de Tração Trator MF", img: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/Assets/Images/engrenagem_satelite_27_d_tracao_trator_mf_660_680_036420r1_1881_1_27082a9123eabe425be96e622170ffd7.webp" },
        { id: "ENG-77410", data: "15/02/2026", total: 150.00, status: "entregue", statusTxt: "✅ Pedido Entregue", prod: "Filtro de Óleo", img: "https://raw.githubusercontent.com/NicolasHarnisch/Engremaq-web-project/main/Assets/Images/download.jpeg" }
    ];

    const ordersList = document.getElementById('orders-list');
    if (ordersList) {
        pedidosMock.forEach(p => {
            ordersList.innerHTML += `
                <div class="order-item">
                    <div class="order-top"><span>Pedido <strong>#${p.id}</strong> realizado em ${p.data}</span><span>Total: <strong>R$ ${p.total.toFixed(2).replace('.', ',')}</strong></span></div>
                    <div class="order-main">
                        <div class="order-prod-info"><img src="${p.img}" alt="Peça"><div><h4>${p.prod}</h4><p>Cód: ${p.id.split('-')[1]}</p></div></div>
                        <span class="status-badge status-${p.status}">${p.statusTxt}</span>
                    </div>
                </div>`;
        });
    }

    // =========================================================
    // 4. SISTEMA REAL DE ENDEREÇOS (Sincronizado com Checkout)
    // =========================================================
    carregarEnderecosDash();

    function carregarEnderecosDash() {
        let enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq'));
        
        // Cria endereços falsos se for a primeira vez
        if (!enderecos || enderecos.length === 0) {
            enderecos = [
                { id: 1, identificacao: "Casa", rua: "Avenida Enir Santos", numero: "1233", bairro: "Centro", cidade: "Horizonte", uf: "CE", cep: "62886-580", frete: 15.00 },
                { id: 2, identificacao: "Oficina (Trabalho)", rua: "Rua Coronel Bento", numero: "450", bairro: "Galpão 2", cidade: "Fortaleza", uf: "CE", cep: "60000-000", frete: 15.00 }
            ];
            localStorage.setItem('enderecosEngremaq', JSON.stringify(enderecos));
            localStorage.setItem('enderecoSelecionado', '1'); // O ID 1 é o padrão inicial
        }
        
        renderizarGridEnderecos();
    }

    function renderizarGridEnderecos() {
        const addressList = document.getElementById('address-list');
        if (!addressList) return;

        const enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq')) || [];
        const padraoId = localStorage.getItem('enderecoSelecionado');

        addressList.innerHTML = '';
        enderecos.forEach(e => {
            const isDefault = (e.id == padraoId);
            addressList.innerHTML += `
                <div class="address-card ${isDefault ? 'default' : ''}" onclick="tornarPadrao(${e.id})">
                    <h4>${e.identificacao} ${isDefault ? '<small style="color:#d4a000; font-size:12px;">(Padrão)</small>' : ''}</h4>
                    <p>${e.rua}, ${e.numero}</p>
                    <p>${e.bairro} - ${e.cidade}, ${e.uf}</p>
                    <p>CEP: ${e.cep}</p>
                    <div class="address-actions">
                        <button onclick="event.stopPropagation(); alert('Para editar, remova e crie um novo.')">Editar</button>
                        <button style="color: #ef4444;" onclick="event.stopPropagation(); removerEndereco(${e.id})">Remover</button>
                    </div>
                </div>
            `;
        });
    }

    // Transformar um endereço no Padrão do site
    window.tornarPadrao = (id) => {
        localStorage.setItem('enderecoSelecionado', id);
        renderizarGridEnderecos(); // Atualiza a tela
    };

    // Apagar um endereço
    window.removerEndereco = (id) => {
        if(confirm("Deseja realmente remover este endereço?")) {
            let enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq')) || [];
            enderecos = enderecos.filter(e => e.id != id);
            localStorage.setItem('enderecosEngremaq', JSON.stringify(enderecos));
            renderizarGridEnderecos();
        }
    };

    // Modal de Novo Endereço
    const modalEndereco = document.getElementById('modal-endereco-dash');
    document.getElementById('btn-add-address')?.addEventListener('click', () => {
        modalEndereco.classList.add('active');
    });

    window.fecharModalEndereco = () => {
        modalEndereco.classList.remove('active');
        document.getElementById('form-novo-endereco').reset();
    };

    // ViaCEP no Modal
    const inputCep = document.getElementById('dash-cep');
    if (inputCep) {
        inputCep.addEventListener('blur', async () => {
            const cep = inputCep.value.replace(/\D/g, '');
            if (cep.length !== 8) return;
            
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const dados = await res.json();
                if (!dados.erro) {
                    document.getElementById('dash-rua').value = dados.logradouro;
                    document.getElementById('dash-bairro').value = dados.bairro;
                    document.getElementById('dash-cidade').value = dados.localidade;
                    document.getElementById('dash-uf').value = dados.uf;
                    document.getElementById('dash-numero').focus();
                }
            } catch (e) { alert("Erro ao buscar CEP."); }
        });
    }

    // Salvar o Novo Endereço
    const formNovoEnd = document.getElementById('form-novo-endereco');
    if (formNovoEnd) {
        formNovoEnd.addEventListener('submit', (e) => {
            e.preventDefault();
            const novoId = Date.now();
            const novoEndereco = {
                id: novoId,
                identificacao: document.getElementById('dash-identificacao').value,
                rua: document.getElementById('dash-rua').value,
                numero: document.getElementById('dash-numero').value,
                complemento: document.getElementById('dash-complemento').value,
                bairro: document.getElementById('dash-bairro').value,
                cep: document.getElementById('dash-cep').value,
                cidade: document.getElementById('dash-cidade').value,
                uf: document.getElementById('dash-uf').value,
                frete: document.getElementById('dash-uf').value === 'CE' ? 15.00 : 45.00
            };

            let enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq')) || [];
            enderecos.push(novoEndereco);
            localStorage.setItem('enderecosEngremaq', JSON.stringify(enderecos));
            
            // Opcional: já define o novo como padrão
            localStorage.setItem('enderecoSelecionado', novoId);
            
            fecharModalEndereco();
            renderizarGridEnderecos();
        });
    }

    // =========================================================
    // 5. SISTEMA DE SEGURANÇA E ALTERAÇÃO DE DADOS 
    // =========================================================
    let acaoSegurancaPendente = ''; 
    const modalSeguranca = document.getElementById('modal-seguranca');
    const stepOtp = document.getElementById('step-otp');
    const stepEmail = document.getElementById('step-novo-email');
    const stepSenha = document.getElementById('step-nova-senha');
    const otpInput = document.getElementById('otp-input');

    function iniciarVerificacaoDeSeguranca(acao) {
        acaoSegurancaPendente = acao;
        modalSeguranca.classList.add('active');
        stepOtp.style.display = 'block';
        stepEmail.style.display = 'none';
        stepSenha.style.display = 'none';
        otpInput.value = '';
        otpInput.style.borderColor = '#ccc';
        document.getElementById('otp-email-display').textContent = usuario.email;

        let titulo = 'Confirmação de Segurança';
        if (acao === 'excluir') titulo = '⚠️ Excluir Conta';
        document.getElementById('modal-seguranca-title').textContent = titulo;
    }

    window.fecharModalSeguranca = () => { modalSeguranca.classList.remove('active'); };

    window.validarOTP = () => {
        if(otpInput.value === '123456') {
            stepOtp.style.display = 'none';
            if(acaoSegurancaPendente === 'email') { stepEmail.style.display = 'block'; document.getElementById('novo-email-input').focus(); } 
            else if (acaoSegurancaPendente === 'senha') { stepSenha.style.display = 'block'; document.getElementById('nova-senha-input').focus(); } 
            else if (acaoSegurancaPendente === 'excluir') {
                if(confirm("⚠️ TEM CERTEZA ABSOLUTA?\n\nEsta ação apagará todo o seu histórico de compras e endereços. Não pode ser desfeita.")) {
                    localStorage.removeItem('usuarioEngremaq');
                    alert("Sua conta foi excluída com sucesso.");
                    window.location.href = '../index.html';
                } else { fecharModalSeguranca(); }
            }
        } else { otpInput.style.borderColor = '#ef4444'; alert("Código incorreto. Digite '123456'."); }
    };

    window.salvarNovoEmail = () => {
        const novo = document.getElementById('novo-email-input').value;
        if(novo.includes('@') && novo.includes('.')) {
            usuario.email = novo;
            localStorage.setItem('usuarioEngremaq', JSON.stringify(usuario));
            alert("✅ E-mail alterado com sucesso!");
            window.location.reload(); 
        } else { alert("Digite um endereço de e-mail válido."); }
    };

    window.salvarNovaSenha = () => {
        const s1 = document.getElementById('nova-senha-input').value;
        const s2 = document.getElementById('nova-senha-confirm').value;
        if(s1.length < 6) return alert("A senha deve ter pelo menos 6 caracteres.");
        if(s1 === s2) { alert("✅ Senha atualizada com sucesso!"); fecharModalSeguranca(); } 
        else { alert("As senhas não coincidem."); }
    };

    document.getElementById('btn-alterar-email')?.addEventListener('click', (e) => { e.preventDefault(); iniciarVerificacaoDeSeguranca('email'); });
    document.getElementById('btn-alterar-senha')?.addEventListener('click', (e) => { e.preventDefault(); iniciarVerificacaoDeSeguranca('senha'); });
    document.getElementById('btn-excluir-conta')?.addEventListener('click', (e) => { e.preventDefault(); iniciarVerificacaoDeSeguranca('excluir'); });

    const formDados = document.getElementById('form-meus-dados');
    if(formDados) {
        formDados.addEventListener('submit', (e) => {
            e.preventDefault();
            usuario.nome = document.getElementById('dados-nome').value;
            localStorage.setItem('usuarioEngremaq', JSON.stringify(usuario));
            alert("✅ Dados atualizados com sucesso!");
            window.location.reload();
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if(confirm("Deseja realmente sair da sua conta?")) {
                localStorage.removeItem('usuarioEngremaq');
                window.location.href = '../index.html';
            }
        });
    }
});