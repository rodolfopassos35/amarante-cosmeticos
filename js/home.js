document.querySelectorAll('.btn-add-carrinho').forEach(botao => {
    botao.addEventListener('click', (e) => {
        e.stopPropagation(); // Impede que o clique no botão ative outros eventos (como filtro de categoria)

        const produto = {
            id: botao.dataset.id,
            nome: botao.dataset.nome,
            preco: parseFloat(botao.dataset.preco),
            imagem: botao.dataset.img,
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