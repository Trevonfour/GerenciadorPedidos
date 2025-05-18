using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using GerenciadorDePedidos.Infra;
using GerenciadorDePedidos.Entities;
using Newtonsoft.Json;

namespace GerenciadorDePedidos.Controllers;

public class HomeController : Controller
{   
    private ProdutoData _produtoData;
    private readonly UsuarioData _usuarioData;
    private readonly PedidoData _pedidoData;
    private Usuario usuario;

    public HomeController(PedidoData pedidoData, ProdutoData produtoData, UsuarioData usuarioData)
    {
        _usuarioData = usuarioData;
        _pedidoData = pedidoData;
        _produtoData = produtoData;
    }
    public IActionResult Index()
    {
        return View();
    }

     public IActionResult Usuario()
    {
        var usuarioJson = HttpContext.Session.GetString("UsuarioLogado");
        if (string.IsNullOrEmpty(usuarioJson))
        {
            return RedirectToAction("Index");
        }
        return View();
    }

    [HttpPost]
    public IActionResult Logar(string nomeUsuario, string senha)
    {
        usuario = _usuarioData.RetornarUsuario(nomeUsuario, senha);

        if (usuario != null)
        {
            var usuarioJson = System.Text.Json.JsonSerializer.Serialize(usuario);
            HttpContext.Session.SetString("UsuarioLogado", usuarioJson);

            return Json(new
            {
                usuarioid = usuario.Cd_Usuario,
                nome = usuario.Nome,
                nomeUsuario = usuario.Nome_Usuario,
                admin = usuario.Administrador
            });
        }

        return Json(new { success = false });
    }

    public IActionResult Logout()
    {
        HttpContext.Session.Remove("UsuarioLogado");
        return RedirectToAction("Index");
    }


    public IActionResult ObterUsuario()
    {
        var usuarioJson = HttpContext.Session.GetString("UsuarioLogado");
        if (string.IsNullOrEmpty(usuarioJson))
        {
            return Json(new { success = false });
        }

        var usuario = JsonConvert.DeserializeObject<Usuario>(usuarioJson);
        return Json(new
        {
            success = true,
            usuario = new
            {
                usuarioid = usuario.Cd_Usuario,
                nome = usuario.Nome,
                nomeUsuario = usuario.Nome_Usuario,
                admin = usuario.Administrador
            }
        });
    }

    public IActionResult RetornarTodosProdutos()
    {
        try
        {
            var produtos = _produtoData.ObterTodosProdutos();
            return Json(produtos);
        }
        catch (Exception ex)
        {
            return BadRequest("Ocorreu um erro ao recuperar os pedidos: " + ex.Message);
        }
    }
    
    public IActionResult RetornarDetalhesPedido(int numeroPedido)
    {
        try
        {
            var pedido = _pedidoData.ConsultarDetalhesPedido(numeroPedido);
            return Json(pedido);
        }
        catch (Exception ex)
        {
            return BadRequest("Ocorreu um erro ao recuperar os pedidos: " + ex.Message);
        }
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View("Error!");
        }

}
