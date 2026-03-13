document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('id');

    if (!produtoId) { window.location.href = "Products.html"; return; }

    try {
        const resposta = await fetch('https://api-engremaq.onrender.com/api/produtos');
        const produtosBanco = await resposta.json();
        
        const produto = produtosBanco.find(p => String(p.codigo) === String(produtoId));

        if (produto) {
            document.getElementById('loading-produto').style.display = 'none';
            document.getElementById('produto-container').style.display = 'block';

            // 1. DADOS BÁSICOS
            document.getElementById('bc-nome').textContent = produto.nome;
            document.getElementById('pd-nome').textContent = produto.nome;
            document.getElementById('pd-marca').textContent = produto.marca.toUpperCase();
            document.getElementById('pd-img').src = produto.imagem;
            
            // 2. LÓGICA DE PROMOÇÃO (REGRA DE OURO DEFINITIVA)
            // Mega promoção apenas para os itens 000001 a 000004
            const ultimoDigito = parseInt(String(produto.codigo).slice(-1));
            const isPromocao = [1, 2, 3, 4].includes(ultimoDigito) && String(produto.codigo).startsWith("000");

            const precoNormal = produto.preco;
            let precoPix, precoAntigo, textoDesconto;

            // Busca a tag HTML que diz "À vista no PIX com X% de desconto"
            // (Assumindo que essa tag está logo abaixo do pd-preco-vista)
            const elTextoDescontoAbaixo = document.getElementById('pd-preco-vista').nextElementSibling;

            if (isPromocao) {
                // MEGA PROMOÇÃO 15% (Para as 4 primeiras peças)
                precoAntigo = precoNormal * 1.30; // Preço antigo fictício (+30%) para mostrar o riscado
                precoPix = precoNormal * 0.85;    // 15% de desconto real à vista
                textoDesconto = "15% de desconto";
                
                document.getElementById('pd-preco-antigo').textContent = precoAntigo.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
                document.getElementById('pd-preco-antigo').style.display = 'block';
                
                const tagPromo = document.getElementById('pd-tag-promo');
                if(tagPromo) {
                    tagPromo.textContent = "-15%";
                    tagPromo.style.display = 'inline-block';
                }

                if (elTextoDescontoAbaixo) elTextoDescontoAbaixo.innerHTML = `À vista no PIX com <strong>15% de desconto</strong>`;

            } else {
                // PREÇO PADRÃO (Apenas 5% desconto no PIX)
                precoPix = precoNormal * 0.95;
                textoDesconto = "5% de desconto";
                
                document.getElementById('pd-preco-antigo').style.display = 'none';
                if(document.getElementById('pd-tag-promo')) document.getElementById('pd-tag-promo').style.display = 'none';
                
                if (elTextoDescontoAbaixo) elTextoDescontoAbaixo.innerHTML = `À vista no PIX com <strong>5% de desconto</strong>`;
            }

            // ATUALIZA OS VALORES NA TELA
            document.getElementById('pd-preco-vista').textContent = precoPix.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
            document.getElementById('pd-preco-parcelado').textContent = `Ou ${precoNormal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})} em até 10x s/ juros no cartão`;

            // 3. TEXTOS GERADOS "TIPO KABUM"
            gerarTextosDescritivos(produto);

            // 4. AÇÕES DOS BOTÕES
            const adicionarAoLocalStorage = () => {
                const qtd = parseInt(document.getElementById('pd-qtd').value);
                let carrinho = JSON.parse(localStorage.getItem('carrinhoEngremaq')) || [];
                const item = carrinho.find(i => i.id === String(produto.codigo));
                
                if (item) item.quantidade += qtd;
                else carrinho.push({ id: String(produto.codigo), nome: produto.nome, preco: precoNormal, imagem: produto.imagem, quantidade: qtd });
                
                localStorage.setItem('carrinhoEngremaq', JSON.stringify(carrinho));
                if(window.atualizarBadge) window.atualizarBadge();
            };

            document.getElementById('btn-comprar-agora').addEventListener('click', () => {
                adicionarAoLocalStorage();
                window.location.href = "Cart.html"; // Comprar agora vai direto pro carrinho
            });

            document.getElementById('btn-add-carrinho').addEventListener('click', (e) => {
                adicionarAoLocalStorage();
                
                // Salva o conteúdo original para voltar depois
                const conteudoOriginal = e.currentTarget.innerHTML;
                
                e.currentTarget.innerHTML = "✓ ADICIONADO!";
                e.currentTarget.style.background = "#e8f5e9";
                e.currentTarget.style.color = "#2e7d32";
                e.currentTarget.style.borderColor = "#2e7d32";
                
                setTimeout(() => {
                    e.currentTarget.innerHTML = conteudoOriginal;
                    e.currentTarget.style = "";
                }, 2000);
            });

        } else {
            document.getElementById('loading-produto').textContent = "Produto não encontrado ou removido do catálogo.";
        }
    } catch (e) {
        document.getElementById('loading-produto').textContent = "Erro ao comunicar com o servidor de peças.";
    }

    // Controle de Qtd
    window.mudarQtd = (valor) => {
        const input = document.getElementById('pd-qtd');
        let novaQtd = parseInt(input.value) + valor;
        if (novaQtd < 1) novaQtd = 1;
        input.value = novaQtd;
    };

    // Calculador de Frete
    document.getElementById('btn-calc-frete-pd').addEventListener('click', async () => {
        const cep = document.getElementById('pd-cep').value.replace(/\D/g, '');
        if (cep.length !== 8) return alert("Digite um CEP válido");
        
        const result = document.getElementById('pd-frete-result');
        result.innerHTML = `<span style="color:#d4a000;">Calculando as melhores opções...</span>`;

        try {
            const freteResp = await fetch('https://api-engremaq.onrender.com/api/frete/calcular', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cepDestino: cep })
            });
            const dadosFrete = await freteResp.json();

            if (dadosFrete.sucesso && dadosFrete.fretes.length > 0) {
                let text = "";
                dadosFrete.fretes.forEach(f => {
                    text += `<div style="display:flex; justify-content:space-between; margin-top:5px; border-bottom:1px solid #eee; padding-bottom:5px;">
                                <span style="color:#555;">${f.nome} (${f.prazo} dias)</span>
                                <strong>${f.preco.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</strong>
                             </div>`;
                });
                result.innerHTML = text;
            } else { result.innerHTML = "Sem opções para este CEP."; }
        } catch(e) { result.innerHTML = "Erro no cálculo."; }
    });
});

