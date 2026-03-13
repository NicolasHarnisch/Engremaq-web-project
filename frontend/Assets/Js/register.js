// register.js - Lógica da página de Cadastro (Estilo KaBuM!)

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // INJEÇÃO DE CSS (Design Limpo e Alertas Vermelhos)
    // ==========================================
    const style = document.createElement('style');
    style.innerHTML = `
        .input-error { border-color: #ef4444 !important; }
        .error-msg { color: #ef4444; font-size: 12px; display: flex; align-items: center; gap: 5px; margin-top: 6px; }
        .form-control-kbm { width: 100%; padding: 14px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; font-family: 'Poppins', sans-serif; transition: 0.3s; outline: none; box-sizing: border-box; }
        .form-control-kbm:focus { border-color: #ffcc00; }
    `;
    document.head.appendChild(style);

    // ==========================================
    // FUNÇÕES DE VALIDAÇÃO MATEMÁTICA (Receita Federal)
    // ==========================================
    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g,''); 
        if(cpf == '') return false;
        if (cpf.length != 11 || /^(\d)\1{10}$/.test(cpf)) return false; 
        
        let add = 0;
        for (let i=0; i < 9; i ++) add += parseInt(cpf.charAt(i)) * (10 - i);
        let rev = 11 - (add % 11);
        if (rev == 10 || rev == 11) rev = 0;
        if (rev != parseInt(cpf.charAt(9))) return false;
        
        add = 0;
        for (let i = 0; i < 10; i ++) add += parseInt(cpf.charAt(i)) * (11 - i);
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11) rev = 0;
        if (rev != parseInt(cpf.charAt(10))) return false;
        
        return true;
    }

    function validarCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]+/g,'');
        if(cnpj == '') return false;
        if (cnpj.length != 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

        let tamanho = cnpj.length - 2
        let numeros = cnpj.substring(0,tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0)) return false;
        
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0,tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1)) return false;
        
        return true;
    }

    // ==========================================
    // 1. LÓGICA DAS ABAS, LABELS DINÂMICOS E MÁSCARAS
    // ==========================================
    const tabCpf = document.getElementById('tab-cpf');
    const tabCnpj = document.getElementById('tab-cnpj');
    
    const inputDoc = document.getElementById('cad-doc');
    const inputNome = document.getElementById('cad-nome');
    const inputTelefone = document.getElementById('cad-telefone');

    let tipoDocumento = 'CPF'; 

    // Função para achar o Label (mesmo que ele não tenha ID)
    const getLabel = (inputEl) => document.querySelector(`label[for="${inputEl.id}"]`) || inputEl.previousElementSibling;

    if (tabCpf && tabCnpj) {
        tabCpf.addEventListener('click', () => {
            tabCpf.classList.add('active');
            tabCnpj.classList.remove('active');
            tipoDocumento = 'CPF';
            
            const labelDoc = getLabel(inputDoc);
            const labelNome = getLabel(inputNome);
            
            if(labelDoc) labelDoc.innerText = 'CPF*';
            if(labelNome) labelNome.innerText = 'Nome completo*';
            
            inputDoc.placeholder = '000.000.000-00';
            inputNome.placeholder = 'Digite seu nome completo';
            
            inputDoc.value = ''; clearError(inputDoc);
            inputDoc.focus();
        });

        tabCnpj.addEventListener('click', () => {
            tabCnpj.classList.add('active');
            tabCpf.classList.remove('active');
            tipoDocumento = 'CNPJ';
            
            const labelDoc = getLabel(inputDoc);
            const labelNome = getLabel(inputNome);
            
            if(labelDoc) labelDoc.innerText = 'CNPJ*';
            if(labelNome) labelNome.innerText = 'Razão Social*'; // Muda para Razão Social automaticamente
            
            inputDoc.placeholder = '00.000.000/0000-00';
            inputNome.placeholder = 'Digite a razão social da empresa';
            
            inputDoc.value = ''; clearError(inputDoc);
            inputDoc.focus();
        });
    }

    // Máscara Dinâmica de CPF/CNPJ
    if (inputDoc) {
        inputDoc.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, ''); 

            if (tipoDocumento === 'CPF') {
                if (valor.length > 11) valor = valor.slice(0, 11); 
                valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
                valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
                valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            } else {
                if (valor.length > 14) valor = valor.slice(0, 14); 
                valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
                valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
                valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
            }
            e.target.value = valor; 
        });
    }

    // Máscara Automática de Telefone
    if (inputTelefone) {
        inputTelefone.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 11) v = v.slice(0, 11);
            v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
            v = v.replace(/(\d)(\d{4})$/, '$1-$2');
            e.target.value = v;
        });
    }

    // ==========================================
    // 2. VALIDAÇÃO EM TEMPO REAL (Alertas Vermelhos)
    // ==========================================
    const inputsValidacao = [
        { id: 'cad-email', msgVazio: 'É necessário informar o seu e-mail.' },
        { id: 'cad-nome', msgVazio: 'O campo nome/razão social é obrigatório.' },
        { id: 'cad-doc', msgVazio: 'É necessário informar o documento.' },
        { id: 'cad-telefone', msgVazio: 'É necessário informar o telefone.' },
        { id: 'cad-senha', msgVazio: 'A senha é obrigatória.' }
    ];

    function showError(input, msg) {
        input.classList.add('input-error');
        let errorSpan = input.nextElementSibling;
        if (!errorSpan || !errorSpan.classList.contains('error-msg')) {
            errorSpan = document.createElement('span');
            errorSpan.className = 'error-msg';
            // Ícone de erro idêntico ao da KaBuM
            errorSpan.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="#ef4444" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> ${msg}`;
            input.parentNode.insertBefore(errorSpan, input.nextSibling);
        } else {
            errorSpan.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="#ef4444" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> ${msg}`;
        }
    }

    function clearError(input) {
        input.classList.remove('input-error');
        const errorSpan = input.nextElementSibling;
        if (errorSpan && errorSpan.classList.contains('error-msg')) {
            errorSpan.remove();
        }
    }

    inputsValidacao.forEach(campo => {
        const el = document.getElementById(campo.id);
        if (el) {
            el.classList.add('form-control-kbm'); // Aplica CSS limpo
            el.addEventListener('blur', () => {
                if (!el.value.trim()) showError(el, campo.msgVazio);
                else clearError(el);
            });
            el.addEventListener('input', () => clearError(el));
        }
    });

    // ==========================================
    // 3. Lógica de Mostrar/Esconder Senha
    // ==========================================
    const toggleSenha = document.getElementById('toggle-senha');
    const cadSenha = document.getElementById('cad-senha');

    if (toggleSenha && cadSenha) {
        toggleSenha.addEventListener('click', () => {
            if (cadSenha.type === 'password') {
                cadSenha.type = 'text'; 
                toggleSenha.src = "https://img.icons8.com/ios-filled/50/666666/hide.png"; 
            } else {
                cadSenha.type = 'password'; 
                toggleSenha.src = "https://img.icons8.com/ios-filled/50/666666/visible--v1.png"; 
            }
        });
    }

    // ==========================================
    // 4. ENVIO DO FORMULÁRIO
    // ==========================================
    const form = document.getElementById('form-cadastro');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nomeInput = document.getElementById('cad-nome');
            const emailInput = document.getElementById('cad-email');
            const docInput = document.getElementById('cad-doc'); 
            const telefoneInput = document.getElementById('cad-telefone');
            const senhaInput = document.getElementById('cad-senha');
            const receberOfertas = document.getElementById('cad-ofertas').checked;

            let temErro = false;

            // Força a validação de vazios ao tentar enviar
            inputsValidacao.forEach(campo => {
                const el = document.getElementById(campo.id);
                if (!el.value.trim()) {
                    showError(el, campo.msgVazio);
                    temErro = true;
                }
            });

            if (temErro) return;

            // VALIDAÇÃO DE DOCUMENTOS 
            if (tipoDocumento === 'CPF') {
                if (!validarCPF(docInput.value)) {
                    showError(docInput, "O CPF digitado é inválido.");
                    docInput.focus(); return; 
                }
            } else {
                if (!validarCNPJ(docInput.value)) {
                    showError(docInput, "O CNPJ digitado é inválido.");
                    docInput.focus(); return;
                }
            }

            // VALIDAÇÃO DE SENHA 
            const regexSenha = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!regexSenha.test(senhaInput.value)) {
                showError(senhaInput, "Mínimo 8 caracteres, 1 maiúscula e 1 número.");
                senhaInput.focus(); return;
            }

            const btnSubmit = form.querySelector('.btn-continuar');
            const textoOriginal = btnSubmit.innerText;
            btnSubmit.innerText = 'CRIANDO CONTA...';
            btnSubmit.disabled = true;

            try {
                const resposta = await fetch('http://localhost:3000/api/auth/registrar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        nome: nomeInput.value.trim(), 
                        email: emailInput.value.trim(), 
                        cpf: docInput.value.trim(), // O Backend recebe na prop "cpf", mesmo sendo CNPJ
                        telefone: telefoneInput.value.trim(), 
                        senha: senhaInput.value.trim(),
                        receberOfertas: receberOfertas 
                    })
                });

                const dados = await resposta.json();

                if (resposta.ok) {
                    alert('✅ Conta criada com sucesso! Verifique o seu e-mail.');
                    window.location.href = 'Login.html';
                } else {
                    alert('❌ ' + dados.erro);
                }

            } catch (erro) {
                alert('❌ Erro de conexão com o servidor. Verifique se o back-end está rodando.');
            } finally {
                btnSubmit.innerText = textoOriginal;
                btnSubmit.disabled = false;
            }
        });
    }
});