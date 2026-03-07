document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const btnEntrar = document.querySelector('button[type="submit"]') || document.querySelector('.btn-continuar') || document.querySelector('button'); 

    const realizarLogin = async (e) => {
        if (e) e.preventDefault(); 

        const emailInput = document.querySelector('input[type="email"], input[placeholder*="e-mail" i]');
        const senhaInput = document.querySelector('input[type="password"], input[placeholder*="senha" i]');

        if (!emailInput || emailInput.value.trim() === '') return alert('Por favor, digite o seu e-mail.');
        if (!senhaInput || senhaInput.value.trim() === '') return alert('Por favor, digite a sua senha.');

        const textoOriginal = btnEntrar.innerText;
        btnEntrar.innerText = 'A ENTRAR...';
        btnEntrar.disabled = true;

        try {
            const resposta = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput.value.trim(), senha: senhaInput.value.trim() })
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                // Guarda os dados visuais E o Token de segurança assinado
                localStorage.setItem('usuarioEngremaq', JSON.stringify(dados.usuario));
                localStorage.setItem('tokenEngremaq', dados.token); 
                window.location.href = '../index.html'; 
            } else {
                alert('❌ ' + dados.erro);
            }
        } catch (erro) {
            alert('❌ Erro de conexão com o servidor. Verifique se o Back-end está a rodar.');
        } finally {
            btnEntrar.innerText = textoOriginal;
            btnEntrar.disabled = false;
        }
    };

    if (form) form.addEventListener('submit', realizarLogin);
    else if (btnEntrar) btnEntrar.addEventListener('click', realizarLogin);

    // Lógica do Olhinho
    const toggleSenhaLogin = document.getElementById('toggle-senha-login');
    const inputSenhaLogin = document.getElementById('login-senha');

    if (toggleSenhaLogin && inputSenhaLogin) {
        toggleSenhaLogin.addEventListener('mouseenter', () => toggleSenhaLogin.style.opacity = '1');
        toggleSenhaLogin.addEventListener('mouseleave', () => toggleSenhaLogin.style.opacity = '0.6');
        toggleSenhaLogin.addEventListener('click', () => {
            if (inputSenhaLogin.type === 'password') {
                inputSenhaLogin.type = 'text';
                toggleSenhaLogin.src = "https://img.icons8.com/ios-filled/50/666666/hide.png";
            } else {
                inputSenhaLogin.type = 'password';
                toggleSenhaLogin.src = "https://img.icons8.com/ios-filled/50/666666/visible--v1.png";
            }
        });
    }
});