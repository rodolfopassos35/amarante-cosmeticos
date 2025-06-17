/* document.addEventListener("DOMContentLoaded", () => {
    // Seleciona APENAS os links de categoria DENTRO da sidebar
    const linksCategoria = document.querySelectorAll('.sidebarProdutos [data-categoria]');
    const produtos = document.querySelectorAll('.agrupaProdutosDestaque figure');      
    const inputPreco = document.getElementById("filtroPreco");
    const spanPreco = document.getElementById("valorPreco");
    const inputBusca = document.getElementById("buscaNome");

    let categoriaSelecionada = "todos"; // Variável para controlar a categoria ativa

    // --- Lógica de Filtros ---

    // Atualiza texto do preço e refiltra
    inputPreco.addEventListener("input", () => {
        spanPreco.textContent = inputPreco.value;
        aplicarFiltros();
    });

    // Atualiza filtro de nome
    inputBusca.addEventListener("input", () => {
        aplicarFiltros();
    });

    // Filtragem por categoria (apenas os links da sidebar)
    linksCategoria.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o comportamento padrão do link
            
            // Remove a classe 'active' de todos os links e adiciona ao clicado (opcional, para estilização)
            linksCategoria.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            categoriaSelecionada = link.dataset.categoria; // Atualiza a categoria selecionada
            aplicarFiltros(); // Aplica os filtros
        });
    });

    // Função principal para aplicar todos os filtros
    function aplicarFiltros() {
        const precoMax = parseFloat(inputPreco.value);
        const termoBusca = inputBusca.value.toLowerCase();

        produtos.forEach(produto => {
            const categoria = produto.dataset.categoria;
            const preco = parseFloat(produto.dataset.preco); 
            const nome = produto.querySelector("h3").textContent.toLowerCase();

            const categoriaOk = categoriaSelecionada === "todos" || categoria === categoriaSelecionada;
            const precoOk = preco <= precoMax;
            const buscaOk = nome.includes(termoBusca);

            if (categoriaOk && precoOk && buscaOk) {
                produto.style.display = "block"; // Mostra o produto
            } else {
                produto.style.display = "none"; // Esconde o produto
            }
        });
    }

    // --- Comportamento inicial ---
    // Garante que todos os produtos estejam visíveis e os filtros aplicados ao carregar a página
    // Isso também inicializa o display dos produtos conforme a categoria "todos" ou a selecionada
    aplicarFiltros(); 
    // Atualiza o valor inicial do spanPreco
    spanPreco.textContent = inputPreco.value;

    // --- Lógica para o botão de adicionar item ao carrinho (AGORA DENTRO DO DOMContentLoaded PRINCIPAL) ---
    document.querySelectorAll('.btn-add-carrinho').forEach(botao => {
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
}); // <--- O fechamento do DOMContentLoaded PRINCIPAL está aqui

 */

// js/produtos.js

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

    // --- Sua lógica de filtro de produtos (assumindo que está aqui) ---
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
            const nomeProduto = figure.querySelector('figcaption h3').textContent.toLowerCase();
            const categoriaProduto = figure.dataset.categoria;
            const precoProduto = parseFloat(figure.querySelector('figcaption span').textContent.replace('R$:', '').replace(',', '.').trim());

            const correspondeNome = nomeProduto.includes(termoBusca);
            const correspondeCategoria = (categoriaAtual === 'todos' || categoriaProduto === categoriaAtual);
            const correspondePreco = (precoProduto <= precoMaxAtual);

            if (correspondeNome && correspondeCategoria && correspondePreco) {
                figure.style.display = 'block';
            } else {
                figure.style.display = 'none';
            }
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

    document.querySelectorAll('.btn-add-carrinho').forEach(botao => {
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
}); // <--- O fechamento do DOMContentLoaded PRINCIPAL está aqui
 // Fim do DOMContentLoaded