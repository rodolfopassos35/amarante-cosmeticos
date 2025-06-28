// carrinho.js

// Variáveis e funções de frete que você já tem
const tabelaFrete = {
  '00000-000': { preco: 0.00, prazo: '3 dias úteis', regiao: 'Sumaré' },
  '13170-000': { preco: 10.00, prazo: '2 dias úteis', regiao: 'Campinas' },
  '01000-000': { preco: 25.00, prazo: '5 dias úteis', regiao: 'São Paulo Capital' },
  '20000-000': { preco: 35.00, prazo: '7 dias úteis', regiao: 'Rio de Janeiro Capital' },
  '13179003': { preco: 7.00, prazo: '2 dias úteis', regiao: 'sumaré, nova veneza' }
};

function formatarCEP(cep) {
  cep = cep.replace(/\D/g, '');
  if (cep.length > 5) {
    cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
  }
  return cep;
}

function calcularFrete(cepDestino) {
  const cepLimpo = cepDestino.replace(/\D/g, '');

  for (const key in tabelaFrete) {
    if (cepLimpo.startsWith(key.replace(/\D/g, '').substring(0, 5))) {
      return tabelaFrete[key];
    }
  }
  return { preco: null, prazo: null, erro: 'CEP não encontrado ou fora da área de entrega.' };
}

let valorFreteAtual = 0; // Variável para armazenar o valor do frete calculado

// --- NOVA FUNÇÃO PARA ADICIONAR PRODUTOS ---
// Torna esta função global para ser acessível de outros scripts
window.adicionarProdutoAoCarrinho = function (novoProduto) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const produtoExistenteIndex = carrinho.findIndex(item => item.id === novoProduto.id);

  if (produtoExistenteIndex !== -1) {
    // Se o produto já existe, incrementa a quantidade
    carrinho[produtoExistenteIndex].quantidade += novoProduto.quantidade || 1; // Adiciona quantidade do novo ou 1
  } else {
    // Se o produto não existe, adiciona ele ao carrinho
    novoProduto.quantidade = novoProduto.quantidade || 1; // Garante que tem quantidade
    carrinho.push(novoProduto);
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  exibirCarrinho(); // Atualiza a exibição do carrinho imediatamente
  // Você pode adicionar um alerta aqui, se desejar
  // alert(`${novoProduto.nome} adicionado ao carrinho!`);
};

// --- Funções de Manipulação do Carrinho (Já existentes, com pequenas melhorias) ---
function alterarQuantidade(index, delta) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  if (!carrinho[index]) return;

  carrinho[index].quantidade += delta;
  if (carrinho[index].quantidade <= 0) {
    carrinho.splice(index, 1); // Remove se a quantidade for zero ou menos
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  exibirCarrinho(); // Atualiza a exibição
}

function removerItem(index) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  if (!carrinho[index]) return; // Adiciona verificação para evitar erro
  carrinho.splice(index, 1);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  exibirCarrinho(); // Atualiza a exibição
}

// --- FUNÇÃO exibirCarrinho() ---
function exibirCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const itensCarrinhoDiv = document.getElementById('itensCarrinho'); // Agora pega a div correta
  const botaoLimpar = document.getElementById('limpar-carrinho');
  const botaoFinalizar = document.getElementById('finalizar-compra');
  const valorTotalCarrinhoElement = document.getElementById('valor-total-carrinho'); // Elemento para o total no resumo

  // Limpa o conteúdo atual da div de itens
  if (itensCarrinhoDiv) {
    itensCarrinhoDiv.innerHTML = '';
  }

  if (carrinho.length === 0) {
    if (itensCarrinhoDiv) {
      itensCarrinhoDiv.innerHTML = '<p>Você ainda não adicionou produtos ao carrinho.</p>';
    }
    if (botaoLimpar) {
      botaoLimpar.style.display = 'none';
    }
    if (botaoFinalizar) {
      botaoFinalizar.style.display = 'none';
    }
    valorFreteAtual = 0;
    if (document.getElementById('valor-frete')) {
      document.getElementById('valor-frete').textContent = '';
    }
    if (valorTotalCarrinhoElement) {
      valorTotalCarrinhoElement.textContent = 'R$ 0,00'; // Reseta o total exibido
    }
    return;
  }

  // Se o carrinho tem itens, mostra os botões
  if (botaoLimpar) {
    botaoLimpar.style.display = 'inline-block'; // Use 'inline-block' para manter o estilo de botão ao lado
  }
  if (botaoFinalizar) {
    botaoFinalizar.style.display = 'inline-block';
  }

  let subtotalProdutos = 0;
  carrinho.forEach((item, index) => {
    console.log('Caminho da imagem do item:', item.imagem);
    const subtotalItem = item.preco * item.quantidade;
    subtotalProdutos += subtotalItem;

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item-carrinho'); // Mantém a classe para estilização

    // Adicione a imagem e ajuste o layout para o CSS que sugeri anteriormente
    itemDiv.innerHTML = `
      <img src="${item.imagem || 'caminho/para/imagem_padrao.jpg'}" alt="${item.nome}" class="item-carrinho-imagem">
      <div class="detalhes-item">
          <h4>${item.nome}</h4>
          <p>R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
          <div class="quantidade-controle">
              <button class="btn-quantidade" data-index="${index}" data-action="decrementar">–</button>
              <span class="quantidade">${item.quantidade}</span>
              <button class="btn-quantidade" data-index="${index}" data-action="incrementar">+</button>
          </div>
      </div>
      <p class="preco-item">R$ ${subtotalItem.toFixed(2).replace('.', ',')}</p>
      <button class="btn-remover-item" data-index="${index}">Remover</button>
    `;
    if (itensCarrinhoDiv) { // Verifica se o elemento existe antes de adicionar
      itensCarrinhoDiv.appendChild(itemDiv);
    }
  });

  // Atualiza o total da compra no resumo (aside)
  const totalFinal = subtotalProdutos + valorFreteAtual;
  if (valorTotalCarrinhoElement) {
    valorTotalCarrinhoElement.textContent = `R$ ${totalFinal.toFixed(2).replace('.', ',')}`;
  }

  // Recria os listeners dos botões de controle de quantidade e remover
  ativarBotoes();
}

