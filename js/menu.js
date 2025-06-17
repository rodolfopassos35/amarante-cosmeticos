document.addEventListener('DOMContentLoaded', () => {
    const hamburgerButton = document.getElementById('hamburgerButton');
    const menuNavegacao = document.getElementById('menuNavegacao');
    const body = document.body; // Referência ao body para controlar overflow

    if (hamburgerButton && menuNavegacao) {
        hamburgerButton.addEventListener('click', () => {
            // Alterna a classe 'active' no botão hambúrguer para animar o ícone
            hamburgerButton.classList.toggle('active');

            // Alterna a classe 'active' no menu de navegação para mostrá-lo/escondê-lo
            menuNavegacao.classList.toggle('active');

            // Alterna a classe 'menu-open' no body para controlar a rolagem
            body.classList.toggle('menu-open');
        });

        // Opcional: Fechar o menu quando um link é clicado (útil para Single Page Applications ou para melhorar a UX)
        menuNavegacao.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerButton.classList.remove('active');
                menuNavegacao.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });
    }
});