// Função que cria a descrição técnica enorme e os bullets points com base na categoria
function gerarTextosDescritivos(produto) {
    let bullets = "";
    let textoLongo = "";

    const cat = produto.categoria.toLowerCase();

    if (cat.includes('filtro')) {
        bullets = `
            <li><strong>Tecnologia de Filtragem:</strong> Retenção de até 99,9% das micropartículas.</li>
            <li><strong>Durabilidade:</strong> Desenvolvido para estender o intervalo entre trocas.</li>
            <li><strong>Proteção:</strong> Evita o desgaste prematuro do motor e do sistema hidráulico.</li>
            <li><strong>Aplicação:</strong> Instalação direta (Plug & Play) com vedação de alta performance.</li>
        `;
        textoLongo = `O <strong>${produto.nome}</strong> da marca ${produto.marca.toUpperCase()} foi projetado sob os mais rigorosos testes de qualidade do mercado agrícola. O seu elemento filtrante de celulose aditivada proporciona um fluxo contínuo de fluidos, garantindo a lubrificação perfeita mesmo sob condições extremas de poeira, calor e longas jornadas de trabalho.<br><br>Manter a manutenção do seu maquinário em dia com componentes de confiança evita paradas inesperadas (downtime) e reduz o consumo de combustível. A vedação reforçada em borracha nitrílica impede vazamentos, garantindo a pressão exata exigida pela montadora.`;
    
    } else if (cat.includes('engrenagem')) {
        bullets = `
            <li><strong>Material:</strong> Aço Carbono Temperado com tratamento térmico especial.</li>
            <li><strong>Precisão:</strong> Usinagem CNC para um encaixe perfeito nos dentes.</li>
            <li><strong>Desempenho:</strong> Suporta altos torques sem fadiga de material.</li>
            <li><strong>Certificação:</strong> Inspecionado e validado pela equipe de engenharia Engremaq.</li>
        `;
        textoLongo = `A <strong>${produto.nome}</strong> é o coração da transmissão da sua máquina pesada. Fabricada em ligas de aço de altíssima densidade e submetida a banhos de têmpera e revenimento, esta engrenagem possui a dureza de superfície ideal para resistir ao atrito constante e aos trancos severos do trabalho no campo.<br><br>Ao escolher uma engrenagem revisada e certificada pela Engremaq, você está optando pela união perfeita entre custo-benefício e durabilidade. O assentamento dos dentes foi perfeitamente desenhado para anular vibrações excessivas e ruídos na caixa de marchas, prolongando a vida útil de todo o conjunto de tração do seu equipamento ${produto.marca}.`;
    
    } else {
        // Genérico para Acessórios, Bombas, Correias, etc.
        bullets = `
            <li><strong>Alta Resistência:</strong> Construção reforçada para o setor agrícola e maquinário pesado.</li>
            <li><strong>Garantia Engremaq:</strong> Peça original revisada com selo de qualidade técnica.</li>
            <li><strong>Compatibilidade:</strong> Padrão exato da montadora ${produto.marca.toUpperCase()}.</li>
            <li><strong>Pronta Entrega:</strong> Produto em estoque com expedição imediata.</li>
        `;
        textoLongo = `O componente <strong>${produto.nome}</strong> é uma peça de reposição essencial para manter a operacionalidade e a eficiência do seu trator. Todas as peças semi-novas do catálogo da Engremaq passam por um intenso processo de engenharia reversa e inspeção de falhas (NDT).<br><br>Nós garantimos que este componente entregará a mesma confiabilidade de uma peça recém-saída da fábrica, permitindo que a sua frota volte ao campo de colheita ou plantio de forma rápida e segura. Construído com as especificações exatas da marca ${produto.marca}, a instalação ocorre de forma transparente, exigindo menos horas de oficina.`;
    }

    document.getElementById('pd-lista-resumo').innerHTML = bullets;
    document.getElementById('pd-descricao-longa').innerHTML = textoLongo;

    document.getElementById('pd-tabela-specs').innerHTML = `
        <tr><th>Fabricante (Marca)</th><td>${produto.marca.toUpperCase()}</td></tr>
        <tr><th>Categoria</th><td>${produto.categoria.charAt(0).toUpperCase() + produto.categoria.slice(1)}</td></tr>
        <tr><th>Código Universal da Peça</th><td>EGMQ-${produto.codigo}</td></tr>
        <tr><th>Condição do Item</th><td>Revisado (Semi-novo Classe A)</td></tr>
        <tr><th>Garantia da Loja</th><td>90 Dias contra defeitos estruturais</td></tr>
        <tr><th>Compatibilidade</th><td>Consulte o catálogo da fabricante para as séries do seu trator.</td></tr>
    `;
}