// register.js - Lógica da página de Cadastro

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // FUNÇÕES DE VALIDAÇÃO MATEMÁTICA (Receita Federal)
    // ==========================================
    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g,''); // Tira pontos e traços
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
    // 1. Lógica das Abas e MÁSCARAS AUTOMÁTICAS
    // ==========================================
    const tabCpf = document.getElementById('tab-cpf');
    const tabCnpj = document.getElementById('tab-cnpj');
    const labelDoc = document.getElementById('label-doc');
    const inputDoc = document.getElementById('cad-doc');

    let tipoDocumento = 'CPF'; 

    if (tabCpf && tabCnpj) {
        // Troca para CPF
        tabCpf.addEventListener('click', () => {
            tabCpf.classList.add('active');
            tabCnpj.classList.remove('active');
            labelDoc.innerText = 'CPF*';
            inputDoc.placeholder = '000.000.000-00';
            tipoDocumento = 'CPF';
            inputDoc.value = ''; // Limpa o campo ao trocar
            inputDoc.focus();
        });

        // Troca para CNPJ
        tabCnpj.addEventListener('click', () => {
            tabCnpj.classList.add('active');
            tabCpf.classList.remove('active');
            labelDoc.innerText = 'CNPJ*';
            inputDoc.placeholder = '00.000.000/0000-00';
            tipoDocumento = 'CNPJ';
            inputDoc.value = ''; // Limpa o campo ao trocar
            inputDoc.focus();
        });
    }

    // O "Mágico" que formata enquanto o usuário digita
    if (inputDoc) {
        inputDoc.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, ''); // Tira tudo que não for número

            if (tipoDocumento === 'CPF') {
                if (valor.length > 11) valor = valor.slice(0, 11); // Limita a 11 números
                // Aplica a máscara: 000.000.000-00
                valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
                valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
                valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            } else {
                if (valor.length > 14) valor = valor.slice(0, 14); // Limita a 14 números
                // Aplica a máscara: 00.000.000/0000-00
                valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
                valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
                valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
            }

            e.target.value = valor; // Devolve o valor formatado para o input
        });
    }

    // ==========================================
    // 2. Lógica de Mostrar/Esconder Senha (O Olhinho)
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
    // 3. Lógica do Formulário (Integração com Back-end)
    // ==========================================
    const form = document.getElementById('form-cadastro');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nomeInput = document.getElementById('cad-nome').value.trim();
            const emailInput = document.getElementById('cad-email').value.trim();
            const docInput = document.getElementById('cad-doc').value.trim(); 
            const telefoneInput = document.getElementById('cad-telefone').value.trim();
            const senhaInput = document.getElementById('cad-senha').value.trim();
            const receberOfertas = document.getElementById('cad-ofertas').checked;

            // VALIDAÇÃO DE DOCUMENTOS (Receita Federal)
            if (tipoDocumento === 'CPF') {
                if (!validarCPF(docInput)) {
                    alert('❌ O CPF digitado é inválido. Verifique os números.');
                    document.getElementById('cad-doc').focus();
                    return; 
                }
            } else {
                if (!validarCNPJ(docInput)) {
                    alert('❌ O CNPJ digitado é inválido. Verifique os números.');
                    document.getElementById('cad-doc').focus();
                    return;
                }
            }

            // NOVA VALIDAÇÃO RIGOROSA DE SENHA (RegEx)
            // Exige: mínimo de 8 caracteres, pelo menos 1 letra maiúscula e 1 número.
            const regexSenha = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!regexSenha.test(senhaInput)) {
                alert('❌ A senha deve conter no mínimo 8 caracteres, 1 letra maiúscula e 1 número.');
                document.getElementById('cad-senha').focus();
                return;
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
                        nome: nomeInput, 
                        email: emailInput, 
                        cpf: docInput,
                        telefone: telefoneInput, 
                        senha: senhaInput,
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
                console.error("Erro na requisição:", erro);
                alert('❌ Erro de conexão com o servidor. Verifique se o back-end está rodando.');
            } finally {
                btnSubmit.innerText = textoOriginal;
                btnSubmit.disabled = false;
            }
        });
    }
});