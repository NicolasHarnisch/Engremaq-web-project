// login.js - Lógica da página de Login

document.addEventListener('DOMContentLoaded', () => {
    
    // Procura o formulário inteiro ou o botão de entrar
    const form = document.querySelector('form');
    const btnEntrar = document.querySelector('button'); 

    // Função que executa o login
    const realizarLogin = (e) => {
        // ESSA É A LINHA MÁGICA: Impede o formulário de recarregar a página e dar o Erro 405
        if (e) e.preventDefault(); 

        // Pega os campos de e-mail e senha buscando pelo tipo ou placeholder
        const emailInput = document.querySelector('input[type="email"], input[placeholder*="e-mail" i]');
        const senhaInput = document.querySelector('input[type="password"], input[placeholder*="senha" i]');

        // Validação para garantir que os campos não estão vazios
        if (!emailInput || emailInput.value.trim() === '') {
            alert('Por favor, digite o seu e-mail.');
            return;
        }
        
        if (!senhaInput || senhaInput.value.trim() === '') {
            alert('Por favor, digite a sua senha.');
            return;
        }

        // Como é um protótipo, vamos aceitar qualquer senha, 
        // e tirar o nome da pessoa a partir do e-mail que ela digitou
        let nomeFormatado = emailInput.value.split('@')[0];
        nomeFormatado = nomeFormatado.charAt(0).toUpperCase() + nomeFormatado.slice(1);

        // 1. Salva os dados na "memória" do navegador (Simulando o Banco de Dados)
        localStorage.setItem('usuarioEngremaq', JSON.stringify({
            nome: nomeFormatado,
            email: emailInput.value
        }));

        // 2. Redireciona para a página Inicial (Home) sem dar erro
        window.location.href = '../index.html'; 
    };

    // Adiciona o evento de 'submit' se existir um formulário (funciona para o botão e tecla Enter)
    if (form) {
        form.addEventListener('submit', realizarLogin);
    } 
    // Fallback: se não tiver tag <form>, escuta o clique direto no botão
    else if (btnEntrar) {
        btnEntrar.addEventListener('click', realizarLogin);
    }
});