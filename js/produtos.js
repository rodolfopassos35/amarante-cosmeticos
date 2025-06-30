// js/produtos.js

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
/* // js/produtos.js

document.addEventListener('DOMContentLoaded', () => {
    // Lógica para os botões 'Adicionar ao Carrinho'
    const botoesAdicionar = document.querySelectorAll('.btn-add-carrinho');

    botoesAdicionar.forEach(botao => {
        botao.addEventListener('click', (event) => {
            const produto = {
                id: event.target.dataset.id,
                nome: event.target.dataset.nome,
                preco: parseFloat(event.target.dataset.preco),
                imagem: event.target.dataset.imagem, // <--- AQUI!
                quantidade: 1
            };

            // ADICIONE ESTE CONSOLE.LOG
            console.log('Produto a ser adicionado do produtos.js:', produto);

            if (window.adicionarProdutoAoCarrinho) {
                window.adicionarProdutoAoCarrinho(produto);
            } else {
                console.error("Erro: A função 'adicionarProdutoAoCarrinho' não está disponível. Verifique o carregamento de carrinho.js.");
            }
        });
    });

    // ---  lógica de filtro de produtos (assumindo que está aqui) ---
    // Seletores de elementos de filtro
    const inputBuscaNome = document.getElementById('buscaNome');
    const linksCategoria = document.querySelectorAll('.sidebarProdutos ul li a');
    const inputFiltroPreco = document.getElementById('filtroPreco');
    const valorPrecoSpan = document.getElementById('valorPreco');

    let categoriaAtual = 'todos';
    let precoMaxAtual = parseFloat(inputFiltroPreco ? inputFiltroPreco.value : 1000); // Garante valor inicial

    // Função de filtro
    function aplicarFiltros() {
        const termoBusca = inputBuscaNome ? inputBuscaNome.value.toLowerCase() : '';
        const produtosFigure = document.querySelectorAll('.agrupaProdutosDestaque figure');

        produtosFigure.forEach(figure => {
            const h3 = figure.querySelector('figcaption h3');
            const span = figure.querySelector('figcaption span');

            if (!h3 || !span) {
                console.warn('Elemento incompleto encontrado:', figure);
                return; // pula esse item
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

    // Event Listeners
    if (inputBuscaNome) {
        inputBuscaNome.addEventListener('input', aplicarFiltros);
    }

    linksCategoria.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o comportamento padrão do link
            linksCategoria.forEach(l => l.classList.remove('active')); // Remove a classe 'active' de todos
            e.target.classList.add('active'); // Adiciona 'active' ao clicado
            categoriaAtual = e.target.dataset.categoria;
            aplicarFiltros();
        });
    });

    if (inputFiltroPreco && valorPrecoSpan) {
        inputFiltroPreco.addEventListener('input', (e) => {
            precoMaxAtual = parseFloat(e.target.value);
            valorPrecoSpan.textContent = precoMaxAtual; // O texto já está "Até R$ " no HTML, só muda o número
            aplicarFiltros();
        });
        // Inicializa o valor do span com o valor atual do slider
        valorPrecoSpan.textContent = precoMaxAtual;
    }

    // Aplica os filtros ao carregar a página
    aplicarFiltros();
    // Ativa o link "Todos" por padrão (visual)
    const linkTodos = document.querySelector('.sidebarProdutos ul li a[data-categoria="todos"]');
    if (linkTodos) {
        linkTodos.classList.add('active');
    }

    // Para o placeholder do header/footer:
    async function incluirComponente(seletor, arquivo) {
        try {
            const resp = await fetch(arquivo);
            if (!resp.ok) {
                throw new Error(`HTTP error! status: ${resp.status}`);
            }
            const html = await resp.text();
            document.querySelector(seletor).innerHTML = html;
        } catch (error) {
            console.error(`Erro ao carregar o componente ${arquivo}:`, error);
        }
    }

    // Carrega o header e footer (se index.js não estiver fazendo isso)
    // Se o index.js já faz isso e é carregado antes, estas linhas podem ser removidas
    incluirComponente('#header-placeholder', 'components/header.html');
    incluirComponente('#footer-placeholder', 'components/footer.html');

    /* document.querySelectorAll('.btn-add-carrinho').forEach(botao => {
        botao.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede que o clique no botão ative outros eventos (como filtro de categoria)

            const produto = {
                id: botao.dataset.id,
                nome: botao.dataset.nome,
                preco: parseFloat(botao.dataset.preco),
                img: botao.dataset.img,
                quantidade: 1
            };

            let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

            // Verifica se o produto já está no carrinho
            const index = carrinho.findIndex(item => item.id === produto.id);

            if (index !== -1) {
                carrinho[index].quantidade += 1; // Se já existir, aumenta a quantidade
            } else {
                carrinho.push(produto); // Se não, adiciona novo produto
            }

            localStorage.setItem('carrinho', JSON.stringify(carrinho));

            mostrarMensagemProdutoAdicionado(produto.nome); // Exibe a mensagem
        });
    }); 

    // --- Mova a função mostrarMensagemProdutoAdicionado para cá também ---
    function mostrarMensagemProdutoAdicionado(nomeProduto) {
        const mensagem = document.createElement('div');
        mensagem.classList.add('mensagem-sucesso');
        mensagem.textContent = `${nomeProduto} foi adicionado ao carrinho!`;

        document.body.appendChild(mensagem);

        // Remove a mensagem após 3 segundos
        setTimeout(() => {
            mensagem.remove();
        }, 3000);
    }
    mostrarMensagemProdutoAdicionado()
}); // <--- O fechamento do DOMContentLoaded PRINCIPAL está aqui
// Fim do DOMContentLoaded */