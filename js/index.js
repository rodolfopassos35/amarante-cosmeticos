async function incluirComponente(seletor, arquivo) {
    try { // Bloco TRY: tenta executar o código
        const resp = await fetch(arquivo);
        // Verifica se a resposta HTTP foi bem-sucedida (status 2xx)
        if (!resp.ok) {
            // Se não foi, lança um erro para ser capturado pelo catch
            throw new Error(`HTTP error! status: ${resp.status}`);
        }
        const html = await resp.text();
            document.querySelector(seletor).innerHTML = html;
        } catch (error) { // Bloco CATCH: captura e lida com erros
            console.error(`Erro ao carregar o componente ${arquivo}:`, error);
        }
}
    
    incluirComponente('#header-placeholder', 'componentes/header.html');
    incluirComponente('#footer-placeholder', 'componentes/footer.html'); 

    document.querySelector(".menu-toggle").addEventListener("click", function() {
    document.querySelector(".linksNavegacao").classList.toggle("ativo");
});
