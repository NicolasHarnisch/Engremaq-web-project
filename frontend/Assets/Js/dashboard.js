// dashboard.js - Lógica funcional para o Painel do Cliente

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================
    // 1. DADOS DO USUÁRIO
    // =========================================================
    const usuario = JSON.parse(localStorage.getItem('usuarioEngremaq')) || { nome: "Nicolas Gomes Harnisch", email: "nicolasgomeshar@gmail.com" };

    document.getElementById('display-user-name').textContent = usuario.nome;
    document.getElementById('display-user-email').textContent = usuario.email;
    document.querySelectorAll('.user-first-name').forEach(el => el.textContent = usuario.nome.split(' ')[0]);

    const inputNome = document.getElementById('dados-nome');
    const inputEmail = document.getElementById('dados-email');
    if(inputNome) inputNome.value = usuario.nome;
    if(inputEmail) inputEmail.value = usuario.email;

    // =========================================================
    // 2. NAVEGAÇÃO ENTRE ABAS
    // =========================================================
    const menuItems = document.querySelectorAll('.nav-item[data-tab]');
    const tabPanes = document.querySelectorAll('.tab-pane');

    function ativarAba(tabId) {
        if (!tabId) return;
        menuItems.forEach(i => i.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        const itemAtivar = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
        const paneAtivar = document.getElementById(`tab-${tabId}`);
        if(itemAtivar && paneAtivar) {
            itemAtivar.classList.add('active');
            paneAtivar.classList.add('active');
        }
    }

    function lerHashDaURL() {
        let hash = window.location.hash.substring(1);
        if (['central', 'pedidos', 'enderecos', 'dados'].includes(hash)) {
            ativarAba(hash);
        } else {
            ativarAba('central'); 
        }
    }

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            window.location.hash = tabId; 
        });
    });

    document.querySelectorAll('.ov-card[data-action]').forEach(card => {
        card.addEventListener('click', () => {
            const action = card.getAttribute('data-action');
            window.location.hash = action; 
        });
    });

    window.addEventListener('hashchange', lerHashDaURL);
    lerHashDaURL();

    // =========================================================
    // 3. RENDERIZAÇÃO DE PEDIDOS E MODAIS KABUM!
    // =========================================================
    async function carregarPedidosDoUsuario() {
        const ordersList = document.getElementById('orders-list');
        if (!ordersList) return;

        ordersList.innerHTML = "<p style='padding: 20px; text-align: center;'>A carregar pedidos...</p>";

        try {
            const resposta = await fetch(`http://localhost:3000/api/pedidos/${usuario.email}`);
            const pedidosReal = await resposta.json();

            if (pedidosReal.length === 0) {
                ordersList.innerHTML = `
                    <div style="text-align: center; padding: 40px; border: 1px dashed #ccc; border-radius: 8px;">
                        <p style="color: #666; font-size: 16px;">Você ainda não tem nenhum pedido.</p>
                        <a href="../Pages/Products.html" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #ffcc00; color: #111; text-decoration: none; font-weight: bold; border-radius: 4px;">Começar a comprar</a>
                    </div>
                `;
                return;
            }

            localStorage.setItem('pedidosEngremaq', JSON.stringify(pedidosReal));
            ordersList.innerHTML = ""; 

            pedidosReal.forEach(p => {
                const dataCriacao = new Date(p.createdAt).toLocaleDateString('pt-BR');
                const dataEntregaStr = p.dataEntrega ? new Date(p.dataEntrega).toLocaleDateString('pt-BR') : 'A calcular';
                
                let statusExibicao = p.pagamento.status;
                let corStatus = '#27ae60'; // Verde (Padrão Aprovado)

                if (p.pagamento.status === 'AGUARDANDO_PAGAMENTO') {
                    statusExibicao = '⏳ Aguardando Pagamento';
                    corStatus = '#e67e22'; // Laranja/Amarelo
                } else if (p.pagamento.status === 'CANCELADO') {
                    statusExibicao = '❌ Compra Cancelada';
                    corStatus = '#ef4444'; // Vermelho
                }

                let itensHtml = '';
                p.itens.forEach(item => {
                    itensHtml += `
                        <div style="display: flex; gap: 15px; margin-bottom: 15px; align-items: center; border-top: 1px solid #eee; padding-top: 15px;">
                            <img src="${item.imagem}" alt="${item.nome}" style="width: 70px; height: 70px; object-fit: contain; border: 1px solid #eee; border-radius: 4px; padding: 5px;">
                            <div>
                                <h4 style="margin: 0 0 5px 0; font-size: 15px; color: #333;">${item.nome}</h4>
                                <p style="margin: 0; font-size: 13px; color: #777;">Vendido e entregue por: <strong>Engremaq</strong></p>
                                <p style="margin: 5px 0 0 0; font-size: 13px; color: #555;">Quantidade: ${item.quantidade}</p>
                            </div>
                        </div>
                    `;
                });

                const botaoAcao = p.pagamento.status === 'CANCELADO' 
                    ? `<span style="color: #ef4444; font-size: 12px; font-weight: bold;">PEDIDO ENCERRADO</span>`
                    : `<button onclick="gerenciarPedido('${p.numeroPedido}')" style="background: #ffcc00; color: #111; border: none; padding: 8px 16px; border-radius: 4px; font-weight: 700; cursor: pointer; transition: 0.2s; font-size: 12px;">GERENCIAR PEDIDO</button>`;

                const cardPedido = document.createElement('div');
                cardPedido.style.cssText = "border: 1px solid #ddd; border-radius: 8px; margin-bottom: 25px; font-family: 'Poppins', sans-serif; background: #fff;";
                cardPedido.innerHTML = `
                    <div style="background: #f8f9fa; padding: 15px 20px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center; border-radius: 8px 8px 0 0;">
                        <div style="font-size: 14px; color: #555;">
                            Pedido: <strong style="color: #333;">${p.numeroPedido}</strong> - ${dataCriacao}
                        </div>
                        ${botaoAcao}
                    </div>
                    <div style="padding: 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                            <div>
                                <p style="color: ${corStatus}; font-weight: 700; font-size: 16px; margin: 0 0 5px 0;">${statusExibicao}</p>
                                <p style="font-size: 13px; color: #666; margin: 0;">🚚 Previsão de entrega: <strong>${p.pagamento.status === 'CANCELADO' ? '-' : dataEntregaStr}</strong></p>
                            </div>
                            <div style="text-align: right;">
                                <p style="font-size: 13px; color: #666; margin: 0 0 5px 0;">Total do Pedido</p>
                                <p style="font-weight: 700; font-size: 18px; color: #111; margin: 0;">${p.totalGeral.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p>
                            </div>
                        </div>
                        ${itensHtml}
                    </div>
                `;
                ordersList.appendChild(cardPedido);
            });
        } catch (erro) {
            ordersList.innerHTML = "<p style='color: red; padding: 20px;'>Erro de conexão com a Base de Dados.</p>";
        }
    }

    carregarPedidosDoUsuario();

    let pedidoSendoGerenciado = null;

    // Abertura do Modal 1 (Principal)
    window.gerenciarPedido = (numeroDoPedido) => {
        const pedidos = JSON.parse(localStorage.getItem('pedidosEngremaq')) || [];
        const pedido = pedidos.find(p => String(p.numeroPedido) === String(numeroDoPedido));

        if (pedido) {
            pedidoSendoGerenciado = pedido;
            
            prepararModalGerenciarHTML();
            document.getElementById('modal-gerenciar-num').textContent = pedido.numeroPedido;
            document.getElementById('radio-cancelar').checked = false;
            
            const btnContinuar = document.getElementById('btn-continuar-gerenciar');
            btnContinuar.disabled = true;
            btnContinuar.style.background = '#eee';
            btnContinuar.style.color = '#aaa';
            btnContinuar.style.cursor = 'not-allowed';
            btnContinuar.textContent = 'CONTINUAR';
            document.getElementById('aviso-cancelamento').style.display = 'none';

            // Garante que as opções de ajuda estão visíveis ao abrir
            const blocoOpcoes = document.getElementById('bloco-opcoes-ajuda');
            if (blocoOpcoes) blocoOpcoes.style.display = 'block';

            const blocoPagamento = document.getElementById('bloco-pagamento-pendente');
            if (pedido.pagamento && pedido.pagamento.status === 'AGUARDANDO_PAGAMENTO') {
                blocoPagamento.style.display = 'block';
                // Sempre que abre, repõe a caixinha amarela original
                blocoPagamento.innerHTML = `
                    <strong style="color: #d4a000; display: block; margin-bottom: 5px;">⚠️ Pagamento Pendente!</strong>
                    <p style="font-size: 13px; color: #666; margin-bottom: 10px;">O seu pedido já está reservado. Realize o pagamento para iniciar a separação.</p>
                    <button id="btn-gerar-pix-pendente" onclick="gerarPixPendente()" style="background: #ffcc00; color: #111; border: none; padding: 8px 15px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px; width: 100%;">💸 PAGAR VIA PIX</button>
                `;
            } else {
                blocoPagamento.style.display = 'none';
            }

            document.getElementById('modal-gerenciar-pedido').style.display = 'flex';
        }
    };

    window.fecharModalGerenciar = () => {
        document.getElementById('modal-gerenciar-pedido').style.display = 'none';
        document.getElementById('modal-motivo-cancelamento').style.display = 'none';
    };

    // Botão Continuar do Modal 1 (Transição para Modal 2)
    window.processarAcaoGerenciar = () => {
        const radioCancelar = document.getElementById('radio-cancelar');
        if (radioCancelar && radioCancelar.checked) {
            document.getElementById('modal-gerenciar-pedido').style.display = 'none';
            
            // Reseta opções do modal 2
            const radiosMotivos = document.querySelectorAll('input[name="motivo_cancelamento"]');
            radiosMotivos.forEach(r => r.checked = false);
            document.getElementById('texto-motivo-extra').value = '';
            const btnConfirmar = document.getElementById('btn-confirmar-cancelamento');
            btnConfirmar.style.background = '#eee';
            btnConfirmar.style.color = '#aaa';
            btnConfirmar.style.cursor = 'not-allowed';
            btnConfirmar.disabled = true;

            document.getElementById('modal-motivo-cancelamento').style.display = 'flex';
        }
    };

    window.voltarParaGerenciar = () => {
        document.getElementById('modal-motivo-cancelamento').style.display = 'none';
        document.getElementById('modal-gerenciar-pedido').style.display = 'flex';
    };

    window.liberarBotaoMotivo = () => {
        const btn = document.getElementById('btn-confirmar-cancelamento');
        btn.disabled = false;
        btn.style.background = '#ef4444';
        btn.style.color = '#fff';
        btn.style.cursor = 'pointer';
    };

    // =========================================================
    // NOVA MÁGICA: GERAR PIX E APROVAR AUTOMATICAMENTE!
    // =========================================================
    window.gerarPixPendente = async () => {
        if (!pedidoSendoGerenciado) return;

        const btn = document.getElementById('btn-gerar-pix-pendente');
        if (btn) {
            btn.innerText = "GERANDO PIX...";
            btn.disabled = true;
        }

        try {
            // 1. Puxa o código PIX do Back-end
            const resposta = await fetch('http://localhost:3000/api/pagamento/pix', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    metodo: 'pix',
                    email: usuario.email,
                    nome: usuario.nome,
                    valorTotal: pedidoSendoGerenciado.totalGeral,
                    descricaoPedido: `Pedido ${pedidoSendoGerenciado.numeroPedido}`
                })
            });

            const dados = await resposta.json();

            if (dados.sucesso) {
                // 💡 UX INTELIGENTE: Esconde a opção de cancelar para focar no pagamento e limpar a tela
                const blocoOpcoes = document.getElementById('bloco-opcoes-ajuda');
                if (blocoOpcoes) blocoOpcoes.style.display = 'none';

                // 2. Injeta o QR Code de forma limpa e centralizada
                const blocoPendente = document.getElementById('bloco-pagamento-pendente');
                blocoPendente.innerHTML = `
                    <div style="text-align: center;">
                        <strong style="color: #27ae60; display: block; margin-bottom: 5px; font-size: 15px;">✅ PIX Gerado com Sucesso!</strong>
                        <p style="font-size: 13px; color: #666; margin-bottom: 10px;">Escaneie o QR Code abaixo no app do seu banco:</p>
                        
                        <div style="background: #fff; padding: 10px; border-radius: 8px; border: 1px solid #eee; display: inline-block; margin-bottom: 15px;">
                            <img src="data:image/png;base64,${dados.qrCodeBase64}" style="width: 150px; height: 150px; display: block;">
                        </div>
                        
                        <div style="display: flex; gap: 5px; margin-bottom: 15px;">
                            <input type="text" value="${dados.pixCopiaECola}" id="input-pix-copia" readonly style="flex: 1; padding: 8px 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 11px; color: #666; outline: none; background: #f9f9f9;">
                            <button onclick="navigator.clipboard.writeText(document.getElementById('input-pix-copia').value); alert('Código PIX Copiado!');" style="background: #ffcc00; color: #111; border: none; padding: 0 15px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 12px; white-space: nowrap;">COPIAR</button>
                        </div>
                        
                        <div id="simulador-aprovacao" style="color: #e67e22; font-weight: bold; font-size: 13px; display: flex; justify-content: center; align-items: center; gap: 8px; padding-top: 10px; border-top: 1px solid #eee;">
                            <svg viewBox="0 0 50 50" style="width: 16px; height: 16px; animation: rotate 2s linear infinite;"><circle cx="25" cy="25" r="20" fill="none" stroke="#e67e22" stroke-width="5" stroke-dasharray="90 150"></circle></svg>
                            Aguardando pagamento...
                        </div>
                    </div>
                `;

                // 3. O TRUQUE: Aguarda 8 segundos e aprova automaticamente!
                setTimeout(async () => {
                    const statusAprovacao = document.getElementById('simulador-aprovacao');
                    if (statusAprovacao) {
                        statusAprovacao.innerHTML = "✅ Pagamento identificado! Atualizando...";
                        statusAprovacao.style.color = "#27ae60";
                    }
                    
                    // Avisa o Back-end que o cliente pagou
                    await fetch(`http://localhost:3000/api/pedidos/${pedidoSendoGerenciado.numeroPedido}/aprovar`, { 
                        method: 'PUT' 
                    });
                    
                    setTimeout(() => {
                        window.location.reload(); 
                    }, 2000);
                    
                }, 8000);

            } else {
                alert("Falha ao gerar código PIX.");
                if (btn) { btn.innerText = "💸 PAGAR VIA PIX"; btn.disabled = false; }
            }
        } catch (erro) {
            alert("Erro de conexão com o servidor de pagamentos.");
            if (btn) { btn.innerText = "💸 PAGAR VIA PIX"; btn.disabled = false; }
        }
    };


    // Ação Real do Cancelamento (Modal 2 -> Back-end)
    window.confirmarCancelamentoFinal = async () => {
        const motivoSelecionado = document.querySelector('input[name="motivo_cancelamento"]:checked');
        const motivoExtra = document.getElementById('texto-motivo-extra').value.trim();
        
        if (!motivoSelecionado) return;

        const motivoFinalStr = motivoExtra ? `${motivoSelecionado.value} - ${motivoExtra}` : motivoSelecionado.value;

        const btn = document.getElementById('btn-confirmar-cancelamento');
        btn.textContent = "CANCELANDO...";
        btn.disabled = true;

        try {
            const resposta = await fetch(`http://localhost:3000/api/pedidos/${pedidoSendoGerenciado.numeroPedido}/cancelar`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ motivo: motivoFinalStr })
            });

            if (resposta.ok) {
                alert("✅ O seu pedido foi cancelado com sucesso.");
                window.location.reload(); 
            } else {
                alert("❌ Erro ao cancelar o pedido. Verifique se a rota PUT está ativa no Back-end.");
                btn.textContent = "CONFIRMAR CANCELAMENTO";
                btn.disabled = false;
            }
        } catch (e) {
            alert("❌ Erro de conexão com o servidor. O Node.js está rodando?");
            btn.textContent = "CONFIRMAR CANCELAMENTO";
            btn.disabled = false;
        }
    };

    // Injeção do HTML dos Dois Modais na Página
    function prepararModalGerenciarHTML() {
        if (!document.getElementById('modal-gerenciar-pedido')) {
            const motivosList = [
                'Me arrependi da compra',
                'A data de entrega não foi cumprida',
                'Quero mudar a forma de pagamento',
                'Encontrei o mesmo produto por um preço melhor',
                'O vendedor não me respondeu',
                'Outros',
                'Desconheço a compra'
            ];

            let htmlMotivos = '';
            motivosList.forEach(m => {
                htmlMotivos += `
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
                        <input type="radio" name="motivo_cancelamento" value="${m}" onchange="liberarBotaoMotivo()" style="accent-color: #ff6b00; transform: scale(1.2);">
                        <span style="color: #555; font-size: 14px;">${m}</span>
                    </label>
                `;
            });

            const modalsHTML = `
            <div id="modal-gerenciar-pedido" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 9999; justify-content: center; align-items: center; backdrop-filter: blur(3px);">
                <div style="background: #fff; width: 90%; max-width: 500px; border-radius: 8px; overflow: hidden; font-family: 'Poppins', sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
                    <div style="background: #005599; color: #fff; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 24px;">🥷</span>
                            <strong style="font-size: 16px;">PRECISA DE AJUDA?</strong>
                        </div>
                        <button onclick="fecharModalGerenciar()" style="background: none; border: none; color: #fff; font-size: 24px; cursor: pointer; font-weight: bold; line-height: 1;">&times;</button>
                    </div>
                    <div style="padding: 20px; max-height: 80vh; overflow-y: auto; scrollbar-width: thin;">
                        <p style="margin: 0 0 15px 0; color: #333; font-weight: 600;">Pedido: <span id="modal-gerenciar-num"></span></p>

                        <div id="bloco-pagamento-pendente" style="display: none; background: #fffcf0; border: 1px solid #d4a000; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                            <strong style="color: #d4a000; display: block; margin-bottom: 5px;">⚠️ Pagamento Pendente!</strong>
                            <p style="font-size: 13px; color: #666; margin-bottom: 10px;">O seu pedido já está reservado. Realize o pagamento para iniciar a separação.</p>
                            <button id="btn-gerar-pix-pendente" onclick="gerarPixPendente()" style="background: #ffcc00; color: #111; border: none; padding: 8px 15px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px; width: 100%;">💸 PAGAR VIA PIX</button>
                        </div>

                        <div id="bloco-opcoes-ajuda">
                            <p style="margin: 0 0 10px 0; font-size: 14px; color: #555;">Selecione um dos tópicos abaixo:</p>

                            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                                <input type="radio" name="opcao_ajuda" value="cancelar" id="radio-cancelar" style="accent-color: #ff6b00; transform: scale(1.2);">
                                <span style="color: #333; font-size: 14px;">Quero cancelar meu pedido</span>
                            </label>

                            <div style="display: flex; gap: 15px; margin-top: 15px;">
                                <span style="color: #aaa; font-size: 12px; font-weight: bold; display: flex; align-items: center; gap: 5px;">📄 NOTA FISCAL</span>
                                <span style="color: #aaa; font-size: 12px; font-weight: bold; display: flex; align-items: center; gap: 5px;">🚚 COMPROVANTE DE ENTREGA</span>
                            </div>

                            <div id="aviso-cancelamento" style="display: none; margin-top: 20px; background: #fff5f5; border-left: 4px solid #ef4444; padding: 10px; font-size: 12px; color: #666;">
                                ⚠️ <strong style="color: #ef4444;">Atenção:</strong> Ao confirmar, o pedido será cancelado imediatamente e não poderá ser revertido.
                            </div>
                        </div>

                        <div style="display: flex; gap: 10px; margin-top: 25px;">
                            <button onclick="fecharModalGerenciar()" style="flex: 1; padding: 12px; background: #fff; border: 1px solid #ffcc00; color: #d4a000; font-weight: bold; border-radius: 4px; cursor: pointer;">VOLTAR</button>
                            <button onclick="processarAcaoGerenciar()" id="btn-continuar-gerenciar" style="flex: 1; padding: 12px; background: #eee; border: none; color: #aaa; font-weight: bold; border-radius: 4px; cursor: not-allowed;" disabled>CONTINUAR</button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="modal-motivo-cancelamento" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10000; justify-content: center; align-items: center; backdrop-filter: blur(3px);">
                <div style="background: #fff; width: 90%; max-width: 550px; border-radius: 8px; overflow: hidden; font-family: 'Poppins', sans-serif; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
                    <div style="background: #005599; color: #fff; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 24px;">🥷</span>
                            <strong style="font-size: 14px;">NOS CONTE O MOTIVO PARA REALIZAR O CANCELAMENTO</strong>
                        </div>
                        <button onclick="fecharModalGerenciar()" style="background: none; border: none; color: #fff; font-size: 24px; cursor: pointer; font-weight: bold; line-height: 1;">&times;</button>
                    </div>
                    <div style="padding: 20px; max-height: 80vh; overflow-y: auto;">
                        <p style="margin: 0 0 15px 0; font-size: 15px; color: #333; font-weight: 600;">Por que você quer cancelar o seu pedido?</p>
                        
                        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
                            ${htmlMotivos}
                        </div>

                        <textarea id="texto-motivo-extra" placeholder="Escreva aqui os motivos para o cancelamento* (Opcional)" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; min-height: 80px; font-family: 'Poppins', sans-serif; resize: none; font-size: 13px;"></textarea>

                        <div style="display: flex; gap: 10px; margin-top: 25px;">
                            <button onclick="voltarParaGerenciar()" style="flex: 1; padding: 12px; background: #fff; border: 1px solid #ffcc00; color: #d4a000; font-weight: bold; border-radius: 4px; cursor: pointer;">VOLTAR</button>
                            <button onclick="confirmarCancelamentoFinal()" id="btn-confirmar-cancelamento" style="flex: 1; padding: 12px; background: #eee; border: none; color: #aaa; font-weight: bold; border-radius: 4px; cursor: not-allowed;" disabled>CONFIRMAR</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalsHTML);

            // 💡 UX INTELIGENTE: Se clicar em cancelar, esconde a caixa amarela do PIX!
            document.getElementById('radio-cancelar').addEventListener('change', (e) => {
                const btn = document.getElementById('btn-continuar-gerenciar');
                const aviso = document.getElementById('aviso-cancelamento');
                const blocoPix = document.getElementById('bloco-pagamento-pendente');
                
                if (e.target.checked) {
                    btn.style.background = '#ef4444';
                    btn.style.color = '#fff';
                    btn.style.cursor = 'pointer';
                    btn.disabled = false;
                    aviso.style.display = 'block';
                    
                    if(blocoPix) blocoPix.style.display = 'none'; // Esconde o PIX para limpar a tela
                }
            });
        }
    }
    
    // =========================================================
    // 4. SISTEMA DE ENDEREÇOS E SEGURANÇA (MANTIDOS INTACTOS)
    // =========================================================
    carregarEnderecosDash();

    function carregarEnderecosDash() {
        let enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq'));
        if (!enderecos || enderecos.length === 0) {
            enderecos = [
                { id: 1, identificacao: "Casa", rua: "Avenida Enir Santos", numero: "1233", bairro: "Centro", cidade: "Horizonte", uf: "CE", cep: "62886-580", frete: 15.00 },
                { id: 2, identificacao: "Oficina (Trabalho)", rua: "Rua Coronel Bento", numero: "450", bairro: "Galpão 2", cidade: "Fortaleza", uf: "CE", cep: "60000-000", frete: 15.00 }
            ];
            localStorage.setItem('enderecosEngremaq', JSON.stringify(enderecos));
            localStorage.setItem('enderecoSelecionado', '1'); 
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

    window.tornarPadrao = (id) => { localStorage.setItem('enderecoSelecionado', id); renderizarGridEnderecos(); };
    window.removerEndereco = (id) => {
        if(confirm("Deseja realmente remover este endereço?")) {
            let enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq')) || [];
            enderecos = enderecos.filter(e => e.id != id);
            localStorage.setItem('enderecosEngremaq', JSON.stringify(enderecos));
            renderizarGridEnderecos();
        }
    };

    const modalEndereco = document.getElementById('modal-endereco-dash');
    document.getElementById('btn-add-address')?.addEventListener('click', () => modalEndereco.classList.add('active'));
    window.fecharModalEndereco = () => { modalEndereco.classList.remove('active'); document.getElementById('form-novo-endereco').reset(); };

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

    const formNovoEnd = document.getElementById('form-novo-endereco');
    if (formNovoEnd) {
        formNovoEnd.addEventListener('submit', (e) => {
            e.preventDefault();
            const novoId = Date.now();
            const novoEndereco = {
                id: novoId, identificacao: document.getElementById('dash-identificacao').value,
                rua: document.getElementById('dash-rua').value, numero: document.getElementById('dash-numero').value,
                complemento: document.getElementById('dash-complemento').value, bairro: document.getElementById('dash-bairro').value,
                cep: document.getElementById('dash-cep').value, cidade: document.getElementById('dash-cidade').value,
                uf: document.getElementById('dash-uf').value, frete: document.getElementById('dash-uf').value === 'CE' ? 15.00 : 45.00
            };
            let enderecos = JSON.parse(localStorage.getItem('enderecosEngremaq')) || [];
            enderecos.push(novoEndereco);
            localStorage.setItem('enderecosEngremaq', JSON.stringify(enderecos));
            localStorage.setItem('enderecoSelecionado', novoId);
            fecharModalEndereco(); renderizarGridEnderecos();
        });
    }

    let acaoSegurancaPendente = ''; let codigoAutenticado = ''; 
    const modalSeguranca = document.getElementById('modal-seguranca');
    const stepOtp = document.getElementById('step-otp');
    const stepEmail = document.getElementById('step-novo-email');
    const stepSenha = document.getElementById('step-nova-senha');
    const otpInput = document.getElementById('otp-input');

    async function iniciarVerificacaoDeSeguranca(acao) {
        acaoSegurancaPendente = acao; modalSeguranca.classList.add('active');
        stepOtp.style.display = 'block'; stepEmail.style.display = 'none'; stepSenha.style.display = 'none';
        otpInput.value = ''; otpInput.style.borderColor = '#ccc'; codigoAutenticado = ''; 
        
        const otpEmailDisplay = document.getElementById('otp-email-display');
        if (otpEmailDisplay) otpEmailDisplay.textContent = usuario.email;

        let titulo = acao === 'excluir' ? '⚠️ Excluir Conta' : acao === 'email' ? '✉️ Alterar E-mail' : '🔒 Alterar Senha';
        document.getElementById('modal-seguranca-title').textContent = 'Enviando código...';
        
        try {
            const resposta = await fetch('http://localhost:3000/api/auth/solicitar-codigo', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: usuario.email, acao: acao })
            });
            const dados = await resposta.json();
            if (resposta.ok) {
                document.getElementById('modal-seguranca-title').textContent = titulo; alert('Um código de segurança REAL foi enviado para o seu e-mail!');
            } else {
                alert(dados.erro.includes('Aguarde') ? '⏳ ' + dados.erro : '❌ ' + dados.erro); fecharModalSeguranca();
            }
        } catch (erro) { console.error(erro); alert('Erro de conexão. Servidor desligado.'); fecharModalSeguranca(); }
    }

    window.fecharModalSeguranca = () => { modalSeguranca.classList.remove('active'); };

    window.validarOTP = async () => {
        const codigoDigitado = otpInput.value.trim().replace(/\s/g, '');
        if (codigoDigitado.length !== 6) return alert('O código deve ter 6 números!');
        try {
            const resposta = await fetch('http://localhost:3000/api/auth/verificar-codigo', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: usuario.email, codigo: codigoDigitado })
            });
            const dados = await resposta.json();
            if (resposta.ok) {
                codigoAutenticado = codigoDigitado; stepOtp.style.display = 'none';
                if (acaoSegurancaPendente === 'excluir') {
                    const resExcluir = await fetch('http://localhost:3000/api/auth/confirmar-exclusao', {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: usuario.email, codigo: codigoDigitado })
                    });
                    if(resExcluir.ok) { alert('Conta excluída!'); localStorage.removeItem('usuarioEngremaq'); window.location.href = '../index.html'; }
                } else if (acaoSegurancaPendente === 'email') { stepEmail.style.display = 'block'; document.getElementById('novo-email-input').focus(); } 
                else if (acaoSegurancaPendente === 'senha') { stepSenha.style.display = 'block'; document.getElementById('nova-senha-input').focus(); }
            } else { otpInput.style.borderColor = '#ef4444'; alert('❌ ' + dados.erro); }
        } catch (erro) { alert('Erro de conexão com o servidor.'); }
    };

    window.salvarNovoEmail = async () => {
        const novoEmail = document.getElementById('novo-email-input').value.trim();
        if(!novoEmail.includes('@') || !novoEmail.includes('.')) return alert("E-mail inválido.");
        try {
            const resposta = await fetch('http://localhost:3000/api/auth/alterar-email', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailAtual: usuario.email, novoEmail: novoEmail, codigo: codigoAutenticado })
            });
            if (resposta.ok) {
                usuario.email = novoEmail; localStorage.setItem('usuarioEngremaq', JSON.stringify(usuario));
                alert("✅ E-mail alterado!"); window.location.reload(); 
            } else { const dados = await resposta.json(); alert('❌ ' + dados.erro); }
        } catch (e) { alert("Erro de conexão."); }
    };

    window.salvarNovaSenha = async () => {
        const novaSenha = document.getElementById('nova-senha-input').value;
        const confirmacao = document.getElementById('nova-senha-confirm').value;
        const regexSenha = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!regexSenha.test(novaSenha)) return alert("Senha fraca.");
        if(novaSenha !== confirmacao) return alert("Senhas não coincidem.");
        try {
            const resposta = await fetch('http://localhost:3000/api/auth/alterar-senha', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: usuario.email, novaSenha: novaSenha, codigo: codigoAutenticado })
            });
            if (resposta.ok) { alert("✅ Senha atualizada!"); fecharModalSeguranca(); } 
            else { const dados = await resposta.json(); alert('❌ ' + dados.erro); }
        } catch (e) { alert("Erro de conexão."); }
    };

    document.getElementById('btn-alterar-email')?.addEventListener('click', (e) => { e.preventDefault(); iniciarVerificacaoDeSeguranca('email'); });
    document.getElementById('btn-alterar-senha')?.addEventListener('click', (e) => { e.preventDefault(); iniciarVerificacaoDeSeguranca('senha'); });
    document.getElementById('btn-excluir-conta')?.addEventListener('click', (e) => { e.preventDefault(); iniciarVerificacaoDeSeguranca('excluir'); });

    const formDados = document.getElementById('form-meus-dados');
    if(formDados) {
        formDados.addEventListener('submit', async (e) => {
            e.preventDefault(); usuario.nome = document.getElementById('dados-nome').value;
            localStorage.setItem('usuarioEngremaq', JSON.stringify(usuario)); alert("✅ Nome atualizado!"); window.location.reload();
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if(confirm("Deseja sair da conta?")) { localStorage.removeItem('usuarioEngremaq'); window.location.href = '../index.html'; }
        });
    }
});