// js/index.js

document.addEventListener('DOMContentLoaded', () => {
  async function incluirComponente(id, url) {
    const elemento = document.getElementById(id);
    if (!elemento) {
      console.warn(`Elemento com ID '${id}' não encontrado.`);
      return;
    }

    try {
      const resposta = await fetch(url);
      const conteudo = await resposta.text();
      elemento.innerHTML = conteudo;

      // Se o header for carregado, aplica o menu hamburguer
      if (id === "header-placeholder") {
        const toggleButton = document.querySelector(".menu-toggle");
        const menuNavegacao = document.getElementById("menuNavegacao");

        if (toggleButton && menuNavegacao) {
          toggleButton.addEventListener("click", function () {
            menuNavegacao.classList.toggle("ativo");
          });
        }
      }

    } catch (erro) {
      console.error(`Erro ao carregar o componente ${url}:`, erro);
    }
  }

  // Chamada para incluir os componentes
  incluirComponente("header-placeholder", "components/header.html");
  incluirComponente("footer-placeholder", "components/footer.html");
});


