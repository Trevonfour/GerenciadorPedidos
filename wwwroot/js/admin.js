$(document).ready(function () {

});

function carregarTodosPedidos() {
    $.ajax({
        url: "/Admin/RetornarTodosPedidos",
        method: "GET",
        success: function (pedidos) {
            montarTabelaPedidos(pedidos);
        }
    });
}
function montarTabelaPedidos(pedidos) {
            var indice = 0;
            var divTabelaPedidos = document.getElementById("divTabelaPedidos");
            var tabela = '<table class="table table-sm table-hover table-striped tabela">';
            tabela += '<thead>';
            tabela += '<tr>';
            tabela += '<th>Numero do Pedido</th>';
            tabela += '<th>Usuario</th>';
            tabela += '<th>Valor Total</th>';
            tabela += '<th>Data da Criação</th>';
            tabela += '<th>Ações</th>';
            tabela += '</tr>';
            tabela += '</thead>';
            tabela += '<tbody>';

            for (indice = 0; indice < pedidos.length; indice++) {
                var dataCriacao = new Date(pedidos[indice].DH_CRIACAO);
                var dataFormatada = dataCriacao.toLocaleDateString('pt-BR');

                var valorTotal = pedidos[indice].VALOR_TOTAL;
                var valorFormato = parseFloat(valorTotal).toFixed(2);

                tabela += `<tr id="${pedidos[indice].NUMERO_PEDIDO}">`;
                tabela += `<td>${pedidos[indice].NUMERO_PEDIDO}</td>`;
                tabela += `<td>${pedidos[indice].NOME}</td>`;
                tabela += `<td> R$ ${valorFormato}</td>`;
                tabela += `<td>${dataFormatada}</td>`;
                tabela += `<td><button class="btn btn-sm btn-outline-info" onclick="detalhesPedido(${pedidos[indice].NUMERO_PEDIDO})">Detalhes</button>`;
                tabela += '</tr>';
            }

            tabela += '</tbody>';
            tabela += '</table>';

            divTabelaPedidos.innerHTML = tabela;
}

function detalhesPedido(numeroPedido){
    $.ajax({
        url: "/Home/RetornarDetalhesPedido",
        method: 'POST',
        data: {
            numeroPedido: numeroPedido
        },
        success: function (pedido) {
            mostrarModalDetalhesPedido(pedido);
        }
    });
}
function mostrarModalDetalhesPedido(pedido) {
    const modalTitle = `Detalhes do Pedido #${pedido[0].NUMERO_PEDIDO}`;
    const nomeUsuario = `Nome do Usuário: ${pedido[0].NOME}`;
    const valorTotal = `Valor Total: R$ ${pedido[0].VALOR_TOTAL.toFixed(2)}`;
    const dataCriacao = `Data e Hora da Criação: ${new Date(pedido[0].DH_CRIACAO).toLocaleString('pt-BR')}`;

    let produtosHTML = '';
    pedido.forEach(produto => {
        produtosHTML += `<tr>
                            <td>${produto.PRODUTO}</td>
                            <td>R$ ${produto.PRECO.toFixed(2)}</td>
                         </tr>`;
    });

    const modalContent = `
        <div class="modal fade" id="modalDetalhesPedido" tabindex="-1" aria-labelledby="modalDetalhesPedidoLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${modalTitle}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>${nomeUsuario}</p>
                        <p>${valorTotal}</p>
                        <p>${dataCriacao}</p>
                        <hr>
                        <h6>Produtos:</h6>
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th>Preço</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${produtosHTML}
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>`;

    $("body").append(modalContent);
    const modalElement = document.getElementById("modalDetalhesPedido");
    const modal = new bootstrap.Modal(modalElement);
    
    modalElement.addEventListener("hidden.bs.modal", function () {
        modalElement.remove();
    });

    modal.show();
}


// GERENCIAR PRODUTOS

function obterTodosProdutos() {
    $.ajax({
        url: "/Home/RetornarTodosProdutos",
        method: "GET",
        success: function (produtos) {
            montarTabelaProdutos(produtos);
        }
    });
}
function montarTabelaProdutos(produtos){
            var indice = 0;
            var divTabelaProdutos = document.getElementById("divTabelaProdutos");
            var tabela = '<table class="table table-sm table-hover table-striped tabela">';
            tabela += '<thead>';
            tabela += '<tr>';
            tabela += '<th>Nome</th>';
            tabela += '<th>Descrição</th>';
            tabela += '<th>Preço</th>';
            tabela += '</tr>';
            tabela += '</thead>';
            tabela += '<tbody>';

            for (indice = 0; indice < produtos.length; indice++) {
                tabela += `<tr id="${produtos[indice].CD_PRODUTO}">`;
                tabela += `<td>${produtos[indice].NOME}</td>`;
                tabela += `<td>${produtos[indice].DESCRICAO}</td>`;
                tabela += `<td>R$ ${produtos[indice].PRECO.toFixed(2)}</td>`;
                tabela += `<td><button class="btn btn-sm btn-outline-info" onclick="obterProdutoPorId(${produtos[indice].CD_PRODUTO})">Atualizar</button> |
                               <button class="btn btn-sm btn-outline-danger" onclick="excluirProduto(${produtos[indice].CD_PRODUTO})">Excluir</button></td>`;
                tabela += '</tr>';
            }

            tabela += '</tbody>';
            tabela += '</table>';

            divTabelaProdutos.innerHTML = tabela;
}

