using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GerenciadorDePedidos.Entities;

namespace GerenciadorDePedidos.Models
{
    public class PedidoModel
    {   
        public int Id { get; set; }
        public string NumeroPedido { get; set; }
        public string NomeResponsavelPedido { get; set; }
        public List<ProdutoDTO> Produtos { get; set; } = new List<ProdutoDTO>();
        public decimal ValorTotal { get; set; }
        public DateTime DataCriacao { get; set; }
    }

    public class ProdutoDTO
    {
        public int Id { get; set; }
        public decimal Preco { get; set; }
    }
}