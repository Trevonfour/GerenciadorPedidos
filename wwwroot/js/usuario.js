$(document).ready(function () {
});
var produtosGlobal = [];
var carrinho = [];
var valorTotalGlobal;

function obterProdutos() {
    $.ajax({
        url: "/Home/RetornarTodosProdutos",
        method: "POST",
        success: function (produtos) {
            montarTabelaProdutos(produtos);
        }
    });
}  
function carregarPedidosUsuario(usuarioId) {
    $.ajax({
        url: "/User/RetornarTodosPedidosUsuario",
        method: "POST",
        data: { cd_usuario: usuarioId },
        success: function (pedidos) {
            montarTabelaPedidos(pedidos);
        }
    });
}   

$("#novoPedido").click(function () {
    window.location.href = "/User/NovoPedido";
});


function detallhesPedido(numeroPedido) {
            $.ajax({
                url: "UsuariosComTelefone/RetornarPorId",
                method: 'GET',
                data: {
                    numeroPedido: numeroPedido
                },

                success: function (usuario) {
                    mostrarModalTelefone();
                    escolherTituloModal(`Atualizar Telefone do ${usuario.NM_NOME}`);
                    $(".usuarioId").val(usuario.CD_USUARIO);
                    $(".nome").val(usuario.NM_NOME);
                    $(".sobrenome").val(usuario.NM_SOBRE_NOME);
                    $(".cpf").val(usuario.CPF);
                    $(".codigoDeArea").val(usuario.DDD);
                    $(".telefone").val(usuario.TELEFONE);
                    $(".email").val(usuario.EMAIL);
                    $(".dataDeNascimento").val(usuario.DH_NASCIMENTO);
                    $(".status").val(usuario.CD_STATUS);

                    atualizarUsuario(usuario);
                }
            });
}


$(".btnSalvar").click(function () {
    if (carrinho.length === 0) {
        alert("O carrinho está vazio!");
        return;
    }
    $.ajax({
        url: "/Home/ObterUsuario",
        method: "GET",
        success: function (response) {
            usuario = response.usuario;

            var produtosParaSalvar = carrinho.map(produto => ({
                id: produto.CD_PRODUTO,
                preco: produto.PRECO
            }));
            $.ajax({
                
                url: "/User/GerarNovoPedido",
                type: "POST",
                data: {
                    cd_usuario: usuario.usuarioid,
                    produtos: produtosParaSalvar,
                    valorTotal: valorTotalGlobal
                },
                success: function () {
                    alert("Pedido criado com sucesso!");
                    window.location.href = "/User/Index";
                    carrinho = [];
                    atualizarTabela();
                    atualizarTotal();
                },
                error: function () {
                    alert("Ocorreu um problema ao gerar seu pedido!");
                }
            });
        }
    });
    
});

function limparFormulario() {

}
function escolherTituloModal(texto) {
            $(".modal-title").text(texto);
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
                produtosGlobal.push(produtos[indice]);
                tabela += `<tr id="${produtos[indice].CD_PRODUTO}">`;
                tabela += `<td>${produtos[indice].NOME}</td>`;
                tabela += `<td>${produtos[indice].DESCRICAO}</td>`;
                tabela += `<td>R$ ${produtos[indice].PRECO.toFixed(2)}</td>`;
                tabela += `<td><button class="btn btn-sm btn-outline-primary" onclick='adicionarProdutoCarrinho(${indice})'>Adicionar ao Carrinho</button></td>`;
                tabela += '</tr>';
            }

            tabela += '</tbody>';
            tabela += '</table>';

            divTabelaProdutos.innerHTML = tabela;
}

function adicionarProdutoCarrinho(indice) {
    var produto = produtosGlobal[indice];
    carrinho.push(produto);
    atualizarTabela();
    atualizarTotal();
}

function atualizarTabela() {
    var tbody = $("#tabelaCarrinho tbody");
    tbody.empty();
        this.carrinho.forEach((produto, index) => {
        var linha = `
            <tr>
                <td>${produto.NOME}</td>
                <td>${produto.DESCRICAO}</td>
                <td>${produto.PRECO.toFixed(2)}</td>
                <td><button class="btnRemoverCarrinho" data-index="${index}">Remover</button></td>
            </tr>
        `;
        tbody.append(linha);
    });
}

$(document).on("click", ".btnRemoverCarrinho", function () {
    var index = $(this).data("index");
    carrinho.splice(index, 1);
    atualizarTabela();
    atualizarTotal();
});

function atualizarTotal() {
    var total = carrinho.reduce((acc, produto) => acc + produto.PRECO, 0);
    $("#valorTotal").text(total.toFixed(2));
    valorTotalGlobal = total;
    console.log("Valor total:", valorTotalGlobal);
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

function mostrarModalNovoPedido() {
    new bootstrap.Modal($("#modalNovoPedido"), {}).show();
}



