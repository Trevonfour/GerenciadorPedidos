using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using GerenciadorDePedidos.Infra;
using GerenciadorDePedidos.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace GerenciadorDePedidos.Controllers
{
    [Route("User")]
    public class UsuarioController : Controller
    {
        private readonly PedidoData pedidoData;
        public UsuarioController()
        {
            pedidoData = new();
        }

        [HttpGet("Index")]
        public IActionResult Index()
        {
            return View();
        }
        [HttpGet("NovoPedido")]
        public IActionResult NovoPedido()
        {
            return View();
        }

        [HttpGet("Error")]
        public IActionResult Error()
        {
            return View("Error!");
        }

        [HttpPost("GerarNovoPedido")]
        public void GerarNovoPedido(int cd_usuario, List<ProdutoDTO> produtos, decimal valorTotal)
        {
            PedidoModel pedido = new();
            pedido.Produtos = produtos;     
            pedido.NumeroPedido = RandomInt(100000000, 999999999).ToString();
            pedido.ValorTotal = valorTotal;
            ;
            while (pedidoData.ValidarPedidoExistente(pedido.NumeroPedido)){}
                pedido.NumeroPedido = RandomInt(100000000, 999999999).ToString();
            pedidoData.AdicionarPedido(cd_usuario, pedido);
        }
        [HttpPost("RetornarTodosPedidosUsuario")]
        public IActionResult RetornarTodosPedidosUsuario(int cd_usuario)
        {
            try
            {
                var pedidos = pedidoData.ObterTodosPedidosUsuario(cd_usuario);
                return Json(pedidos);
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao recuperar os pedidos: " + ex.Message);
            }
        }

        private int RandomInt(int min, int max)
        {
            Random random = new Random();
            return random.Next(min, max);
        }
    }
}