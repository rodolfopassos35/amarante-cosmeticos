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

incluirComponente('#header-placeholder', 'components/header.html');
incluirComponente('#footer-placeholder', 'components/footer.html');

// js/contato.js (ou o arquivo onde o seu código de contato está)

// ... (suas funções incluirComponente, se existirem) ...

document.querySelector("#form-contato").addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.querySelector("#nome").value;
    const email = document.querySelector("#email").value;
    const mensagem = document.querySelector("#mensagem").value;

    const formData = new FormData();
    formData.append("Nome", nome);
    formData.append("Email", email);
    formData.append("Mensagem", mensagem);

    // --- Campo oculto para o Formspree definir o assunto do e-mail recebido ---
    formData.append("_subject", `Nova Mensagem do Site Amarante Cosméticos de: ${nome}`);

    // --- Opcional: Redirecionar para uma página de agradecimento após o envio ---
    // Você pode criar uma página simples chamada 'obrigado.html' no seu site.
    // formData.append("_next", "https://seusite.com.br/obrigado.html"); 

    const formStatus = document.getElementById('formStatus');

    if (formStatus) {
        formStatus.textContent = 'Enviando...';
        formStatus.style.color = 'blue';
    }

    try {
        // --- ATUALIZE ESTE URL AGORA COM O SEU URL FORMSPREE REAL ---
        const formspreeUrl = "https://formspree.io/f/xeokdebb"; // <--- ESTE É O SEU URL

        const resposta = await fetch(formspreeUrl, {
            method: "POST",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (resposta.ok) {
            if (formStatus) {
                formStatus.textContent = "✅ Mensagem enviada com sucesso! A Amarante Cosméticos entrará em contato em breve.";
                formStatus.style.color = 'green';
            } else {
                alert("✅ Mensagem enviada com sucesso! A Amarante Cosméticos entrará em contato em breve.");
            }
            // Limpa o formulário após o envio
            document.querySelector("#nome").value = '';
            document.querySelector("#email").value = '';
            document.querySelector("#mensagem").value = '';
        } else {
            const resultado = await resposta.json();
            const errorMessage = resultado.errors ? resultado.errors.map(e => e.message).join(", ") : 'Ocorreu um erro ao enviar a mensagem.';
            if (formStatus) {
                formStatus.textContent = "❌ Erro: " + errorMessage;
                formStatus.style.color = 'red';
            } else {
                alert("❌ Erro: " + errorMessage);
            }
            console.error("Erro do Formspree:", resultado);
        }
    } catch (erro) {
        if (formStatus) {
            formStatus.textContent = "❌ Erro de conexão. Por favor, verifique sua conexão com a internet e tente novamente.";
            formStatus.style.color = 'red';
        } else {
            alert("❌ Erro de conexão com o servidor. Por favor, verifique sua conexão com a internet e tente novamente.");
        }
        console.error("Erro de rede:", erro);
    }
});

/* document.querySelector("#form-contato").addEventListener("submit", async function (e) {
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
}); */