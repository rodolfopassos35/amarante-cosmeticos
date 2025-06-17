async function incluirComponente(seletor, arquivo) {
    try {
        const resp = await fetch(arquivo);
            if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
            const html = await resp.text();
            document.querySelector(seletor).innerHTML = html;
    } catch (error) {
            console.error(`Erro ao carregar o componente ${arquivo}:`, error);
        }
}

incluirComponente('#header-placeholder', 'componentes/header.html'); 
incluirComponente('#footer-placeholder', 'componentes/footer.html');
        
document.querySelector("#form-contato").addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.querySelector("#nome").value;
    const email = document.querySelector("#email").value;
    const mensagem = document.querySelector("#mensagem").value;

    try {
        const resposta = await fetch("http://localhost:3000/enviar-contato", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, mensagem }),
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert("✅ Mensagem enviada com sucesso!");
        } else {
            alert("❌ Erro: " + resultado.error);
        }
    } catch (erro) {
                alert("❌ Erro de conexão com o servidor.");
                console.error(erro);
    }
});