$("#novoProduto").click(function () {
            escolherTituloModal("Cadastrar de novo Produto");
            limparFormulario();
            mostrarModalProduto();
            $('.produtoId').val(0);
        });

$('.btnSalvar').click(function () {
    var produto = {
        produtoId: $('.produtoId').val(),
        nome: $('.nome').val().trim(),
        descricao: $('.descricao').val().trim(),
        preco: $('.preco').val().trim()
    };

    let isValid = true;

    if (produto.nome === '' || produto.nome.length > 50) {
        $('.nome').addClass('is-invalid');
        $('.erroNome').text('O nome é obrigatório e deve ter no máximo 50 caracteres.').removeClass('d-none');
        isValid = false;
    } else {
        $('.nome').removeClass('is-invalid').addClass('is-valid');
        $('.erroNome').addClass('d-none');
    }

    if (produto.descricao === '' || produto.descricao.length > 150) {
        $('.descricao').addClass('is-invalid');
        $('.erroDescricao').text('A descrição é obrigatória e deve ter no máximo 150 caracteres.').removeClass('d-none');
        isValid = false;
    } else {
        $('.descricao').removeClass('is-invalid').addClass('is-valid');
        $('.erroDescricao').addClass('d-none');
    }

    if (produto.preco === '' || isNaN(parseFloat(produto.preco.replace(/[R$\s.]/g, '').replace(',', '.'))) || parseFloat(produto.preco.replace(/[R$\s.]/g, '').replace(',', '.')) <= 0) {
        $('.preco').addClass('is-invalid');
        $('.erroPreco').text('O preço é obrigatório, deve ser numérico e maior que zero.').removeClass('d-none');
        isValid = false;
    } else {
        $('.preco').removeClass('is-invalid').addClass('is-valid');
        $('.erroPreco').addClass('d-none');
    }

    if (isValid) {
        if (parseInt(produto.produtoId) > 0) {
            atualizarProduto(produto);
        } else {
            criarProduto(produto);
        }
    }
});

function atualizarProduto(produto) {
    $.ajax({
        url: "/Admin/AtualizarProduto",
        method: 'POST',
        data: {
            produto: produto
        },
        success: function () {
            $("#modalProduto").modal('hide');
            alert("Produto Atualizado com sucesso")
            obterTodosProdutos();
            limparFormulario();
        }
    });
}

function criarProduto(produto) {
    $.ajax({
        url: "/Admin/AdicionarProduto",
        method: 'POST',
        data: {
            produto: produto
        },
        success: function () {
            $("#modalProduto").modal('hide');
            obterTodosProdutos();
            limparFormulario();
        }
    });
}
function obterProdutoPorId(produtoId) {
    $.ajax({
        url: "/Admin/RetornarProdutoId",
        method: 'POST',
        data: {
            produtoId: produtoId
        },
        success: function (produto) {
            mostrarModalProduto();
            escolherTituloModal(`Atualizar Produto ${produto[0].NOME}`);
            $(".produtoId").val(produto[0].CD_PRODUTO);
            $(".nome").val(produto[0].NOME);
            $(".descricao").val(produto[0].DESCRICAO);
            $(".preco").val(produto[0].PRECO);
        }
    });
}

function excluirProduto(produtoId) {
    $.ajax({
        url: "/Admin/ValidarProdutoEmPedido",
        method: 'POST',
        data: {
            produtoId: produtoId
        },
        success: function (existe) {
            if(existe)
                alert("Não foi possível excluir o produto, por estar  vinculado a pedidos");
            else{
                $.ajax({
                url: "/Admin/ExcluirProdutoId",
                method: 'POST',
                data: {
                    produtoId: produtoId
                },
                success: function () {
                        alert("Produto foi excluída com sucesso");
                        obterTodosProdutos();
                },
                error: function () {
                    alert("Não foi possível excluir o produto");
                }
            });
            obterTodosProdutos();
            }
            
        }
    });
}

function mostrarModalExcluir() {
            new bootstrap.Modal($("#modalExcluir"), {}).show();
}
function escolherTituloModal(texto) {
            $(".modal-title").text(texto);
}
function mostrarModalProduto() {
            new bootstrap.Modal($("#modalProduto"), {}).show();
}
function limparFormulario() {
    $(".nome").val('');
    $(".nome").removeClass('is-valid');
    $(".descricao").val('');
    $(".descricao").removeClass('is-valid');
    $(".preco").val('');
    $(".preco").removeClass('is-valid');
}
