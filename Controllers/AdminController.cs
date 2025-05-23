using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using GerenciadorDePedidos.Entities;
using GerenciadorDePedidos.Infra;
using GerenciadorDePedidos.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace GerenciadorDePedidos.Controllers
{
    [Route("Admin")]
    public class AdminController : Controller
    {
        private readonly PedidoData _pedidoData;
        private readonly ProdutoData _produtoData;

        public AdminController(PedidoData pedidoData, ProdutoData produtoData)
        {
            _pedidoData = pedidoData;
            _produtoData = produtoData;
        }
        private Usuario ObterUsuarioLogado()
        {
            var usuarioJson = HttpContext.Session.GetString("UsuarioLogado");
            if (string.IsNullOrEmpty(usuarioJson))
            {
                return null;
            }

            return JsonConvert.DeserializeObject<Usuario>(usuarioJson);
        }

        private bool UsuarioTemPermissao()
        {
            var usuario = ObterUsuarioLogado();
            return usuario != null && usuario.Administrador == AdminStatus.True;
        }

        [HttpGet("")]
        public IActionResult Index()
        {
            if (!UsuarioTemPermissao())
            {
                return RedirectToAction("Usuario", "Home");
            }

            return View();
        }

        [HttpGet("GerenciarProdutos")]
        public IActionResult GerenciarProdutos()
        {
            if (!UsuarioTemPermissao())
            {
                return RedirectToAction("Usuario", "Home");
            }

            return View();
        }

        [HttpGet("Error")]
        public IActionResult Error()
        {
            return View("Error!");
        }

        [HttpGet("RetornarTodosPedidos")]
        public IActionResult RetornarTodosPedidos()
        {
            try
            {
                var pedidos = _pedidoData.ObterTodosPedidos();
                return Json(pedidos);

            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao recuperar os pedidos: " + ex.Message);
            }
        }

        [HttpPost("RetornarProdutoId")]
        public IActionResult RetornarProdutoId(int produtoId)
        {
            try
            {
                var produto = _produtoData.ObterProdutoPorId(produtoId);
                return Json(produto);

            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao recuperar os pedidos: " + ex.Message);
            }
        }

        [HttpPost("ExcluirProdutoId")]
        public void ExcluirProdutoId(int produtoId)
        {
            try
            {
                _produtoData.ExluirProdutoPorId(produtoId);

            }
            catch (Exception ex)
            {
                BadRequest("Ocorreu um erro ao recuperar os pedidos: " + ex.Message);
            }
        }

        [HttpPost("ValidarProdutoEmPedido")]
        public bool ValidarProdutoEmPedido(int produtoId)
        {
            bool existe = _produtoData.ValidarProdutoPedido(produtoId);
            return existe;

        }

        [HttpPost("AtualizarProduto")]
        public void AtualizarProduto(Produto produto)
        {
            try
            {
                _produtoData.AtualizarDadosProduto(produto);
            }
            catch (Exception ex)
            {
                BadRequest("Ocorreu um erro ao atualizar o produto: " + ex.Message);
            }
        }

        [HttpPost("AdicionarProduto")]
        public void AdicionarProduto(Produto produto)
        {
            try
            {
                _produtoData.InserirNovoProduto(produto);
            }
            catch (Exception ex)
            {
                BadRequest("Ocorreu um erro ao adicionar o produto: " + ex.Message);
            }
        }

    }
}