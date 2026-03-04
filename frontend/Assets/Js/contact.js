document.getElementById("form-contato")?.addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const btn = document.getElementById("btn-enviar");
    let envios = JSON.parse(localStorage.getItem("historicoEnvios")) || {};

    if (envios[email] >= 10) return document.getElementById("msg-erro").style.display = "block";

    btn.textContent = "Enviando...";
    btn.disabled = true;

    fetch("https://formsubmit.co/ajax/nicolasgomeshar@gmail.com", {
        method: "POST",
        body: new FormData(this)
    }).then(r => r.json()).then(data => {
        if(data.success) {
            document.getElementById("msg-sucesso").style.display = "block";
            this.reset();
            envios[email] = (envios[email] || 0) + 1;
            localStorage.setItem("historicoEnvios", JSON.stringify(envios));
        }
    }).finally(() => {
        btn.textContent = "Enviar Mensagem";
        btn.disabled = false;
    });
});