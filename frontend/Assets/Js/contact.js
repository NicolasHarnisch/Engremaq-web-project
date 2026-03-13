document.getElementById("form-contato")?.addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const btn = document.getElementById("btn-enviar");
    let envios = JSON.parse(localStorage.getItem("historicoEnvios")) || {};

    if (envios[email] >= 10) return document.getElementById("msg-erro").style.display = "block";

    btn.textContent = "A Enviar...";
    btn.disabled = true;

    // Constrói os dados no formato JSON
    const payload = {
        nome: document.getElementById("nome")?.value,
        email: email,
        assunto: document.getElementById("assunto")?.value,
        mensagem: document.getElementById("mensagem")?.value
    };

    // Aponta para o seu Back-end em vez do FormSubmit
    fetch("https://api-engremaq.onrender.com/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    }).then(r => r.json()).then(data => {
        if(data.success) {
            document.getElementById("msg-sucesso").style.display = "block";
            this.reset();
            envios[email] = (envios[email] || 0) + 1;
            localStorage.setItem("historicoEnvios", JSON.stringify(envios));
        } else {
            alert("Erro ao enviar a mensagem. Tente novamente mais tarde.");
        }
    }).catch(() => {
        alert("Erro de conexão com o servidor.");
    }).finally(() => {
        btn.textContent = "Enviar Mensagem";
        btn.disabled = false;
    });
});