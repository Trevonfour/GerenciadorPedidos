$(document).ready(function () {
    VerificarSessao();
    });
$("#btnLogin").click(function () {
            ModalLogin(true);
        });
$("#btnLogar").click(function () {
            var username = $('#username').val().trim();
            var password = $('#password').val().trim();
            if (username === "" || password === "") {
                alert("Preencha todos os campos.");
                return;
            }
            EfetuarLogin(username, password);
        });
$("#btnLogout").click(function () {
            EfetuarLogout();
        });
function ModalLogin(mostrarModal) {
    if (mostrarModal) {
        $('#modalLogin').modal('show');
    } else {
        $('#modalLogin').modal('hide');
    }
}
function EfetuarLogin(username, password) {
    $.ajax({
        url: "/Home/Logar",
        method: 'POST',
        data: {
            nomeUsuario: username,
            senha: password
        },
        success: function(response){
            response.admin? window.location.href = "/Admin" : window.location.href = "/User/Index";
        },
        error: function () {
            alert("Usuário ou senha incorretos.");
        }
    });
}
function EfetuarLogout() {
    $.ajax({
        url: "/Home/Logout",
        method: "GET",
        success: function() {
            usuario = null;
            window.location.href = "/Home/Index";
            $('#Logado').hide();
            $('#btnLogout').hide();
            $('#btnLogin').show();
            
        }
    });
}

function VerificarSessao() {
    $.ajax({
        url: "/Home/ObterUsuario",
        method: "GET",
        success: function (response) {

            if (response.success) {
                usuario = response.usuario;
                if (!usuario.admin && window.location.pathname === "/User/Index")
                    carregarPedidosUsuario(usuario.usuarioid);
                else if (window.location.pathname === "/User/NovoPedido")
                    obterProdutos();
                if (usuario.admin && window.location.pathname === "/Admin")
                    carregarTodosPedidos();
                else if (window.location.pathname === "/Admin/GerenciarProdutos")
                    obterTodosProdutos();
                
                $('#lblNomeUsuario').text(usuario.nome);
                $('#btnLogin').hide();
                $('#btnLogout').show();
                $('#Logado').show();
            } else {
                $('#btnLogin').show();
                $('#btnLogout').hide();
                $('#Logado').hide();
            }
        }
    });
}