// --- Funções de Ativação de Botões (adaptadas para o novo HTML) ---
function ativarBotoes() {
  document.querySelectorAll('.btn-quantidade').forEach(btn => {
    btn.onclick = null; // Remove listeners antigos para evitar duplicação
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      const action = e.target.dataset.action;
      if (action === 'incrementar') {
        alterarQuantidade(index, 1);
      } else if (action === 'decrementar') {
        alterarQuantidade(index, -1);
      }
    });
  });

  document.querySelectorAll('.btn-remover-item').forEach(btn => {
    btn.onclick = null; // Remove listeners antigos
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      removerItem(index);
    });
  });
}


// --- Event Listeners DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
  // --- Lógica para o cálculo de frete ---
  const inputCepEntrega = document.getElementById('cep-entrega');
  const btnCalcularFrete = document.getElementById('btn-calcular-frete');
  const valorFreteElement = document.getElementById('valor-frete');

  if (inputCepEntrega) {
    inputCepEntrega.addEventListener('input', (e) => {
      e.target.value = formatarCEP(e.target.value);
    });
  }

  if (btnCalcularFrete) {
    btnCalcularFrete.addEventListener('click', () => {
      const cep = inputCepEntrega.value;
      if (cep.length === 9) {
        const resultadoFrete = calcularFrete(cep);

        if (resultadoFrete.preco !== null) {
          valorFreteAtual = resultadoFrete.preco;
          valorFreteElement.innerHTML = `Frete: R$ ${resultadoFrete.preco.toFixed(2).replace('.', ',')} (${resultadoFrete.prazo})`;
          exibirCarrinho(); // Atualiza a exibição com o frete
        } else {
          valorFreteAtual = 0;
          valorFreteElement.innerHTML = `<span style="color: red;">${resultadoFrete.erro}</span>`;
          exibirCarrinho(); // Atualiza a exibição sem frete
        }
      } else {
        alert('Por favor, digite um CEP válido com 8 dígitos.');
        valorFreteAtual = 0;
        if (valorFreteElement) valorFreteElement.textContent = '';
        exibirCarrinho(); // Atualiza a exibição
      }
    });
  }

  // --- Lógica do botão Finalizar Compra ---
  const botaoFinalizarCompra = document.getElementById('finalizar-compra');
  if (botaoFinalizarCompra) {
    botaoFinalizarCompra.addEventListener('click', () => {
      const carrinhoAtual = JSON.parse(localStorage.getItem('carrinho')) || [];

      if (carrinhoAtual.length === 0) {
        alert('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra!');
        return;
      }

      let subtotalProdutosCalculado = 0;
      carrinhoAtual.forEach(item => {
        subtotalProdutosCalculado += item.preco * item.quantidade;
      });

      // Verifica se o frete foi calculado antes de finalizar, se o campo de CEP não estiver vazio
      if (inputCepEntrega.value.length === 9 && valorFreteAtual === 0) {
        alert('Por favor, aguarde o cálculo do frete ou verifique seu CEP.');
        return;
      }
      if (inputCepEntrega.value.length < 9 && subtotalProdutosCalculado > 0) {
        alert('Por favor, informe e calcule o frete para seu CEP antes de finalizar a compra.');
        inputCepEntrega.focus();
        return;
      }

      const totalComFrete = subtotalProdutosCalculado + valorFreteAtual;

      alert(`Parabéns! Sua compra no valor total de R$ ${totalComFrete.toFixed(2).replace('.', ',')} foi finalizada com sucesso! Agradecemos a preferência.`);

      localStorage.removeItem('carrinho');
      exibirCarrinho();
    });
  }

  // --- Lógica do botão Limpar Carrinho ---
  const botaoLimparCarrinho = document.getElementById('limpar-carrinho');
  if (botaoLimparCarrinho) {
    botaoLimparCarrinho.addEventListener('click', () => {
      if (confirm('Tem certeza que deseja limpar o carrinho?')) {
        localStorage.removeItem('carrinho');
        exibirCarrinho();
      }
    });
  }

  // Garante que o carrinho seja exibido ao carregar a página
  exibirCarrinho();
});