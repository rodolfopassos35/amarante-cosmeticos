/* // carrinho.js

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

function mostrarMensagemProdutoAdicionado(nomeProduto) {
  const mensagem = document.createElement('div');
  mensagem.classList.add('mensagem-sucesso'); // Certifique-se de ter CSS para esta classe!
  mensagem.textContent = `${nomeProduto} foi adicionado ao carrinho!`;

  document.body.appendChild(mensagem);

  // Remove a mensagem após 3 segundos
  setTimeout(() => {
    mensagem.remove();
  }, 3000);
}

// Função principal para adicionar um produto ao carrinho
// Tornamos ela global para que possa ser chamada de outros arquivos (como produtos.js)
window.adicionarProdutoAoCarrinho = function (produto) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

  // Verifica se o produto já está no carrinho
  const index = carrinho.findIndex(item => item.id === produto.id);

  if (index !== -1) {
    carrinho[index].quantidade += 1; // Se já existir, aumenta a quantidade
  } else {
    carrinho.push(produto); // Se não, adiciona novo produto
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho));

  // Chama a função para exibir a mensagem de sucesso
  mostrarMensagemProdutoAdicionado(produto.nome);
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
}); */

// js/carrinho.js

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

// --- Função para exibir a mensagem de produto adicionado ---
function mostrarMensagemProdutoAdicionado(nomeProduto) {
  const mensagem = document.createElement('div');
  mensagem.classList.add('mensagem-sucesso');
  mensagem.textContent = `${nomeProduto} foi adicionado ao carrinho!`;

  document.body.appendChild(mensagem);

  setTimeout(() => {
    mensagem.remove();
  }, 3000);
}

// --- Função principal para adicionar um produto ao carrinho (GLOBAL) ---
window.adicionarProdutoAoCarrinho = function (produto) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

  const index = carrinho.findIndex(item => item.id === produto.id);

  if (index !== -1) {
    carrinho[index].quantidade += 1;
  } else {
    // Garante que o produto tenha a propriedade 'img' ao ser adicionado
    produto.quantidade = 1; // Garante que a quantidade inicial é 1
    carrinho.push(produto);
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  mostrarMensagemProdutoAdicionado(produto.nome);
  // Se estiver na página do carrinho, atualiza a exibição
  if (document.getElementById('itensCarrinho')) {
    exibirCarrinho();
  }
  // Opcional: Se você tiver um ícone de carrinho no header, chame uma função para atualizar o contador
  // if (window.atualizarContadorCarrinho) {
  //   window.atualizarContadorCarrinho();
  // }
};

// --- Funções de Manipulação de Quantidade e Remoção ---
function alterarQuantidade(index, delta) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  if (!carrinho[index]) return;

  carrinho[index].quantidade += delta;
  if (carrinho[index].quantidade <= 0) {
    carrinho.splice(index, 1);
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  exibirCarrinho();
}

function removerItem(index) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  if (!carrinho[index]) return;
  carrinho.splice(index, 1);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  exibirCarrinho();
}

