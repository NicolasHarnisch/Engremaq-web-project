// register.js - Lógica da página de Cadastro

document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica das Abas (CPF vs CNPJ)
    const tabCpf = document.getElementById('tab-cpf');
    const tabCnpj = document.getElementById('tab-cnpj');
    const labelDoc = document.getElementById('label-doc');
    const inputDoc = document.getElementById('cad-doc');

    if (tabCpf && tabCnpj) {
        tabCpf.addEventListener('click', () => {
            tabCpf.classList.add('active');
            tabCnpj.classList.remove('active');
            labelDoc.innerText = 'CPF*';
            inputDoc.placeholder = '000.000.000-00';
        });

        tabCnpj.addEventListener('click', () => {
            tabCnpj.classList.add('active');
            tabCpf.classList.remove('active');
            labelDoc.innerText = 'CNPJ*';
            inputDoc.placeholder = '00.000.000/0000-00';
        });
    }

    // 2. Lógica do Formulário (Salvar e Logar)
    const form = document.getElementById('form-cadastro');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita recarregar a página (Erro 405)

            const nomeInput = document.getElementById('cad-nome').value.trim();
            const emailInput = document.getElementById('cad-email').value.trim();
            const senhaInput = document.getElementById('cad-senha').value.trim();

            // Validação simples de senha
            if (senhaInput.length < 8) {
                alert('A senha precisa ter pelo menos 8 caracteres!');
                return;
            }

            // Pega apenas o primeiro nome para ficar bonito no cabeçalho
            let primeiroNome = nomeInput.split(' ')[0];
            primeiroNome = primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1);

            // Salva no LocalStorage simulando a criação da conta
            localStorage.setItem('usuarioEngremaq', JSON.stringify({
                nome: primeiroNome,
                email: emailInput
            }));

            alert('Conta criada com sucesso! Bem-vindo(a) à Engremaq.');
            
            // Redireciona logado para a página inicial
            window.location.href = '../index.html';
        });
    }
});