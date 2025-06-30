document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica para os botões 'Adicionar ao Carrinho' ---
    const botoesAdicionar = document.querySelectorAll('.btn-add-carrinho');

    botoesAdicionar.forEach(botao => {
        botao.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede que o clique no botão ative outros eventos (como filtro de categoria)

            const produto = {
                id: botao.dataset.id,
                nome: botao.dataset.nome,
                preco: parseFloat(botao.dataset.preco),
                img: botao.dataset.img, // Usa 'img' para ser consistente com data-img no HTML
                quantidade: 1
            };

            // CHAMA A FUNÇÃO GLOBAL DEFINIDA EM carrinho.js
            if (window.adicionarProdutoAoCarrinho) {
                window.adicionarProdutoAoCarrinho(produto);
                console.log(`Produto "${produto.nome}" adicionado via produtos.js`);
            } else {
                console.error("Erro: A função 'adicionarProdutoAoCarrinho' não está disponível. Verifique o carregamento de carrinho.js.");
            }
        });
    });

    // --- Lógica de filtro de produtos ---
    // (Mantenha o restante do seu código de filtro aqui, sem modificações)
    const inputBuscaNome = document.getElementById('buscaNome');
    const linksCategoria = document.querySelectorAll('.sidebarProdutos ul li a');
    const inputFiltroPreco = document.getElementById('filtroPreco');
    const valorPrecoSpan = document.getElementById('valorPreco');

    let categoriaAtual = 'todos';
    let precoMaxAtual = parseFloat(inputFiltroPreco ? inputFiltroPreco.value : 1000);

    function aplicarFiltros() {
        const termoBusca = inputBuscaNome ? inputBuscaNome.value.toLowerCase() : '';
        const produtosFigure = document.querySelectorAll('.agrupaProdutosDestaque figure');

        produtosFigure.forEach(figure => {
            const h3 = figure.querySelector('figcaption h3');
            const span = figure.querySelector('figcaption span');

            if (!h3 || !span) {
                console.warn('Elemento incompleto encontrado:', figure);
                return;
            }

            const nomeProduto = h3.textContent.toLowerCase();
            const categoriaProduto = figure.dataset.categoria;
            const precoProduto = parseFloat(span.textContent.replace('R$:', '').replace(',', '.').trim());

            const correspondeNome = nomeProduto.includes(termoBusca);
            const correspondeCategoria = (categoriaAtual === 'todos' || categoriaProduto === categoriaAtual);
            const correspondePreco = (precoProduto <= precoMaxAtual);

            figure.style.display = (correspondeNome && correspondeCategoria && correspondePreco) ? 'block' : 'none';
        });
    }

    if (inputBuscaNome) {
        inputBuscaNome.addEventListener('input', aplicarFiltros);
    }

    linksCategoria.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            linksCategoria.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
            categoriaAtual = e.target.dataset.categoria;
            aplicarFiltros();
        });
    });

    if (inputFiltroPreco && valorPrecoSpan) {
        inputFiltroPreco.addEventListener('input', (e) => {
            precoMaxAtual = parseFloat(e.target.value);
            valorPrecoSpan.textContent = precoMaxAtual;
            aplicarFiltros();
        });
        valorPrecoSpan.textContent = precoMaxAtual;
    }

    aplicarFiltros();
    const linkTodos = document.querySelector('.sidebarProdutos ul li a[data-categoria="todos"]');
    if (linkTodos) {
        linkTodos.classList.add('active');
    }
});