// --- FUNÇÃO exibirCarrinho() ---
function exibirCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const itensCarrinhoDiv = document.getElementById('itensCarrinho');
  const botaoLimpar = document.getElementById('limpar-carrinho');
  const botaoFinalizar = document.getElementById('finalizar-compra');
  const valorTotalCarrinhoElement = document.getElementById('valor-total-carrinho');
  const valorFreteElement = document.getElementById('valor-frete'); // Pega o elemento do frete

  if (!itensCarrinhoDiv || !valorTotalCarrinhoElement) {
    console.error("Elementos do carrinho não encontrados. Verifique o HTML.");
    return; // Sai da função se os elementos essenciais não existirem
  }

  itensCarrinhoDiv.innerHTML = ''; // Limpa o conteúdo atual

  if (carrinho.length === 0) {
    itensCarrinhoDiv.innerHTML = '<p>Você ainda não adicionou produtos ao carrinho.</p>';
    if (botaoLimpar) {
      botaoLimpar.style.display = 'none';
    }
    if (botaoFinalizar) {
      botaoFinalizar.style.display = 'none';
    }
    valorFreteAtual = 0;
    if (valorFreteElement) {
      valorFreteElement.textContent = '';
    }
    valorTotalCarrinhoElement.textContent = 'R$ 0,00';
    return;
  }

  if (botaoLimpar) {
    botaoLimpar.style.display = 'inline-block';
  }
  if (botaoFinalizar) {
    botaoFinalizar.style.display = 'inline-block';
  }

  let subtotalProdutos = 0;
  carrinho.forEach((item, index) => {
    const subtotalItem = item.preco * item.quantidade;
    subtotalProdutos += subtotalItem;

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item-carrinho');

    // ATENÇÃO AQUI: Usando item.img, que é o que vem do data-img
    itemDiv.innerHTML = `
      <img src="${item.img || 'https://via.placeholder.com/80'}" alt="${item.nome}" class="item-carrinho-imagem">
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
    itensCarrinhoDiv.appendChild(itemDiv);
  });

  const totalFinal = subtotalProdutos + valorFreteAtual;
  valorTotalCarrinhoElement.textContent = `R$ ${totalFinal.toFixed(2).replace('.', ',')}`;

  ativarBotoes();
}

// --- Funções de Ativação de Botões ---
function ativarBotoes() {
  document.querySelectorAll('.btn-quantidade').forEach(btn => {
    btn.onclick = null; // Remove listeners antigos para evitar duplicação
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      const action = e.target.dataset.action;
      alterarQuantidade(index, action === 'incrementar' ? 1 : -1);
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

// --- NOVA FUNÇÃO PARA GERAR PEDIDO VIA WHATSAPP (GLOBAL) ---
window.gerarPedidoWhatsApp = function () {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const numeroTelefone = '5519994461397'; // <-- COLOQUE SEU NÚMERO DE TELEFONE AQUI (com DDD e sem espaços/hífens)

  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.');
    return;
  }

  const inputCepEntrega = document.getElementById('cep-entrega');
  const valorFreteElement = document.getElementById('valor-frete');
  let subtotalProdutosCalculado = 0;
  carrinho.forEach(item => {
    subtotalProdutosCalculado += item.preco * item.quantidade;
  });

  // Validação do CEP e Frete antes de enviar para o WhatsApp
  if (inputCepEntrega && inputCepEntrega.value.length < 9) {
    alert('Por favor, informe e calcule o frete para seu CEP antes de finalizar a compra.');
    inputCepEntrega.focus();
    return;
  }
  if (inputCepEntrega && inputCepEntrega.value.length === 9 && valorFreteAtual === 0) {
    // Se o CEP foi digitado mas o frete ainda é 0 (não calculado ou erro)
    alert('Por favor, calcule o frete para seu CEP antes de finalizar a compra.');
    return;
  }

  const totalComFrete = subtotalProdutosCalculado + valorFreteAtual;

  let mensagem = 'Olá! Gostaria de fazer o seguinte pedido da Amarante Cosméticos:\n\n';
  mensagem += '--- ITENS DO PEDIDO ---\n';
  carrinho.forEach((item, index) => {
    const subtotal = item.preco * item.quantidade;
    mensagem += `${index + 1}. ${item.nome} (Qtd: ${item.quantidade}) - R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
  });

  mensagem += `\nSubtotal dos Produtos: R$ ${subtotalProdutosCalculado.toFixed(2).replace('.', ',')}`;
  if (valorFreteAtual > 0) {
    mensagem += `\nValor do Frete: R$ ${valorFreteAtual.toFixed(2).replace('.', ',')}`;
    // Adiciona a informação do CEP e prazo, se disponível
    const cepInformado = inputCepEntrega ? inputCepEntrega.value : 'Não informado';
    const resultadoFrete = calcularFrete(cepInformado);
    if (resultadoFrete.prazo) {
      mensagem += ` (CEP: ${cepInformado}, Prazo: ${resultadoFrete.prazo})`;
    }
  } else {
    mensagem += '\nFrete: A combinar (CEP não informado ou fora da área de entrega)';
  }

  mensagem += `\n\nTOTAL GERAL DO PEDIDO: R$ ${totalComFrete.toFixed(2).replace('.', ',')}`;
  mensagem += '\n\nPor favor, me informe sobre as opções de pagamento e entrega.';

  const mensagemCodificada = encodeURIComponent(mensagem);
  const linkWhatsApp = `https://wa.me/${numeroTelefone}?text=${mensagemCodificada}`;

  window.open(linkWhatsApp, '_blank');

  // Opcional: Limpar o carrinho após gerar o pedido
  if (confirm('Seu pedido foi enviado para o WhatsApp! Deseja limpar o carrinho agora?')) {
    localStorage.removeItem('carrinho');
    exibirCarrinho(); // Atualiza a exibição para mostrar que está vazio
    alert('Carrinho limpo! Aguarde nosso contato pelo WhatsApp.');
  }
};


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

  // --- Lógica do botão Finalizar Compra (agora chamando a função WhatsApp) ---
  const botaoFinalizarCompra = document.getElementById('finalizar-compra');
  if (botaoFinalizarCompra) {
    botaoFinalizarCompra.addEventListener('click', () => {
      window.gerarPedidoWhatsApp(); // Chama a função que gera o pedido no WhatsApp
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